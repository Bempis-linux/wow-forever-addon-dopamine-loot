#!/usr/bin/env bash
# NOTE (2026-11-09): the crafting sounds now come from tools/render-media.html (the mockups' own sound code,
# rendered offline) + tools/convert-media.sh. Running this script would overwrite them with the older hand-made ones.
# Synthesizes Dopamine Loot's crafting sounds into DopamineLoot/Media/ as OGG (original audio: sine waves and
# noise, nothing copied). Picked by ear in docs/mockups/crafting-r4.html, crafting-r5.html, firstaid-r6.html.
# Each profession: its work beats (played during the cast) and its payoff (when the item is made); a payoff
# also comes as a quiet "Q" copy for the later items of a long Create All.
#   Leatherworking  LeatherThok (an awl punch), LeatherZip (the thread through), LeatherTug (+Q)
#   Alchemy         AlchClink (glass), AlchGlug (a low glug), AlchFoam (the boil-over), AlchCork (+Q, a hollow cork)
#   Tailoring       TailorFwip (a stitch), TailorSnip (+Q)
#   Engineering     EngTick (a metal ratchet click), EngBoing (+Q, a springy boing)
#   Cooking         CookSizzle, CookWhoosh (the flip), CookTss (+Q, it lands)
#   Blacksmithing   SmithTap (a light dry tap), SmithClang (+Q, the heavy hit), SmithHiss (the quench)
#   Enchanting      EnchChime1..3 (rising), EnchPing (+Q)
#   First Aid       AidPat (the salve), AidTap (a wrap), AidClick (+Q, it clicks shut)
#   CraftDone (+Q)  any other profession: a small bright two-note
# Run: bash tools/gen_craft_sounds.sh   (needs ffmpeg, like gen_sounds.sh)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=DopamineLoot/Media
FF="${FFMPEG:-$(command -v ffmpeg || ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/*/bin/ffmpeg.exe 2>/dev/null | head -1)}"
[ -x "$FF" ] || { echo "ffmpeg not found"; exit 1; }

render() { # NAME SECONDS GAIN EXPR [FILTERS]
  local fl fade; fl=$(awk "BEGIN{d = $2 / 3; print (d < 0.2 ? d : 0.2)}"); fade=$(awk "BEGIN{print $2 - $fl}")
  "$FF" -y -loglevel error -f lavfi -i "aevalsrc=exprs='$3*($4)':s=44100:d=$2" \
    -af "${5:+$5,}afade=t=out:st=$fade:d=$fl,alimiter=limit=0.8" -c:a libvorbis -q:a 5 "$OUT/$1.ogg"
  echo "wrote $OUT/$1.ogg"
}
both() { render "$1" "$2" "$3" "$4" "${5:-}"; render "${1}Q" "$2" "$(awk "BEGIN{print $3 * 0.45}")" "$4" "${5:-}"; } # a payoff and its quiet copy
# glide START F0 F1 DUR DECAY: a sine sliding from F0 to F1 over DUR
glide() { local s=$1 f0=$2 f1=$3 d=$4 k=$5 u="(t-$1)" r; r=$(awk "BEGIN{print log($3 / $2)}")
  echo "gte(t,$s)*min(1,$u*300)*sin(2*PI*$f0*$d/$r*(exp($r*min($u,$d)/$d)-1))*exp(-$k*$u)"; }
sq() { local s=$1 f0=$2 f1=$3 d=$4 k=$5 u="(t-$1)" r; r=$(awk "BEGIN{print log($3 / $2)}") # a square-ish glide (odd harmonics)
  local ph="2*PI*$f0*$d/$r*(exp($r*min($u,$d)/$d)-1)"; echo "gte(t,$s)*min(1,$u*400)*(sin($ph)+0.33*sin(3*$ph)+0.2*sin(5*$ph))*exp(-$k*$u)"; }
hit() { local s=$1 k=$2; echo "gte(t,$s)*(random(0)*2-1)*exp(-$k*(t-$s))"; } # a noise burst
metal() { local s=$1 f=$2 k=$3 u="(t-$1)"; echo "gte(t,$s)*min(1,$u*900)*(sin(2*PI*$f*$u)*exp(-$k*$u)+0.35*sin(2*PI*$f*2.76*$u)*exp(-1.6*$k*$u)+0.15*sin(2*PI*$f*5.4*$u)*exp(-2.4*$k*$u))"; }
pluck() { local s=$1 f=$2 d=$3 u="(t-$1)"; echo "gte(t,$s)*min(1,$u*250)*((sin(2*PI*$f*$u)+0.4*sin(2*PI*$f*1.003*$u))*exp(-$d*$u)+0.18*sin(2*PI*$f*2*$u)*exp(-2.5*$d*$u))"; }

# Leatherworking: the sounds the user liked most
render LeatherThok 0.15 0.5 "$(sq 0 240 160 0.06 40)+0.4*$(hit 0 60)" "lowpass=f=2500"
render LeatherZip 0.15 0.25 "$(hit 0 25)*sin(PI*min(t/0.06,1))" "bandpass=f=3200:width_type=q:w=3"
both LeatherTug 0.3 0.3 "$(glide 0 520 880 0.12 14)" "lowpass=f=4000"
# Alchemy: glass and liquid (boil-over)
render AlchClink 0.4 0.2 "$(metal 0 2300 9)"
render AlchGlug 0.2 0.45 "$(glide 0 280 140 0.12 18)+0.15*$(hit 0 30)" "lowpass=f=1200"
render AlchFoam 0.3 0.2 "$(hit 0 9)*sin(PI*min(t/0.25,1))" "bandpass=f=3000:width_type=q:w=0.7"
both AlchCork 0.25 0.55 "$(glide 0 190 120 0.13 16)+0.3*$(hit 0 120)+0.15*$(pluck 0.02 700 30)" "lowpass=f=3500"
# Tailoring
render TailorFwip 0.1 0.2 "$(hit 0 30)*sin(PI*min(t/0.05,1))" "bandpass=f=5000:width_type=q:w=4"
both TailorSnip 0.2 0.22 "gte(t,0)*(sin(2*PI*3300*t)+0.5*sin(2*PI*6600*t))*exp(-60*t)+gte(t,0.05)*(sin(2*PI*3700*(t-0.05))+0.5*sin(2*PI*7400*(t-0.05)))*exp(-60*(t-0.05))"
# Engineering (E1: metal ratchet + a springy boing)
render EngTick 0.15 0.3 "0.7*$(hit 0 150)+0.4*$(metal 0 3400 40)" "bandpass=f=3400:width_type=q:w=1"
both EngBoing 0.5 0.3 "gte(t,0)*min(1,t*300)*sin(2*PI*(320*t+200*t*t*3)+30/22*sin(2*PI*22*t))*exp(-6*t)"
# Cooking
render CookSizzle 0.15 0.2 "$(hit 0 18)" "highpass=f=5000"
render CookWhoosh 0.25 0.2 "$(hit 0 6)*sin(PI*min(t/0.2,1))" "bandpass=f=900:width_type=q:w=0.8"
both CookTss 0.4 0.22 "$(hit 0 7)*0.8+0.4*$(pluck 0 260 20)" "highpass=f=1500"
# Blacksmithing (H2: tap, tap, CLANG)
render SmithTap 0.15 0.3 "0.8*$(hit 0 80)+0.25*$(metal 0 1250 30)" "bandpass=f=3800:width_type=q:w=1.2"
both SmithClang 0.5 0.45 "$(glide 0 85 50 0.1 20)+0.7*$(hit 0 40)+0.3*$(metal 0 470 7)" "lowpass=f=5000"
render SmithHiss 0.5 0.15 "$(hit 0 4)*sin(PI*min(t/0.45,1))" "highpass=f=4500"
# Enchanting
render EnchChime1 0.5 0.18 "$(pluck 0 1046.5 7)"
render EnchChime2 0.5 0.18 "$(pluck 0 1318.5 7)"
render EnchChime3 0.5 0.18 "$(pluck 0 1568 7)"
both EnchPing 0.7 0.2 "$(pluck 0 1568 5)+0.6*$(pluck 0.02 2093 5)"
# First Aid (B clean: F2's tactile taps)
render AidPat 0.15 0.35 "$(glide 0 200 140 0.06 30)+0.3*$(hit 0 50)" "lowpass=f=1600"
render AidTap 0.12 0.35 "$(sq 0 260 180 0.05 45)+0.3*$(hit 0 60)" "lowpass=f=3000"
both AidClick 0.35 0.6 "0.6*$(hit 0 200)+0.5*$(pluck 0.03 1046.5 10)" "highpass=f=400"
# any other profession
both CraftDone 0.6 0.18 "$(pluck 0 1318.5 6)+0.8*$(pluck 0.07 1760 6)"
