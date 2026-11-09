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

# Per-profession touches (docs/mockups/gather-themes.html):
#   Strike00..02   mining: a pick strike, a short metallic tink (three pitches, played in rhythm)
#   Splash         fishing: a soft bloop with a little spray
#   Slash          skinning: a quick bright swish
#   RareHerb       a flower blooming: a soft rising bell arpeggio
#   RareOre        a gem: two high glinting bells
#   RareFish       a leap: a rising slide and a splash
#   RareSkin       a shine sweep: a shimmering high slide
#   Unlock         something new to gather / a rank maxed: an arpeggio into a held chord
glide() { # START F0 F1 DUR DECAY: a sine sliding from F0 to F1 over DUR, fading
  local s=$1 f0=$2 f1=$3 d=$4 k=$5 u="(t-$1)" r
  r=$(awk "BEGIN{print log($3 / $2)}")
  echo "gte(t,$s)*min(1,$u*200)*sin(2*PI*$f0*$d/$r*(exp($r*min($u,$d)/$d)-1))*exp(-$k*$u)"
}
for n in 0 1 2; do
  f=$(hz 1760 "$((n * 2))")
  render "Strike0$n" 0.35 0.16 "sin(2*PI*$f*t)*exp(-30*t)+0.6*sin(2*PI*$f*2.76*t)*exp(-45*t)+0.3*sin(2*PI*$f*5.4*t)*exp(-70*t)"
done
render Splash 0.6 0.25 "$(glide 0 520 180 0.12 9)+0.25*(random(0)*2-1)*exp(-14*t)*min(1,t*80)"
render Slash 0.3 0.18 "(random(0)*2-1)*sin(PI*min(t/0.16,1))*exp(-4*t)*(0.5+0.5*sin(2*PI*2400*t))"
render RareHerb 1.4 0.18 "$(pluck 0 1046.5 3)+$(pluck 0.09 1318.5 3)+$(pluck 0.18 1568 3)+1.1*$(pluck 0.27 2093 2.5)"
render RareOre 1.1 0.16 "$(pluck 0 2637 4)+0.8*$(pluck 0.12 3520 4)+0.5*$(pluck 0.24 3136 4)"
render RareFish 1.2 0.2 "$(glide 0 300 900 0.45 2)+0.3*gte(t,0.85)*(random(0)*2-1)*exp(-12*(t-0.85))"
render RareSkin 0.9 0.14 "$(glide 0 1500 3200 0.4 3)+0.6*$(glide 0.05 2250 4800 0.4 3)"
render Unlock 1.8 0.18 "$(pluck 0 523.25 3)+$(pluck 0.1 659.25 3)+$(pluck 0.2 783.99 3)+$(pluck 0.3 1046.5 2)+0.8*($(pluck 0.45 1318.5 1.6)+$(pluck 0.45 1568 1.6))"

# Round 2 (docs/mockups/gather-polish.html):
#   HerbPop       herbalism (H4 "Pluck pop"): a soft woody pop
#   FlurryHit     skinning rare "Flurry": one quick slash of the storm (a short bright tick)
#   FlurryFinal   the flurry's big final slash: a low hit, a whoosh and two bright bells
render HerbPop 0.3 0.2 "sin(2*PI*880*t)*exp(-40*t)*min(1,t*400)+0.5*sin(2*PI*1320*t)*exp(-60*t)+0.15*(random(0)*2-1)*exp(-50*t)"
render FlurryHit 0.15 0.14 "(random(0)*2-1)*exp(-45*t)*(0.4+0.6*sin(2*PI*3200*t))+0.4*sin(2*PI*2800*t)*exp(-60*t)"
render FlurryFinal 1.3 0.22 "sin(2*PI*(55*t+40*(1-exp(-8*t))))*exp(-5*t)+0.35*(random(0)*2-1)*exp(-9*t)+0.35*$(pluck 0.02 1760 4)+0.3*$(pluck 0.06 2637 4)"
