#!/usr/bin/env bash
# Turns what tools/render-media.html rendered (tools/out/*.wav, *.png) into the addon's files:
# OGG sounds (trailing silence trimmed) and uncompressed 32-bit TGA pictures in DopamineLoot/Media/.
#   bash tools/convert-media.sh
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=DopamineLoot/Media
for f in tools/out/*.wav; do
  n=$(basename "$f" .wav)
  ffmpeg -loglevel error -y -i "$f" -af "areverse,silenceremove=start_periods=1:start_threshold=-70dB,areverse,alimiter=limit=0.9" \
    -c:a libvorbis -q:a 5 "$OUT/$n.ogg"
done
for f in tools/out/*.png; do
  n=$(basename "$f" .png)
  # (ffmpeg writes rows top-down; flip them and mark the file bottom-up, like tools/gen_textures.lua's)
  ffmpeg -loglevel error -y -i "$f" -vf vflip -pix_fmt bgra -rle 0 "$OUT/$n.tga"
  printf '\x08' | dd of="$OUT/$n.tga" bs=1 seek=17 count=1 conv=notrunc status=none
done
echo "converted $(ls tools/out | wc -l) files"
