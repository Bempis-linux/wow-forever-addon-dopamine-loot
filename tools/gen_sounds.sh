#!/usr/bin/env bash
# Synthesizes Dopamine Loot's arrival sounds into DopamineLoot/Media/ as OGG (original audio, made
# here from sine waves and noise; nothing copied). Played with PlaySoundFile on top of the tier sound,
# timed with the arrival effects in View.lua.
#   ArrivalRare       two soft bell notes with the spark ring
#   ArrivalEpic       a soft thump, a rising bell arpeggio, then a warm chord that blooms and rings out
#   ArrivalLegendary  a deep, long boom with the shockwave, then a bright bell chord and a high sparkle
#   Tick00..Tick14    loot rain: a short tick per landed item, climbing a semitone each
#   (and the money / treasure chest sets at the end: LaunchItem, LaunchCoin, Clink, Merge*, Gather)
# Run: bash tools/gen_sounds.sh   (needs ffmpeg; set FFMPEG or have it on PATH or in WinGet's folder)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=DopamineLoot/Media
FF="${FFMPEG:-$(command -v ffmpeg || ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/*/bin/ffmpeg.exe 2>/dev/null | head -1)}"
[ -x "$FF" ] || { echo "ffmpeg not found"; exit 1; }

# bell START FREQ DECAY: a soft bell (gentle attack, mostly harmonic overtones, a slightly detuned
# twin for warmth), silent before START
bell() {
  local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*150)*((sin(2*PI*$f*$u)+0.5*sin(2*PI*$f*1.004*$u))*exp(-$d*$u)+0.22*sin(2*PI*$f*2*$u)*exp(-2*$d*$u)+0.06*sin(2*PI*$f*3*$u)*exp(-3*$d*$u))"
}
# pad START FREQ SWELL DECAY: a warm tone that blooms in over SWELL seconds and fades with DECAY
pad() {
  local s=$1 f=$2 w=$3 d=$4 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u/$w)*exp(-$d*$u)*(sin(2*PI*$f*$u)+0.6*sin(2*PI*$f*1.005*$u)+0.15*sin(2*PI*$f*2*$u))"
}
# boom START LOW HIGH DECAY: a sine falling from HIGH to LOW Hz
boom() {
  local s=$1 lo=$2 hi=$3 d=$4 u="(t-$1)"
  echo "gte(t,$s)*sin(2*PI*($lo*$u+($hi-$lo)/6*(1-exp(-6*$u))))*exp(-$d*$u)"
}
render() { # NAME SECONDS GAIN EXPR [EXTRA FILTERS]
  local fl fade; fl=$(awk "BEGIN{d = $2 / 3; print (d < 0.3 ? d : 0.3)}"); fade=$(awk "BEGIN{print $2 - $fl}")
  "$FF" -y -loglevel error -f lavfi -i "aevalsrc=exprs='$3*($4)':s=44100:d=$2" \
    -af "${5:+$5,}afade=t=out:st=$fade:d=$fl,alimiter=limit=0.89" -c:a libvorbis -q:a 5 "$OUT/$1.ogg"
  echo "wrote $OUT/$1.ogg"
}
ROOM="aecho=0.8:0.6:70|140:0.25|0.15" # a little room so it rings out

render ArrivalRare 1.2 0.38 "$(bell 0 1318.5 5)+0.8*$(bell 0.1 1975.5 5)" "$ROOM"

THUMP="0.7*$(boom 0 50 120 9)"
ARP="0.8*($(bell 0.03 1046.5 4)+$(bell 0.1 1318.5 4)+$(bell 0.17 1568 4)+1.1*$(bell 0.24 2093 3))"
BLOOM="0.45*($(pad 0.3 523.25 0.25 1.6)+$(pad 0.3 783.99 0.25 1.6)+$(pad 0.3 1046.5 0.25 1.8)+$(pad 0.3 1318.5 0.25 2))"
SHIMMER="0.35*$(bell 0.42 2637 3.5)+0.25*$(bell 0.52 3136 3.5)"
render ArrivalEpic 2.4 0.32 "$THUMP+$ARP+$BLOOM+$SHIMMER" "$ROOM"

# a deep boom (two layers falling into the sub range) with a noise crack, then the chord
BOOM="1.1*$(boom 0 38 140 1.8)+0.7*$(boom 0 28 70 1.2)+0.5*(random(0)*2-1)*exp(-28*t)"
CHORD="$(bell 0.18 523.25 2.2)+$(bell 0.18 659.25 2.2)+$(bell 0.18 783.99 2.2)+0.9*$(bell 0.18 1046.5 2)"
SPARK="0.6*$(bell 0.55 2093 3)+0.5*$(bell 0.68 2637 3)"
render ArrivalLegendary 3.2 0.3 "$BOOM+0.6*($CHORD)+$SPARK" "lowpass=f=9000,$ROOM"

# Loot rain escalation: a short soft tick per landed item, one semitone higher each time
# (Tick00 = A5 ... Tick14 = B6); the game has no pitch control, so each step is its own file
for i in $(seq 0 14); do
  f=$(awk "BEGIN{print 880 * 2 ^ ($i / 12)}")
  render "$(printf 'Tick%02d' "$i")" 0.35 0.3 "$(bell 0 "$f" 14)"
done

# Loot rain, money and the treasure chest. Each set climbs a major pentatonic scale (n = 0..10:
# 0 2 4 7 9 12 14 16 19 21 24 semitones), so a long run of them never sounds like one note.
#   LaunchItem00..10   leaving the chest: a soft upward "fwip" (an item)
#   LaunchCoin00..10   leaving the chest: a quick light "tink" (a coin)
#   Clink00..10        a coin landing: two inharmonic partials, like metal
#   MergeSilver00..10, MergeGold00..10   a pile of coins joining up into one: a bright chime
#   Gather             a pile hopping together before it joins (a soft rising slide)
semis() { local p=(0 2 4 7 9); echo $(( ${p[$1 % 5]} + 12 * ($1 / 5) )); }
hz() { awk "BEGIN{print $1 * 2 ^ ($2 / 12)}"; }
# glide START F0 F1 DUR DECAY: a sine sliding exponentially from F0 to F1 over DUR, fading
glide() {
  local s=$1 f0=$2 f1=$3 d=$4 k=$5 u="(t-$1)" r
  r=$(awk "BEGIN{print log($3 / $2)}")
  echo "gte(t,$s)*min(1,$u*200)*sin(2*PI*$f0*$d/$r*(exp($r*min($u,$d)/$d)-1))*exp(-$k*$u)"
}
for n in $(seq 0 10); do
  st=$(semis "$n"); id=$(printf '%02d' "$n")
  render "LaunchItem$id" 0.3 0.42 "$(glide 0 "$(hz 180 "$st")" "$(hz 420 "$st")" 0.13 14)"
  render "LaunchCoin$id" 0.2 0.3 "$(glide 0 "$(hz 700 "$st")" "$(hz 1300 "$st")" 0.07 30)"
  f=$(hz 1000 "$st")
  render "Clink$id" 0.3 0.3 "sin(2*PI*$f*t)*exp(-28*t)+0.5*sin(2*PI*$f*2.76*t)*exp(-50*t)"
  for metal in Silver:1047 Gold:1318; do
    b=$(hz "${metal#*:}" "$st")
    render "Merge${metal%%:*}$id" 0.9 0.19 "$(bell 0 "$b" 4.5)+0.6*$(bell 0 "$(awk "BEGIN{print $b * 1.5}")" 4)+0.3*$(bell 0 "$(awk "BEGIN{print $b * 2}")" 6)"
  done
done
render Gather 0.45 0.3 "$(glide 0 350 900 0.3 3)"

#   ChestPop           a medium haul's chest opening: a soft low lid "thock" and a little sparkle
#                      (small hauls open silently, big ones with a game sound)
render ChestPop 0.6 0.4 "0.9*$(boom 0 85 170 16)+0.25*(random(0)*2-1)*exp(-70*t)+0.3*$(bell 0.05 1568 7)+0.2*$(bell 0.09 2093 8)" "lowpass=f=6000"

# Chest show: deprecated (set aside 2026-10-14), written to deprecated/chest-show/Media/, not the addon
OUT=deprecated/chest-show/Media
#   ChestRattle1..3    the chest knocking about as it shakes (short wooden knocks, three to vary)
#   Tease00..05        the seam's light climbing a rarity: a chime a step higher each time
#   ChestBurst         the lid flying off: a boom under a bright chord
#   ChestBurstGold     the same for the golden chest (Legendary): bigger, brighter
#   PouchPop           the loot pouch bursting open: a quick soft pop
for i in 1 2 3; do
  f=$(awk "BEGIN{print 90 + 25 * $i}")
  render "ChestRattle$i" 0.18 0.32 "$(boom 0 "$f" "$(awk "BEGIN{print $f * 1.8}")" 30)+0.35*(random(0)*2-1)*exp(-90*t)" "lowpass=f=2500"
done
for n in $(seq 0 5); do
  st=$(semis $((n * 2))); id=$(printf '%02d' "$n")
  render "Tease$id" 0.7 0.24 "$(bell 0 "$(hz 660 "$st")" 5)+0.45*$(bell 0 "$(hz 990 "$st")" 6)"
done
render ChestBurst 1.6 0.3 "1.0*$(boom 0 50 220 3.2)+0.3*(random(0)*2-1)*exp(-30*t)+0.55*($(bell 0.04 523.25 2.6)+$(bell 0.04 659.25 2.6)+$(bell 0.04 783.99 2.6))" "lowpass=f=9000,$ROOM"
render ChestBurstGold 2.2 0.28 "1.1*$(boom 0 45 220 2.4)+0.35*(random(0)*2-1)*exp(-26*t)+0.5*($(bell 0.04 783.99 2.2)+$(bell 0.04 987.77 2.2)+$(bell 0.04 1174.66 2.2)+$(bell 0.04 1567.98 2))+0.4*$(bell 0.35 2093 3)+0.35*$(bell 0.47 2637 3)" "lowpass=f=10000,$ROOM"
render PouchPop 0.3 0.4 "$(glide 0 260 620 0.09 18)+0.2*(random(0)*2-1)*exp(-80*t)"
