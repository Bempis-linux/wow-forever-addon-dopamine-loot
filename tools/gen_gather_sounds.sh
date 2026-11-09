#!/usr/bin/env bash
# Synthesizes Dopamine Loot's gathering sounds into DopamineLoot/Media/ as OGG (original audio, sine
# waves only; nothing copied). Separate from gen_sounds.sh so the other sets aren't re-rendered.
#   GatherNote00..10   each gather in a run: a soft plucked bell a step higher up a major pentatonic
#                      scale (0 2 4 7 9 12 14 16 19 21 24 semitones), resetting after a pause
#   GatherStack        a material reaching a full stack: two quick rising bells
#   SkillUp            a skill-up: a short bright arpeggio
# Run: bash tools/gen_gather_sounds.sh   (needs ffmpeg; set FFMPEG or have it on PATH or in WinGet's folder)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=DopamineLoot/Media
FF="${FFMPEG:-$(command -v ffmpeg || ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/*/bin/ffmpeg.exe 2>/dev/null | head -1)}"
[ -x "$FF" ] || { echo "ffmpeg not found"; exit 1; }

# pluck START FREQ DECAY: a soft plucked bell (quick attack, warm twin, faint overtones)
pluck() {
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*250)*((sin(2*PI*$f*$u)+0.4*sin(2*PI*$f*1.003*$u))*exp(-$d*$u)+0.18*sin(2*PI*$f*2*$u)*exp(-2.5*$d*$u))"
}
render() { # NAME SECONDS GAIN EXPR
  local fl fade; fl=$(awk "BEGIN{d = $2 / 3; print (d < 0.3 ? d : 0.3)}"); fade=$(awk "BEGIN{print $2 - $fl}")
  "$FF" -y -loglevel error -f lavfi -i "aevalsrc=exprs='$3*($4)':s=44100:d=$2" \
    -af "aecho=0.8:0.5:60|120:0.2|0.1,afade=t=out:st=$fade:d=$fl,alimiter=limit=0.8" -c:a libvorbis -q:a 5 "$OUT/$1.ogg"
  echo "wrote $OUT/$1.ogg"
}
semis() { local p=(0 2 4 7 9); echo $(( ${p[$1 % 5]} + 12 * ($1 / 5) )); }
hz() { awk "BEGIN{print $1 * 2 ^ ($2 / 12)}"; }

for n in $(seq 0 10); do
  render "GatherNote$(printf '%02d' "$n")" 0.7 0.22 "$(pluck 0 "$(hz 659.25 "$(semis "$n")")" 7)"
done
render GatherStack 0.8 0.22 "$(pluck 0 1318.5 6)+0.9*$(pluck 0.08 1975.5 6)"
render SkillUp 1.2 0.2 "$(pluck 0 783.99 4)+$(pluck 0.07 987.77 4)+$(pluck 0.14 1174.66 4)+1.1*$(pluck 0.21 1567.98 3.5)"
