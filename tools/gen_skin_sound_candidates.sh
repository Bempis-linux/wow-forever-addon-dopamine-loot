#!/usr/bin/env bash
# Skinning sound candidates for picking by ear: renders each candidate (sine waves and noise, nothing
# copied) to docs/mockups/sounds/ (gitignored), all brought to the same loudness so the comparison is
# fair, then writes docs/mockups/skin-sounds.html with them embedded (the browser pane can't load files
# beside a page). The picked ones move into tools/gen_gather_sounds.sh.
# Run: bash tools/gen_skin_sound_candidates.sh   (needs ffmpeg, like gen_sounds.sh)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=docs/mockups/sounds
PAGE=docs/mockups/skin-sounds.html
mkdir -p "$OUT"
FF="${FFMPEG:-$(command -v ffmpeg || ls -d "$LOCALAPPDATA"/Microsoft/WinGet/Packages/Gyan.FFmpeg*/*/bin/ffmpeg.exe 2>/dev/null | head -1)}"
[ -x "$FF" ] || { echo "ffmpeg not found"; exit 1; }

render() { # NAME SECONDS EXPR [EXTRA FILTERS]: loudness-matched for listening
  local fl fade; fl=$(awk "BEGIN{d = $2 / 3; print (d < 0.3 ? d : 0.3)}"); fade=$(awk "BEGIN{print $2 - $fl}")
  "$FF" -y -loglevel error -f lavfi -i "aevalsrc=exprs='0.5*($3)':s=44100:d=$2" \
    -af "${4:+$4,}afade=t=out:st=$fade:d=$fl,loudnorm=I=-22:TP=-4:LRA=11,alimiter=limit=0.7" -ar 44100 -c:a libvorbis -q:a 4 "$OUT/$1.ogg"
  echo "wrote $OUT/$1.ogg"
}
pluck() { local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*250)*((sin(2*PI*$f*$u)+0.4*sin(2*PI*$f*1.003*$u))*exp(-$d*$u)+0.18*sin(2*PI*$f*2*$u)*exp(-2.5*$d*$u))"; }
# noise burst START DUR: a soft swell of noise (the filter shapes it)
swell() { local s=$1 d=$2 u="(t-$1)"; echo "gte(t,$s)*lte(t,$s+$d)*(random(0)*2-1)*sin(PI*$u/$d)"; }
# shing START FREQ DECAY: a blade's metallic ring (inharmonic partials) with a breath of noise
shing() { local s=$1 f=$2 d=$3 u="(t-$1)"
  echo "gte(t,$s)*min(1,$u*900)*(sin(2*PI*$f*$u)*exp(-$d*$u)+0.6*sin(2*PI*$f*1.47*$u)*exp(-1.3*$d*$u)+0.4*sin(2*PI*$f*2.31*$u)*exp(-1.8*$d*$u)+0.25*(random(0)*2-1)*exp(-40*$u))"; }
# the shipped Slash (tools/gen_gather_sounds.sh), at START
slash_now() { local s=$1 u="(t-$1)"; echo "gte(t,$s)*(random(0)*2-1)*sin(PI*min($u/0.16,1))*exp(-4*$u)*(0.5+0.5*sin(2*PI*2400*$u))"; }
thump() { local s=$1 f=$2 u="(t-$1)"; echo "gte(t,$s)*min(1,$u*400)*sin(2*PI*$f*$u)*exp(-22*$u)"; }

# --- normal (every skin: gentle, short) ---
render SkinN0 0.4 "$(slash_now 0)"
render SkinN1 0.4 "$(swell 0 0.2)" "bandpass=f=1600:width_type=o:w=1.2"
render SkinN2 0.5 "0.6*$(shing 0 2600 14)"
render SkinN3 0.4 "(random(0)*2-1)*gte(t,0)*lte(t,0.22)*(0.5+0.5*gt(sin(2*PI*55*t),0.2))*sin(PI*t/0.22)" "lowpass=f=2600"
render SkinN4 0.5 "0.8*$(swell 0 0.16)+0.9*$(thump 0.13 170)" "lowpass=f=5000"
render SkinN5 0.25 "(random(0)*2-1)*exp(-120*t)+0.5*sin(2*PI*3400*t)*exp(-70*t)" "highpass=f=1200"

# --- rare: Double slash (two blades crossing at 0 and 0.12 s; the meeting at 0.17 s) ---
render SkinR0 1.3 "$(slash_now 0)+$(slash_now 0.12)+0.5*($(pluck 0.17 1500 3)+0.6*$(pluck 0.22 2250 3))"
render SkinR1 1.4 "0.6*$(shing 0 2400 9)+0.6*$(shing 0.12 3000 9)+0.4*($(pluck 0.17 1568 2.5)+$(pluck 0.17 1976 2.5)+$(pluck 0.17 2349 2.5))"
render SkinR2 1.6 "0.8*$(swell 0 0.15)+0.8*$(swell 0.12 0.15)+0.7*gte(t,0.17)*(sin(2*PI*330*(t-0.17))+0.5*sin(2*PI*330*2.76*(t-0.17))+0.3*sin(2*PI*330*5.4*(t-0.17)))*exp(-3*(t-0.17))" "lowpass=f=7000"
render SkinR3 1.5 "0.6*$(shing 0 2400 10)+0.6*$(shing 0.12 2800 10)+0.35*($(pluck 0.2 3136 4)+$(pluck 0.28 2637 4)+$(pluck 0.36 2093 4)+$(pluck 0.44 1568 3.5))"

# --- rare: Flurry (11 hits speeding up, a pause, the final slash; the same timing as in game) ---
times=(); t=0.1; for i in $(seq 0 10); do times+=("$t"); g=$(awk "BEGIN{v=0.13-$i*0.009; print (v<0.045?0.045:v)}"); t=$(awk "BEGIN{print $t+$g}"); done
fin=$(awk "BEGIN{print $t+0.32}")
hits_now=""; hits_shing=""; hits_whoosh=""
for i in "${!times[@]}"; do
  s=${times[$i]}; f=$(awk "BEGIN{print 2200+$i*90}")
  hits_now+="+(gte(t,$s)*(random(0)*2-1)*exp(-45*(t-$s))*(0.4+0.6*sin(2*PI*3200*(t-$s)))+0.4*gte(t,$s)*sin(2*PI*2800*(t-$s))*exp(-60*(t-$s)))"
  hits_shing+="+0.45*$(shing "$s" "$f" 22)"
  hits_whoosh+="+0.6*$(swell "$s" 0.09)"
done
final_now="gte(t,$fin)*(sin(2*PI*(55*(t-$fin)+40*(1-exp(-8*(t-$fin)))))*exp(-5*(t-$fin))+0.35*(random(0)*2-1)*exp(-9*(t-$fin)))+0.35*$(pluck "$fin" 1760 4)+0.3*$(pluck "$(awk "BEGIN{print $fin+0.04}")" 2637 4)"
render SkinF0 2.8 "0.7*(0${hits_now})+$final_now"
render SkinF1 2.8 "0${hits_shing}+0.9*$(shing "$fin" 1700 4)+0.7*gte(t,$fin)*sin(2*PI*(50*(t-$fin)+30*(1-exp(-8*(t-$fin)))))*exp(-5*(t-$fin))"
render SkinF2 2.8 "0${hits_whoosh}+1.2*$(swell "$fin" 0.35)+0.8*gte(t,$fin+0.05)*sin(2*PI*(48*(t-$fin)+40*(1-exp(-9*(t-$fin)))))*exp(-4*(t-$fin))" "lowpass=f=6000"

# --- the listening page, with the sounds embedded ---
{
cat <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skinning Sounds</title>
<style>
  :root { --text: #e8e2d0; --muted: #9a927e; --gold: #ffd100; }
  html, body { margin: 0; background: #0b0b10; color: var(--text); font: 13px/1.4 system-ui, sans-serif; }
  header { padding: 14px 18px 4px; } h1 { font-size: 16px; margin: 0 0 4px; color: var(--gold); font-weight: 600; }
  header p { margin: 0; color: var(--muted); max-width: 900px; }
  h2 { font-size: 14px; margin: 18px 18px 6px; color: var(--gold); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 8px; margin: 0 18px; max-width: 1100px; }
  .card { background: #15120c; border: 1px solid #2a2418; border-radius: 6px; padding: 9px 11px; display: flex; gap: 10px; align-items: flex-start; }
  .card.now { border-color: #5a4a28; }
  .card b { color: var(--gold); } .card small { display: block; color: var(--muted); font-size: 11.5px; margin-top: 2px; }
  button { background: #4a3c1c; color: var(--text); border: 1px solid #d0a040; border-radius: 50%; width: 34px; height: 34px; flex: none; cursor: pointer; font-size: 13px; }
  button:active { transform: scale(.94); }
  .bar { padding: 6px 18px; color: var(--muted); font-size: 12px; display: flex; gap: 10px; align-items: center; }
  .rep { border-radius: 4px; width: auto; height: auto; padding: 4px 10px; font-size: 12px; }
</style>
</head>
<body>
<header>
  <h1>Skinning sounds</h1>
  <p>Our own synthesized candidates, all at the same loudness. "Now" is what's in game. The normal sound plays on every skin, so it should stay pleasant after hundreds; the rare ones can be bigger. Click ▶ to play; "×5" plays a normal one five times in a row, the way a skinning run sounds.</p>
</header>
<div class="bar">Volume <input type="range" id="vol" min="0" max="100" value="70"></div>
HTML
section() { # TITLE, then KEY|NAME|TEXT|now?
  echo "<h2>$1</h2><div class=\"grid\">"; shift
  for row in "$@"; do
    IFS='|' read -r key name text now <<<"$row"
    local rep=""; [[ $key == SkinN* ]] && rep="<button class=\"rep\" onclick=\"rep('$key')\">×5</button>"
    echo "<div class=\"card ${now:+now}\"><button onclick=\"play('$key')\">▶</button><div><b>$name</b><small>$text</small></div>$rep</div>"
  done
  echo "</div>"
}
section "Normal (every skin)" \
  "SkinN0|Now: noisy swish|A bright noise swish with a buzzy shimmer.|now" \
  "SkinN1|N1 Soft swish|An airy, band-passed whoosh: softer and rounder." \
  "SkinN2|N2 Blade shing|A short metallic ring of the knife, a breath of air." \
  "SkinN3|N3 Leather rip|A quick, soft tearing (the hide coming free)." \
  "SkinN4|N4 Swish and thump|A short swish, then a muffled thump as the hide drops." \
  "SkinN5|N5 Snick|A tiny crisp tick: the quietest option."
section "Rare: Double slash" \
  "SkinR0|Now: two swishes and a chime|The noise swish twice, then a two-note chime as they cross.|now" \
  "SkinR1|R1 Twin shing chord|Two metallic shings, then a bright three-note chord at the crossing." \
  "SkinR2|R2 Swishes and gong|Two soft swishes, then a small metal gong where they meet." \
  "SkinR3|R3 Shing and sparkle|Two shings, then a little descending sparkle of bells."
section "Rare: Flurry" \
  "SkinF0|Now: ticks and a boom|Eleven bright ticks speeding up, then a low hit with two bells.|now" \
  "SkinF1|F1 Shing storm|Each slash a short shing rising in pitch, then a big shing over a low hit." \
  "SkinF2|F2 Whoosh storm|Each slash an airy whoosh, then a long deep whoosh and a boom."
echo "<script>"
echo "const S = {"
for f in "$OUT"/Skin*.ogg; do k=$(basename "$f" .ogg); printf "  %s: 'data:audio/ogg;base64,%s',\n" "$k" "$(base64 -w0 "$f")"; done
echo "};"
cat <<'HTML'
const vol = () => document.getElementById('vol').value / 100;
function play(k) { const a = new Audio(S[k]); a.volume = vol(); a.play(); }
function rep(k) { for (let i = 0; i < 5; i++) setTimeout(() => play(k), i * 900); }
</script>
</body>
</html>
HTML
} > "$PAGE"
echo "wrote $PAGE"
