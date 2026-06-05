#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BEFORE="$(mktemp)"
AFTER="$(mktemp)"
trap 'rm -f "$BEFORE" "$AFTER"' EXIT

git diff -- packages/react-native-data-scanner/lib packages/react-native-data-scanner/nitrogen/generated > "$BEFORE"
bun run specs
git diff -- packages/react-native-data-scanner/lib packages/react-native-data-scanner/nitrogen/generated > "$AFTER"

if ! cmp -s "$BEFORE" "$AFTER"; then
  git diff -- packages/react-native-data-scanner/lib packages/react-native-data-scanner/nitrogen/generated
  echo "Generated files are out of date. Run 'bun run specs' and commit the result." >&2
  exit 1
fi
