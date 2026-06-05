#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

KOTLIN_FILES="$(find packages/react-native-data-scanner/android/src/main/java -type f -name '*.kt' | sort)"
if [ -z "$KOTLIN_FILES" ]; then
  exit 0
fi

KTLINT_VERSION="${KTLINT_VERSION:-1.5.0}"

if command -v ktlint >/dev/null 2>&1; then
  KTLINT_BIN="$(command -v ktlint)"
else
  KTLINT_BIN="$ROOT_DIR/.cache/ktlint/ktlint-$KTLINT_VERSION"
  if [ ! -x "$KTLINT_BIN" ]; then
    mkdir -p "$(dirname "$KTLINT_BIN")"
    curl -fsSL -o "$KTLINT_BIN" "https://github.com/pinterest/ktlint/releases/download/$KTLINT_VERSION/ktlint"
    chmod +x "$KTLINT_BIN"
  fi
fi

# shellcheck disable=SC2086
"$KTLINT_BIN" -F $KOTLIN_FILES
