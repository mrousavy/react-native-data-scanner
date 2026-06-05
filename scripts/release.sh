#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")/../packages/react-native-data-scanner"
bun release "$@"
