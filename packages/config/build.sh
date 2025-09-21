#!/bin/sh
SRC="src"
DST="build"

rm -rf "$DST"
cp -a "$SRC" "$DST"

find "$DST" -type f -name 'tsconfig*.jsonc' -exec sh -c '
  for f; do mv "$f" "${f%.jsonc}.json"; done
' _ {} +
