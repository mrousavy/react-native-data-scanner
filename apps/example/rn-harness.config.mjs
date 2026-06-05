import {
  applePlatform,
  appleSimulator,
} from '@react-native-harness/platform-apple'
import {
  androidEmulator,
  androidPlatform,
} from '@react-native-harness/platform-android'

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

const androidBundleId =
  process.env.HARNESS_ANDROID_BUNDLE_ID ?? 'com.margelo.datascanner.example'
const androidDevice = process.env.HARNESS_ANDROID_DEVICE ?? 'Pixel_8_API_35'
const androidApiLevel = Number.parseInt(
  process.env.HARNESS_ANDROID_API_LEVEL ?? '35',
  10
)
const androidProfile = process.env.HARNESS_ANDROID_PROFILE ?? 'pixel_8'
const shouldHarnessManageAndroidAvd =
  process.env.HARNESS_ANDROID_MANAGED_AVD === '1' ||
  process.env.HARNESS_ANDROID_MANAGED_AVD === 'true'
const androidAvdConfig = shouldHarnessManageAndroidAvd
  ? {
      apiLevel: androidApiLevel,
      profile: androidProfile,
      diskSize: '4G',
      heapSize: '2G',
      snapshot: { enabled: false },
    }
  : undefined

const config = {
  entryPoint: './index.ts',
  appRegistryComponentName: 'main',
  runners: [
    androidPlatform({
      name: 'android',
      device: androidEmulator(androidDevice, androidAvdConfig),
      bundleId: androidBundleId,
      activityName: '.MainActivity',
    }),
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
  defaultRunner: process.env.HARNESS_DEFAULT_RUNNER ?? 'android',
  bridgeTimeout: 120_000,
  bundleStartTimeout: 90_000,
  maxAppRestarts: 3,
  detectNativeCrashes: true,
  forwardClientLogs: true,
  resetEnvironmentBetweenTestFiles: true,
}

export default config
