#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
APP_DIR="$ROOT_DIR/apps/example"
ARTIFACT_DIR="$APP_DIR/.harness/android"

ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}}"
ANDROID_SDK_ROOT="$ANDROID_HOME"
ANDROID_AVD_HOME="${ANDROID_AVD_HOME:-$HOME/.android/avd}"
PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
export ANDROID_HOME ANDROID_SDK_ROOT ANDROID_AVD_HOME PATH

AVD_NAME="${HARNESS_ANDROID_DEVICE:-Pixel_8_API_35}"
API_LEVEL="${HARNESS_ANDROID_API_LEVEL:-35}"
PROFILE="${HARNESS_ANDROID_PROFILE:-pixel_8}"
SYSTEM_IMAGE_VARIANT="${HARNESS_ANDROID_SYSTEM_IMAGE_VARIANT:-google_apis_playstore}"
SYSTEM_IMAGE_ARCH="${HARNESS_ANDROID_SYSTEM_IMAGE_ARCH:-}"
COMPILE_SDK="${ANDROID_COMPILE_SDK:-36}"
BUILD_TOOLS="${ANDROID_BUILD_TOOLS:-36.0.0}"
NDK_VERSION="${ANDROID_NDK_VERSION:-29.0.14206865}"
QR_ASSET="${HARNESS_ANDROID_QR_ASSET:-$APP_DIR/assets/harness-qr.png}"
HARNESS_APP_PATH="${HARNESS_APP_PATH:-$APP_DIR/android/app/build/outputs/apk/debug/app-debug.apk}"
HARNESS_ANDROID_MANAGED_AVD="${HARNESS_ANDROID_MANAGED_AVD:-0}"
export HARNESS_APP_PATH HARNESS_ANDROID_DEVICE HARNESS_ANDROID_MANAGED_AVD

if [ -z "$SYSTEM_IMAGE_ARCH" ]; then
  case "$(uname -m)" in
    x86_64 | amd64)
      SYSTEM_IMAGE_ARCH="x86_64"
      ;;
    arm64 | aarch64)
      SYSTEM_IMAGE_ARCH="arm64-v8a"
      ;;
    *)
      echo "Unsupported Android emulator host architecture: $(uname -m)" >&2
      exit 1
      ;;
  esac
fi

SYSTEM_IMAGE="system-images;android-${API_LEVEL};${SYSTEM_IMAGE_VARIANT};${SYSTEM_IMAGE_ARCH}"
EXPECTED_IMAGE_SYSDIR="system-images/android-${API_LEVEL}/${SYSTEM_IMAGE_VARIANT}/${SYSTEM_IMAGE_ARCH}/"

mkdir -p "$ARTIFACT_DIR" "$ANDROID_AVD_HOME"

find_tool() {
  local name="$1"
  local preferred="$2"

  if [ -x "$preferred" ]; then
    printf '%s\n' "$preferred"
    return 0
  fi

  command -v "$name"
}

SDKMANAGER="$(find_tool sdkmanager "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager")"
AVDMANAGER="$(find_tool avdmanager "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager")"
EMULATOR="$(find_tool emulator "$ANDROID_HOME/emulator/emulator")"
ADB="$(find_tool adb "$ANDROID_HOME/platform-tools/adb")"

if [ ! -f "$QR_ASSET" ]; then
  echo "QR asset does not exist: $QR_ASSET" >&2
  exit 1
fi

if [ ! -f "$HARNESS_APP_PATH" ]; then
  echo "Harness APK does not exist: $HARNESS_APP_PATH" >&2
  exit 1
fi

echo "Installing Android SDK packages for $SYSTEM_IMAGE..."
yes | "$SDKMANAGER" --sdk_root="$ANDROID_HOME" --licenses >/dev/null || true
"$SDKMANAGER" --sdk_root="$ANDROID_HOME" \
  "platform-tools" \
  "emulator" \
  "platforms;android-${COMPILE_SDK}" \
  "build-tools;${BUILD_TOOLS}" \
  "ndk;${NDK_VERSION}" \
  "$SYSTEM_IMAGE"

AVD_DIR="$ANDROID_AVD_HOME/$AVD_NAME.avd"
AVD_CONFIG="$AVD_DIR/config.ini"

if [ -f "$AVD_CONFIG" ] && ! grep -Fq "image.sysdir.1=${EXPECTED_IMAGE_SYSDIR}" "$AVD_CONFIG"; then
  echo "Recreating $AVD_NAME because its system image does not match $SYSTEM_IMAGE."
  rm -rf "$AVD_DIR" "$ANDROID_AVD_HOME/$AVD_NAME.ini"
fi

if ! "$EMULATOR" -list-avds | grep -Fxq "$AVD_NAME"; then
  echo "Creating Android emulator $AVD_NAME from $SYSTEM_IMAGE..."
  if ! printf 'no\n' | "$AVDMANAGER" create avd \
    --force \
    --name "$AVD_NAME" \
    --package "$SYSTEM_IMAGE" \
    --device "$PROFILE" \
    -p "$AVD_DIR"; then
    echo "Hardware profile \"$PROFILE\" is unavailable. Retrying with avdmanager's default profile..."
    printf 'no\n' | "$AVDMANAGER" create avd \
      --force \
      --name "$AVD_NAME" \
      --package "$SYSTEM_IMAGE" \
      -p "$AVD_DIR"
  fi
fi

set_avd_config() {
  local key="$1"
  local value="$2"
  local tmp_file

  tmp_file="$(mktemp)"
  if grep -q "^${key}=" "$AVD_CONFIG"; then
    awk -v key="$key" -v value="$value" '
      index($0, key "=") == 1 { print key "=" value; next }
      { print }
    ' "$AVD_CONFIG" > "$tmp_file"
    mv "$tmp_file" "$AVD_CONFIG"
  else
    rm -f "$tmp_file"
    printf '%s=%s\n' "$key" "$value" >> "$AVD_CONFIG"
  fi
}

set_avd_config "hw.camera.back" "virtualscene"
set_avd_config "hw.camera.front" "none"
set_avd_config "hw.keyboard" "yes"
set_avd_config "disk.dataPartition.size" "1G"
set_avd_config "vm.heapSize" "1024"

"$ADB" start-server >/dev/null

find_adb_id_for_avd() {
  while read -r adb_id state; do
    if [ "$state" != "device" ]; then
      continue
    fi

    local avd_name
    avd_name="$("$ADB" -s "$adb_id" emu avd name 2>/dev/null | tr -d '\r' | sed -n '1p' || true)"
    if [ "$avd_name" = "$AVD_NAME" ]; then
      printf '%s\n' "$adb_id"
      return 0
    fi
  done < <("$ADB" devices | awk 'NR > 1 && NF >= 2 { print $1, $2 }')
}

EMULATOR_PID=""
STARTED_EMULATOR=0
ADB_ID="$(find_adb_id_for_avd || true)"

cleanup() {
  if [ "$STARTED_EMULATOR" = "1" ] && [ "${HARNESS_ANDROID_KEEP_EMULATOR:-0}" != "1" ]; then
    if [ -n "${ADB_ID:-}" ]; then
      "$ADB" -s "$ADB_ID" emu kill >/dev/null 2>&1 || true
    elif [ -n "${EMULATOR_PID:-}" ]; then
      kill "$EMULATOR_PID" >/dev/null 2>&1 || true
    fi
  fi

  if [ -n "${EMULATOR_PID:-}" ]; then
    wait "$EMULATOR_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [ -z "$ADB_ID" ]; then
  echo "Starting Android emulator $AVD_NAME with virtual-scene QR poster..."
  "$EMULATOR" "@$AVD_NAME" \
    -no-window \
    -gpu swiftshader_indirect \
    -noaudio \
    -no-boot-anim \
    -no-snapshot-load \
    -no-snapshot-save \
    -camera-back virtualscene \
    -camera-front none \
    -virtualscene-poster "wall=$QR_ASSET" \
    -virtualscene-poster "table=$QR_ASSET" \
    -no-metrics \
    >"$ARTIFACT_DIR/emulator.log" 2>&1 &
  EMULATOR_PID="$!"
  STARTED_EMULATOR=1
fi

deadline=$((SECONDS + 360))
while [ -z "${ADB_ID:-}" ]; do
  if [ -n "${EMULATOR_PID:-}" ] && ! kill -0 "$EMULATOR_PID" >/dev/null 2>&1; then
    echo "Android emulator exited before ADB connected." >&2
    sed -n '1,220p' "$ARTIFACT_DIR/emulator.log" >&2 || true
    exit 1
  fi

  if (( SECONDS >= deadline )); then
    echo "Timed out waiting for Android emulator $AVD_NAME to appear in ADB." >&2
    sed -n '1,220p' "$ARTIFACT_DIR/emulator.log" >&2 || true
    exit 1
  fi

  sleep 2
  ADB_ID="$(find_adb_id_for_avd || true)"
done

echo "Waiting for $AVD_NAME ($ADB_ID) to finish booting..."
"$ADB" -s "$ADB_ID" wait-for-device
deadline=$((SECONDS + 360))
while [ "$("$ADB" -s "$ADB_ID" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
  if (( SECONDS >= deadline )); then
    echo "Timed out waiting for Android emulator boot." >&2
    "$ADB" -s "$ADB_ID" shell getprop >&2 || true
    exit 1
  fi

  sleep 2
done

"$ADB" -s "$ADB_ID" shell input keyevent 82 >/dev/null 2>&1 || true
"$ADB" -s "$ADB_ID" shell settings put global window_animation_scale 0 >/dev/null 2>&1 || true
"$ADB" -s "$ADB_ID" shell settings put global transition_animation_scale 0 >/dev/null 2>&1 || true
"$ADB" -s "$ADB_ID" shell settings put global animator_duration_scale 0 >/dev/null 2>&1 || true

if ! "$ADB" -s "$ADB_ID" shell pm path com.google.android.gms >/dev/null 2>&1; then
  echo "Google Play Services is missing from $AVD_NAME; Google Code Scanner cannot run." >&2
  exit 1
fi

echo "Running Android Harness tests on $ADB_ID..."
set +e
bun run --cwd "$APP_DIR" test:harness:android
status=$?
set -e

if [ "$status" -ne 0 ]; then
  echo "Android Harness failed. Capturing emulator diagnostics..."
  "$ADB" -s "$ADB_ID" logcat -d -t 1000 > "$ARTIFACT_DIR/logcat.txt" 2>/dev/null || true
  "$ADB" -s "$ADB_ID" shell dumpsys activity top > "$ARTIFACT_DIR/activity-top.txt" 2>/dev/null || true
  sed -n '1,220p' "$ARTIFACT_DIR/emulator.log" >&2 || true
fi

exit "$status"
