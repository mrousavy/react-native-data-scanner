#!/usr/bin/env bash
set -euo pipefail

BUNDLE_ID="${HARNESS_IOS_BUNDLE_ID:-com.margelo.datascanner.example}"
SIMULATOR_UDID="${SIMULATOR_UDID:-booted}"
SERVE_SIM="${SERVE_SIM_BIN:-../../node_modules/.bin/serve-sim}"
QR_ASSET="${HARNESS_QR_ASSET:-$PWD/assets/harness-qr.png}"
HARNESS_TIMEOUT_SECONDS="${HARNESS_IOS_TEST_TIMEOUT_SECONDS:-300}"

if [ ! -x "$SERVE_SIM" ]; then
  echo "serve-sim binary not found at $SERVE_SIM"
  exit 1
fi

if [ ! -f "$QR_ASSET" ]; then
  echo "QR fixture not found at $QR_ASSET"
  exit 1
fi

if [ "$SIMULATOR_UDID" = "booted" ]; then
  SIMULATOR_UDID="$(
    xcrun simctl list devices booted --json | node -e '
      const fs = require("fs");
      const data = JSON.parse(fs.readFileSync(0, "utf8"));
      const devices = Object.values(data.devices ?? {}).flat();
      const booted = devices.find((device) => device.state === "Booted");
      if (booted == null) {
        process.exit(1);
      }
      process.stdout.write(booted.udid);
    '
  )"
fi

cleanup() {
  "$SERVE_SIM" camera --stop-webcam -d "$SIMULATOR_UDID" --quiet >/dev/null 2>&1 || true
}
trap cleanup EXIT

dump_harness_diagnostics() {
  echo "::group::Harness iOS diagnostics"

  echo "RCT_jsLocation default:"
  xcrun simctl spawn "$SIMULATOR_UDID" defaults read "$BUNDLE_ID" RCT_jsLocation || true

  echo "App launchctl entries:"
  xcrun simctl spawn "$SIMULATOR_UDID" launchctl list | /usr/bin/grep -i "$BUNDLE_ID" || true

  echo "Recent simulator logs:"
  log_predicate='process == "DataScannerExample" OR process == "com.margelo.datascanner.example" OR senderImagePath CONTAINS "DataScannerExample" OR eventMessage CONTAINS[c] "React Native Harness" OR eventMessage CONTAINS[c] "Failed to initialize" OR eventMessage CONTAINS[c] "RCTFatal" OR eventMessage CONTAINS[c] "JavaScript" OR eventMessage CONTAINS[c] "WebSocket" OR eventMessage CONTAINS[c] "libSimCamera" OR eventMessage CONTAINS[c] "simcam"'
  xcrun simctl spawn "$SIMULATOR_UDID" log show --style compact --last 5m --predicate "$log_predicate" || true

  echo "::endgroup::"
}

echo "Granting camera permission to $BUNDLE_ID on $SIMULATOR_UDID..."
xcrun simctl privacy "$SIMULATOR_UDID" grant camera "$BUNDLE_ID" || true

echo "Starting serve-sim camera feed with $QR_ASSET..."
camera_output="$("$SERVE_SIM" camera "$BUNDLE_ID" -d "$SIMULATOR_UDID" --file "$QR_ASSET" --mirror off --quiet)"
echo "$camera_output"

export HARNESS_IOS_CAMERA_DYLIB
HARNESS_IOS_CAMERA_DYLIB="$(
  node -e '
    const fs = require("fs");
    const path = require("path");
    const output = process.argv[1];
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {}

    if (parsed?.dylib) {
      process.stdout.write(parsed.dylib);
      process.exit(0);
    }

    const fallback = path.resolve(
      "../../node_modules/serve-sim/dist/simcam/libSimCameraInjector.dylib"
    );
    if (!fs.existsSync(fallback)) {
      throw new Error(`Unable to find serve-sim camera dylib at ${fallback}`);
    }
    process.stdout.write(fallback);
  ' "$camera_output"
)"

export HARNESS_IOS_CAMERA_SHM_NAME
HARNESS_IOS_CAMERA_SHM_NAME="$(
  node -e '
    const crypto = require("crypto");
    const output = process.argv[1];
    const udid = process.argv[2];
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {}

    if (parsed?.shm) {
      process.stdout.write(parsed.shm);
      process.exit(0);
    }

    process.stdout.write(
      `/serve-sim-cam-${crypto.createHash("sha1").update(udid).digest("hex").slice(0, 8)}`
    );
  ' "$camera_output" "$SIMULATOR_UDID"
)"

export HARNESS_IOS_CAMERA_MIRROR_MODE=off

xcrun simctl terminate "$SIMULATOR_UDID" "$BUNDLE_ID" || true

echo "Running Harness iOS tests (hard timeout: ${HARNESS_TIMEOUT_SECONDS}s)..."
bun run test:harness:ios &
harness_pid=$!
deadline=$((SECONDS + HARNESS_TIMEOUT_SECONDS))

while kill -0 "$harness_pid" >/dev/null 2>&1; do
  if (( SECONDS >= deadline )); then
    echo "Harness tests exceeded ${HARNESS_TIMEOUT_SECONDS}s and were aborted."
    kill "$harness_pid" >/dev/null 2>&1 || true
    sleep 5
    kill -9 "$harness_pid" >/dev/null 2>&1 || true
    wait "$harness_pid" >/dev/null 2>&1 || true
    dump_harness_diagnostics
    exit 1
  fi

  sleep 2
done

set +e
wait "$harness_pid"
harness_status=$?
set -e

if [ "$harness_status" -ne 0 ]; then
  dump_harness_diagnostics
  exit "$harness_status"
fi
