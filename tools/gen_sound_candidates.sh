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

# Round 2 (the user: round 1 sounded "lottery-like"): physical, less ringing. Landing: the
# marimba crossed with the water drop, and earthier knocks; the bag: pouch and cloth, barely pitched.
wood_drop() {  # the marimba bar crossed with the drop: it bends up into the note, short, a soft thump under it
  local s=$1 f=$2 d=$3 u="(t-$1)" f0
  f0=$(awk "BEGIN{print $2 * 0.82}")
  echo "gte(t,$s)*(min(1,$u*400)*(sin(2*PI*($f*$u+($f-$f0)*0.012*exp(-$u/0.012)))*exp(-$d*$u)+0.14*sin(2*PI*$f*3.93*$u)*exp(-4*$d*$u)+0.08*sin(4*PI*$f*$u)*exp(-2*$d*$u))+0.25*sin(2*PI*90*$u)*exp(-40*$u))"
}
thock() {      # an earthy knock: a low body falling into place and a dull tap, barely a note
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*(min(1,$u*500)*sin(2*PI*($f*$u-0.5*$f*0.015*exp(-$u/0.015)))*exp(-$d*$u)+0.18*(random(0)*2-1)*exp(-120*$u))"
}
pouch() {      # into a leather pouch: a soft "fwump" (filtered noise, see {F}) on a low thud
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*(min(1,$u*120)*(random(0)*2-1)*exp(-$d*$u)+0.7*sin(2*PI*($f*0.12)*$u)*exp(-30*$u))"
}
pouch_coin() { # the pouch, and a faint coin settling inside
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "$(pouch "$1" "$2" "$3")+gte(t,$s+0.03)*0.16*(sin(2*PI*$f*4*($u-0.03))+0.5*sin(2*PI*$f*4*2.76*($u-0.03)))*exp(-38*($u-0.03))"
}
soft_pop() {   # a soft pop, like a cork: a quick rising blip, mostly air
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*(min(1,$u*800)*sin(2*PI*($f*$u+$f*0.5*0.02*(1-exp(-$u/0.02))))*exp(-$d*$u)+0.12*(random(0)*2-1)*exp(-90*$u))"
}

# Round 3 (the user: the drops are nice but a little "headachy" over and over; the pouch and coin is
# liked but the pouch part is wrong and jarring): softer drops, and the coin with a gentler pouch.
soft_drop() {  # the drop, softened: a slower attack, a smaller bend, just the note (darkened by its filter)
  local s=$1 f=$2 d=$3 u="(t-$1)" f0
  f0=$(awk "BEGIN{print $2 * 0.9}")
  echo "gte(t,$s)*min(1,$u*150)*exp(-$d*$u)*(sin(2*PI*($f*$u+($f-$f0)*0.01*exp(-$u/0.01)))+0.05*sin(4*PI*$f*$u))"
}
soft_drop_thud() { # the soft drop on a soft low thud, as if it landed on grass
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "0.75*$(soft_drop "$1" "$2" "$3")+gte(t,$s)*0.4*min(1,$u*300)*sin(2*PI*70*$u)*exp(-25*$u)"
}
coin() {       # a coin settling: a clink and a smaller one as it rocks (at 4x the note), no pouch
  local s=$1 f=$2 u="(t-$1)" v="(t-$1-0.07)" c c2
  c=$(awk "BEGIN{print $2 * 4}"); c2=$(awk "BEGIN{print $2 * 4 * 1.06}")
  echo "gte(t,$s)*min(1,$u*900)*(sin(2*PI*$c*$u)+0.5*sin(2*PI*$c*2.76*$u))*exp(-34*$u)+gte(t,$s+0.07)*0.4*(sin(2*PI*$c2*$v)+0.5*sin(2*PI*$c2*2.76*$v))*exp(-45*$v)"
}
coin_thud() {  # the coin on a soft low thud (the pouch as a body, without its noise)
  local s=$1 f=$2 u="(t-$1)"
  echo "$(coin "$1" "$2")+gte(t,$s)*0.45*min(1,$u*250)*sin(2*PI*85*$u)*exp(-28*$u)"
}
pouch_coin_soft() { # the liked pouch and coin, with the pouch a quiet brush (slow attack, much less noise)
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*(0.18*min(1,$u*40)*(random(0)*2-1)*exp(-$d*$u)+0.4*sin(2*PI*85*$u)*exp(-28*$u))+$(coin "$(awk "BEGIN{print $1 + 0.02}")" "$2")"
}

# name  timbre  base Hz  decay  seconds  steps  filters ({F} = the note's Hz x 2, for the noise ones)
# steps: pent = a major pentatonic scale (12 notes over 2+ octaves); narrow = 12 small steps over 6
# semitones (barely pitched, so a run doesn't sing)
CANDIDATES="
LandBloop land_bloop 392 12 0.4 pent $ROOM
LandWoodDrop wood_drop 330 15 0.4 pent lowpass=f=5000,$ROOM
LandDropSoft soft_drop 294 14 0.4 pent lowpass=f=2200,$ROOM
LandDropDark soft_drop 220 13 0.45 pent lowpass=f=1500,$ROOM
LandDropThud soft_drop_thud 262 15 0.4 pent lowpass=f=1800
BagPouchCoin pouch_coin 450 26 0.35 narrow lowpass=f={F},highpass=f=120
BagPouchCoinSoft pouch_coin_soft 450 30 0.4 narrow lowpass=f=6500,highpass=f=60
BagCoin coin 450 0 0.35 narrow highpass=f=300
BagCoinThud coin_thud 450 0 0.35 narrow lowpass=f=8000
"
while read -r name timbre base decay secs steps filters; do
  [ -n "$name" ] || continue
  for n in $(seq 0 11); do
    if [ "$steps" = pent ]; then st=$(semis "$n"); else st=$(awk "BEGIN{print $n / 2}"); fi
    f=$(hz "$base" "$st")
    render "$name$(printf '%02d' "$n")" "$secs" "$($timbre 0 "$f" "$decay")" "${filters//\{F\}/$(awk "BEGIN{print int($f * 2)}")}"
  done
  # its chord, for the end of the rain: the scale's 1, 3, 5, 8 rolled
  chord="$($timbre 0 "$base" "$(awk "BEGIN{print $decay * 0.35}")")"
  for st in 4 7 12; do
    chord="$chord+$($timbre "$(awk "BEGIN{print $st * 0.006}")" "$(hz "$base" "$st")" "$(awk "BEGIN{print $decay * 0.35}")")"
  done
  cf=$(awk "BEGIN{print int($base * 2)}")
  render "${name}Chord" 1.6 "$chord" "${filters//\{F\}/$cf}"
  echo "wrote $name"
done <<< "$CANDIDATES"
