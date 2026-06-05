#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BEFORE="$(mktemp)"
AFTER="$(mktemp)"
trap 'rm -f "$BEFORE" "$AFTER"' EXIT

git diff -- packages/react-native-data-scanner/ios > "$BEFORE"
"$ROOT_DIR/scripts/format-swift.sh"
git diff -- packages/react-native-data-scanner/ios > "$AFTER"

if ! cmp -s "$BEFORE" "$AFTER"; then
  git diff -- packages/react-native-data-scanner/ios
  echo "Swift files are not formatted. Run 'bun run format:swift' and commit the result." >&2
  exit 1
fi
