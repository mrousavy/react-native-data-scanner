const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..', '..')
const isHarness = process.env.RN_HARNESS === 'true'

const config = getDefaultConfig(projectRoot)

if (isHarness) {
  config.server.unstable_serverRoot = projectRoot
}

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

const upstreamResolveRequest = config.resolver.resolveRequest
const harnessEntryPoint = require.resolve(
  '@react-native-harness/runtime/entry-point'
)
const abortControllerEventTargetShim = require.resolve(
  'abort-controller/node_modules/event-target-shim/dist/event-target-shim'
)
const expoVirtualEntryImport = `./${path
  .relative(workspaceRoot, path.resolve(projectRoot, 'index'))
  .replaceAll(path.sep, '/')}`

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    isHarness &&
    moduleName === expoVirtualEntryImport &&
    path.resolve(context.originModulePath) === projectRoot
  ) {
    return {
      type: 'sourceFile',
      filePath: harnessEntryPoint,
    }
  }

  if (
    isHarness &&
    moduleName === 'event-target-shim' &&
    context.originModulePath.includes(
      `${path.sep}abort-controller${path.sep}`
    )
  ) {
    return {
      type: 'sourceFile',
      filePath: abortControllerEventTargetShim,
    }
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
