#!/usr/bin/env bash
# Sound candidates for picking by ear (docs/mockups/sounds.html): each candidate is a 12-note major
# pentatonic scale, the way the loot rain plays them (Land*: items landing, Bag*: going into the bag),
# all brought to the same loudness so the comparison is fair. The picked ones move into
# tools/gen_sounds.sh; this output is only for listening (docs/mockups/sounds/, not shipped).
# Run: bash tools/gen_sound_candidates.sh   (needs ffmpeg, like gen_sounds.sh)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=docs/mockups/sounds
mkdir -p "$OUT"
FF="${FFMPEG:-$(command -v ffmpeg || ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/*/bin/ffmpeg.exe 2>/dev/null | head -1)}"
[ -x "$FF" ] || { echo "ffmpeg not found"; exit 1; }

semis() { local p=(0 2 4 7 9); echo $(( ${p[$1 % 5]} + 12 * ($1 / 5) )); }
hz() { awk "BEGIN{print $1 * 2 ^ ($2 / 12)}"; }
ROOM="aecho=0.8:0.6:70|140:0.25|0.15"
render() { # NAME SECONDS EXPR [EXTRA FILTERS]
  local fl fade; fl=$(awk "BEGIN{d = $2 / 3; print (d < 0.3 ? d : 0.3)}"); fade=$(awk "BEGIN{print $2 - $fl}")
  "$FF" -y -loglevel error -f lavfi -i "aevalsrc=exprs='0.5*($3)':s=44100:d=$2" \
    -af "${4:+$4,}afade=t=out:st=$fade:d=$fl,loudnorm=I=-20:TP=-4:LRA=11,alimiter=limit=0.7" -ar 44100 -c:a libvorbis -q:a 5 "$OUT/$1.ogg"
}

# Each timbre: START FREQ DECAY (silent before START)
land_now() {   # what ships now: a marimba-like bar with a click
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*(min(1,$u*600)*(sin(2*PI*$f*$u)*exp(-$d*$u)+0.32*sin(2*PI*$f*3.93*$u)*exp(-3.5*$d*$u)+0.08*sin(2*PI*$f*2*$u)*exp(-2*$d*$u)+0.05*sin(2*PI*$f*9.2*$u)*exp(-8*$d*$u))+0.1*(random(0)*2-1)*exp(-500*$u))"
}
land_soft() {  # the same bar, rounder: no click, a gentler attack, the bright overtone tamed
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*300)*(sin(2*PI*$f*$u)*exp(-$d*$u)+0.14*sin(2*PI*$f*3.93*$u)*exp(-4*$d*$u)+0.1*sin(2*PI*$f*2*$u)*exp(-2*$d*$u))"
}
land_bloop() { # a soft water drop: the note bends up into place, very round
  local s=$1 f=$2 d=$3 u="(t-$1)" f0
  f0=$(awk "BEGIN{print $2 * 0.78}")
  echo "gte(t,$s)*min(1,$u*400)*exp(-$d*$u)*(sin(2*PI*($f*$u+($f-$f0)*0.018*exp(-$u/0.018)))+0.12*sin(4*PI*$f*$u))"
}
land_glass() { # a small glass bell: clear, a little shimmer, rings a touch longer
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*500)*((sin(2*PI*$f*$u)+0.4*sin(2*PI*$f*1.0025*$u))*exp(-$d*$u)+0.3*sin(2*PI*$f*2*$u)*exp(-1.6*$d*$u)+0.1*sin(2*PI*$f*4.2*$u)*exp(-3*$d*$u))"
}
land_felt() {  # a felted piano key: soft attack, warm, no edges
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*120)*(sin(2*PI*$f*$u)*exp(-$d*$u)+0.45*sin(2*PI*$f*2*$u)*exp(-1.6*$d*$u)+0.2*sin(2*PI*$f*3*$u)*exp(-2.5*$d*$u))"
}
bag_now() {    # what ships now: a kalimba-like tine
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*500)*((sin(2*PI*$f*$u)+0.35*sin(2*PI*$f*1.003*$u))*exp(-$d*$u)+0.28*sin(2*PI*$f*5.4*$u)*exp(-4*$d*$u)+0.18*sin(2*PI*$f*2*$u)*exp(-2.2*$d*$u))"
}
bag_musicbox() { # a music box comb: high, tiny, sparkly
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*700)*(sin(2*PI*$f*$u)*exp(-$d*$u)+0.25*sin(2*PI*$f*2*$u)*exp(-2*$d*$u)+0.16*sin(2*PI*$f*4.1*$u)*exp(-4*$d*$u))"
}
bag_chime() {  # a soft wind chime: warm bell with a detuned twin
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*150)*((sin(2*PI*$f*$u)+0.5*sin(2*PI*$f*1.004*$u))*exp(-$d*$u)+0.22*sin(2*PI*$f*2*$u)*exp(-2*$d*$u)+0.06*sin(2*PI*$f*3*$u)*exp(-3*$d*$u))"
}
bag_harp() {   # a harp string: plucked, round, a little body
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*250)*(sin(2*PI*$f*$u)*exp(-$d*$u)+0.4*sin(2*PI*$f*2*$u)*exp(-1.8*$d*$u)+0.18*sin(2*PI*$f*3*$u)*exp(-2.6*$d*$u)+0.06*sin(2*PI*$f*4*$u)*exp(-3.5*$d*$u))"
}

# name  timbre  base Hz  decay  seconds  filters
CANDIDATES="
LandNow land_now 392 11 0.5 $ROOM
LandSoft land_soft 392 10 0.5 lowpass=f=4500,$ROOM
LandBloop land_bloop 392 12 0.4 $ROOM
LandGlass land_glass 523.25 8 0.7 $ROOM
LandFelt land_felt 392 8 0.6 lowpass=f=3000,$ROOM
BagNow bag_now 523.25 8 0.6 $ROOM
BagMusicBox bag_musicbox 784 7 0.7 $ROOM
BagChime bag_chime 659.25 6 0.8 $ROOM
BagHarp bag_harp 523.25 6 0.7 lowpass=f=6000,$ROOM
"
while read -r name timbre base decay secs filters; do
  [ -n "$name" ] || continue
  for n in $(seq 0 11); do
    render "$name$(printf '%02d' "$n")" "$secs" "$($timbre 0 "$(hz "$base" "$(semis "$n")")" "$decay")" "$filters"
  done
  # its chord, for the end of the rain: the scale's 1, 3, 5, 8 rolled
  chord="$($timbre 0 "$base" "$(awk "BEGIN{print $decay * 0.35}")")"
  for st in 4 7 12; do
    chord="$chord+$($timbre "$(awk "BEGIN{print $st * 0.006}")" "$(hz "$base" "$st")" "$(awk "BEGIN{print $decay * 0.35}")")"
  done
  render "${name}Chord" 1.6 "$chord" "$filters"
  echo "wrote $name"
done <<< "$CANDIDATES"
