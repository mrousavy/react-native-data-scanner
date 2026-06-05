import {
  applePlatform,
  appleSimulator,
} from '@react-native-harness/platform-apple'

const iosBundleId =
  process.env.HARNESS_IOS_BUNDLE_ID ?? 'com.margelo.datascanner.example'
const iosDevice = process.env.HARNESS_IOS_DEVICE ?? 'iPhone 16 Pro'
const iosVersion = process.env.HARNESS_IOS_VERSION ?? '18.6'

const cameraDylib = process.env.HARNESS_IOS_CAMERA_DYLIB?.trim()
const cameraSharedMemoryName =
  process.env.HARNESS_IOS_CAMERA_SHM_NAME?.trim()
const cameraMirrorMode = process.env.HARNESS_IOS_CAMERA_MIRROR_MODE?.trim()

const iosEnvironment =
  cameraDylib && cameraSharedMemoryName
    ? {
        DYLD_INSERT_LIBRARIES: cameraDylib,
        SIMCAM_SHM_NAME: cameraSharedMemoryName,
        ...(cameraMirrorMode ? { SIMCAM_MIRROR_MODE: cameraMirrorMode } : {}),
      }
    : undefined

const config = {
  entryPoint: './index.ts',
  appRegistryComponentName: 'main',
  runners: [
    applePlatform({
      name: 'ios',
      device: appleSimulator(iosDevice, iosVersion),
      bundleId: iosBundleId,
      appLaunchOptions: iosEnvironment
        ? {
            environment: iosEnvironment,
          }
        : undefined,
    }),
  ],
  defaultRunner: 'ios',
  bridgeTimeout: 120_000,
  bundleStartTimeout: 90_000,
  maxAppRestarts: 3,
  detectNativeCrashes: true,
  forwardClientLogs: true,
  resetEnvironmentBetweenTestFiles: true,
}

export default config
