#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SWIFT_FILES="$(find packages/react-native-data-scanner/ios -type f -name '*.swift' | sort)"
if [ -z "$SWIFT_FILES" ]; then
  exit 0
fi

SWIFT_FORMAT=()
SWIFT_FORMAT_ARGS=()
if swift format --help >/dev/null 2>&1; then
  SWIFT_FORMAT=(swift format)
elif command -v swift-format >/dev/null 2>&1; then
  SWIFT_FORMAT=(swift-format)
elif command -v xcrun >/dev/null 2>&1 && xcrun --find swift-format >/dev/null 2>&1; then
  SWIFT_FORMAT=(xcrun swift-format)
else
  echo "Swift format is required. Install Xcode's swift-format tool, then retry." >&2
  exit 1
fi

if [ -f ".swift-format" ]; then
  SWIFT_FORMAT_ARGS=(--configuration .swift-format)
fi

# shellcheck disable=SC2086
"${SWIFT_FORMAT[@]}" --in-place "${SWIFT_FORMAT_ARGS[@]}" $SWIFT_FILES
