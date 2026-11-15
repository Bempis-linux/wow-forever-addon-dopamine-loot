// Rejected skill-up rounds 53-54 (Blacksmithing base), moved out of skillup-p2.html 2026-11-15 to keep the page under the browser pane's 512 KiB limit. Not loaded; uses the page's helpers (land53, hT53, lastHit53, rnd53, steel53).
// A: one overlapping steel plate, a gold rivet on its right
function plate53(x, y, w, a = 1) { if (w <= .5) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = steel53(y, 10); ctx.beginPath(); ctx.roundRect(x, y - 5, w, 10, 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x, y - 5, 1.2, 10); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + 1.2, y - 4, w - 2, 1);
  if (w > 5) { ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(x + w - 3, y + .5, 1.1, 0, 7); ctx.fill(); } ctx.restore(); }
function plates53(x0, y, end) { for (let x = x0; x < end - .5; x += 7) plate53(x, y, Math.min(9, end - x)); }
// B: steel layers; edges share one wave, so two stacked halves of n bands = 2n bands
function layers53(x0, end, cy, h, n, a = 1) { if (end <= x0 + .5) return; const e = (j, x) => cy - h / 2 + (j + .42 * Math.sin(x * .11 + 1.3)) * h / n; ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.rect(x0, cy - h / 2, end - x0, h); ctx.clip(); ctx.fillStyle = '#56606c'; ctx.fillRect(x0, cy - h / 2, end - x0, h);
  for (let j = -1; j <= n; j += 2) { ctx.fillStyle = j % 4 === 1 || j % 4 === -3 ? '#c4ccd4' : '#9aa4ae'; ctx.beginPath(); for (let x = x0; x <= end + 3; x += 3) ctx.lineTo(x, e(j, x)); for (let x = end + 3; x >= x0 - 3; x -= 3) ctx.lineTo(x, e(j + 1, x)); ctx.fill(); }
  const g = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(.5, 'rgba(255,200,140,0)'); g.addColorStop(1, 'rgba(0,0,0,.3)'); ctx.fillStyle = g; ctx.fillRect(x0, cy - h / 2, end - x0, h); ctx.restore(); }
// D: dark rough iron (fixed speckles) and mirror-polished steel
function rough53(x0, end, y) { if (end <= x0) return; ctx.fillStyle = '#34302c'; ctx.fillRect(x0, y - 6, end - x0, 12);
  for (let k = 0; k < 90; k++) { const x = x0 + rnd53(k) * 232; if (x > end) continue; ctx.fillStyle = rnd53(k + 50) > .5 ? 'rgba(120,108,96,.7)' : 'rgba(10,8,6,.6)'; ctx.fillRect(x, y - 6 + rnd53(k + 99) * 11, 1.3, 1.3); } }
function polish53(x0, end, y, t) { if (end <= x0) return; const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#f4f7fa'); g.addColorStop(.3, '#c2cad2'); g.addColorStop(.55, '#6e7a86'); g.addColorStop(.8, '#b0bac4'); g.addColorStop(1, '#5a6470'); ctx.fillStyle = g; ctx.fillRect(x0, y - 6, end - x0, 12);
  const sx = x0 + ((t * 70) % 300) - 30; if (sx < end) { const s = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0); s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(.5, 'rgba(255,255,255,.55)'); s.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = s; ctx.fillRect(Math.max(x0, sx - 14), y - 6, Math.min(end, sx + 14) - Math.max(x0, sx - 14), 12); } }
const BS53 = {
  A: { name: 'Plate by plate', desc: 'The fill is overlapping steel plates, each with a gold rivet. Each skill-up drops a new plate in from above the bar: it lands at the front with a small thud, the bar kicks, a puff of dust, and its rivet glints.',
    snd: (i, v) => { drum46(110 * semi(pick45(i, 2) / 3), 0, .035 * v); bell45(1318 * semi(pick45(i, 3)), .03, .005 * v); },
    V: { grow(p, x0, y, L, f, t, I) { plates53(x0, y, I.X(S.v0 + land53(.2))); },
      shake(I) { const k = lastHit53(); if (k < 0) return [0, 0]; const t = hT53(k) - .2; return t > 0 && t < .12 ? [0, Math.sin(t * 90) * 1.6 * (1 - t / .12)] : [0, 0]; },
      over(p, I) { S.hits.forEach((h, i) => { const t = hT53(i), xe = I.X(S.v0 + i + 1);
        if (t >= 0 && t < .2) { const u = t / .2; ctx.save(); ctx.translate(xe - 4.5, I.ly - 30 * (1 - u * u)); ctx.rotate(-.5 * (1 - u)); plate53(-4.5, 0, 9); ctx.restore(); }
        if (t >= .2) once('a53' + i, () => { BS53.A.snd(i, fat45(i)); for (let q = 0; q < 6; q++) spawn({ x: xe - 4 + (Math.random() - .5) * 8, y: I.ly + 4, vx: (Math.random() - .5) * 50, vy: -10 - Math.random() * 20, g: 40, life: .5, size: 1.6, col: 'rgba(170,160,150,.55)' }); });
        if (t >= .2 && t < .55) { const g = 1 - (t - .2) / .35; ctx.save(); ctx.globalAlpha *= g; ctx.fillStyle = '#fff6d8'; ctx.shadowColor = '#ffd36a'; ctx.shadowBlur = 8; star4(xe - 3, I.ly + .5, 2 + g * 4, t * 3); ctx.restore(); } }); } } },
  B: { name: 'Folded steel', desc: 'The fill shows thin layers of steel. Each skill-up folds it: a copy of the steel comes down from above while the bar squeezes into its lower half, the two halves press together (a soft tap), and a sheen runs along the denser pattern before it settles.',
    snd: (i, v, k) => k ? mallet(392 * semi(pick45(i, 3)), 0, .022 * v) : tone(196 * semi(pick45(i, 2)), 0, .012 * v, .25, 'sine', null, .03),
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), end = I.tipX, ft = k < 0 ? 9 : hT53(k);
        if (ft >= 0 && ft < .3) { const u = eOut(ft / .3), h = 12 * (1 - .5 * u); layers53(x0, end, y + 6 - h / 2, h, 6); }
        else if (ft >= .3 && ft < .6) { const c = (ft - .3) / .3; layers53(x0, end, y + 3, 6, 6); layers53(x0, end, y - 3, 6, 6); layers53(x0, end, y, 12, 6, c); }
        else layers53(x0, end, y, 12, 6); },
      over(p, I) { const k = lastHit53(); S.hits.forEach((h, i) => { const t = hT53(i); if (t >= 0) once('b53u' + i, () => BS53.B.snd(i, fat45(i), 0)); if (t >= .3) once('b53d' + i, () => BS53.B.snd(i, fat45(i), 1)); });
        if (k < 0) return; const ft = hT53(k);
        if (ft >= 0 && ft < .3) { const u = eOut(ft / .3), h = 12 * (1 - .5 * u), top = lerp(I.ly - 22, I.ly - 6, u); layers53(I.x0, I.tipX, top + h / 2, h, 6, .5 + .5 * u); }
        if (ft >= .3 && ft < .7) { const sx = lerp(I.x0, I.tipX, (ft - .3) / .4); ctx.save(); ctx.beginPath(); ctx.rect(I.x0, I.ly - 6, I.tipX - I.x0, 12); ctx.clip(); const s = ctx.createLinearGradient(sx - 16, 0, sx + 16, 0); s.addColorStop(0, 'rgba(255,240,210,0)'); s.addColorStop(.5, 'rgba(255,240,210,.7)'); s.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = s; ctx.fillRect(sx - 16, I.ly - 6, 32, 12); ctx.restore(); } } } },
  C: { name: 'Drawn out', desc: 'Each skill-up pulls the steel forward: the bar stretches past its new mark, thinning as it goes, a bright streak runs along it, then it springs back, thickens and settles at the new value (a soft plucked note).',
    snd: (i, v) => pluck(196 * semi(pick45(i, 3)), .03 * v),
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(); let end = I.X(S.v0 + land53(0)), th = 12, streak = -1;
        if (k >= 0) { const ft = hT53(k), e0 = I.X(S.v0 + k), e1 = I.X(S.v0 + k + 1), over = 14;
          if (ft < .18) { end = lerp(e0, e1 + over, eOut(ft / .18)); streak = ft / .18; } else { end = e1 + over * Math.cos((ft - .18) * 16) * Math.exp(-(ft - .18) * 8); }
          th = 12 * (1 - .45 * clamp((end - e1) / over)); }
        if (end <= x0) return; ctx.fillStyle = steel53(y, th); ctx.beginPath(); ctx.moveTo(x0, y - th / 2); ctx.lineTo(end - 10, y - th / 2); ctx.quadraticCurveTo(end, y - th / 2, end, y); ctx.quadraticCurveTo(end, y + th / 2, end - 10, y + th / 2); ctx.lineTo(x0, y + th / 2); ctx.fill();
        ctx.fillStyle = hexA(p.col, .18); ctx.fillRect(x0, y - th / 2, end - x0 - 6, th);
        if (streak >= 0) { const sx = lerp(x0, end, streak); const s = ctx.createLinearGradient(sx - 30, 0, sx, 0); s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(1, 'rgba(255,255,255,.8)'); ctx.fillStyle = s; ctx.fillRect(Math.max(x0, sx - 30), y - 1.5, Math.min(30, sx - x0), 2); } },
      over(p, I) { onHits('c53', i => BS53.C.snd(i, fat45(i))); } } },
  D: { name: 'Polished edge', desc: 'The bar fills with dark, rough iron. Each skill-up grinds the newest part: a bright point runs along it, leaving mirror steel behind, and a short stream of grinding sparks flies off backwards, out of the bar; a soft glint when it’s done.',
    snd: (i, v, k) => k ? bell45(1175 * semi(pick45(i, 3)), 0, .008 * v) : noise(0, .3, .02 * v, 700, .7, 'lowpass'),
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(); rough53(x0, I.tipX, y); let pol = I.X(S.v0 + land53(.45));
        if (k >= 0) { const ft = hT53(k); if (ft < .45) pol = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), clamp((ft - .1) / .35)); }
        polish53(x0, Math.min(pol, I.tipX), y, t); },
      over(p, I) { S.hits.forEach((h, i) => { const t = hT53(i); if (t >= .1) once('d53g' + i, () => BS53.D.snd(i, fat45(i), 0)); if (t >= .45) once('d53e' + i, () => BS53.D.snd(i, fat45(i), 1));
        if (t >= .1 && t < .45) { const x = lerp(I.X(S.v0 + i), I.X(S.v0 + i + 1), (t - .1) / .35), g = ctx.createRadialGradient(x, I.ly, 0, x, I.ly, 8); g.addColorStop(0, 'rgba(255,250,235,.95)'); g.addColorStop(.5, 'rgba(255,200,120,.5)'); g.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, I.ly, 8, 0, 7); ctx.fill();
          once('d53s' + i + '_' + Math.floor(t / .025), () => { for (let q = 0; q < 2; q++) spawn({ x, y: I.ly - 3, vx: -60 - Math.random() * 110, vy: -50 - Math.random() * 90, g: 420, life: .3 + Math.random() * .15, size: .9, col: q ? '#ffd070' : '#fff0c0' }); }); }
        if (t >= .45 && t < .8) { const a = 1 - (t - .45) / .35, x = I.X(S.v0 + i + 1) - 2; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff'; ctx.shadowColor = '#e8f0ff'; ctx.shadowBlur = 8; star4(x, I.ly - 2, 2 + a * 4, 0); ctx.restore(); } }); } } },
};
function r53(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS53[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS53[K].desc + ' (The base only: add-ons, the finale and the sound come next; the sound here is a gentle placeholder that varies and steps down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS53[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS53[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r53('A'), PB: r53('B'), PC: r53('C'), PD: r53('D') });
// ---------- round 54 (2026-11-15): Blacksmithing base, four new ideas (round 53's plates, folding, stretching, polishing set aside) ----------
// A: the blade, x0..end, tapering to a point over its last 14 px
function blade54(x0, end, y, p) { if (end <= x0 + 1) return; const tp = Math.max(x0, end - 14); ctx.fillStyle = steel53(y, 10); ctx.beginPath(); ctx.moveTo(x0, y - 5); ctx.lineTo(tp, y - 5); ctx.lineTo(end, y + 1); ctx.lineTo(tp, y + 5); ctx.lineTo(x0, y + 5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(x0, y + 3); ctx.lineTo(tp, y + 3); ctx.lineTo(end, y + 1); ctx.lineTo(tp, y + 5); ctx.lineTo(x0, y + 5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(30,36,44,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0 + 2, y - 1); ctx.lineTo(Math.max(x0 + 2, tp - 6), y - 1); ctx.stroke();
  ctx.fillStyle = hexA(p.col, .9); ctx.fillRect(x0 - 2, y - 6, 3, 12); }
// B: the steel rod, vibrating: a standing wave along it, amp px
function rod54(x0, end, y, amp, ph) { if (end <= x0 + 1) return; const len = end - x0, w = x => amp * Math.sin(Math.PI * 3 * (x - x0) / len) * Math.sin(ph); ctx.fillStyle = steel53(y, 8);
  ctx.beginPath(); for (let x = x0; x <= end; x += 2) ctx.lineTo(x, y - 4 + w(x)); for (let x = end; x >= x0; x -= 2) ctx.lineTo(x, y + 4 + w(x)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = x0; x <= end; x += 2) ctx.lineTo(x, y - 2.5 + w(x)); ctx.stroke(); }
// C: packed filings (fixed short dashes)
function filings54(x0, end, y) { if (end <= x0) return; ctx.fillStyle = '#2a2a2e'; ctx.fillRect(x0, y - 6, end - x0, 12); ctx.lineWidth = 1; ctx.lineCap = 'round';
  for (let k = 0; k < 220; k++) { const x = x0 + rnd53(k * 3) * 232; if (x > end - 1) continue; const yy = y - 5 + rnd53(k * 3 + 1) * 10, an = (rnd53(k * 3 + 2) - .5) * .8; ctx.strokeStyle = k % 3 ? 'rgba(150,156,166,.85)' : 'rgba(210,216,224,.9)'; ctx.beginPath(); ctx.moveTo(x - Math.cos(an) * 1.6, yy - Math.sin(an) * 1.6); ctx.lineTo(x + Math.cos(an) * 1.6, yy + Math.sin(an) * 1.6); ctx.stroke(); } }
// D: dark blued steel, and the gold inlay line with curls (alternating above/below) up to end
function inlay54(x0, end, y) { if (end <= x0) return; ctx.save(); ctx.strokeStyle = '#ffd36a'; ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,211,106,.6)'; ctx.shadowBlur = 3;
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(end, y); ctx.stroke();
  for (let k = 0, cx = x0 + 9; cx < end; k++, cx += 15) { const s = k % 2 ? 1 : -1, g = clamp((end - cx) / 7), a0 = s < 0 ? Math.PI / 2 : -Math.PI / 2; ctx.beginPath(); ctx.arc(cx, y + s * 3, 3, a0, a0 + 4.6 * g * (s < 0 ? 1 : -1), s > 0); ctx.stroke(); }
  ctx.restore(); }
const BS54 = {
  A: { name: 'The blade', desc: 'The bar is a sword blade (a flat spine, a bright edge, a fuller down its middle) tapering to a point at the front. Each skill-up lengthens the blade, and a glint slides from the start of the bar to the point, where it sparkles.',
    snd: (i, v) => { bell45(1568 * semi(pick45(i, 3)), .2, .006 * v); bell45(2093 * semi(pick45(i, 3)), .26, .003 * v); },
    V: { grow(p, x0, y, L, f, t, I) { blade54(x0, I.tipX, y, p); const k = lastHit53(); if (k < 0) return; const ft = hT53(k); if (ft < 0 || ft > .35) return;
        const gx = lerp(x0, I.tipX, eOut(ft / .35)), s = ctx.createLinearGradient(gx - 18, 0, gx + 4, 0); s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(1, 'rgba(255,255,255,.85)'); ctx.fillStyle = s; ctx.fillRect(gx - 18, y - 6, 22, 12); },
      over(p, I) { S.hits.forEach((h, i) => { const t = hT53(i); if (t >= .2) once('a54' + i, () => BS54.A.snd(i, fat45(i)));
        if (t >= .33 && t < .75) { const a = 1 - (t - .33) / .42, x = I.X(S.v0 + i + 1); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff'; ctx.shadowColor = '#e8f0ff'; ctx.shadowBlur = 8; star4(x, I.ly + 1, 2 + a * 5, t * 2); ctx.restore(); } }); } } },
  B: { name: 'Ringing steel', desc: 'The bar is a rod of steel. Each skill-up makes it ring: it hums and shivers along its length (a shimmer that fades), and the fill moves forward while it rings. A soft, long tuning-fork tone.',
    snd: (i, v) => { const f = 523 * semi(pick45(i, 3)); tone(f, 0, .014 * v, 1.4, 'sine', null, .01); tone(f * 2, 0, .004 * v, .7, 'sine', null, .01); },
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), amp = ft >= 0 && ft < 1.2 ? 1.8 * Math.exp(-ft * 3.2) : 0;
        if (amp > .05) { ctx.save(); ctx.globalAlpha *= .3; rod54(x0, I.tipX, y, amp, ft * 70 + 1.6); rod54(x0, I.tipX, y, amp, ft * 70 - 1.6); ctx.restore(); }
        rod54(x0, I.tipX, y, amp, ft * 70); ctx.fillStyle = hexA(p.col, .15); ctx.fillRect(x0, y - 4, I.tipX - x0, 8);
        if (amp > .05) { ctx.fillStyle = `rgba(255,240,215,${amp * .25})`; ctx.fillRect(x0, y - 6, I.tipX - x0, 12); } },
      over(p, I) { onHits('b54', i => BS54.B.snd(i, fat45(i))); } } },
  C: { name: 'Iron filings', desc: 'The fill is packed iron filings. Each skill-up pulls a stream of filings in from around the bar, as if by a magnet: they swirl toward the front and pack on with a small shiver, and a few stand up on end at the front for a moment.',
    snd: (i, v, k) => k ? mallet(220 * semi(pick45(i, 2)), 0, .02 * v) : [0, 1, 2, 3].forEach(q => tone(2093 * semi(PENT42[(i + q * 2) % 10]), q * .05, .0025 * v, .12, 'sine', null, .004)),
    V: { grow(p, x0, y, L, f, t, I) { filings54(x0, I.X(S.v0 + land53(.4)), y); },
      shake(I) { const k = lastHit53(); if (k < 0) return [0, 0]; const t = hT53(k) - .4; return t > 0 && t < .15 ? [Math.sin(t * 120) * .8 * (1 - t / .15), 0] : [0, 0]; },
      over(p, I) { S.hits.forEach((h, i) => { const t = hT53(i), tx = I.X(S.v0 + i + 1) - 2; if (t >= 0) once('c54a' + i, () => BS54.C.snd(i, fat45(i), 0)); if (t >= .4) once('c54b' + i, () => BS54.C.snd(i, fat45(i), 1));
        if (t >= 0 && t < .45) { ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 1.1; for (let q = 0; q < 26; q++) { const d = rnd53(q + i * 31) * .12, u = clamp((t - d) / .3); if (u <= 0 || u >= 1) continue;
            const r0 = 26 + rnd53(q * 7 + i) * 34, a0 = rnd53(q * 13 + i) * 6.28, r = r0 * (1 - u * u), an = a0 + u * 2.2, x = tx + Math.cos(an) * r, yy = I.ly + Math.sin(an) * r * .55, dir = Math.atan2(I.ly - yy, tx - x);
            ctx.strokeStyle = q % 3 ? 'rgba(170,176,186,.9)' : 'rgba(230,234,240,.95)'; ctx.beginPath(); ctx.moveTo(x - Math.cos(dir) * 2, yy - Math.sin(dir) * 2); ctx.lineTo(x + Math.cos(dir) * 2, yy + Math.sin(dir) * 2); ctx.stroke(); } ctx.restore(); }
        if (t >= .4 && t < 1) { const a = Math.sin(Math.PI * (t - .4) / .6); ctx.save(); ctx.strokeStyle = `rgba(200,206,216,${a * .9})`; ctx.lineWidth = 1; for (let q = -2; q <= 2; q++) { const x = tx + q * 1.8, l = (5 - Math.abs(q)) * a; ctx.beginPath(); ctx.moveTo(x, I.ly - 6); ctx.lineTo(x + q * .6, I.ly - 6 - l); ctx.moveTo(x, I.ly + 6); ctx.lineTo(x + q * .6, I.ly + 6 + l); ctx.stroke(); } ctx.restore(); } }); } } },
  D: { name: 'Gold inlay', desc: 'The bar is plain dark steel. Each skill-up engraves a gold line further into it, with small curls along the way (above, then below); a bright point leads the line as it’s cut, and the new end gleams.',
    snd: (i, v, k) => k ? bell45(1175 * semi(pick45(i, 3)), 0, .007 * v) : tone(587 * semi(pick45(i, 2)), 0, .01 * v, .5, 'triangle', null, .03),
    V: { grow(p, x0, y, L, f, t, I) { const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#4a5462'); g.addColorStop(.5, '#2a303a'); g.addColorStop(1, '#1c2028'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12);
        const k = lastHit53(); let end = I.X(S.v0 + land53(.4)); if (k >= 0) { const ft = hT53(k); if (ft < .4) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), clamp((ft - .05) / .35)); } inlay54(x0, end, y); I.inl = end; },
      over(p, I) { S.hits.forEach((h, i) => { const t = hT53(i); if (t >= .05) once('d54a' + i, () => BS54.D.snd(i, fat45(i), 0)); if (t >= .4) once('d54b' + i, () => BS54.D.snd(i, fat45(i), 1));
        if (t >= .05 && t < .4) { const x = lerp(I.X(S.v0 + i), I.X(S.v0 + i + 1), (t - .05) / .35), g = ctx.createRadialGradient(x, I.ly, 0, x, I.ly, 6); g.addColorStop(0, 'rgba(255,250,225,.95)'); g.addColorStop(1, 'rgba(255,211,106,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, I.ly, 6, 0, 7); ctx.fill(); }
        if (t >= .4 && t < .8) { const a = 1 - (t - .4) / .4, x = I.X(S.v0 + i + 1); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff6d8'; ctx.shadowColor = '#ffd36a'; ctx.shadowBlur = 8; star4(x, I.ly, 2 + a * 4, 0); ctx.restore(); } }); } } },
};
function r54(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS54[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS54[K].desc + ' (The base only: add-ons, the finale and the sound come next; the sound here is a gentle placeholder that varies and steps down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS54[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS54[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r54('A'), PB: r54('B'), PC: r54('C'), PD: r54('D') });

// Rejected rounds 56-57 (Blacksmithing base), moved out 2026-11-15 (page size limit).
// ---------- round 56 (2026-11-15): Blacksmithing base, A kept (round 55 A) + three new directions, no gold needed ----------
// B: rust crust (fixed speckles), cracks, flakes
function rust56(x0, end, y) { if (end <= x0) return; ctx.fillStyle = '#7a3e1c'; ctx.fillRect(x0, y - 6, end - x0, 12);
  for (let k = 0; k < 160; k++) { const ax = I56x0 + rnd53(k * 5) * 236; if (ax < x0 || ax > end) continue; ctx.fillStyle = ['#a8582a', '#5a2a12', '#c47a40', '#4a2410'][k % 4]; ctx.fillRect(ax, y - 6 + rnd53(k * 5 + 1) * 11, 1.5 + rnd53(k * 5 + 2) * 2, 1.3); } }
let I56x0 = 0;
function cracks56(x0, x1, y, u) { ctx.save(); ctx.strokeStyle = 'rgba(25,10,4,.9)'; ctx.lineWidth = .9; ctx.lineCap = 'round'; const n = Math.max(2, Math.round((x1 - x0) / 4));
  for (let q = 0; q <= n; q++) { const x = lerp(x0, x1, q / n), l = 6 * u; ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x + (rnd53(q + 7) - .5) * 3, y - 6 + l); ctx.moveTo(x + 1, y + 6); ctx.lineTo(x + (rnd53(q + 9) - .5) * 3, y + 6 - l); ctx.stroke(); } ctx.restore(); }
// C: a rod from xa to xb, sagging by sag (a smooth bow), thickness th
function rod56(xa, xb, y, sag, th, raw) { if (xb <= xa) return; const yy = x => y + sag * Math.sin(Math.PI * (x - xa) / (xb - xa)) + sag * .35 * Math.sin(2 * Math.PI * (x - xa) / (xb - xa));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = th; ctx.strokeStyle = raw ? '#4a4642' : '#8f9aa6'; ctx.beginPath(); for (let x = xa; x <= xb; x += 2) ctx.lineTo(x, yy(x)); ctx.lineTo(xb, yy(xb)); ctx.stroke();
  ctx.lineWidth = 1.2; ctx.strokeStyle = raw ? 'rgba(140,130,120,.5)' : 'rgba(240,246,252,.8)'; ctx.beginPath(); for (let x = xa; x <= xb; x += 2) ctx.lineTo(x, yy(x) - th * .28); ctx.stroke(); ctx.restore(); }
const BS56 = {
  A: { name: 'Ringing steel, curls', desc: 'Kept from round 55: dark steel with a gold line and curls; each skill-up the bar hums and shivers along its length, a shine runs along the gold, the new end gleams.', V: VAR55.A },
  B: { name: 'Rust flakes off', desc: 'The bar fills with a rust crust. Each skill-up cracks the crust on the newest part; it breaks off in flakes that tumble down below the bar, and clean steel shows underneath.',
    snd: (i, v) => { noise(0, .12, .025 * v, 600, .7, 'lowpass'); mallet(165 * semi(pick45(i, 2)), .02, .014 * v); },
    V: { grow(p, x0, y, L, f, t, I) { I56x0 = I.x0 - 2; const clean = I.X(S.v0 + land53(.2)); ctx.fillStyle = steel53(y, 12); ctx.fillRect(x0 - 2, y - 6, clean - x0 + 2, 12); ctx.fillStyle = hexA(p.col, .12); ctx.fillRect(x0 - 2, y - 6, clean - x0 + 2, 12);
        rust56(clean, I.tipX, y); const k = lastHit53(); if (k >= 0) { const ft = hT53(k); if (ft >= .03 && ft < .2) cracks56(I.X(S.v0 + k), I.X(S.v0 + k + 1), y, (ft - .03) / .17); } },
      shake(I) { const k = lastHit53(); if (k < 0) return [0, 0]; const t = hT53(k) - .2; return t > 0 && t < .1 ? [0, Math.sin(t * 100) * 1 * (1 - t / .1)] : [0, 0]; },
      over(p, I) { S.hits.forEach((h, i) => { if (hT53(i) >= .2) once('b56' + i, () => { BS56.B.snd(i, fat45(i)); const a = I.X(S.v0 + i), b = I.X(S.v0 + i + 1);
        for (let q = 0; q < 9; q++) spawn({ x: lerp(a - 2, b, Math.random()), y: I.ly + (Math.random() - .5) * 8, vx: (Math.random() - .5) * 40, vy: -20 - Math.random() * 30, g: 260, life: .7, size: 1.2 + Math.random() * 1.2, shape: 'sq', vr: (Math.random() - .5) * 14, col: ['#a8582a', '#7a3e1c', '#c47a40'][q % 3] }); }); }); } } },
  C: { name: 'Straightened', desc: 'Ahead of the fill the bar is raw, bent stock, sagging out of line below the bar. Each skill-up snaps the next section straight and true with a small jolt; the bent part ahead shivers and settles; progress is the bar getting straight.',
    snd: (i, v) => { mallet(196 * semi(pick45(i, 3)), 0, .02 * v); tone(392 * semi(pick45(i, 3)), .01, .006 * v, .5, 'sine', null, .01); },
    V: { grow(p, x0, y, L, f, t, I) {}, over(p, I) { const k = lastHit53(); let s = I.X(S.v0 + land53(.12)), wob = 0;
        if (k >= 0) { const ft = hT53(k); if (ft >= 0 && ft < .12) s = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut(ft / .12)); if (ft >= .12 && ft < 1) wob = Math.sin((ft - .12) * 30) * Math.exp(-(ft - .12) * 5) * 3; }
        onHits('c56', i => BS56.C.snd(i, fat45(i)));
        rod56(I.x0, s, I.ly, 0, 7, false); ctx.save(); ctx.globalAlpha *= .14; ctx.fillStyle = p.col; ctx.fillRect(I.x0, I.ly - 3.5, s - I.x0, 7); ctx.restore();
        rod56(s, I.x1 - 4, I.ly, 7 + wob, 6, true);
        if (k >= 0) { const ft = hT53(k); if (ft >= .12 && ft < .45) { const a = 1 - (ft - .12) / .33; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff'; ctx.shadowColor = '#e8f0ff'; ctx.shadowBlur = 8; star4(s, I.ly, 2 + a * 4, 0); ctx.restore(); } } },
      shake(I) { const k = lastHit53(); if (k < 0) return [0, 0]; const t = hT53(k) - .12; return t > 0 && t < .1 ? [Math.sin(t * 110) * 1.2 * (1 - t / .1), 0] : [0, 0]; } } },
  D: { name: 'Raised ridge', desc: 'The fill is flat steel with a raised ridge down its middle. Each skill-up pushes the newest part up from behind: the ridge swells out of the flat steel there, a highlight runs along the top of the whole ridge, it casts a small shadow, and it settles with a soft thud.',
    snd: (i, v) => { drum46(98 * semi(pick45(i, 2) / 3), 0, .03 * v); },
    V: { grow(p, x0, y, L, f, t, I) { const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#7a8590'); g.addColorStop(1, '#3e4650'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12);
        const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), a = k < 0 ? I.tipX : I.X(S.v0 + k), rise = ft < 0 ? 0 : eBack(clamp(ft / .3)), ht = x => x < a ? 1 : rise;
        for (let x = x0; x < I.tipX; x += 1) { const h = ht(x) * 3.2; if (h <= .05) continue; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x, y + h * .5, 1, h * .5 + .8); const gr = ctx.createLinearGradient(0, y - h, 0, y + h * .5); gr.addColorStop(0, '#f0f4f8'); gr.addColorStop(1, '#6a7480'); ctx.fillStyle = gr; ctx.fillRect(x, y - h, 1, h * 1.5); }
        if (ft >= .05 && ft < .6) { const sx = lerp(x0, I.tipX, (ft - .05) / .55), s = ctx.createLinearGradient(sx - 18, 0, sx + 6, 0); s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(1, 'rgba(255,255,255,.9)'); ctx.fillStyle = s; ctx.fillRect(Math.max(x0, sx - 18), y - 3.5, Math.min(24, sx - x0 + 6), 2); } },
      over(p, I) { S.hits.forEach((h, i) => { if (hT53(i) >= .22) once('d56' + i, () => BS56.D.snd(i, fat45(i))); }); },
      shake(I) { const k = lastHit53(); if (k < 0) return [0, 0]; const t = hT53(k) - .22; return t > 0 && t < .1 ? [0, Math.sin(t * 100) * .9 * (1 - t / .1)] : [0, 0]; } } },
};
function r56(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS56[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS56[K].desc + ' (The base only; the sound is a gentle placeholder that varies and steps down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS56[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS56[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r56('A'), PB: r56('B'), PC: r56('C'), PD: r56('D') });
// ---------- round 57 (2026-11-15): Blacksmithing base, blacksmithy again: heat, embers and the anvil in forms the craft ring doesn't use (no hammer) ----------
const heatCol57 = h => h < .5 ? mix('#2a0e06', '#c8401a', h / .5) : mix('#c8401a', '#ffd070', Math.min(1, (h - .5) / .5));
// B: the coal bed; heat(x) adds the gust wave
function coals57(x0, end, y, t, wave) { if (end <= x0) return; ctx.fillStyle = '#140a06'; ctx.fillRect(x0 - 2, y - 6, end - x0 + 2, 12);
  for (let k = 0; k < 120; k++) { const x = x0 - 2 + rnd53(k * 4) * 234; if (x > end) continue; const yy = y + (rnd53(k * 4 + 1) - .5) * 9, r = 1.8 + rnd53(k * 4 + 2) * 2.2;
    let h = .35 + .15 * Math.sin(t * (1.5 + rnd53(k) * 2) + k) + .25 * clamp(1 - (end - x) / 30) + wave(x); ctx.fillStyle = heatCol57(clamp(h)); ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill(); }
  const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, 'rgba(255,170,80,.18)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, end - x0 + 2, 12); }
// C: the anvil under the bar (all of it below the track, so drawing order doesn't matter)
function anvil57(I, flash) { const y = I.ly + 6.5, a = I.x0 + 40, b = I.x1 - 34, m = (a + b) / 2; ctx.save();
  const ag = ctx.createLinearGradient(0, y, 0, y + 13); ag.addColorStop(0, '#7a808c'); ag.addColorStop(.4, '#4a4f58'); ag.addColorStop(1, '#2a2d33'); ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.lineTo(b, y + 4); ctx.lineTo(m + 16, y + 6); ctx.lineTo(m + 12, y + 10); ctx.lineTo(m + 30, y + 13); ctx.lineTo(m - 30, y + 13); ctx.lineTo(m - 12, y + 10); ctx.lineTo(m - 16, y + 6); ctx.lineTo(a, y + 4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(a, y); ctx.quadraticCurveTo(a - 30, y + .5, I.x0 - 16, y + 1.2); ctx.quadraticCurveTo(a - 26, y + 4, a, y + 4); ctx.fill();
  ctx.fillStyle = `rgba(200,210,224,${.35 + flash * .6})`; ctx.fillRect(a, y, b - a, 1); ctx.restore(); }
// D: the chain; even links face-on (an oval), odd edge-on (a bar)
function link57(x, y, k, col, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); if (k % 2 === 0) { ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(0, 0, 5, 3.4, 0, 0, 7); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(0, -.6, 4.4, 2.6, 0, 3.6, 5.8); ctx.stroke(); }
  else { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-5, -1.4, 10, 2.8, 1.4); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-4, -1.2, 8, .7); } ctx.restore(); }
const lx57 = (x0, k) => x0 + 3 + k * 7;
const BS57 = {
  A: { name: 'Ringing steel, curls', desc: 'Kept: dark steel with a gold line and curls; each skill-up the bar hums and shivers along its length, a shine runs along the gold, the new end gleams.', V: VAR55.A },
  B: { name: 'Forge coals', desc: 'The fill is a bed of glowing coals, flickering, hottest at the front, a few embers drifting up out of the bar. Each skill-up a gust flares the coals in a wave from the start to the front, and a puff of embers lifts out at the new end.',
    snd: (i, v) => { noise(0, .35, .03 * v, 260, .6, 'lowpass'); tone(110 * semi(pick45(i, 2) / 2), .05, .01 * v, .5, 'sine', null, .08); },
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), wx = lerp(x0, I.tipX, clamp(ft / .4)), on = ft >= 0 && ft < .65 ? 1 - clamp((ft - .4) / .25) : 0;
        coals57(x0, I.tipX, y, t, x => on * .55 * Math.exp(-Math.pow((x - wx) / 16, 2))); },
      over(p, I) { const b = Math.floor(S.age / .22); once('b57i' + b, () => { if (I.tipX > I.x0 + 10) spawn({ x: lerp(I.x0, I.tipX, Math.random()), y: I.ly - 4, vx: (Math.random() - .5) * 8, vy: -14 - Math.random() * 12, life: 1.1, size: .9, col: Math.random() > .5 ? '#ffb040' : '#ff7a30' }); });
        S.hits.forEach((h, i) => { const t = hT53(i); if (t >= 0) once('b57s' + i, () => BS57.B.snd(i, fat45(i)));
          if (t >= .38) once('b57p' + i, () => { const x = I.X(S.v0 + i + 1); for (let q = 0; q < 9; q++) spawn({ x: x - Math.random() * 8, y: I.ly - 3, vx: (Math.random() - .5) * 30, vy: -30 - Math.random() * 30, g: -10, life: .9 + Math.random() * .4, size: 1 + Math.random() * .6, col: q % 3 ? '#ffb040' : '#ffe0a0' }); }); }); } } },
  C: { name: 'On the anvil', desc: 'The bar lies across a dark anvil set under it, its horn reaching out to the left. Each skill-up the bar jumps and drops back onto the anvil: the anvil’s face flashes, it rings, flakes of scale bounce off it, and the fill has grown.',
    snd: (i, v) => { bell45(330 * semi(pick45(i, 3)), 0, .012 * v); drum46(90, 0, .025 * v); },
    V: { grow() {}, over(p, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), jump = ft >= 0 && ft < .22 ? -7 * Math.sin(Math.PI * ft / .22) : 0, sq = ft >= .22 && ft < .34 ? Math.sin(Math.PI * (ft - .22) / .12) : 0;
        anvil57(I, ft >= .22 && ft < .6 ? 1 - (ft - .22) / .38 : 0); const end = I.X(S.v0 + land53(.22)), th = 8 - sq * 1.6, y = I.ly + jump + sq * .8;
        if (end > I.x0) { ctx.fillStyle = steel53(y, th); ctx.beginPath(); ctx.roundRect(I.x0 - 1, y - th / 2, end - I.x0 + 1, th, 2); ctx.fill(); ctx.fillStyle = hexA(p.col, .14); ctx.fillRect(I.x0, y - th / 2, end - I.x0, th); }
        S.hits.forEach((h, i) => { if (hT53(i) >= .22) once('c57' + i, () => { BS57.C.snd(i, fat45(i)); for (let q = 0; q < 8; q++) { const x = lerp(I.x0 + 50, I.x1 - 40, Math.random()); spawn({ x, y: I.ly + 6, vx: (x > (I.x0 + I.x1) / 2 ? 1 : -1) * (20 + Math.random() * 40), vy: -40 - Math.random() * 40, g: 300, life: .55, size: 1 + Math.random(), shape: 'sq', vr: 12, col: q % 2 ? '#3a3a40' : '#6a6a72' }); } }); }); } } },
  D: { name: 'Forged chain', desc: 'The fill is a heavy iron chain. Each skill-up a red-hot link drops onto the front of the chain and swings into place with a clink, then darkens to iron.',
    snd: (i, v) => { bell45(1760 * semi(pick45(i, 3)), 0, .005 * v); mallet(330 * semi(pick45(i, 2)), 0, .014 * v); },
    V: { grow(p, x0, y, L, f, t, I) { const n = Math.floor((I.X(S.v0 + land53(.25)) - x0) / 7); for (let k = 0; k < n - 1; k++) link57(lx57(x0, k), y, k, '#7a8088'); },
      over(p, I) { const n = Math.floor((I.X(S.v0 + land53(.25)) - I.x0) / 7), k = lastHit53(), ft = k < 0 ? 9 : hT53(k);
        if (n > 0) { const heat = ft >= .25 && ft < 1.1 ? 1 - (ft - .25) / .85 : 0, rot = ft >= .25 && ft < .8 ? Math.sin((ft - .25) * 28) * .35 * Math.exp(-(ft - .25) * 6) : 0;
          ctx.save(); if (heat > 0) { ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8 * heat; } link57(lx57(I.x0, n - 1), I.ly, n - 1, heat > 0 ? mix('#7a8088', '#ff8a40', heat) : '#7a8088', rot); ctx.restore(); }
        S.hits.forEach((h, i) => { const t = hT53(i); if (t >= 0 && t < .25) { const u = t / .25, m = Math.floor((I.X(S.v0 + i + 1) - I.x0) / 7) - 1; ctx.save(); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8; link57(lx57(I.x0, Math.max(0, m)), I.ly - 26 * (1 - u * u), Math.max(0, m), '#ff8a40', .9 * (1 - u)); ctx.restore(); }
          if (t >= .25) once('d57' + i, () => BS57.D.snd(i, fat45(i))); }); } } },
};
function r57(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS57[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS57[K].desc + ' (The base only; the sound is a gentle placeholder that varies and steps down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS57[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS57[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r57('A'), PB: r57('B'), PC: r57('C'), PD: r57('D') });

// Round 58-59 options (Blacksmithing), moved out 2026-11-15 (page size limit); their helpers stay in the page.
const spark58 = (I, i, q) => ({ d: .28 + rnd53(q * 3 + i) * .12, h: 5 + rnd53(q * 5 + i) * 8, dx: (rnd53(q * 7 + i) - .5) * 8 });
const BS58 = {
  A: { name: 'Ringing steel, curls', desc: 'Kept: dark steel with a gold line and curls; each skill-up the bar hums and shivers along its length, a shine runs along the gold, the new end gleams.', V: VAR55.A },
  B: { name: 'Anvil at the start', desc: 'A small black anvil sits just left of the bar’s start. The fill is dark iron, warm at its front. Each skill-up the anvil’s face flashes and throws an arc of sparks along the bar; they land on the front, which flares, and the fill has grown where they hit.',
    snd: (i, v, k) => k ? drum46(110 * semi(pick45(i, 2) / 3), 0, .02 * v) : [0, 1, 2].forEach(q => bell45(2349 * semi(PENT42[(i + q * 3) % 10]), q * .04, .003 * v)),
    V: { grow(p, x0, y, L, f, t, I) { const end = I.X(S.v0 + land53(.32)); if (end <= x0) return; const g = ctx.createLinearGradient(x0, 0, end, 0); g.addColorStop(0, '#2a2c30'); g.addColorStop(Math.max(0, 1 - 24 / (end - x0)), '#3a3c42'); g.addColorStop(1, '#d0602a'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 5, end - x0 + 2, 10); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0 - 2, y - 5, end - x0 + 2, 1.5); },
      over(p, I) { const ax = I.x0 - 26, k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil58(ax, I.ly, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0);
        S.hits.forEach((h, i) => { const t = hT53(i), tx = I.X(S.v0 + i + 1); if (t >= 0) once('b58a' + i, () => BS58.B.snd(i, fat45(i), 0)); if (t >= .32) once('b58b' + i, () => BS58.B.snd(i, fat45(i), 1));
          if (t >= 0 && t < .45) { ctx.save(); ctx.lineCap = 'round'; for (let q = 0; q < 10; q++) { const s = spark58(I, i, q), u = t / s.d; if (u >= 1) continue; const pos = w => [lerp(ax + 3, tx + s.dx, w), lerp(I.ly - 6, I.ly - 2, w) - Math.sin(Math.PI * w) * s.h];
              const [x1, y1] = pos(u), [x2, y2] = pos(Math.max(0, u - .08)); ctx.strokeStyle = q % 3 ? '#ffb040' : '#fff0c0'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x1, y1); ctx.stroke(); } ctx.restore(); }
          if (t >= .3 && t < .7) glow58(tx, I.ly, 12, .7 * (1 - (t - .3) / .4)); }); } } },
  C: { name: 'Magma channel', desc: 'The fill is magma flowing slowly along the channel, dark crust drifting on it, the rounded front hottest. Each skill-up a surge rolls down the channel from the start, brightening as it goes; it reaches the front and pushes it forward with a glow.',
    snd: (i, v) => { tone(73 * semi(pick45(i, 2) / 2), 0, .03 * v, .6, 'sine', null, .06); noise(.05, .4, .02 * v, 220, .6, 'lowpass'); },
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), sx = lerp(x0, I.X(S.v0 + Math.max(0, k) + 1), clamp(ft / .4)), on = ft >= 0 && ft < .6 ? 1 - clamp((ft - .4) / .2) : 0;
        let end = I.X(S.v0 + land53(.4)); if (k >= 0 && ft >= .4 && ft < .7) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .4) / .3));
        magma58(x0, end, y, t, x => on * .5 * Math.exp(-Math.pow((x - sx) / 14, 2)), true); },
      over(p, I) { onHits('c58', i => BS58.C.snd(i, fat45(i))); const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), end = I.X(S.v0 + land53(.4)); glow58(end, I.ly, 10 + (ft >= .4 && ft < .9 ? 6 * (1 - (ft - .4) / .5) : 0), .35 + .1 * Math.sin(S.age * 3)); } } },
  D: { name: 'Ironforge falls', desc: 'Like the Great Forge’s magma pouring down from the mountain: a thin stream of magma falls from above onto the front of the bar. Each skill-up it pours heavier; the front splashes, spits droplets and grows; then it slows back to a trickle.',
    snd: (i, v) => { noise(0, .45, .025 * v, 300, .5, 'lowpass'); tone(98 * semi(pick45(i, 2) / 2), .05, .016 * v, .35, 'sine', null, .02); },
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.45)); if (k >= 0 && ft >= 0 && ft < .45) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), ft / .45); I.mEnd = end;
        magma58(x0, end, y, t, x => 0, true); },
      over(p, I) { onHits('d58', i => BS58.D.snd(i, fat45(i))); const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), pour = ft >= 0 && ft < .6 ? Math.sin(Math.PI * Math.min(1, ft / .6)) : 0, x = (I.mEnd || I.tipX) - 3, top = I.ly - 46, w = 1.4 + pour * 3.2;
        if (I.mEnd > I.x0 + 2) { const g = ctx.createLinearGradient(0, top, 0, I.ly); g.addColorStop(0, 'rgba(255,140,40,0)'); g.addColorStop(.3, 'rgba(255,140,40,.9)'); g.addColorStop(1, 'rgba(255,220,140,1)'); ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath();
          for (let yy = top; yy <= I.ly - 2; yy += 3) ctx.lineTo(x + Math.sin(yy * .3 + S.age * 9) * .6 * (1 - pour * .5), yy); ctx.stroke(); ctx.restore(); glow58(x, I.ly - 3, 8 + pour * 8, .45 + pour * .4);
          if (pour > .2) once('d58s' + Math.floor(S.age / .04), () => spawn({ x, y: I.ly - 5, vx: (Math.random() - .3) * 70, vy: -40 - Math.random() * 50, g: 320, life: .4, size: 1 + Math.random() * .8, col: Math.random() > .4 ? '#ff9a3a' : '#ffd890' })); } } } },
};
function r58(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS58[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS58[K].desc + ' (The base only; the sound is a gentle placeholder that varies and steps down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS58[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS58[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r58('A'), PB: r58('B'), PC: r58('C'), PD: r58('D') });
const BS59 = {
  A: { name: 'Spark fuse', desc: 'The anvil at the start; the fill dark iron, warm at its front. Each skill-up the anvil’s face flashes and a spark runs along the top of the bar like a lit fuse, crackling small sparks up behind it; at the front it bursts in a fan of sparks and the fill grows.',
    snd: (i, v, k) => k ? drum46(110 * semi(pick45(i, 2) / 3), 0, .022 * v) : [0, 1, 2].forEach(q => bell45(1760 * semi(PENT42[(i + q * 2) % 10]), q * .1, .003 * v)),
    V: { grow(p, x0, y, L, f, t, I) { iron59(x0, I.X(S.v0 + land53(.4)), y); },
      over(p, I) { const ax = I.x0 - 26, k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil58(ax, I.ly, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0);
        S.hits.forEach((h, i) => { const t = hT53(i), tx = I.X(S.v0 + i + 1); if (t >= 0) once('a59a' + i, () => BS59.A.snd(i, fat45(i), 0));
          if (t >= .05 && t < .4) { const x = lerp(ax + 6, tx, (t - .05) / .35), y = I.ly - 6; glow58(x, y, 6, .8); glint59(x, y, 1, 2); once('a59s' + i + '_' + Math.floor(t / .03), () => spawn({ x, y, vx: (Math.random() - .5) * 30, vy: -25 - Math.random() * 30, g: 200, life: .3, size: .8, col: Math.random() > .5 ? '#ffb040' : '#fff0c0' })); }
          if (t >= .4) once('a59b' + i, () => { BS59.A.snd(i, fat45(i), 1); for (let q = 0; q < 12; q++) { const an = -Math.PI / 2 + (q / 11 - .5) * 2.2; spawn({ x: tx, y: I.ly - 3, vx: Math.cos(an) * (50 + Math.random() * 40), vy: Math.sin(an) * (50 + Math.random() * 40), g: 260, life: .45, size: 1, col: q % 3 ? '#ffb040' : '#fff0c0' }); } });
          if (t >= .4 && t < .8) glow58(tx, I.ly, 12, .7 * (1 - (t - .4) / .4)); }); } } },
  B: { name: 'Spark shower', desc: 'The anvil at the start. Each skill-up the anvil flings a spray of sparks; they rain down along the whole bar, each one glinting where it lands, and the last few land past the front, lighting it, and the fill has grown.',
    snd: (i, v, k) => k ? drum46(110 * semi(pick45(i, 2) / 3), 0, .02 * v) : bell45(2093 * semi(pick45(i, 3)), 0, .004 * v),
    V: { grow(p, x0, y, L, f, t, I) { iron59(x0, I.X(S.v0 + land53(.42)), y); },
      over(p, I) { const ax = I.x0 - 26, k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil58(ax, I.ly, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0);
        S.hits.forEach((h, i) => { const t = hT53(i), tx = I.X(S.v0 + i + 1); if (t >= 0) once('b59a' + i, () => BS59.B.snd(i, fat45(i), 0)); if (t >= .42) once('b59b' + i, () => BS59.B.snd(i, fat45(i), 1));
          for (let q = 0; q < 16; q++) { const last = q >= 13, d = .22 + q / 15 * .2, lx = last ? tx + (q - 14) * 2 : lerp(I.x0 + 6, tx - 6, rnd53(q * 3 + i)), u = t / d;
            if (u >= 0 && u < 1) { const x = lerp(ax + 4, lx, u), y = lerp(I.ly - 7, I.ly - 5, u) - Math.sin(Math.PI * u) * (9 + rnd53(q + i * 5) * 6), x2 = lerp(ax + 4, lx, Math.max(0, u - .07)), y2 = lerp(I.ly - 7, I.ly - 5, Math.max(0, u - .07)) - Math.sin(Math.PI * Math.max(0, u - .07)) * (9 + rnd53(q + i * 5) * 6);
              ctx.save(); ctx.strokeStyle = q % 3 ? '#ffb040' : '#fff0c0'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
            else if (u >= 1) glint59(lx, I.ly - 4, 1 - (t - d) / .3, last ? 5 : 3); }
          if (t >= .42 && t < .8) glow58(tx, I.ly, 12, .7 * (1 - (t - .42) / .38)); }); } } },
  C: { name: 'Falls and mound', desc: 'Ironforge’s falls, bolder: the stream of magma falls from a glowing opening above onto the front of the bar. Each skill-up it pours heavier and piles a glowing mound on the front; heat shimmers above it; then the mound slumps forward into the bar and the front has grown.',
    snd: (i, v) => { noise(0, .45, .025 * v, 300, .5, 'lowpass'); tone(98 * semi(pick45(i, 2) / 2), .3, .018 * v, .4, 'sine', null, .02); },
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.6)); if (k >= 0 && ft >= .3 && ft < .6) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .3) / .3)); I.mEnd = end; magma58(x0, end, y, t, () => 0, true); },
      over(p, I) { onHits('c59', i => BS59.C.snd(i, fat45(i))); if (!(I.mEnd > I.x0 + 2)) return; const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), pour = ft >= 0 && ft < .55 ? Math.sin(Math.PI * Math.min(1, ft / .55)) : 0,
          mound = ft >= 0 && ft < .3 ? eOut(ft / .3) : ft >= .3 && ft < .6 ? 1 - eOut((ft - .3) / .3) : 0, x = I.mEnd - 3, mh = 1 + mound * 6;
        for (let q = 0; q < 3; q++) { const sx = x - 6 + q * 6, ph = (S.age * .8 + q * .33) % 1; ctx.save(); ctx.globalAlpha *= .18 * Math.sin(Math.PI * ph) * (.4 + mound); ctx.strokeStyle = '#ffd8a0'; ctx.lineWidth = 1; ctx.beginPath(); for (let yy = 0; yy < 10; yy += 2) ctx.lineTo(sx + Math.sin(yy * .8 + S.age * 6 + q) * 1.2, I.ly - 8 - ph * 14 - yy); ctx.stroke(); ctx.restore(); }
        ctx.save(); ctx.fillStyle = heat58(.8); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.ellipse(x, I.ly - 5, 5 + mound * 3, mh, 0, Math.PI, 0); ctx.fill(); ctx.restore();
        stream59(x, I.ly - 46, I.ly - 5 - mh, 1.4 + pour * 3.4, S.age, true); glow58(x, I.ly - 4, 8 + pour * 9, .45 + pour * .4);
        if (pour > .3) once('c59s' + Math.floor(S.age / .05), () => spawn({ x, y: I.ly - 5 - mh, vx: (Math.random() - .5) * 60, vy: -35 - Math.random() * 40, g: 320, life: .4, size: 1 + Math.random() * .8, col: Math.random() > .4 ? '#ff9a3a' : '#ffd890' })); } } },
  D: { name: 'Forge at the start', desc: 'Both together: a stream of magma falls from above onto the anvil at the bar’s start, and it overflows into the bar, the magma running along to the front. Each skill-up the pour comes heavier, the splash throws sparks off the anvil, and a surge rolls down the bar and pushes the front on.',
    snd: (i, v) => { noise(0, .4, .022 * v, 280, .5, 'lowpass'); bell45(1760 * semi(pick45(i, 3)), .05, .003 * v); tone(82 * semi(pick45(i, 2) / 2), .35, .02 * v, .5, 'sine', null, .04); },
    V: { grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), sx = lerp(x0, I.X(S.v0 + Math.max(0, k) + 1), clamp((ft - .1) / .35)), on = ft >= .1 && ft < .7 ? 1 - clamp((ft - .45) / .25) : 0;
        let end = I.X(S.v0 + land53(.45)); if (k >= 0 && ft >= .45 && ft < .75) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .45) / .3)); magma58(x0, end, y, t, x => on * .5 * Math.exp(-Math.pow((x - sx) / 14, 2)), true); },
      over(p, I) { onHits('d59', i => BS59.D.snd(i, fat45(i))); const ax = I.x0 - 26, k = lastHit53(), ft = k < 0 ? 9 : hT53(k), pour = ft >= 0 && ft < .5 ? Math.sin(Math.PI * Math.min(1, ft / .5)) : 0, fx = ax + 4;
        anvil58(ax, I.ly, pour * .6); ctx.save(); ctx.strokeStyle = heat58(.75); ctx.lineWidth = 2 + pour * 1.5; ctx.lineCap = 'round'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.moveTo(ax + 8, I.ly - 7); ctx.quadraticCurveTo(ax + 18, I.ly - 7, I.x0, I.ly - 1); ctx.stroke(); ctx.restore();
        stream59(fx, I.ly - 46, I.ly - 8, 1.4 + pour * 3.4, S.age, true); glow58(fx, I.ly - 7, 8 + pour * 8, .4 + pour * .4);
        if (pour > .3) once('d59s' + Math.floor(S.age / .045), () => spawn({ x: fx, y: I.ly - 8, vx: (Math.random() - .5) * 90, vy: -40 - Math.random() * 50, g: 320, life: .4, size: .9, col: Math.random() > .5 ? '#ffb040' : '#fff0c0' }));
        glow58(I.X(S.v0 + land53(.45)), I.ly, 9, .3 + .08 * Math.sin(S.age * 3)); } } },
};
function r59(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS59[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS59[K].desc + ' (The base only; the sound is a gentle placeholder that varies and steps down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS59[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS59[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r59('A'), PB: r59('B'), PC: r59('C'), PD: r59('D') });

// Rounds 55, 58-60 Blacksmithing code not used by round 61 (moved out 2026-11-15, page size limit).
const ring55 = (i, v) => { const f = 523 * semi(pick45(i, 3)); tone(f, 0, .014 * v, 1.4, 'sine', null, .01); tone(f * 2, 0, .004 * v, .7, 'sine', null, .01); }; // the tuning-fork tone (round 54 B)
// ---------- round 55 (2026-11-15): Blacksmithing = round 54 B's ringing on round 54 D's dark steel + gold; four inlay designs ----------
// The bar (dark steel + its gold pattern) is drawn flat on an offscreen canvas, then copied in 2 px columns shifted by the
// standing wave, so the whole inlay shivers with the steel.
const OFF55 = document.createElement('canvas'), OCX55 = OFF55.getContext('2d');
const G55 = '#ffd36a';
const PAT55 = {
  A: { name: 'Curls', desc: 'Round 54’s inlay: one gold line with small curls, above then below.', draw(c, x0, end, y) { c.beginPath(); c.moveTo(x0, y); c.lineTo(end, y); c.stroke();
      for (let k = 0, cx = x0 + 9; cx < end; k++, cx += 15) { const s = k % 2 ? 1 : -1, g = clamp((end - cx) / 7), a0 = s < 0 ? Math.PI / 2 : -Math.PI / 2; c.beginPath(); c.arc(cx, y + s * 3, 3, a0, a0 + 4.6 * g * (s < 0 ? 1 : -1), s > 0); c.stroke(); } } },
  B: { name: 'Braid', desc: 'Two gold lines weaving over and under each other along the bar, a small gold bead where they cross.', draw(c, x0, end, y) { [0, Math.PI].forEach(ph => { c.beginPath(); for (let x = x0; x <= end; x += 1.5) c.lineTo(x, y + 3.2 * Math.sin((x - x0) * Math.PI / 9 + ph)); c.stroke(); });
      c.fillStyle = '#fff0b8'; for (let x = x0 + 9; x < end - 1; x += 9) { c.beginPath(); c.arc(x, y, 1.1, 0, 7); c.fill(); } } },
  C: { name: 'Runes', desc: 'A gold line broken into short runs, with small engraved marks between them in turn: a dot, a pair of strokes, a diamond.', draw(c, x0, end, y) { for (let k = 0, x = x0; x < end; k++, x += 14) { const e = Math.min(end, x + 7); c.beginPath(); c.moveTo(x, y); c.lineTo(e, y); c.stroke(); const m = x + 10.5; if (m > end) break;
      if (k % 3 === 0) { c.beginPath(); c.arc(m, y, 1.4, 0, 7); c.fill(); } else if (k % 3 === 1) { c.beginPath(); c.moveTo(m - 1.3, y - 3.5); c.lineTo(m - 1.3, y + 3.5); c.moveTo(m + 1.3, y - 3.5); c.lineTo(m + 1.3, y + 3.5); c.stroke(); }
      else { c.beginPath(); c.moveTo(m, y - 3.5); c.lineTo(m + 2.2, y); c.lineTo(m, y + 3.5); c.lineTo(m - 2.2, y); c.closePath(); c.fill(); } } } },
  D: { name: 'Leaf scroll', desc: 'One long flowing gold scroll along the bar, a small gold leaf at every crest and dip.', draw(c, x0, end, y) { c.beginPath(); for (let x = x0; x <= end; x += 1.5) c.lineTo(x, y + 2.6 * Math.sin((x - x0) * Math.PI / 12)); c.stroke();
      for (let k = 0, x = x0 + 6; x < end - 2; k++, x += 12) { const s = k % 2 ? 1 : -1, g = clamp((end - x) / 5); c.save(); c.translate(x, y + s * 2.6); c.rotate(s * .6); c.beginPath(); c.ellipse(2.2 * g, s * 1.2 * g, 2.6 * g, 1.1 * g, s * .5, 0, 7); c.fill(); c.restore(); } } },
};
function bar55(K, x0, end, y, amp, ph, shine) { if (end <= x0 + 1) return; const w = Math.ceil(end - x0) + 4, h = 16, d = DPR;
  if (OFF55.width < w * d || OFF55.height < h * d) { OFF55.width = Math.max(OFF55.width, w * d); OFF55.height = h * d; }
  const c = OCX55; c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, w, h);
  const g = c.createLinearGradient(0, 3, 0, 13); g.addColorStop(0, '#4a5462'); g.addColorStop(.5, '#2a303a'); g.addColorStop(1, '#1c2028'); c.fillStyle = g; c.beginPath(); c.roundRect(0, 3, end - x0, 10, 2); c.fill();
  c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(1, 4, end - x0 - 2, 1);
  c.strokeStyle = G55; c.fillStyle = G55; c.lineWidth = 1.3; c.lineCap = 'round'; c.lineJoin = 'round'; c.save(); c.beginPath(); c.rect(0, 3, end - x0, 10); c.clip(); PAT55[K].draw(c, 1, end - x0 - 1, 8);
  if (shine) { c.globalCompositeOperation = 'source-atop'; const sx = shine * (end - x0 + 40) - 20, s = c.createLinearGradient(sx - 16, 0, sx + 16, 0); s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(.5, 'rgba(255,250,225,.75)'); s.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = s; c.fillRect(sx - 16, 0, 32, h); }
  c.restore();
  const len = end - x0; for (let x = 0; x < len; x += 2) { const off = amp * Math.sin(Math.PI * 3 * x / len) * Math.sin(ph); ctx.drawImage(OFF55, x * d, 0, 2 * d, h * d, x0 + x, y - 8 + off, 2, h); } }
function V55(K) { return {
  grow(p, x0, y, L, f, t, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k), amp = ft >= 0 && ft < 1.2 ? 1.8 * Math.exp(-ft * 3.2) : 0, shine = ft >= .05 && ft < .75 ? (ft - .05) / .7 : 0;
    if (amp > .05) { ctx.save(); ctx.globalAlpha *= .25; bar55(K, x0, I.tipX, y, amp, ft * 70 + 1.6, 0); bar55(K, x0, I.tipX, y, amp, ft * 70 - 1.6, 0); ctx.restore(); }
    bar55(K, x0, I.tipX, y, amp, ft * 70, shine); },
  over(p, I) { onHits('e55', i => ring55(i, fat45(i))); S.hits.forEach((h, i) => { const t = hT53(i); if (t >= .4 && t < .85) { const a = 1 - (t - .4) / .45, x = I.X(S.v0 + i + 1) - 1; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff6d8'; ctx.shadowColor = G55; ctx.shadowBlur = 8; star4(x, I.ly, 2 + a * 4, 0); ctx.restore(); } }); } }; }
const VAR55 = { A: V55('A'), B: V55('B'), C: V55('C'), D: V55('D') };
function r55(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? PAT55[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Ringing steel (round 54 B) on the gold inlay’s dark steel (round 54 D): each skill-up the bar hums and shivers along its length, the gold catching a shine that runs along it, the fill moving forward while it rings, and the new end gleams. The inlay: ' + PAT55[K].desc + ' (Placeholder sound: the soft tuning-fork tone, varied, stepping down. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'ringing steel, ' + PAT55[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', VAR55[K]); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r55('A'), PB: r55('B'), PC: r55('C'), PD: r55('D') });
// magma from x0 to end: flowing bright veins, a hotter rounded front; bump(x) adds heat (a surge); crust: dark plates drifting
function magma58(x0, end, y, t, bump, crust) { if (end <= x0 + 1) return; ctx.save(); ctx.beginPath(); ctx.moveTo(x0 - 2, y - 6); ctx.lineTo(end - 5, y - 6); ctx.quadraticCurveTo(end + 1, y - 6, end + 1, y); ctx.quadraticCurveTo(end + 1, y + 6, end - 5, y + 6); ctx.lineTo(x0 - 2, y + 6); ctx.closePath(); ctx.clip();
  for (let x = x0 - 2; x < end + 2; x += 2) { const h = .5 + .14 * Math.sin(x * .15 - t * 2) + .1 * Math.sin(x * .37 - t * 3.1) + .25 * clamp(1 - (end - x) / 22) + bump(x); ctx.fillStyle = heat58(clamp(h)); ctx.fillRect(x, y - 6, 2.2, 12); }
  if (crust) for (let k = 0; k < 14; k++) { const x = x0 + ((rnd53(k) * 240 + t * 5) % 240); if (x > end - 16) continue; ctx.fillStyle = 'rgba(30,14,8,.8)'; ctx.beginPath(); ctx.roundRect(x, y - 5 + rnd53(k + 20) * 5, 5 + rnd53(k + 40) * 6, 2.5 + rnd53(k + 60) * 2, 1.2); ctx.fill(); }
  const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, 'rgba(255,230,160,.25)'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,0,0,.35)'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, end - x0 + 4, 12); ctx.restore(); }
// a falling magma stream from top to the point (x, yb), width w; a glowing slit at the top (the mountain's opening)
function stream59(x, top, yb, w, t, slit) { const g = ctx.createLinearGradient(0, top, 0, yb); g.addColorStop(0, slit ? 'rgba(255,170,60,.9)' : 'rgba(255,140,40,0)'); g.addColorStop(.3, 'rgba(255,140,40,.9)'); g.addColorStop(1, 'rgba(255,220,140,1)');
  ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); for (let yy = top; yy <= yb; yy += 3) ctx.lineTo(x + Math.sin(yy * .3 + t * 9) * .6, yy); ctx.lineTo(x, yb); ctx.stroke();
  if (slit) { ctx.fillStyle = 'rgba(255,200,110,.9)'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.ellipse(x, top, 7, 1.6, 0, 0, 7); ctx.fill(); } ctx.restore(); }
function shower60(I, i, t, linger) { const ax = I.x0 - 26, tx = I.X(S.v0 + i + 1);
  for (let q = 0; q < 16; q++) { const last = q >= 13, d = .22 + q / 15 * .2, lx = last ? tx + (q - 14) * 2 : lerp(I.x0 + 6, tx - 6, rnd53(q * 3 + i)), hh = 9 + rnd53(q + i * 5) * 6, u = t / d, P = w => [lerp(ax + 4, lx, w), lerp(I.ly - 7, I.ly - 5, w) - Math.sin(Math.PI * w) * hh];
    if (u >= 0 && u < 1) { const [x, y] = P(u), [x2, y2] = P(Math.max(0, u - .07)); ctx.save(); ctx.strokeStyle = q % 3 ? '#ffb040' : '#fff0c0'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
    else if (u >= 1) { const age = t - d; if (!linger) glint59(lx, I.ly - 4, 1 - age / .3, last ? 5 : 3);
      else { const a = 1 - age / 1.6; if (a > 0) { const tw = .6 + .4 * Math.sin(age * 14 + q * 2); ctx.save(); ctx.fillStyle = mix('#ff6a20', '#fff0c0', a * tw); ctx.globalAlpha *= a; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.arc(lx, I.ly - 3 + rnd53(q + 3) * 6, last ? 1.6 : 1.1, 0, 7); ctx.fill(); ctx.restore(); } if (age < .2) glint59(lx, I.ly - 4, 1 - age / .2, last ? 5 : 2.5); } } } }
// bubbly magma with a wavy surface (like Fishing's water): from x0 to end; lift(x) adds to the surface (mounds, ripples)
function magma60(I, end, t, lift) { const x0 = I.x0, bot = I.ly + 6, top = I.ly - 5; if (end <= x0 + 1) return;
  const surf = x => top - (Math.sin(x * .17 - t * 2.2) * .8 + Math.sin(x * .41 + t * 1.4) * .5) - lift(x) + bub60(x, t, end, true);
  const body = () => { ctx.beginPath(); ctx.moveTo(x0 - 2, bot); for (let x = x0 - 2; x <= end - 4; x += 2) ctx.lineTo(x, surf(x)); ctx.quadraticCurveTo(end + 1, surf(end - 4), end + 1, (surf(end - 4) + bot) / 2 + 1); ctx.quadraticCurveTo(end + 1, bot, end - 4, bot); ctx.closePath(); };
  ctx.save(); body(); ctx.clip(); for (let x = x0 - 2; x < end + 2; x += 2) { const h = .5 + .13 * Math.sin(x * .15 - t * 2) + .08 * Math.sin(x * .37 - t * 3.1) + .25 * clamp(1 - (end - x) / 22); const g = ctx.createLinearGradient(0, top - 3, 0, bot); g.addColorStop(0, heat58(clamp(h + .25))); g.addColorStop(1, heat58(clamp(h - .25))); ctx.fillStyle = g; ctx.fillRect(x, top - 10, 2.2, bot - top + 10); }
  for (let k = 0; k < 9; k++) { const x = x0 + ((rnd53(k + 70) * 240 + t * 4) % 240); if (x > end - 14) continue; ctx.fillStyle = 'rgba(40,12,4,.75)'; ctx.beginPath(); ctx.roundRect(x, surf(x) + .5, 4 + rnd53(k + 80) * 5, 1.8, .9); ctx.fill(); }
  bub60(0, t, end, false, I); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,224,150,.9)'; ctx.lineWidth = 1.1; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 4; ctx.beginPath(); for (let x = x0 - 1; x <= end - 4; x += 2) ctx.lineTo(x, surf(x)); ctx.stroke(); ctx.restore(); return surf; }
// bubbles: each rises from the bottom over its period, swelling, then domes the surface and pops (two droplets)
function bub60(x, t, end, dome, I) { let lift = 0; for (let k = 0; k < 12; k++) { const per = 1.3 + rnd53(k + 5) * 1.2, ph = ((t + rnd53(k + 9) * per) % per) / per, bx = I ? I.x0 + rnd53(k + 13) * 228 : (I60 ? I60.x0 : 0) + rnd53(k + 13) * 228; if (bx > end - 6) continue;
    if (dome) { if (ph > .82) lift -= 1.8 * Math.sin(Math.PI * (ph - .82) / .18) * Math.exp(-Math.pow((x - bx) / 2.5, 2)); continue; }
    if (ph < .82) { const r = .8 + ph * 1.6, y = lerp(I.ly + 5, I.ly - 3, ph / .82); ctx.fillStyle = 'rgba(255,240,190,.55)'; ctx.beginPath(); ctx.arc(bx, y, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(120,30,8,.5)'; ctx.beginPath(); ctx.arc(bx + .3, y + .3, r * .55, 0, 7); ctx.fill(); }
    else once('bp60' + k + '_' + Math.floor((t + rnd53(k + 9) * per) / per), () => { for (let q = 0; q < 2; q++) spawn({ x: bx, y: I.ly - 6, vx: (q ? 1 : -1) * (8 + Math.random() * 10), vy: -25 - Math.random() * 15, g: 260, life: .3, size: .8, col: '#ffb050' }); }); }
  return lift; }
let I60 = null;
const BS60 = {
  A: { name: 'Shower, anvil tink', desc: 'Round 59’s Spark shower, the anvil easier to see (a warm glow behind it). Sound: a short, damped strike of metal (a tink with a soft thud under it), its pitch varied.',
    V: { grow(p, x0, y, L, f, t, I) { iron59(x0, I.X(S.v0 + land53(.42)), y); },
      over(p, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil60(I, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0); onHits('a60', i => anvTink60(i, fat45(i)));
        S.hits.forEach((h, i) => { const t = hT53(i); shower60(I, i, t, false); if (t >= .42 && t < .8) glow58(I.X(S.v0 + i + 1), I.ly, 12, .7 * (1 - (t - .42) / .38)); }); } } },
  B: { name: 'Lingering sparks, clank', desc: 'The Spark shower, but the sparks stay where they land as hot specks that twinkle and fade over a second and a half, so the bar glitters after each skill-up (a run of five keeps it lit), the front brightest. Sound: a lower, fuller clank of metal with a thud.',
    V: { grow(p, x0, y, L, f, t, I) { iron59(x0, I.X(S.v0 + land53(.42)), y); },
      over(p, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil60(I, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0); onHits('b60', i => anvClank60(i, fat45(i)));
        S.hits.forEach((h, i) => { const t = hT53(i); shower60(I, i, t, true); if (t >= .42 && t < .8) glow58(I.X(S.v0 + i + 1), I.ly, 12, .7 * (1 - (t - .42) / .38)); }); } } },
  C: { name: 'Falls, bubbling', desc: 'Round 59’s Falls and mound in a new magma: a wavy surface like Fishing’s water, glowing along its crest, bubbles rising, swelling, doming the surface and popping. The stream falls onto the front; each skill-up it pours heavier, the surface mounds up under it, slumps forward into the bar, and a swell runs back along the surface.',
    snd: (i, v) => { noise(0, .45, .025 * v, 300, .5, 'lowpass'); tone(110 * semi(pick45(i, 2) / 2), .3, .016 * v, .25, 'sine', 140 * semi(pick45(i, 2) / 2), .02); },
    V: { grow() {}, over(p, I) { I60 = I; onHits('c60', i => BS60.C.snd(i, fat45(i))); const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.6)); if (k >= 0 && ft >= .3 && ft < .6) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .3) / .3));
        const pour = ft >= 0 && ft < .55 ? Math.sin(Math.PI * Math.min(1, ft / .55)) : 0, mound = ft >= 0 && ft < .3 ? eOut(ft / .3) : ft >= .3 && ft < .6 ? 1 - eOut((ft - .3) / .3) : 0, sw = ft >= .4 && ft < 1.4 ? end - (ft - .4) * 160 : -999, swA = ft >= .4 && ft < 1.4 ? 2.2 * (1 - (ft - .4)) : 0;
        if (end <= I.x0 + 2) return; const surf = magma60(I, end, S.age, x => .8 + mound * 5 * Math.exp(-Math.pow((x - end + 4) / 6, 2)) + swA * Math.exp(-Math.pow((x - sw) / 7, 2))), x = end - 4;
        stream59(x, I.ly - 46, surf(x) - 1, 1.4 + pour * 3.4, S.age, true); glow58(x, I.ly - 5, 8 + pour * 9, .45 + pour * .4);
        if (pour > .3) once('c60s' + Math.floor(S.age / .05), () => spawn({ x, y: surf(x) - 1, vx: (Math.random() - .5) * 60, vy: -35 - Math.random() * 40, g: 320, life: .4, size: 1 + Math.random() * .8, col: Math.random() > .4 ? '#ff9a3a' : '#ffd890' })); } } },
  D: { name: 'Gloops', desc: 'The same bubbling magma, but no steady stream: a glowing opening above the front drips now and then, and each skill-up a big glob of magma gathers, drops and plops into the front: the surface dips and rebounds, droplets splash up, a swell runs back along the bar, and the front grows.',
    snd: (i, v) => { tone(98 * semi(pick45(i, 2) / 2), 0, .03 * v, .22, 'sine', 130 * semi(pick45(i, 2) / 2), .01); noise(0, .2, .02 * v, 400, .6, 'lowpass'); },
    V: { grow() {}, over(p, I) { I60 = I; const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.5)); if (k >= 0 && ft >= .25 && ft < .5) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .25) / .25));
        if (end <= I.x0 + 2) return; const pl = ft - .25, dip = pl >= 0 && pl < .5 ? -3 * Math.sin(pl * 18) * Math.exp(-pl * 7) : 0, sw = pl >= .1 && pl < 1.1 ? end - (pl - .1) * 160 : -999, swA = pl >= .1 && pl < 1.1 ? 2.2 * (1 - (pl - .1)) : 0, x = end - 4, top = I.ly - 46;
        const surf = magma60(I, end, S.age, xx => .8 + dip * Math.exp(-Math.pow((xx - x) / 6, 2)) + swA * Math.exp(-Math.pow((xx - sw) / 7, 2)));
        ctx.save(); ctx.fillStyle = 'rgba(255,200,110,.9)'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.ellipse(x, top, 7, 1.6, 0, 0, 7); ctx.fill(); ctx.restore(); glow58(x, I.ly - 4, 8, .4);
        const dp = (S.age % 1.3) / 1.3; if (dp < .35) { const yy = lerp(top, surf(x), (dp / .35) * (dp / .35)); ctx.fillStyle = heat58(.85); ctx.beginPath(); ctx.arc(x, yy, 1, 0, 7); ctx.fill(); }
        S.hits.forEach((h, i) => { const t = hT53(i), xi = I.X(S.v0 + i) - 4; if (t >= -.1 && t < .25) { const g = t < 0 ? (t + .1) / .1 : 1, u = t < 0 ? 0 : t / .25, yy = lerp(top + 3, surf(xi) - 2, u * u); ctx.save(); ctx.fillStyle = heat58(.9); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.ellipse(xi, yy, 2.6 * g, (2.6 + u * 1.6) * g, 0, 0, 7); ctx.fill(); ctx.restore(); }
          if (t >= .25) once('d60' + i, () => { BS60.D.snd(i, fat45(i)); for (let q = 0; q < 8; q++) spawn({ x: xi, y: I.ly - 6, vx: (Math.random() - .5) * 70, vy: -40 - Math.random() * 40, g: 320, life: .45, size: 1 + Math.random() * .8, col: Math.random() > .4 ? '#ff9a3a' : '#ffd890' }); }); }); } } },
};
function r60(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? BS60[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? BS60[K].desc + ' (The base only; sounds step down after two in a row. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? BS60[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', BS60[K].V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r60('A'), PB: r60('B'), PC: r60('C'), PD: r60('D') });


// Round 61 magma (E-H) code, moved out 2026-11-15 (page size limit).
const surf61 = (I, t, lift) => x => I.ly - 5 - (Math.sin(x * .17 - t * 2.2) * .7 + Math.sin(x * .41 + t * 1.4) * .4) - lift(x);
function lava61(I, end, t, o) { const x0 = I.x0, bot = I.ly + 6, top = I.ly - 5, sf = o.flat ? (x => top) : surf61(I, t, o.lift || (() => 0)); if (end <= x0 + 1) return sf;
  const body = () => { ctx.beginPath(); ctx.moveTo(x0 - 2, bot); for (let x = x0 - 2; x <= end - 4; x += 2) ctx.lineTo(x, sf(x)); ctx.quadraticCurveTo(end + 1, sf(end - 4), end + 1, (sf(end - 4) + bot) / 2 + 1); ctx.quadraticCurveTo(end + 1, bot, end - 4, bot); ctx.closePath(); };
  ctx.save(); body(); ctx.clip(); const g = ctx.createLinearGradient(0, top - 3, 0, bot); g.addColorStop(0, '#ffe08a'); g.addColorStop(.3, '#ff8a24'); g.addColorStop(.7, '#b8300a'); g.addColorStop(1, '#4a0e04'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, top - 10, end - x0 + 4, bot - top + 10);
  if (o.heat) { for (let x = x0 - 2; x < end; x += 3) { const h = o.heat(x); if (h > .02) { ctx.fillStyle = `rgba(255,240,190,${Math.min(.8, h)})`; ctx.fillRect(x, top - 10, 3, bot - top + 10); } } }
  if (o.tex === 'flow') { ctx.lineCap = 'round'; for (let k = 0; k < 46; k++) { const sp = 14 + rnd53(k) * 22, len = 5 + rnd53(k + 1) * 11, x = x0 - 12 + ((rnd53(k + 2) * 260 + t * sp) % 260), y = top + 1 + rnd53(k + 3) * (bot - top - 2); if (x > end) continue;
      ctx.strokeStyle = k % 3 ? `rgba(255,232,160,${.35 + rnd53(k + 4) * .3})` : 'rgba(80,14,4,.45)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + Math.sin(x * .1) * .6); ctx.stroke(); } }
  if (o.tex === 'crust') { const off = t * 3, sh = Math.floor(off / 11); for (let k = -1; k < 24; k++) { const id = k - sh, x = x0 + k * 11 + (off % 11) + rnd53(id * 7) * 2, w = 8 + rnd53(id * 7 + 1) * 3, fade = clamp((end - 18 - x) / 20); if (fade <= 0 || x > end) continue;
      [[top - 2, I.ly - .6], [I.ly + .6, bot - .8]].forEach(([ya, yb], r) => { const dx = (rnd53(id * 7 + 2 + r) - .5) * 3; ctx.fillStyle = `rgba(52,18,8,${.92 * fade})`; ctx.beginPath(); ctx.roundRect(x + dx, ya, w, yb - ya, 1.6); ctx.fill(); ctx.fillStyle = `rgba(150,70,40,${.35 * fade})`; ctx.fillRect(x + dx + 1, ya + .6, w - 2, .7); }); } }
  if (o.tex === 'veins') { ctx.fillStyle = '#2a120c'; ctx.fillRect(x0 - 2, top - 10, end - x0 + 4, bot - top + 10); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let k = 0; k < 5; k++) { const yb = top + 1.5 + k * 2.2, ph = rnd53(k + 30) * 6, fr = .08 + rnd53(k + 31) * .1; ctx.beginPath(); for (let x = x0 - 2; x <= end; x += 3) ctx.lineTo(x, yb + Math.sin(x * fr + ph) * 1.6 + Math.sin(x * .37 + k) * .5); const b = o.vein ? o.vein(k) : .5; ctx.strokeStyle = heat58(Math.min(1, .45 + b * .5)); ctx.lineWidth = .9 + b * .5; ctx.shadowColor = '#ff7a20'; ctx.shadowBlur = 3 + b * 4; ctx.stroke(); }
    ctx.shadowBlur = 0; if (o.pulse) for (let x = x0 - 2; x < end; x += 3) { const h = o.pulse(x); if (h > .02) { ctx.fillStyle = `rgba(255,190,90,${Math.min(.6, h * .6)})`; ctx.fillRect(x, top, 3, bot - top); } } }
  const fg = ctx.createRadialGradient(end - 4, I.ly, 0, end - 4, I.ly, 16); fg.addColorStop(0, 'rgba(255,240,180,.55)'); fg.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = fg; ctx.fillRect(end - 22, top - 10, 26, bot - top + 10); ctx.restore();
  if (!o.flat) { ctx.save(); ctx.strokeStyle = 'rgba(255,226,150,.85)'; ctx.lineWidth = 1; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 4; ctx.beginPath(); for (let x = x0 - 1; x <= end - 4; x += 2) ctx.lineTo(x, sf(x)); ctx.stroke(); ctx.restore(); } return sf; }
// a lava fall: a glowing sheet from top to bottom at x, width w, streaks running down it; a mist of glow where it lands
function fall61(x, top, yb, w, t) { ctx.save(); const g = ctx.createLinearGradient(0, top, 0, yb); g.addColorStop(0, 'rgba(255,150,50,.25)'); g.addColorStop(.25, 'rgba(255,140,40,.95)'); g.addColorStop(1, 'rgba(255,214,130,1)'); ctx.fillStyle = g; ctx.beginPath();
  for (let y = top; y <= yb; y += 3) ctx.lineTo(x - w / 2 + Math.sin(y * .25 + t * 7) * .5, y); for (let y = yb; y >= top; y -= 3) ctx.lineTo(x + w / 2 + Math.sin(y * .22 + t * 6 + 1) * .5, y); ctx.closePath(); ctx.fill(); ctx.clip();
  ctx.lineCap = 'round'; for (let k = 0; k < 8; k++) { const sx = x - w / 2 + (k + .5) * w / 8, y = top + ((rnd53(k + 50) * 60 + t * (50 + rnd53(k) * 30)) % 60) - 10; ctx.strokeStyle = k % 2 ? 'rgba(255,245,210,.8)' : 'rgba(150,40,8,.5)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(sx, y); ctx.lineTo(sx, y + 6 + rnd53(k + 9) * 6); ctx.stroke(); } ctx.restore();
  ctx.save(); ctx.fillStyle = 'rgba(255,190,100,.9)'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.ellipse(x, top, w / 2 + 3, 1.8, 0, 0, 7); ctx.fill(); ctx.restore(); glow58(x, yb, 9 + w, .5); }
const MG61 = {
  E: { name: 'Lava curtain', desc: 'A wider, bolder lava fall: a glowing sheet of lava pours from an opening above onto the front, streaks running down it, a glow where it lands. The bar: flowing lava under dark crust plates drifting on it, glowing through the cracks; the front is fresh, bright lava. Each skill-up the curtain widens, the surface mounds up under it and slumps forward, and a swell runs back under the crust.',
    V: { grow() {}, over(p, I) { onHits('e61', i => lsnd61(i, fat45(i))); const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.6)); if (k >= 0 && ft >= .3 && ft < .6) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .3) / .3)); if (end <= I.x0 + 2) return;
      const pour = ft >= 0 && ft < .6 ? Math.sin(Math.PI * Math.min(1, ft / .6)) : 0, mound = ft >= 0 && ft < .3 ? eOut(ft / .3) : ft >= .3 && ft < .6 ? 1 - eOut((ft - .3) / .3) : 0, sw = ft >= .4 && ft < 1.4 ? end - (ft - .4) * 160 : -999, swA = ft >= .4 && ft < 1.4 ? 2 * (1 - (ft - .4)) : 0;
      const sf = lava61(I, end, S.age, { tex: 'crust', lift: x => .6 + mound * 4.5 * Math.exp(-Math.pow((x - end + 5) / 7, 2)) + swA * Math.exp(-Math.pow((x - sw) / 7, 2)) }), x = end - 5;
      fall61(x, I.ly - 48, sf(x), 4 + pour * 5, S.age); if (pour > .3) once('e61s' + Math.floor(S.age / .05), () => splash61(x, sf(x) - 1, 1)); } } },
  F: { name: 'Wave from the left', desc: 'No fall: the bar is a channel of flowing lava (bright streaks running along it toward the front). Each skill-up a wave of lava rises at the start of the bar, as if fed from the mountain, and rolls along, growing as it goes; it crashes at the front with a spray of droplets and pushes the front on.',
    V: { grow() {}, over(p, I) { onHits('f61', i => lsnd61(i, fat45(i))); const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.55)); if (k >= 0 && ft >= .45 && ft < .75) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eBack((ft - .45) / .3)); if (end <= I.x0 + 2) return;
      const u = clamp(ft / .45), wx = lerp(I.x0, I.X(S.v0 + Math.max(0, k)), u * u), wa = ft >= 0 && ft < .5 ? 1 + u * 4.5 : 0;
      lava61(I, end, S.age, { tex: 'flow', lift: x => .6 + wa * Math.exp(-Math.pow((x - wx) / (6 + u * 4), 2)), heat: x => wa * .12 * Math.exp(-Math.pow((x - wx) / 8, 2)) });
      S.hits.forEach((h, i) => { if (hT53(i) >= .45) once('f61c' + i, () => splash61(I.X(S.v0 + i) - 3, I.ly - 8, 12)); }); } } },
  G: { name: 'Ironforge fall at the start', desc: 'Like the Great Forge: a glowing sheet of lava falls from above into the start of the bar, and the lava flows along the channel to the front (streaks running toward it). Each skill-up the fall surges wider, and the surge rides along the channel as a swell to the front, which spills forward.',
    V: { grow() {}, over(p, I) { onHits('g61', i => lsnd61(i, fat45(i))); const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.6)); if (k >= 0 && ft >= .5 && ft < .8) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .5) / .3)); if (end <= I.x0 + 2) return;
      const pour = ft >= 0 && ft < .5 ? Math.sin(Math.PI * Math.min(1, ft / .5)) : 0, u = clamp((ft - .1) / .45), wx = lerp(I.x0 + 6, I.X(S.v0 + Math.max(0, k)), u), wa = ft >= .1 && ft < .65 ? 3 * Math.sin(Math.PI * Math.min(1, u * 1.1)) + .5 : 0;
      const sf = lava61(I, end, S.age, { tex: 'flow', lift: x => .6 + wa * Math.exp(-Math.pow((x - wx) / 8, 2)) + (1.2 + pour * 2) * Math.exp(-Math.pow((x - I.x0 - 6) / 6, 2)) });
      fall61(I.x0 + 6, I.ly - 48, sf(I.x0 + 6), 4 + pour * 5, S.age); if (pour > .3) once('g61s' + Math.floor(S.age / .05), () => splash61(I.x0 + 6, sf(I.x0 + 6) - 1, 1)); } } },
  H: { name: 'Veined lava rock', desc: 'A different texture: the bar is dark cooled lava rock with glowing veins of magma running through it, the front cracked open and bright. Each skill-up a pulse of heat runs through the veins from the start to the front, they flare, and the front cracks open further with a flash, rock chips falling away.',
    V: { grow() {}, over(p, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); let end = I.X(S.v0 + land53(.4)); if (k >= 0 && ft >= .4 && ft < .6) end = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut((ft - .4) / .2)); if (end <= I.x0 + 2) return;
      const px = lerp(I.x0, I.X(S.v0 + Math.max(0, k)), clamp(ft / .4)), on = ft >= 0 && ft < .6 ? 1 - clamp((ft - .4) / .2) : 0;
      lava61(I, end, S.age, { tex: 'veins', flat: true, vein: v => .45 + .15 * Math.sin(S.age * 2 + v) + on * .3, pulse: x => on * Math.exp(-Math.pow((x - px) / 12, 2)) });
      S.hits.forEach((h, i) => { const t = hT53(i); if (t >= .4) once('h61' + i, () => { const x = I.X(S.v0 + i + 1); noise(0, .1, .03 * fat45(i), 700, .8, 'lowpass', true); tone(73 * semi(pick45(i, 2) / 2), 0, .03 * fat45(i), .5, 'sine', null, .02); for (let q = 0; q < 6; q++) spawn({ x: x - 2, y: I.ly + (Math.random() - .5) * 8, vx: 10 + Math.random() * 40, vy: -20 - Math.random() * 30, g: 300, life: .55, size: 1 + Math.random(), shape: 'sq', vr: 10, col: q % 2 ? '#2a120c' : '#5a2a1a' }); });
        if (t >= .4 && t < .75) glow58(I.X(S.v0 + i + 1) - 3, I.ly, 13, .8 * (1 - (t - .4) / .35)); }); } } },
};

// Round 63 (magma look variations of Depth bands), moved out 2026-11-15.
// ---------- round 63 (2026-11-15): magma look, iterating from Depth bands (round 62 B, kept as A) ----------
// layered bands under the surface: cols top to bottom, th = each band's thickness, edge(b, x) = the sway of the edge under band b
function bands63(xa, xb, surf, cols, th, edge) { let d = 0; const ds = th.map(v => (d += v, d - v));
  for (let b = 0; b < cols.length; b++) { const d0 = ds[b], d1 = b === cols.length - 1 ? 40 : ds[b] + th[b]; ctx.fillStyle = cols[b]; ctx.beginPath();
    for (let x = xa; x <= xb + 2; x += 2) ctx.lineTo(x, surf(x) + d0 + (b ? edge(b, x) : 0)); for (let x = xb + 2; x >= xa; x -= 2) ctx.lineTo(x, surf(x) + d1 + edge(b + 1, x)); ctx.closePath(); ctx.fill(); } }
Object.assign(TEX62, {
  // B: a glowing core: a thin dark skin at the surface, the hottest layer in the middle, cooling again toward the bottom
  B63(xa, xb, ly, bot, t, surf) { bands63(xa, xb, surf, ['#7a2208', '#e8641a', '#ffc24a', '#fff4c0', '#ffc24a', '#d0420e', '#6a1406'], [1.3, 1.6, 1.6, 1.8, 1.6, 2, 3], (b, x) => .6 * Math.sin(x * .09 + t * .8 + b * 1.7));
    const g = ctx.createLinearGradient(0, ly - 3, 0, ly + 3); g.addColorStop(0, 'rgba(255,250,220,0)'); g.addColorStop(.5, 'rgba(255,250,220,.35)'); g.addColorStop(1, 'rgba(255,250,220,0)'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 4, xb - xa, 8); },
  // C: the depth bands under a cooled skin: dark crust islands float on the surface, drifting, the bright magma showing in the gaps
  C63(xa, xb, ly, bot, t, surf) { TEX62.B(xa, xb, ly, bot, t, surf); const off = t * 3, sh = Math.floor(off / 16);
    for (let k = -1; k < 18; k++) { const id = k - sh, x = xa + k * 16 + (off % 16), w = 9 + rnd53(id * 3 + 200) * 5; if (x > xb - 10) continue; ctx.fillStyle = '#3a1408'; ctx.beginPath();
      for (let xx = x; xx <= x + w; xx += 1.5) ctx.lineTo(xx, surf(xx) - .4); for (let xx = x + w; xx >= x; xx -= 1.5) ctx.lineTo(xx, surf(xx) + 2 + .8 * Math.sin((xx - x) / w * Math.PI) + rnd53(id + 300) * .6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(160,80,50,.6)'; ctx.lineWidth = .6; ctx.beginPath(); for (let xx = x + 1; xx <= x + w - 1; xx += 1.5) ctx.lineTo(xx, surf(xx) + .3); ctx.stroke(); } },
  // D: flowing bands: each layer slides toward the front at its own speed (the top fastest, the deep ones slow), a faint shine on each edge
  D63(xa, xb, ly, bot, t, surf) { const sp = [0, 9, 6, 4, 2.5, 1.5], edge = (b, x) => .9 * Math.sin((x - t * (sp[b] || 1)) * .1 + b * 1.7); const cols = ['#fff0a8', '#ffc24a', '#ff8424', '#d8460e', '#8a1c06'];
    bands63(xa, xb, surf, cols, [2.3, 2.3, 2.3, 2.3, 4], edge);
    for (let b = 1; b < cols.length; b++) { ctx.strokeStyle = `rgba(255,240,190,${.4 - b * .06})`; ctx.lineWidth = .6; ctx.beginPath(); for (let x = xa; x <= xb; x += 2) ctx.lineTo(x, surf(x) + b * 2.3 + edge(b, x)); ctx.stroke(); } },
});
Object.assign(CREST62, { B63: '#ffb070', C63: 'rgba(255,214,140,.55)', D63: '#fff2b0' });
const LOOK63 = {
  A: { key: 'B', name: 'Depth bands', desc: 'Round 62 B as picked: soft heat layers, pale yellow under the surface to deep red at the bottom, the edges swaying slowly.' },
  B: { key: 'B63', name: 'Glowing core', desc: 'The bands turned inside out: a thin dark skin at the surface, the hottest pale layer in the middle of the bar, cooling again toward the bottom, so it glows from the inside like a forge’s heart.' },
  C: { key: 'C63', name: 'Crusted bands', desc: 'The depth bands under a cooled skin: dark crust islands float on the surface and drift slowly, the bright magma showing in the gaps between them.' },
  D: { key: 'D63', name: 'Flowing bands', desc: 'The depth bands in motion: each layer slides toward the front at its own speed (the top fastest, the deep ones slowest), with a faint shine along each edge.' },
};
function r63(K) { const L = LOOK63[K]; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? L.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'The magma’s look only (animations come after), in the open-top bar. ' + L.desc + ' (A skill-up just eases the fill on with a small swell; placeholder sound.)' : 'One profession at a time: this round is Blacksmithing’s magma look. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'magma look: ' + L.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {};
    try { barModule(top, 'M', { grow: (p, x0, y, Ln, f, t, I) => mag62(L.key, I, t), over: (p, I) => onHits('m63', i => lsnd61(i, fat45(i))) }); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r63('A'), PB: r63('B'), PC: r63('C'), PD: r63('D') });

// Round 62 looks A/C/D + r62, round 64 C/D + r64 (magma looks), moved out 2026-11-15.
  // A: round 61's look: hot vertical gradient, bright and dark streaks flowing toward the front
  A(xa, xb, ly, bot, t) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#ffe08a'); g.addColorStop(.3, '#ff8a24'); g.addColorStop(.7, '#b8300a'); g.addColorStop(1, '#4a0e04'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    ctx.lineCap = 'round'; for (let k = 0; k < 46; k++) { const sp = 14 + rnd53(k) * 22, len = 5 + rnd53(k + 1) * 11, x = xa - 12 + ((rnd53(k + 2) * 260 + t * sp) % 260), y = ly - 4 + rnd53(k + 3) * 9; if (x > xb) continue;
      ctx.strokeStyle = k % 3 ? `rgba(255,232,160,${.35 + rnd53(k + 4) * .3})` : 'rgba(80,14,4,.45)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + Math.sin(x * .1) * .6); ctx.stroke(); } },
  // C: marbled: molten orange with long bright and dark swirls drifting through it, like stirred metal
  C(xa, xb, ly, bot, t) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#ff9a34'); g.addColorStop(1, '#a8280a'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let k = 0; k < 14; k++) { const a = xa - 40 + ((rnd53(k + 90) * 290 + t * (5 + rnd53(k + 91) * 4)) % 290), len = 30 + rnd53(k + 92) * 30, yc = ly - 2 + rnd53(k + 93) * 6, amp = 1.5 + rnd53(k + 94) * 2, fr = .12 + rnd53(k + 95) * .1, ph = rnd53(k + 96) * 6 + t * .4;
      ctx.strokeStyle = k % 3 === 0 ? 'rgba(90,16,4,.55)' : `rgba(255,236,170,${.45 + rnd53(k + 97) * .35})`; ctx.lineWidth = k % 3 === 0 ? 1.4 : 1 + rnd53(k + 98) * .8; ctx.beginPath(); for (let x = a; x <= a + len; x += 2) { const u = (x - a) / len; ctx.lineTo(x, yc + amp * Math.sin((x - a) * fr + ph) * Math.sin(Math.PI * u) + Math.sin(u * 3 + ph) * 1.2); } ctx.stroke(); } },
  // D: painted, the way the game's own lava textures are: flat warm orange, big soft yellow highlight blobs and dark red shadow blobs that slowly drift and swell
  D(xa, xb, ly, bot, t) { ctx.fillStyle = '#f07a22'; ctx.fillRect(xa, ly - 16, xb - xa, 30); const sh = ctx.createLinearGradient(0, ly - 4, 0, bot); sh.addColorStop(0, 'rgba(120,20,0,0)'); sh.addColorStop(1, 'rgba(120,20,0,.55)'); ctx.fillStyle = sh; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    for (let k = 0; k < 16; k++) { const hot = k % 2 === 0, x = xa - 10 + ((rnd53(k + 120) * 250 + t * 3) % 250), y = ly - 2 + rnd53(k + 121) * 7 + (hot ? -1.5 : 1.5), r = (hot ? 4 : 5) + rnd53(k + 122) * 4 + Math.sin(t * .9 + k) * 1; if (x > xb + r) continue;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hot ? 'rgba(255,236,140,.9)' : 'rgba(150,26,4,.55)'); g.addColorStop(.6, hot ? 'rgba(255,214,100,.5)' : 'rgba(150,26,4,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r * 1.6, r * .7, 0, 0, 7); ctx.fill(); }
  },
const LOOK62 = {
  A: { name: 'Flow streaks', desc: 'Round 61’s look in the new bar: a hot gradient (yellow at the surface, deep red below) with bright and dark streaks flowing toward the front.' },
  B: { name: 'Depth bands', desc: 'The heat in soft layers, like the Fishing bar’s depth bands: pale yellow just under the surface, then gold, orange, red, deep red at the bottom; the band edges sway slowly. Clean and calm.' },
  C: { name: 'Marbled', desc: 'Molten orange with long bright and dark swirls drifting through it, like stirred molten metal or marble.' },
  D: { name: 'Painted', desc: 'Like the game’s own lava textures: a flat warm orange with big soft yellow highlights and dark red shadows that drift and swell slowly; a thicker bright rim on the surface.' },
};
function r62(K) { return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? LOOK62[K].name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'The magma’s look only (animations come after): the bar is open at the top like Fishing’s, the wavy surface is its top edge, dark cooled lava ahead of the fill. ' + LOOK62[K].desc + ' (A skill-up just eases the fill on with a small swell; placeholder sound.)' : 'One profession at a time: this round is Blacksmithing’s magma look. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'magma look: ' + LOOK62[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {};
    try { barModule(top, 'M', { grow: (p, x0, y, L, f, t, I) => mag62(K, I, t), over: (p, I) => onHits('m62', i => lsnd61(i, fat45(i))) }); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r62('A'), PB: r62('B'), PC: r62('C'), PD: r62('D') });
  // C: convection cells: bright rounded cells of magma packed together, dark cooler seams between them, slowly drifting and breathing
  C64(xa, xb, ly, bot, t) { ctx.fillStyle = '#4a1206'; ctx.fillRect(xa, ly - 16, xb - xa, 30); const off = t * 2.5, sh = Math.floor(off / 9);
    for (let row = 0; row < 3; row++) for (let k = -1; k < 30; k++) { const id = (k - sh) * 3 + row, x = xa + k * 9 + (off % 9) + (row % 2) * 4.5 + (rnd53(id + 500) - .5) * 3, y = ly - 4 + row * 4 + (rnd53(id + 501) - .5) * 1.5; if (x > xb + 6) continue;
      const br = .75 + .25 * Math.sin(t * (.8 + rnd53(id + 502)) + id), rx = 4.2 + rnd53(id + 503) * 1, ry = 2.2 + rnd53(id + 504) * .6, g = ctx.createRadialGradient(x, y - .5, 0, x, y, rx);
      g.addColorStop(0, mix('#ff9a34', '#fff0b0', br * .8)); g.addColorStop(.7, '#f06a1a'); g.addColorStop(1, '#a8300c'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); } },
  // D: glossy molten metal: smooth and deep, a bright mirror highlight riding the waves (strongest on the crests), a slow sheen, a warm rim light below
  D64(xa, xb, ly, bot, t, surf) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#ff9a3a'); g.addColorStop(.45, '#d8460e'); g.addColorStop(1, '#4a0e04'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    ctx.lineCap = 'round'; for (let x = xa; x < xb; x += 2) { const s = surf(x + 1) - surf(x - 1), a = clamp(.25 + (-s) * .5 + .2 * Math.sin(x * .05 - t * .7)); if (a < .05) continue; ctx.strokeStyle = `rgba(255,252,235,${a})`; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x, surf(x) + 2.2); ctx.lineTo(x + 2, surf(x + 2) + 2.2); ctx.stroke(); }
    const sx = xa + ((t * 22) % (xb - xa + 60)) - 30, sg = ctx.createLinearGradient(sx - 20, 0, sx + 20, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,240,210,.28)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 20, ly - 16, 40, 30);
    ctx.fillStyle = 'rgba(255,170,90,.45)'; ctx.fillRect(xa, bot - 1.6, xb - xa, 1); },
const LOOK64 = {
  A: { key: 'B', name: 'Depth bands', desc: 'Round 62 B as picked: soft heat layers, pale yellow under the surface to deep red at the bottom, the edges swaying slowly.' },
  B: { key: 'B64', name: 'Bubbling', over: bub64, desc: 'Plain, deep molten orange with soft warm patches, and bubbles on the surface: now and then one swells up slowly as a glossy dome (about a second and a half), then pops: a bright flash and two little droplets. Only a few at a time, here and there.' },
  C: { key: 'C64', name: 'Convection cells', desc: 'Rounded cells of bright magma packed together with dark, cooler seams between them, drifting slowly toward the front, each one breathing brighter and dimmer on its own.' },
  D: { key: 'D64', name: 'Glossy molten', desc: 'Smooth, deep molten metal with a mirror shine: a bright highlight rides the waves just under the surface (strongest on the crests), a slow sheen sweeps along, a warm rim of light along the bottom.' },
};
function r64(K) { const L = LOOK64[K]; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? L.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'The magma’s look only (animations come after), in the open-top bar. ' + L.desc + ' (A skill-up just eases the fill on with a small swell; placeholder sound.)' : 'One profession at a time: this round is Blacksmithing’s magma look. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'magma look: ' + L.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {};
    try { barModule(top, 'M', { grow: (p, x0, y, Ln, f, t, I) => mag62(L.key, I, t), over: (p, I) => { onHits('m64', i => lsnd61(i, fat45(i))); if (L.over) L.over(I); } }); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r64('A'), PB: r64('B'), PC: r64('C'), PD: r64('D') });

// Round 64 B (Bubbling) + round 65 looks, moved out 2026-11-15 (page size limit); slot65/spot65/BOIL65/MAGLIFT stay in the page.
// ---------- round 64 (2026-11-15): magma look: Depth bands (A) + three DIFFERENT designs; B is bubbly (bubbles swell slowly on the surface and pop) ----------
Object.assign(TEX62, {
  // B: plain molten orange, warm and deep; the bubbles are drawn on the surface by over() (bub64)
  B64(xa, xb, ly, bot, t) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#ffb44a'); g.addColorStop(.35, '#f06a1a'); g.addColorStop(1, '#7a1806'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    for (let k = 0; k < 6; k++) { const x = xa + ((rnd53(k + 400) * 240 + t * 2) % 240), r = 10 + rnd53(k + 401) * 8, gg = ctx.createRadialGradient(x, ly, 0, x, ly, r); gg.addColorStop(0, 'rgba(255,220,130,.35)'); gg.addColorStop(1, 'rgba(255,220,130,0)'); ctx.fillStyle = gg; ctx.fillRect(x - r, ly - 8, r * 2, 16); } },
});
Object.assign(CREST62, { B64: 'rgba(255,214,140,.9)', C64: 'rgba(255,190,110,.75)', D64: '#fff6dc' });
// B's bubbles, on the surface: one at a time here and there, a dome that swells slowly (about 1.4 s), then pops: the dome is gone, a bright spot, two droplets
function bub64(I) { const t = S.age, sf = I.surf, end = I.tipX; if (!sf || end <= I.x0 + 8) return;
  for (let k = 0; k < 7; k++) { const per = 2.6 + rnd53(k + 600) * 2.4, c = Math.floor((t + rnd53(k + 601) * per) / per), ph = ((t + rnd53(k + 601) * per) % per) / per, x = I.x0 + 6 + rnd53(k * 13 + c * 7 + 602) * (end - I.x0 - 14), grow = .55, y = sf(x);
    if (ph < grow) { const u = ph / grow, r = 1 + u * u * 4; ctx.save(); const g = ctx.createRadialGradient(x - r * .35, y - r * .5, 0, x, y, r); g.addColorStop(0, 'rgba(255,248,215,.95)'); g.addColorStop(.5, 'rgba(255,190,90,.95)'); g.addColorStop(1, 'rgba(210,80,20,.95)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y + .4, r, Math.PI, 0); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,240,.85)'; ctx.beginPath(); ctx.arc(x - r * .4, y - r * .45, Math.max(.4, r * .2), 0, 7); ctx.fill(); ctx.restore(); }
    else if (ph < grow + .12) { const u = (ph - grow) / .12; glow58(x, y, 3 + u * 5, .7 * (1 - u)); once('bub64' + k + '_' + c, () => { for (let q = 0; q < 2; q++) spawn({ x, y: y - 1, vx: (q ? 1 : -1) * (10 + Math.random() * 8), vy: -24 - Math.random() * 10, g: 220, life: .35, size: .9, col: '#ffc070' }); }); } } }
Object.assign(TEX62, {
  // B: a dark cooled crust with a web of glowing cracks; blisters push up through it
  B65(xa, xb, ly, bot, t, surf) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#3a160c'); g.addColorStop(1, '#1e0a06'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = '#ff6a10'; ctx.shadowBlur = 4; const glow = .75 + .25 * Math.sin(t * 1.3);
    ctx.strokeStyle = `rgba(255,${130 + 40 * glow},40,.9)`; ctx.lineWidth = 1; ctx.beginPath(); for (let x = xa; x <= xb; x += 3) ctx.lineTo(x, ly + 1 + Math.sin(x * .13) * 1.4 + Math.sin(x * .41) * .6); ctx.stroke();
    for (let x = xa + 6, k = 0; x < xb; x += 9 + rnd53(k + 700) * 7, k++) { const up = k % 2 === 0, y0 = ly + 1 + Math.sin(x * .13) * 1.4 + Math.sin(x * .41) * .6; ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + (rnd53(k + 701) - .5) * 4, (y0 + (up ? surf(x) : bot)) / 2, x + (rnd53(k + 702) - .5) * 5, up ? surf(x) + .5 : bot); ctx.stroke(); }
    ctx.restore(); },
  // C: deep red magma, calm, with a hot spot that wanders slowly along the bar where it boils
  C65(xa, xb, ly, bot, t) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#e8501a'); g.addColorStop(.5, '#a82a0a'); g.addColorStop(1, '#4a0c04'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    const px = BOIL65(xa, xb, t), hg = ctx.createRadialGradient(px, ly - 2, 0, px, ly - 2, 26); hg.addColorStop(0, 'rgba(255,236,150,.85)'); hg.addColorStop(.5, 'rgba(255,170,60,.45)'); hg.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = hg; ctx.fillRect(px - 26, ly - 16, 52, 30); },
  // D: thick, matte molten rock: dull orange to brown, slow darker blotches, a soft dull sheen
  D65(xa, xb, ly, bot, t) { const g = ctx.createLinearGradient(0, ly - 7, 0, bot); g.addColorStop(0, '#d8642a'); g.addColorStop(.45, '#8a2e0e'); g.addColorStop(1, '#3a1206'); ctx.fillStyle = g; ctx.fillRect(xa, ly - 16, xb - xa, 30);
    for (let k = 0; k < 9; k++) { const x = xa + ((rnd53(k + 800) * 250 + t * 1.5) % 250), r = 8 + rnd53(k + 801) * 6, gg = ctx.createRadialGradient(x, ly + 1, 0, x, ly + 1, r); gg.addColorStop(0, 'rgba(60,14,4,.35)'); gg.addColorStop(1, 'rgba(60,14,4,0)'); ctx.fillStyle = gg; ctx.fillRect(x - r, ly - 8, r * 2, 16); }
    ctx.fillStyle = 'rgba(255,200,150,.12)'; ctx.fillRect(xa, ly - 4, xb - xa, 2); },
});
Object.assign(CREST62, { B65: 'rgba(255,120,50,.55)', C65: 'rgba(255,200,120,.85)', D65: 'rgba(255,190,140,.55)' });
// B: blisters: rare, big; a dark dome of crust swells (~2.5 s) with cracks glowing brighter, then splits: a flash, a gout of lava, a bright molten patch that slowly crusts over
function blister65(I) { const t = S.age, sf = I.surf; if (!sf || I.tipX <= I.x0 + 20) return;
  for (let k = 0; k < 3; k++) { const { c, ph, per } = slot65(k, 4.5, 2.5, 900, t), x = spot65(I, k, c, 902), y = sf(x), grow = .55, age = (ph - grow) * per;
    if (ph < grow) { const u = ph / grow, r = 1.5 + u * u * 5; ctx.save(); ctx.fillStyle = '#3a160c'; ctx.beginPath(); ctx.ellipse(x, y + .5, r * 1.2, r, 0, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = `rgba(255,${120 + 100 * u},50,${.4 + u * .6})`; ctx.lineWidth = .9; ctx.shadowColor = '#ff6a10'; ctx.shadowBlur = 2 + u * 5; ctx.beginPath(); ctx.moveTo(x - r * .8, y - r * .3); ctx.quadraticCurveTo(x, y - r * 1.1, x + r * .7, y - r * .4); ctx.moveTo(x - r * .2, y - r * .9); ctx.lineTo(x + r * .1, y - r * .2); ctx.stroke(); ctx.restore(); }
    else { const spot = clamp(1 - age / 1.8); if (age < .15) glow58(x, y - 2, 6 + age * 60, .9 * (1 - age / .15)); once('bl65' + k + '_' + c, () => { for (let q = 0; q < 7; q++) spawn({ x, y: y - 2, vx: (Math.random() - .5) * 40, vy: -55 - Math.random() * 40, g: 300, life: .55, size: 1 + Math.random(), col: Math.random() > .4 ? '#ffa040' : '#ffe0a0' }); });
      if (spot > 0) { ctx.save(); ctx.fillStyle = mix('#5a1e0c', '#ffd070', spot); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6 * spot; ctx.beginPath(); ctx.ellipse(x, y + 1, 5, 1.8, 0, 0, 7); ctx.fill(); ctx.restore(); } } } }
// C: the boiling patch: quick small bubbles crowd where the hot spot is, popping fast; heat shimmer rises over it
function boil65(I) { const t = S.age, sf = I.surf; if (!sf || I.tipX <= I.x0 + 20) return; const px = BOIL65(I.x0 - 2, I.tipX, t);
  for (let k = 0; k < 11; k++) { const { c, ph } = slot65(k, .55, .5, 1000, t), x = clamp(px + (rnd53(k * 11 + c * 5 + 1002) - .5) * 30, I.x0 + 4, I.tipX - 4), y = sf(x);
    if (ph < .7) { const u = ph / .7, r = .6 + u * 1.9; ctx.fillStyle = 'rgba(255,214,120,.95)'; ctx.beginPath(); ctx.arc(x, y + .3, r, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,255,235,.9)'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .4, Math.max(.3, r * .25), 0, 7); ctx.fill(); }
    else if (ph < .8) { ctx.save(); ctx.fillStyle = '#fff6d0'; ctx.shadowColor = '#ffb040'; ctx.shadowBlur = 4; star4(x, y - 1, 1.6, 0); ctx.restore(); } }
  ctx.save(); ctx.strokeStyle = 'rgba(255,220,170,.16)'; ctx.lineWidth = 1; for (let q = 0; q < 4; q++) { const ph = (t * .7 + q * .25) % 1, sx = px - 12 + q * 8; ctx.beginPath(); for (let yy = 0; yy < 9; yy += 1.5) ctx.lineTo(sx + Math.sin(yy * .9 + t * 5 + q) * 1.2, sf(px) - 3 - ph * 12 - yy); ctx.stroke(); } ctx.restore(); }
// D: gloops: slow, few; a bulb rises and stretches tall on a neck, bursts with a thick splat, and rings of ripples spread both ways along the surface
const gloopSlots65 = I => [0, 1, 2].map(k => { const s = slot65(k, 4, 2, 1100, S.age); return Object.assign(s, { k, x: spot65(I, k, s.c, 1102), age: (s.ph - .5) * s.per }); });
const gloopLift65 = I => { const G = gloopSlots65(I); return x => { let l = 0; for (const g of G) if (g.ph >= .5 && g.age < 1.6) { const d = Math.abs(x - g.x) - g.age * 34; l += 1.5 * Math.exp(-g.age * 2.2) * Math.cos(d * .55) * Math.exp(-d * d / 50); } return l; }; };
function gloop65(I) { const sf = I.surf; if (!sf || I.tipX <= I.x0 + 20) return;
  for (const g of gloopSlots65(I)) { const y = sf(g.x);
    if (g.ph < .5) { const u = g.ph / .5, rx = 2.2 + u * 1.6, ry = 1 + u * u * 5.5, cy = y - ry * .8; ctx.save(); const gr = ctx.createLinearGradient(0, cy - ry, 0, y); gr.addColorStop(0, '#f08a3a'); gr.addColorStop(1, '#8a2e0e'); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(g.x, cy, rx, ry, 0, 0, 7); ctx.fill();
      ctx.fillRect(g.x - rx * .55, cy, rx * 1.1, y - cy + .5); ctx.fillStyle = 'rgba(255,220,180,.45)'; ctx.beginPath(); ctx.ellipse(g.x - rx * .35, cy - ry * .45, rx * .25, ry * .25, 0, 0, 7); ctx.fill(); ctx.restore(); }
    else once('gl65' + g.k + '_' + g.c, () => { for (let q = 0; q < 4; q++) spawn({ x: g.x, y: y - 3, vx: (Math.random() - .5) * 30, vy: -30 - Math.random() * 20, g: 200, life: .5, size: 1.4 + Math.random() * .6, col: '#c8541e' }); }); } }
const LOOK65 = {
  A: { key: 'B64', name: 'Bubbling', over: bub64, desc: 'Round 64 B as picked: plain deep molten orange; now and then a glossy dome swells slowly on the surface and pops (a flash, two droplets); a few at a time.' },
  B: { key: 'B65', name: 'Crust blisters', over: blister65, desc: 'Dark cooled crust with a web of glowing cracks. Rarely, a big blister of crust swells up slowly (2-3 s), its cracks glowing hotter, then splits open: a flash, a gout of lava thrown up, and a bright molten patch left on the surface that slowly crusts over again.' },
  C: { key: 'C65', name: 'Boiling patch', over: boil65, desc: 'Deep red, calm magma with one hot spot that wanders slowly along the bar; there it boils: many small quick bubbles crowding and popping with tiny glints, a heat shimmer rising over it. The rest stays still.' },
  D: { key: 'D65', name: 'Thick gloops', over: gloop65, lift: gloopLift65, desc: 'Thick, matte molten rock (dull orange to brown). Slow, heavy bubbles: a bulb rises and stretches tall on a neck, bursts with a thick splat, and rings of ripples run out both ways along the surface.' },
};
function r65(K) { const L = LOOK65[K]; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? L.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'The magma’s look only (animations come after), in the open-top bar. ' + L.desc + ' (A skill-up just eases the fill on with a small swell; placeholder sound.)' : 'One profession at a time: this round is Blacksmithing’s magma look. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'magma look: ' + L.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {};
    try { barModule(top, 'M', { grow: (p, x0, y, Ln, f, t, I) => { MAGLIFT = L.lift ? L.lift(I) : null; mag62(L.key, I, t); }, over: (p, I) => { onHits('m65', i => lsnd61(i, fat45(i))); if (L.over) L.over(I); } }); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; } } }; }
Object.assign(FAM, { PA: r65('A'), PB: r65('B'), PC: r65('C'), PD: r65('D') });

// Round 61 spark options (SP61, BS61, r61) and round 66 parts, moved out 2026-11-15; sparks61, bandsGrad66, ripple66, splat66 stay.
const SP61 = (name, desc, extra) => ({ name, desc, V: { grow(p, x0, y, L, f, t, I) { iron59(x0, I.X(S.v0 + land53(.42)), y); },
  over(p, I) { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); extra.anvil ? extra.anvil(I, ft) : anvil60(I, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0); onHits('s61' + name, i => anvClank60(i, fat45(i)));
    S.hits.forEach((h, i) => { const t = hT53(i); extra.each(I, i, t); if (t >= .42 && t < .8) glow58(I.X(S.v0 + i + 1), I.ly, 12, .7 * (1 - (t - .42) / .38)); }); if (extra.after) extra.after(I); } } });
// the run's heat: each skill-up adds, it fades over a few seconds
const runHeat61 = () => Math.min(1.4, S.hits.reduce((s, h) => { const a = S.age - h - HIT; return a >= 0 ? s + .35 * Math.exp(-a / 3) : s; }, 0));
const BS61 = {
  A: SP61('Lingering sparks', 'Round 60 B as picked: the anvil flings a shower of sparks along the bar; they stay where they land as hot specks that twinkle and fade over a second and a half; the clank.', { each: (I, i, t) => sparks61(I, i, t, 16) }),
  B: SP61('Chain flare', 'Add-on: once the sparks have landed, a flare runs along the bar from speck to speck like a chain reaction; each one flashes as it passes, and at the front it bursts in a fan of sparks.', {
    each: (I, i, t) => { sparks61(I, i, t, 16, { flare: true }); if (t >= .62 && t < 1) { const rx = lerp(I.x0, I.X(S.v0 + i + 1), (t - .62) / .38), g = ctx.createLinearGradient(rx - 22, 0, rx, 0); g.addColorStop(0, 'rgba(255,200,120,0)'); g.addColorStop(1, 'rgba(255,240,200,.8)'); ctx.fillStyle = g; ctx.fillRect(Math.max(I.x0, rx - 22), I.ly - 5.5, Math.min(22, rx - I.x0), 1.6); }
      if (t >= 1) once('b61' + i, () => { const tx = I.X(S.v0 + i + 1); [0, 1].forEach(q => bell45(784 * semi(pick45(i, 2) + q * 7), q * .03, .0035 * fat45(i))); for (let q = 0; q < 12; q++) { const an = -Math.PI / 2 + (q / 11 - .5) * 2.4; spawn({ x: tx, y: I.ly - 3, vx: Math.cos(an) * (40 + Math.random() * 50), vy: Math.sin(an) * (40 + Math.random() * 50), g: 260, life: .5, size: 1, col: q % 3 ? '#ffb040' : '#fff0c0' }); } });
      if (t >= 1 && t < 1.4) glow58(I.X(S.v0 + i + 1), I.ly, 14, .8 * (1 - (t - 1) / .4)); } }),
  C: SP61('Ember pile', 'Add-on: the sparks land and roll along the top of the bar to the front, where they gather into a small glowing pile of embers sitting on the front; every skill-up adds to it (a run of five builds a heap), and it rides along as the bar grows.', {
    each: (I, i, t) => sparks61(I, i, t, 16, { roll: true }),
    after: I => { const n = Math.min(14, S.hits.filter(h => S.age >= h + HIT + .7).length * 3 + 2), tx = I.X(S.v0 + land53(.42)); if (tx <= I.x0 + 3) return;
      for (let q = 0; q < n; q++) { const row = q < 5 ? 0 : q < 9 ? 1 : q < 12 ? 2 : 3, inRow = [5, 4, 3, 2][row], j = q - [0, 5, 9, 12][row], x = tx - 6 + (j - (inRow - 1) / 2) * 2.4, y = I.ly - 7 - row * 2, tw = .55 + .45 * Math.sin(S.age * 5 + q * 1.7);
        ctx.save(); ctx.fillStyle = mix('#c83a12', '#ffe0a0', tw); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 4; ctx.beginPath(); ctx.arc(x, y, 1.3, 0, 7); ctx.fill(); ctx.restore(); }
      glow58(tx - 6, I.ly - 8, 7 + n * .5, .25 + .03 * n); } }),
  D: SP61('The anvil heats up', 'Add-on: the anvil’s face heats with every skill-up and cools between runs: in a run of five it glows hotter each time, throws bigger, higher showers, and its clank rings a little brighter; one skill-up on its own stays modest.', {
    anvil: (I, ft) => { const H = runHeat61(), ax = I.x0 - 26; glow58(ax + 2, I.ly - 4, 14 + H * 10, .2 + H * .35); anvil58(ax, I.ly, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0); if (H > .05) { ctx.save(); ctx.fillStyle = heat58(Math.min(1, .45 + H * .4)); ctx.globalAlpha *= Math.min(1, H * 1.2); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6 * H; ctx.fillRect(ax - 4, I.ly - 7.6, 17, 2.2); ctx.restore(); } },
    each: (I, i, t) => { const H = Math.min(1.4, S.hits.slice(0, i + 1).reduce((s, h) => s + .35 * Math.exp(-(S.hits[i] - h) / 3), 0)); sparks61(I, i, t, Math.round(10 + H * 12), { hs: .8 + H * .5 }); } }),
};
function r61(K) { const D = BS61[K]; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? D.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? D.desc + (BS61[K] ? ' (1-4: the sparks; sound: the clank, varied, stepping down.)' : ' (5-8: the magma; placeholder sound.)') + ' Try “Five in a row”.' : 'One profession at a time: this round is Blacksmithing’s base. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? D.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K > 'D' ? 'A' : K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; try { barModule(top, 'A', D.V); } finally { S.p.snd = snd0; S.p.hit = hit0; } } }; }
Object.assign(FAM, { PA: r61('A'), PB: r61('B'), PC: r61('C'), PD: r61('D') });
// the small boiling bubbles (round 65 C): domes crowding at the hot spot; pops: a thick splat (D) and a small ring of ripples
const SMALL66 = { n: 11, per: .55, spread: .5, seed: 1000, rise: .7 };
const BIG66 = { per: 3.4, spread: 1.2, seed: 1300, rise: .6 };
const smallX66 = (I, k, c) => clamp(BOIL65(I.x0 - 2, I.tipX, S.age) + (rnd53(k * 11 + c * 5 + 1002) - .5) * 30, I.x0 + 4, I.tipX - 4);
const bigX66 = (I, c) => clamp(BOIL65(I.x0 - 2, I.tipX, S.age) + (rnd53(c * 3 + 1302) - .5) * 14, I.x0 + 8, I.tipX - 8);
// the pops of the last ~1.2 s: [x, age, size]
function pops66(I, big, small) { const out = [], t = S.age;
  if (small) for (let k = 0; k < SMALL66.n; k++) { const s = slot65(k, SMALL66.per, SMALL66.spread, SMALL66.seed, t); for (let j = 0; j < 3; j++) { const age = (s.ph - SMALL66.rise) * s.per + j * s.per; if (age >= 0 && age < 1.2) out.push([smallX66(I, k, s.c - j), age, .45]); } }
  if (big) { const s = slot65(0, BIG66.per, BIG66.spread, BIG66.seed, t); for (let j = 0; j < 2; j++) { const age = (s.ph - BIG66.rise) * s.per + j * s.per; if (age >= 0 && age < 1.6) out.push([bigX66(I, s.c - j), age, 1.6]); } }
  return out; }
function small66(I, sf) { const t = S.age; for (let k = 0; k < SMALL66.n; k++) { const { c, ph } = slot65(k, SMALL66.per, SMALL66.spread, SMALL66.seed, t), x = smallX66(I, k, c), y = sf(x);
    if (ph < SMALL66.rise) { const u = ph / SMALL66.rise, r = .6 + u * 1.9; ctx.fillStyle = 'rgba(255,214,120,.95)'; ctx.beginPath(); ctx.arc(x, y + .3, r, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,255,235,.9)'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .4, Math.max(.3, r * .25), 0, 7); ctx.fill(); }
    else once('s66' + k + '_' + c, () => splat66(x, y, 2, false)); } }
// the big bubble's rise, three ways; then its pop: a bigger splat and a stronger ring of ripples
const RISE66 = {
  // a glossy round bubble that inflates smoothly out of the surface, wobbling a little
  sphere(x, y, u, t) { const r = 1 + 5 * eOut(u), w = 1 + .06 * Math.sin(t * 18) * u, cy = y + r * .25; ctx.save(); const g = ctx.createRadialGradient(x - r * .35, cy - r * .5, 0, x, cy, r); g.addColorStop(0, 'rgba(255,250,225,.95)'); g.addColorStop(.45, 'rgba(255,196,96,.92)'); g.addColorStop(1, 'rgba(226,96,26,.95)'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, cy, r * w, r / w, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,240,.9)'; ctx.beginPath(); ctx.ellipse(x - r * .38, cy - r * .55, r * .22, r * .14, -.5, 0, 7); ctx.fill(); ctx.restore(); },
  // the surface itself heaves up into a smooth mound (drawn by the lift), a stretched bright skin on top
  heave: null,
};
const heaveLift66 = I => { const s = slot65(0, BIG66.per, BIG66.spread, BIG66.seed, S.age); if (s.ph >= BIG66.rise) return () => 0; const u = s.ph / BIG66.rise, x0 = bigX66(I, s.c), h = 6 * (u < .85 ? Math.sin(Math.PI / 2 * u / .85) : 1) * (1 + .05 * Math.sin(S.age * 20) * u), w = 4 + u * 3; return x => h * Math.exp(-Math.pow((x - x0) / w, 2)); };
function big66(I, sf, mode) { const s = slot65(0, BIG66.per, BIG66.spread, BIG66.seed, S.age), x = bigX66(I, s.c), y = sf(x);
  if (s.ph < BIG66.rise) { const u = s.ph / BIG66.rise; if (mode === 'sphere') RISE66.sphere(x, y, u, S.age); else { ctx.save(); ctx.strokeStyle = `rgba(255,252,230,${.4 + u * .5})`; ctx.lineWidth = 1.2; ctx.shadowColor = '#ffd070'; ctx.shadowBlur = 4 + u * 4; ctx.beginPath(); for (let xx = x - 5; xx <= x + 5; xx += 1) ctx.lineTo(xx, sf(xx) + .4); ctx.stroke(); ctx.restore(); } }
  else { const age = (s.ph - BIG66.rise) * s.per; if (age < .15) glow58(x, y - 2, 5 + age * 50, .8 * (1 - age / .15)); once('b66' + s.c, () => splat66(x, y, 6, true)); } }
const MIX66 = {
  A: { name: 'Boil, every pop a splat', desc: 'The hot spot boils with round 65 C’s small bubbles, and every one pops round 65 D’s way: a thick little splat and a small ring of ripples running out along the surface, so the patch churns.', small: true, big: null },
  B: { name: '+ a big bubble: round', desc: 'The small boiling bubbles (each a tiny splat, small ripples), and every few seconds one big bubble in the patch: a glossy round bubble inflates smoothly out of the surface, wobbling a little, then bursts with D’s bigger splat and a strong ring of ripples both ways.', small: true, big: 'sphere' },
  C: { name: '+ a big heave', desc: 'The small boiling bubbles, and every few seconds the surface itself heaves up into a smooth mound in the patch (no separate bubble), a stretched bright skin on top; it bursts with the big splat and a strong ring of ripples.', small: true, big: 'heave' },
  D: { name: 'Heave + heat plume', desc: 'As C, and the depth bands bow upward over the hot spot, so you see the heat rising from below into the boil (the bright layers thicken and climb there, the deep red pushed up).', small: true, big: 'heave', plume: true },
};
function r66(K) { const M = MIX66[K]; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? M.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'The magma’s look only (animations come after): Depth bands with soft gradient edges (the layers blend into each other), in the open-top bar. ' + M.desc + ' (A skill-up just eases the fill on with a small swell; placeholder sound.)' : 'One profession at a time: this round is Blacksmithing’s magma look. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'magma: ' + M.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {};
    TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, M.plume ? (x => Math.exp(-Math.pow((x - BOIL65(xa, xb, t)) / 16, 2))) : null);
    try { barModule(top, 'M', { grow: (p, x0, y, Ln, f, t, I) => { if (I.tipX > I.x0 + 20) { const R = ripple66(pops66(I, !!M.big, M.small)), H = M.big === 'heave' ? heaveLift66(I) : () => 0; MAGLIFT = x => R(x) + H(x); } mag62('G66', I, t); },
      over: (p, I) => { onHits('m66', i => lsnd61(i, fat45(i))); if (!I.surf || I.tipX <= I.x0 + 20) return; small66(I, I.surf); if (M.big) big66(I, I.surf, M.big); } }); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; } } }; }
Object.assign(FAM, { PA: r66('A'), PB: r66('B'), PC: r66('C'), PD: r66('D') });

// Round 67 A-C, r67, round 68 B-D, r68, moved out 2026-11-15 (ACT67.D and POP68.A stay: picked).
  A: { name: 'The anvil throws magma', desc: 'Each skill-up the anvil’s face flashes with a burst of sparks and it flings a glob of magma along the bar; it lands on the head with a big splat and a ring of ripples, and the head moves on.', land: SHOT67,
    lift: (I, i, t) => () => 0, draw: (I, i, t) => shot67(I, i, t), at: { 0: I => anvilBurst67(I), [SHOT67]: (I, i) => { splat66(I.X(S.v0 + i) - 3, I.ly - 6, 7, true); } }, pop: SHOT67 },
  B: { name: 'Big wave to the left', desc: 'Each skill-up the head heaves up and the anvil answers: a big wave rolls back from the head along the bar toward the anvil and crashes against it in a burst of sparks; the head has moved on.', land: .15,
    lift: (I, i, t) => { const h = t >= 0 && t < .2 ? 3 * Math.sin(Math.PI * t / .2) : 0, hx = I.X(S.v0 + i), W = waveLeft67(I, i, t, .15, .8); return x => h * Math.exp(-Math.pow((x - hx) / 7, 2)) + W(x); }, draw: () => {}, at: { .8: I => { anvilBurst67(I, 12, true); splat66(I.x0 + 4, I.ly - 6, 6, true); } } },
  C: { name: 'Throw, then the wave back', desc: 'Both: the anvil flings the glob of magma onto the head (splat, the head moves on), and the impact sends a big wave rolling back along the bar to the anvil, which crashes against it in a burst of sparks.', land: SHOT67,
    lift: (I, i, t) => waveLeft67(I, i, t, SHOT67, SHOT67 + .6), draw: (I, i, t) => shot67(I, i, t), at: { 0: I => anvilBurst67(I, 5), [SHOT67]: (I, i) => splat66(I.X(S.v0 + i) - 3, I.ly - 6, 7, true), [SHOT67 + .6]: I => { anvilBurst67(I, 12, true); splat66(I.x0 + 4, I.ly - 6, 5, true); } } },
function r67(K) { const A = ACT67[K]; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? A.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'The anvil + the magma: gradient depth bands; slow bubbles rise only at the head (the fill’s front) and pop with a splat and a ring of ripples. ' + A.desc + ' (Sound: the anvil’s clank + a placeholder for the magma. Try “Five in a row”.)' : 'One profession at a time: this round is Blacksmithing. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? A.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    const fill = I => { const k = lastHit53(); let e = I.X(S.v0 + land53(A.land)); if (k >= 0) { const ft = hT53(k) - A.land; if (ft >= 0 && ft < .3) e = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut(ft / .3)); } return e; };
    try { barModule(top, 'M', { grow: (p, x0, y, Ln, f, t, I) => { I.tipX = fill(I); if (I.tipX > I.x0 + 20) { const R = ripple66(headPops67(I)), L = S.hits.map((h, i) => A.lift(I, i, hT53(i))); MAGLIFT = x => R(x) + L.reduce((s, l) => s + l(x), 0); } mag62('G66', I, t); },
      over: (p, I) => { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil60(I, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0); onHits('a67', i => { anvClank60(i, fat45(i)); lsnd61(i, fat45(i) * .6); });
        if (!I.surf) return; if (I.tipX > I.x0 + 20) headBubbles67(I, I.surf);
        S.hits.forEach((h, i) => { const t = hT53(i); A.draw(I, i, t); for (const at in A.at) if (t >= +at) once('at67' + K + i + '_' + at, () => A.at[at](I, i)); }); } }); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; } } }; }
Object.assign(FAM, { PA: r67('A'), PB: r67('B'), PC: r67('C'), PD: r67('D') });
  B: { name: 'Gas puff', desc: 'Swamp gas: when the dome pops it lets out a little puff of smoky gas that curls up off the surface and fades (warm underneath, grey-brown on top), a dimple, soft ripples; no droplets.',
    pop: () => {}, draw: (p, y) => { if (p.age >= 1.3) return; for (let q = 0; q < 3; q++) { const a = Math.max(0, p.age - q * .08), u = a / 1.3, px = p.x + Math.sin(a * 4 + q * 2) * (1.5 + a * 3), py = y - 2 - a * 13 - q * 1.5, r = (3 + a * 6) * p.s;
      const g = ctx.createRadialGradient(px, py + r * .3, 0, px, py, r); g.addColorStop(0, `rgba(255,170,90,${.3 * (1 - u)})`); g.addColorStop(.5, `rgba(130,105,90,${.28 * (1 - u)})`); g.addColorStop(1, 'rgba(110,95,85,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); } } },
  C: { name: 'Blub-blub cluster', desc: 'Like a bog: one bubble pops, then a few smaller ones follow right beside it, blub-blub-blub, each smaller, their dimples and ripples overlapping.',
    pop: (p, y) => drops68(p.x, y, 2, 18), draw: (p, y, sf) => { for (const q of cluster68(p)) { if (q.age < 0 && q.age > -.12) { dome68(q.x, sf(q.x), (1.4 + (q.age + .12) / .12 * 3) * q.s * 1.6); } else if (q.age >= 0) once('c68' + p.k + '_' + p.c + '_' + q.s, () => drops68(q.x, sf(q.x), 1, 14)); } } },
  D: { name: 'Thick blorp', desc: 'Thick and slow: just before it pops, the dome stretches up into a little peak; it bursts with one fat droplet thrown up that falls back with a tiny plip, and the surface dips, then bounces back up past level before it settles.',
    stretch: true, pop: (p, y) => spawn({ x: p.x, y: y - 3, vx: (Math.random() - .5) * 8, vy: -42, g: 260, life: .32, size: 1.5, col: '#ffc060' }), draw: (p, y) => { if (p.age > .3 && p.age < .45) { const u = (p.age - .3) / .15; ctx.save(); ctx.strokeStyle = `rgba(255,236,190,${.8 * (1 - u)})`; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(p.x, y + .3, 1 + u * 4, (1 + u * 4) * .3, 0, 0, 7); ctx.stroke(); ctx.restore(); } } },
function r68(K) { const M = POP68[K], A = ACT67.D; return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? M.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Round 67 D as picked (the anvil’s sparks shower into the magma, each landing with a tiny ring of ripples). The bubbles at the head, swamp-style: a thin glossy film swells slowly into a dome, then pops. ' + M.desc + ' (The bubbles are silent; the skill-up has the clank.)' : 'One profession at a time: this round is Blacksmithing. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'swamp pops: ' + M.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    const fill = I => { const k = lastHit53(); let e = I.X(S.v0 + land53(A.land)); if (k >= 0) { const ft = hT53(k) - A.land; if (ft >= 0 && ft < .3) e = lerp(I.X(S.v0 + k), I.X(S.v0 + k + 1), eOut(ft / .3)); } return e; };
    try { barModule(top, 'M', { grow: (p, x0, y, Ln, f, t, I) => { I.tipX = fill(I); if (I.tipX > I.x0 + 20) { const R = lift68(I, K), L = S.hits.map((h, i) => A.lift(I, i, hT53(i))); MAGLIFT = x => R(x) + L.reduce((s, l) => s + l(x), 0); } mag62('G66', I, t); },
      over: (p, I) => { const k = lastHit53(), ft = k < 0 ? 9 : hT53(k); anvil60(I, ft >= 0 && ft < .3 ? 1 - ft / .3 : 0); onHits('a68', i => anvClank60(i, fat45(i)));
        if (!I.surf) return; if (I.tipX > I.x0 + 20) bubbles68(I, I.surf, M); S.hits.forEach((h, i) => A.draw(I, i, hT53(i))); } }); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; } } }; }
Object.assign(FAM, { PA: r68('A'), PB: r68('B'), PC: r68('C'), PD: r68('D') });

// Round 69 finales (FIN69, r69), moved out 2026-11-15; V69 and helpers stay.
const FIN69 = {
  A: { name: 'Eruption', finAt: 1.45, desc: 'The head starts boiling hard (bubbles crowding faster and faster, the surface heaving up), then erupts: a fountain of magma shoots up out of the head and arcs into the unlock’s icon, which fills with glowing magma and lights.',
    lift: (I, ts) => { const hx = I.tipX - 4, a = ts < .6 ? 4 * (ts / .6) * (1 + .15 * Math.sin(ts * 40)) : ts < .8 ? 4 * (1 - (ts - .6) / .2) : 0; return x => a * Math.exp(-Math.pow((x - hx) / 7, 2)); },
    fin(I, ts, sf) { const hx = I.tipX - 4, ux = ux69(I);
      if (ts < .6) for (let k = 0; k < 7; k++) { const per = .5 - ts * .5, ph = ((ts + k * .13) % per) / per, x = hx - rnd53(k * 7 + Math.floor((ts + k * .13) / per)) * 18, r = 1 + ph * 2.6; if (ph < .85) dome68(x, sf(x), r); }
      if (ts >= .6) { once('fA0', () => { rumble69(); splat66(hx, I.ly - 8, 10, true); }); for (let j = 0; j < 14; j++) { const u = clamp((ts - .6) * 2.2 - j * .05); if (u <= 0 || u >= 1) continue; glob67(lerp(hx, ux, u), lerp(I.ly - 8, I.ly - 2, u) - Math.sin(Math.PI * u) * 24, 2.6 - j * .1); } }
      if (ts >= 1.05) { once('fA1', () => { splat66(ux, I.ly - 8, 6, true); tone(110, 0, .02, .5, 'sine', null, .02); }); } },
    after: (I, ts) => iconFill69(I, clamp((ts - 1.05) / .4)) },
  B: { name: 'The anvil’s big shower', finAt: 1.6, desc: 'The anvil flashes three times in quick succession (three clanks climbing), then throws one enormous shower of sparks: it rains along the whole bar, the whole surface fizzing with ripples where they land, and the last sparks hit the icon, which catches and blazes.',
    lift: (I, ts) => { const P = []; for (let q = 0; q < 40; q++) { const d = .55 + .25 + q / 39 * .35, age = ts - d; if (age >= 0 && age < .8) P.push([lerp(I.x0 + 6, I.tipX - 2, rnd53(q * 5 + 77)), age, .3]); } return ripple66(P); },
    anvilFlash: ts => [0, .2, .4].reduce((m, t0) => Math.max(m, ts >= t0 && ts < t0 + .16 ? 1 - (ts - t0) / .16 : 0), 0),
    fin(I, ts) { const ax = I.x0 - 26, ux = ux69(I); [0, .2, .4].forEach((t0, n) => { if (ts >= t0) once('fB' + n, () => { anvClank60(n * 2, 1.1); anvilBurst67(I, 6 + n * 3); }); });
      if (ts >= .55) for (let q = 0; q < 48; q++) { const toIcon = q >= 40, d = toIcon ? .5 + (q - 40) * .02 : .25 + q / 39 * .35, u = (ts - .55) / d; if (u < 0 || u >= 1) continue; const lx = toIcon ? ux + (q - 44) * 2 : lerp(I.x0 + 6, I.tipX - 2, rnd53(q * 5 + 77)), hh = 8 + rnd53(q + 3) * 6, P = w => [lerp(ax + 4, lx, w), lerp(I.ly - 7, toIcon ? I.ly - 4 : I.ly - 5, w) - Math.sin(Math.PI * w) * hh], [x, y] = P(u), [x2, y2] = P(Math.max(0, u - .07));
        ctx.save(); ctx.strokeStyle = q % 3 ? '#ffb040' : '#fff0c0'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
      if (ts >= 1.05) once('fB3', () => { rumble69(.6); }); },
    after: (I, ts) => blaze69(ux69(I), I.ly, ts >= 1.05 ? Math.min(1, (ts - 1.05) / .2) * (ts > 1.5 ? Math.max(0, 1 - (ts - 1.5) / .5) : 1) : 0) },
  C: { name: 'The great wave', finAt: 1.5, desc: 'The whole bar of magma swells into one big wave that rolls from the anvil to the end, building as it goes, and crashes over the icon in a burst of droplets, leaving it glowing with magma.',
    lift: (I, ts) => { if (ts > 1.15) return () => 0; const u = clamp(ts / 1.05), wx = lerp(I.x0, I.tipX + 10, u * u * (3 - 2 * u)), a = 2.5 + 6.5 * u; return x => a * Math.exp(-Math.pow((x - wx) / (8 + u * 4), 2)) + a * .35 * Math.exp(-Math.pow((x - wx + 16) / 10, 2)); },
    fin(I, ts, sf) { once('fC0', () => { noise(0, 1.1, .03, 260, .5, 'lowpass'); tone(65, 0, .02, 1.1, 'sine', 98, .3); }); if (ts < 1.05) { const u = clamp(ts / 1.05), wx = lerp(I.x0, I.tipX + 10, u * u * (3 - 2 * u)); if (wx < I.tipX) glow58(wx, sf(wx), 8 + u * 8, .5 + u * .3); } if (ts >= 1.05) once('fC1', () => { const ux = ux69(I); for (let q = 0; q < 16; q++) spawn({ x: ux - 6 + Math.random() * 10, y: I.ly - 6, vx: (Math.random() - .3) * 70, vy: -50 - Math.random() * 50, g: 300, life: .55, size: 1.2 + Math.random() * .8, col: Math.random() > .4 ? '#ff9a3a' : '#ffd890' }); tone(98, 0, .025, .5, 'sine', null, .02); }); },
    after: (I, ts) => { iconFill69(I, ts >= 1.05 ? Math.min(.75, (ts - 1.05) / .15) : 0); if (ts >= 1.05) glow58(ux69(I), I.ly, 16, .6 * Math.max(0, 1 - (ts - 1.05) / .8)); } },
  D: { name: 'Forged in the magma', finAt: 1.75, desc: 'The icon hops back and dips into the head of the magma, which boils up around it; then it rises back out glowing, dripping molten drops, settles back in its place and shines.',
    pos: (I, ts) => { const ux = ux69(I), hx = I.tipX - 8; if (ts < .4) { const u = eOut(ts / .4); return [lerp(ux, hx, u), -Math.sin(Math.PI * u) * 8 + u * 4]; } if (ts < .95) return [hx, 4 + 2 * Math.sin((ts - .4) * 12) * .3]; if (ts < 1.4) { const u = eOut((ts - .95) / .45); return [lerp(hx, ux, u), lerp(4, 0, u) - Math.sin(Math.PI * u) * 9]; } return [ux, 0]; },
    lift: (I, ts) => { const hx = I.tipX - 8, a = ts >= .38 && ts < 1.1 ? 2.5 * Math.sin(Math.PI * Math.min(1, (ts - .38) / .7)) : 0; return x => a * Math.exp(-Math.pow((x - hx) / 9, 2)); },
    fin(I, ts, sf) { const hx = I.tipX - 8; if (ts >= .4) once('fD0', () => { splat66(hx, I.ly - 6, 8, true); tone(82, 0, .03, .5, 'sine', null, .02); });
      if (ts >= .4 && ts < 1) for (let k = 0; k < 5; k++) { const ph = ((ts * 3 + k * .2) % 1), x = hx - 9 + k * 4.5; if (ph < .8) dome68(x, sf(x), 1 + ph * 2.2); }
      if (ts >= .95 && ts < 1.6) once('fD' + Math.floor(ts / .09), () => { const [x, dy] = FIN69.D.pos(I, ts); spawn({ x: x + (Math.random() - .5) * 12, y: I.ly + dy + 9, vy: 10, g: 220, life: .5, size: 1.2, col: '#ff9a3a' }); }); },
    after: (I, ts) => { const [x, dy] = FIN69.D.pos(I, ts), heat = ts >= .5 && ts < 1.75 ? Math.min(1, (ts - .5) / .3) : 0; if (heat > 0) { glow58(x, I.ly + dy, 16, .55 * heat); ctx.save(); ctx.globalAlpha *= .45 * heat; ctx.fillStyle = '#ff9a3a'; ctx.beginPath(); ctx.roundRect(x - 11, I.ly + dy - 11, 22, 22, 3); ctx.fill(); ctx.restore(); }
      if (ts >= .4 && ts < 1) { const sf = I.surf, top = sf(x); ctx.save(); const g = ctx.createLinearGradient(0, top, 0, I.ly + 14); g.addColorStop(0, '#ffe08a'); g.addColorStop(.5, '#ff8424'); g.addColorStop(1, '#8a1c06'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 13, I.ly + 14); for (let xx = x - 13; xx <= x + 13; xx += 2) ctx.lineTo(xx, sf(xx)); ctx.lineTo(x + 13, I.ly + 14); ctx.closePath(); ctx.fill(); ctx.restore(); } } },
};
function r69(K) { const F = FIN69[K], V = V69(F); return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Blacksmithing as picked (the anvil, depth-band magma, Film burst bubbles, Sparks into the magma). Reaching the next unlock: ' + F.desc + ' (Pick “Reaching the next unlock” to see it; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'finale: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; } } }; }
Object.assign(FAM, { PA: r69('A'), PB: r69('B'), PC: r69('C'), PD: r69('D') });

// Rounds 20, 28, 33, 40 (gatherer rounds nothing else uses), moved out 2026-11-15 (page size limit).
// ---------- round 20 (2026-11-15): Fishing picked D (a bright surface over the filled water) + the reel and line kept ----------
function r20(K) { return { get name() { return K + '. The set bar (same for A-D)'; }, get desc() { return 'The set header and bar, the fit per profession: Herbalism breaks out, Mining and Skinning inside, Fishing a water bar (D: the bright surface over the filled water) with the reel at its start paying out line, the line snapping taut with a twang each skill-up and sagging back, the bobber dipping. A-D are the same this round.'; },
  get note() { return 'the set bar, per profession.'; }, draw(top) { FISHR = true; FISHV = 'D'; barModule(top, FIT19[profName] || 'A'); FISHR = false; } }; }
Object.assign(FAM, { PA: r20('A'), PB: r20('B'), PC: r20('C'), PD: r20('D') });

// ---------- round 28 (2026-11-15): Herbalism, new add-ons to the Vine (round 27's picking designs out); the gust back ----------
const VAR28 = { Herbalism: { A: VAR26.Herbalism.A,
  B: { name: '+ The gust', desc: 'Each skill-up a gust of wind blows through: streaks race along the bar, the whole vine leans over and springs back, and a few leaves tear loose and tumble away to the right. Reaching the next herb, a big gust swirls a handful of leaves into its icon.',
    grow(p, x, y, L, f, t, I) { const ha = I.hitAge, lean = ha >= 0 && ha < 1 ? Math.sin(Math.PI * clamp(ha / .5)) * .45 * (1 - clamp((ha - .5) / .5)) + (ha > .5 ? Math.sin((ha - .5) * 14) * .08 * (1 - ha) : 0) : 0;
      ctx.save(); ctx.transform(1, 0, -lean, 1, lean * y, 0); grow(p, x, y, L, f, t); ctx.restore(); },
    over(p, I) { const ha = I.hitAge; if (ha >= 0 && ha < .6) { const u = ha / .6; ctx.save(); ctx.strokeStyle = `rgba(235,250,235,${.7 * (1 - u)})`; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; for (let j = 0; j < 5; j++) { const yy = I.ly - 14 + j * 6, xs = lerp(I.x0 - 30, I.x1 + 10, u) - j * 18; ctx.beginPath(); ctx.moveTo(xs, yy); ctx.lineTo(xs + 26, yy - 1); ctx.stroke(); } ctx.restore(); }
      onHits('hgu', () => { noise(0, .6, .04, 1200, .5); noise(.05, .5, .025, 3200, .6); for (let q = 0; q < 6; q++) spawn({ x: lerp(I.x0, I.tipX, Math.random()), y: I.ly - 5, vx: 90 + Math.random() * 80, vy: -30 - Math.random() * 30, g: 60, life: 1.1, size: 2, shape: 'leaf', vr: 8, col: q % 2 ? '#7ee04a' : '#5ac83a' }); });
      if (I.done) once('hgud', () => { noise(0, .9, .05, 1000, .5); for (let q = 0; q < 18; q++) { const sx = lerp(I.x0, I.x1, Math.random()); spawn({ x: sx, y: I.ly - 6, vx: (I.x1 + 18 - sx) / .9, vy: -40 - Math.random() * 30, g: 90, life: .9, size: 2.2, shape: 'leaf', vr: 10, col: q % 2 ? '#7ee04a' : '#9ff08a' }); } }); } },
  C: { name: '+ Tracking the herb', desc: 'Like Find Herbs on the minimap: the next herb’s icon carries a yellow tracking dot that grows brighter as you close in, and each skill-up it pings, two yellow rings sweeping out from it like radar with a soft ping. Reaching it, a big ping and the herb is found, glowing yellow.',
    over(p, I) { const ux = I.x1 + 18, uy = I.ly, ha = I.hitAge; ctx.save(); const glow = .35 + .65 * I.f; ctx.fillStyle = `rgba(255,220,60,${glow})`; ctx.shadowColor = '#ffd84a'; ctx.shadowBlur = 6 + 8 * I.f; ctx.beginPath(); ctx.arc(ux + 11, uy - 11, 2.2 + I.f * 1.2, 0, 7); ctx.fill(); ctx.restore();
      const ring = (t0, big) => { for (const d of [0, .18]) { const u = clamp((t0 - d) / (big ? 1 : .7)); if (u <= 0 || u >= 1) continue; ctx.save(); ctx.strokeStyle = `rgba(255,220,60,${(1 - u) * .9})`; ctx.lineWidth = big ? 2.4 : 1.6; ctx.beginPath(); ctx.arc(ux, uy, 10 + u * (big ? 60 : 34), 0, 7); ctx.stroke(); ctx.restore(); } };
      if (ha >= 0 && !I.done) ring(ha, false); if (I.done) ring(S.age - S.closeAt, true);
      onHits('htr', () => { tone(1568, 0, .025, .5); tone(1568, .18, .015, .4); }); if (I.done) once('htrd', () => { tone(1568, 0, .03, .7); tone(2093, .1, .025, .8); }); } },
  D: { name: '+ Dew run', desc: 'Each skill-up a drop of dew slides along the whole vine from its start to the tip, every leaf dipping as it passes, and drips off the bud with a plink and a tiny splash. Reaching the next herb, a run of drops chases each other along and splash into its icon.',
    grow(p, x, y, L, f, t, I) { const ha = I.hitAge, dx = ha >= 0 && ha < .8 && !I.done ? lerp(x, I.tipX, eOut(ha / .8)) : -999; ctx.save(); grow(p, x, y, L, f, t); ctx.restore();
      if (dx > -999) { const dip = s => Math.exp(-((s - dx) * (s - dx)) / 60); ctx.save(); ctx.fillStyle = 'rgba(40,90,30,.0)'; ctx.restore(); ctx.save(); ctx.strokeStyle = 'rgba(200,240,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); for (let s = x; s <= dx; s += 3) ctx.lineTo(s, y - 3 + dip(s) * 2); ctx.stroke(); ctx.restore(); } },
    over(p, I) { const ha = I.hitAge; const drop = (x, y, s) => { ctx.save(); ctx.fillStyle = 'rgba(210,240,255,.95)'; ctx.shadowColor = '#bfe8ff'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.moveTo(x, y - 3.4 * s); ctx.quadraticCurveTo(x + 2.6 * s, y, x, y + 1.6 * s); ctx.quadraticCurveTo(x - 2.6 * s, y, x, y - 3.4 * s); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x - .7 * s, y - .6 * s, .6 * s, 0, 7); ctx.fill(); ctx.restore(); };
      if (!I.done && ha >= 0 && ha < 1.1) { if (ha < .8) drop(lerp(I.x0, I.tipX, eOut(ha / .8)), I.ly - 5, 1.3); else { const u = (ha - .8) / .3; drop(I.tipX + 2, I.ly - 4 + u * u * 14, 1.2 * (1 - u * .3)); } }
      landed('hdw', 1.05, () => { tone(1800, 0, .03, .12, 'sine', 900); for (let q = 0; q < 5; q++) spawn({ x: I.tipX + 2, y: I.ly + 8, vx: (Math.random() - .5) * 40, vy: -20 - Math.random() * 20, g: 300, life: .4, size: 1, col: '#d8f0ff' }); });
      if (I.done) { const ts = S.age - S.closeAt; for (let j = 0; j < 4; j++) { const u = clamp((ts - j * .12) / .55); if (u > 0 && u < 1) drop(lerp(I.x0, I.x1 + 18, eOut(u)), I.ly - 5 - Math.sin(Math.PI * u) * (j % 2 ? 4 : 0), 1.2); } once('hdwd', () => { for (let j = 0; j < 4; j++) tone(1600 + j * 200, .5 + j * .12, .025, .14, 'sine', 900); }); } } },
} };
function r28(K) { const v = () => VAR28[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : 'Herbalism only this round'); },
  get desc() { return v() ? v()[K].desc : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : 'One profession at a time: this round is Herbalism. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = v(); barModule(top, FIT19[profName] || 'A', o ? o[K] : null); FISHR = false; } }; }
Object.assign(FAM, { PA: r28('A'), PB: r28('B'), PC: r28('C'), PD: r28('D') });
setTimeout(() => { profName = 'Herbalism'; if (typeof sync === 'function') { sync(); play(); } }, 0);
setTimeout(() => { const b = document.querySelector('[data-g="bright"]'); if (b) b.click(); }, 0);
// ---------- round 33 (2026-11-15): Skinning finales again, no fur (round 32 all read alike: hide and fur effects) ----------
// V.after(p, info): drawn after the unlock icon (over it).
const VAR33 = { Skinning: {
  A: Object.assign({}, skBase, { name: 'Trap snaps', finAt: .6, desc: 'Skinning as locked (the cut + a stroke + Fur flies). Reaching the next beasts: two straight jaws swing up out of the bar’s end and clap shut on the beasts’ icon like a trap, with a hard metal clack and a jolt; they hold a beat, swing back open and fade, and the icon is lit.',
    shake(I) { if (!I.done) return [0, 0]; const t = S.age - S.closeAt - .32; return t >= 0 && t < .3 ? [0, 2.5 * Math.exp(-t * 12) * Math.cos(t * 55)] : [0, 0]; },
    after(p, I) { skFurOnly(I); if (!I.done) return; const ts = S.age - S.closeAt, hx = I.x1 - 6, ux = I.x1 + 18; if (ts > 1) return;
      const open = ts < .2 ? 1.25 * eOut(ts / .2) : ts < .32 ? lerp(1.25, .1, Math.pow((ts - .2) / .12, 2)) : ts < .55 ? .1 : lerp(.1, 1.3, eOut(clamp((ts - .55) / .3))), a = clamp(ts / .1) * clamp((1 - ts) / .2);
      const jaw = sgn => { ctx.save(); ctx.translate(hx, I.ly); ctx.rotate(-sgn * open); ctx.fillStyle = 'rgba(20,18,16,.95)'; ctx.beginPath(); ctx.roundRect(0, sgn > 0 ? -14 : 6, 44, 8, 2.5); ctx.fill(); ctx.strokeStyle = '#ffd36a'; ctx.lineWidth = 1.3; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(2, sgn > 0 ? -13 : 7, 40, 1.5); ctx.restore(); };
      ctx.save(); ctx.globalAlpha *= a; jaw(1); jaw(-1); ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(hx, I.ly, 2.5, 0, 7); ctx.fill(); ctx.restore();
      once('sktr0', () => { noise(.02, .18, .02, 1500, 1); });
      if (ts >= .32) once('sktr1', () => { metal(0, 420, .09, .5, [1, 2.4, 3.9], [1, .5, .25]); click(0, .12, 2600, 2); tone(70, 0, .08, .2, 'sine', 40); spawn({ x: ux, y: I.ly, size: 10, shape: 'ring', grow: 26, life: .3, col: '#fff' }); }); } }),
  B: Object.assign({}, skBase, { name: 'Claw rake', finAt: .4, desc: 'Skinning as locked. Reaching the next beasts: the beast strikes back, three glowing gold claw marks rake across the whole module at once in a single swipe with a tearing hiss, and the icon lights where they end; the marks fade slowly.',
    after(p, I) { skFurOnly(I); if (!I.done) return; const ts = S.age - S.closeAt; if (ts > 1.4) return; const u = eOut(clamp(ts / .18)), a = 1 - clamp((ts - .5) / .9);
      for (let j = 0; j < 3; j++) { const xa = I.x0 + 30 + j * 16, ya = I.ly - 30 + j * 3, xb = I.x1 + 24 + j * 4, yb = I.ly + 12 + j * 8, xe = lerp(xa, xb, u), ye = lerp(ya, yb, u), mx = (xa + xe) / 2, my = (ya + ye) / 2 - 10;
        ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.shadowColor = '#ffb030'; ctx.shadowBlur = 8; ctx.strokeStyle = '#ffd36a'; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.quadraticCurveTo(mx, my, xe, ye); ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = '#fff8e0'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); }
      once('skcl', () => { noise(0, .22, .09, 3200, .5); noise(.04, .3, .05, 1200, .7); tone(500, 0, .03, .2, 'sawtooth', 160); }); } }),
  C: Object.assign({}, skBase, { name: 'Target lock', finAt: .6, desc: 'Skinning as locked. Reaching the next beasts: a hunter’s reticle (a ring with four ticks) slides in from the bar’s start, turning as it goes, closes on the beasts’ icon and locks with a crisp click, snapping tight and turning gold; the icon lights.',
    after(p, I) { skFurOnly(I); if (!I.done) return; const ts = S.age - S.closeAt, ux = I.x1 + 18; if (ts > 1.3) return; const u = clamp(ts / .45), e = eOut(u), locked = ts >= .45, k = locked ? eBack(clamp((ts - .45) / .15)) : 0;
      const x = lerp(I.x0, ux, e), r = locked ? lerp(15, 13, k) : lerp(22, 15, e), rot = (1 - e) * 1.6, col = locked ? '#ffd36a' : '#f0ead8', a = clamp(ts / .1) * (1 - clamp((ts - .9) / .4));
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, I.ly); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = locked ? 2 : 1.4; if (locked) { ctx.shadowColor = '#ffd36a'; ctx.shadowBlur = 6; }
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); for (let q = 0; q < 4; q++) { const an = q * Math.PI / 2; ctx.beginPath(); ctx.moveTo(Math.cos(an) * (r - 4), Math.sin(an) * (r - 4)); ctx.lineTo(Math.cos(an) * (r + 5), Math.sin(an) * (r + 5)); ctx.stroke(); } ctx.restore();
      once('sktg0', () => tone(880, 0, .012, .4, 'sine', 1320));
      if (locked) once('sktg1', () => { click(0, .1, 3800, 4); tone(1760, 0, .03, .12); spawn({ x: ux, y: I.ly, size: 13, shape: 'ring', grow: 16, life: .3, col: '#ffd36a' }); }); } }),
  D: Object.assign({}, skBase, { name: 'Rank refill', finAt: .9, desc: 'Skinning as locked. Reaching the next beasts: the bar’s notches light up one by one in a fast run of ticks; then the bar drains in a blink and refills in gold from end to end with a rising note, as if the skill moved up a tier, and the icon lights.',
    over(p, I) { skFurOnly(I); if (!I.done) return; const ts = S.age - S.closeAt, L = I.x1 - I.x0, N = Math.max(4, I.N);
      if (ts < .5) for (let j = 1; j < N; j++) { const tj = j / N * .4; if (ts < tj) continue; const x = I.x0 + j / N * L, a = ts > .4 ? 1 - (ts - .4) / .1 : 1; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff8d8'; ctx.shadowColor = '#ffd36a'; ctx.shadowBlur = 6; ctx.fillRect(x - 1, I.ly - 7, 2, 14); ctx.restore(); once('skrt' + j, () => click(0, .035, 2600 + j * 120, 5)); }
      if (ts >= .4) { const dr = clamp((ts - .4) / .1), fl = clamp((ts - .55) / .3), a = 1 - clamp((ts - 1.6) / .6); ctx.save(); ctx.globalAlpha *= a;
        ctx.fillStyle = 'rgba(8,8,12,.95)'; ctx.fillRect(I.x1 + 1 - (L + 2) * dr, I.ly - 5, (L + 2) * dr, 10);
        if (fl > 0) { const w = (L + 2) * eOut(fl), g = ctx.createLinearGradient(I.x0, 0, I.x1, 0); g.addColorStop(0, '#9a6a10'); g.addColorStop(1, '#ffe08a'); ctx.fillStyle = g; ctx.fillRect(I.x0 - 1, I.ly - 5, w, 10); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(I.x0 - 1, I.ly - 4, w, 2); ctx.fillStyle = '#fff'; ctx.fillRect(I.x0 - 1 + w - 2, I.ly - 5, 2, 10); }
        ctx.restore(); once('skrd', () => tone(330, 0, .03, .1, 'triangle', 120)); if (ts >= .55) once('skrf', () => { tone(330, 0, .03, .35, 'triangle', 990); noise(0, .3, .015, 3000, .6); }); } } }),
} };
function r33(K) { const v = () => VAR33[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning’s finale. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null; barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r33('A'), PB: r33('B'), PC: r33('C'), PD: r33('D') });
// ---------- round 40 (2026-11-15): Fishing skill-up sound = the natural plop (39 B); its splash, four ways ----------
const plop40 = () => { noise(0, .09, .06, 500, .9, 'lowpass'); tone(170, 0, .035, .12, 'sine', 85); };
const SPL40 = {
  A: () => noise(.03, .25, .02, 2200, .6), // as round 39: a flat hiss of spray
  B: () => { noise(.02, .14, .014, 2600, .7); [.13, .2, .26, .34, .45].forEach((t, k) => { const f = 2400 + skHash(k + S.age) * 1800; tone(f, t, .012 - k * .0015, .05, 'sine', f * .6); }); }, // droplets: a short spray, then droplets pattering back down (tiny falling plinks)
  C: () => { noise(.02, .12, .016, 1800, .8); for (let k = 0; k < 5; k++) { const t = .06 + k * .055 + skHash(k + S.age) * .03, f = 900 + skHash(k + 7 + S.age) * 700; tone(f, t, .01, .06, 'sine', f * 1.8); } }, // bubbly: a soft splash, then little bubbles popping up (short rising blips)
  D: () => { noise(.02, .12, .03, 3200, .6); noise(.06, .2, .028, 1500, .6); noise(.12, .3, .022, 650, .7, 'lowpass'); }, // fuller: a three-layer sploosh that darkens as it settles
};
const SPLNAME40 = { A: 'Spray hiss (as now)', B: 'Droplets falling back', C: 'Bubbles', D: 'A fuller sploosh' };
const SPLDESC40 = { A: 'the round 39 splash, for comparison: a flat hiss of spray.', B: 'a short spray, then a few droplets pattering back down onto the water, tiny falling plinks.', C: 'a soft splash, then little bubbles popping up from where the bobber went under, short rising blips.', D: 'a bigger three-layer splash, bright at first and darkening as the water settles; no notes.' };
function fish40(K) { const s = swell38('A'); return { name: SPLNAME40[K], tex: TEX38.B, snd: i => { plop40(); SPL40[K](); }, pre: s.pre, over: s.over,
  desc: 'Fishing as picked: the swell, Depth bands, the soft low rush and the natural plop. Its splash: ' + SPLDESC40[K] }; }
const VAR40 = { Fishing: { A: fish40('A'), B: fish40('B'), C: fish40('C'), D: fish40('D') } };
function r40(K) { return { get name() { return K + '. ' + (VAR40[profName] ? VAR40[profName][K].name : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Fishing only this round'); },
  get desc() { return VAR40[profName] ? VAR40[profName][K].desc + ' (Sound on; try “Five in a row”.)' : 'One profession at a time: this round is Fishing. Others show their current look.'; },
  get note() { return VAR40[profName] ? VAR40[profName][K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { const keep = VAR39.Fishing; VAR39.Fishing = VAR40.Fishing; try { r39(K).draw(top); } finally { VAR39.Fishing = keep; } } }; }
Object.assign(FAM, { PA: r40('A'), PB: r40('B'), PC: r40('C'), PD: r40('D') });
