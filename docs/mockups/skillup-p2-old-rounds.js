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

// Round 70 finales + r70, round 71 A/B/D + r71, moved out 2026-11-15 (FIN71.C, the Ember swarm, stays).
const FIN70 = {
  A: { name: 'The drain', finAt: 1.9, desc: 'The magma drains out toward the end: the level sinks and tilts, the bar empties as a glowing stream spills from its end into the unlock’s icon, filling it; for a breath the channel lies dark and empty, then fresh bright magma rushes back in from the anvil to the end.',
    lift: (I, ts) => { if (ts > 1.3) return () => 0; const d = ts < .9 ? eOut(ts / .9) * 10 : 10 * (1 - (ts - .9) / .4); return x => -d * (.55 + .45 * (x - I.x0) / (I.x1 - I.x0)); },
    tip: (I, ts) => ts < 1.1 ? null : ts < 1.25 ? I.x0 : lerp(I.x0, I.tipX, eOut(clamp((ts - 1.25) / .5))),
    fin(I, ts, sf) { const ux = ux69(I); once('fa0', () => { noise(0, 1, .03, 200, .5, 'lowpass'); [0, 1, 2, 3].forEach(q => mallet(147 * semi(PENT42[q]), .2 + q * .18, .01)); });
      if (ts > .1 && ts < 1.05) { const w = 1.5 + 2.5 * Math.sin(Math.PI * clamp((ts - .1) / .95)), x = I.tipX - 2; ctx.save(); ctx.strokeStyle = '#ffb040'; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.moveTo(x, sf(x)); ctx.quadraticCurveTo(ux - 4, I.ly - 8, ux - 2, I.ly + 6); ctx.stroke(); ctx.restore(); }
      if (ts >= 1.25) once('fa1', () => { noise(0, .5, .025, 300, .5, 'lowpass'); tone(110, 0, .02, .5, 'sine', null, .05); }); },
    after: (I, ts) => iconFill69(I, clamp((ts - .2) / .85)) },
  B: { name: 'Crust and crack', finAt: 1.6, desc: 'The whole bar crusts over dark in a moment, the glow gone; then it cracks open in a chain from the anvil to the end, light bursting up through each crack; the crust shatters into falling chips, the magma blazes bright again, and the last crack splits light into the icon.',
    lift: () => () => 0,
    fin(I, ts, sf) { const crust = ts < .3 ? ts / .3 : ts < 1.2 ? 1 : 1 - (ts - 1.2) / .15; const N = 8, xs = k => lerp(I.x0 + 10, I.tipX - 6, k / (N - 1));
      if (crust > 0) { ctx.save(); ctx.globalAlpha *= Math.min(1, crust) * .92; ctx.fillStyle = '#2a120a'; ctx.beginPath(); ctx.moveTo(I.x0 - 2, I.ly + 6); for (let x = I.x0 - 2; x <= I.tipX; x += 2) ctx.lineTo(x, sf(x) - .5); ctx.lineTo(I.tipX, I.ly + 6); ctx.closePath(); ctx.fill(); ctx.restore(); }
      for (let k = 0; k < N; k++) { const tk = .4 + k * .09, a = ts - tk; if (a < 0 || crust <= 0) continue; once('fb' + k, () => { mallet(196 * semi(PENT42[k % 7]), 0, .012); spawn({ x: xs(k), y: I.ly - 6, vy: -30, g: 100, life: .3, size: 1, col: '#ffe0a0' }); });
        const x = xs(k), h = Math.min(1, a / .08); ctx.save(); ctx.strokeStyle = '#ffd070'; ctx.lineWidth = 1.4; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.moveTo(x, sf(x)); ctx.quadraticCurveTo(x + 2, I.ly, x - 1, sf(x) + 11 * h); ctx.stroke(); ctx.restore(); if (a < .25) glow58(x, I.ly - 5, 6 + a * 30, .7 * (1 - a / .25)); }
      if (ts >= 1.2) once('fb9', () => { rumble69(.7); for (let q = 0; q < 22; q++) spawn({ x: lerp(I.x0, I.tipX, Math.random()), y: I.ly - 3, vx: (Math.random() - .5) * 40, vy: -30 - Math.random() * 30, g: 280, life: .6, size: 1 + Math.random(), shape: 'sq', vr: 10, col: q % 2 ? '#2a120a' : '#4a1e10' }); }); },
    after: (I, ts) => blaze69(ux69(I), I.ly, ts >= 1.12 ? Math.min(1, (ts - 1.12) / .15) * Math.max(0, 1 - Math.max(0, ts - 1.5) / .5) : 0) },
  C: { name: 'Fire across the surface', finAt: 1.5, desc: 'A spark from the anvil drops onto the magma and sets its surface alight: a run of flames races along the bar from the anvil to the end, dancing up and dying down behind the front, and at the end the icon bursts into flame.',
    lift: () => () => 0,
    fin(I, ts, sf) { const ax = I.x0 - 26, fx = lerp(I.x0, I.tipX, clamp((ts - .15) / .85)); if (ts < .15) { const u = ts / .15; glint59(lerp(ax + 4, I.x0 + 2, u), lerp(I.ly - 8, sf(I.x0 + 2), u) - Math.sin(Math.PI * u) * 4, 1, 2); }
      once('fc0', () => anvClank60(0, 1)); if (ts >= .15) once('fc1', () => { noise(0, 1, .025, 900, .5, 'lowpass'); tone(196, 0, .006, 1, 'sine', 262, .4); });
      if (ts >= .15) for (let x = I.x0 + 2, k = 0; x <= fx; x += 5, k++) { const age = ts - .15 - (x - I.x0) / (I.tipX - I.x0) * .85, a = clamp(1 - age / .7) * (ts > 1.3 ? Math.max(0, 1 - (ts - 1.3) / .3) : 1); flame70(x, sf(x) + .5, (4 + 4 * rnd53(k + 40)) * Math.min(1, age / .1 + .3) * (.6 + .4 * a), a, ts * 1.3 + k); } },
    after: (I, ts) => { const a = ts >= 1 ? Math.min(1, (ts - 1) / .15) * Math.max(0, 1 - Math.max(0, ts - 1.4) / .4) : 0; if (a > 0) { const ux = ux69(I); for (let q = 0; q < 5; q++) flame70(ux - 8 + q * 4, I.ly + 10, 10 + 8 * rnd53(q + 60), a, ts * 1.5 + q); blaze69(ux, I.ly, a * .7); } } },
  D: { name: 'Overflow', finAt: 1.7, desc: 'The magma rises: the whole level swells up past the top of the bar, bulging, and spills over its lower edge in glowing drips that stretch and fall; the overflow runs on into the icon and fills it, then the level settles back.',
    lift: (I, ts) => { const r = ts < .6 ? eOut(ts / .6) * 5.5 : ts < 1.1 ? 5.5 : 5.5 * (1 - eOut(clamp((ts - 1.1) / .5))); return x => r * (1 + .12 * Math.sin(x * .2 + ts * 6)); },
    fin(I, ts) { once('fd0', () => { noise(0, 1.1, .028, 240, .5, 'lowpass'); tone(73, 0, .025, 1.1, 'sine', null, .4); });
      if (ts > .45 && ts < 1.6) for (let k = 0; k < 9; k++) { const x = lerp(I.x0 + 8, I.tipX - 6, k / 8) + (rnd53(k + 90) - .5) * 8, st = .45 + rnd53(k + 91) * .35, a = ts - st; if (a < 0) continue; const len = Math.min(9, a * 22) * (ts > 1.3 ? Math.max(0, 1 - (ts - 1.3) / .3) : 1);
        ctx.save(); ctx.strokeStyle = '#ff9a3a'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 4; ctx.beginPath(); ctx.moveTo(x, I.ly + 5); ctx.lineTo(x, I.ly + 5 + len); ctx.stroke(); ctx.fillStyle = '#ffc060'; ctx.beginPath(); ctx.arc(x, I.ly + 5 + len, 1.6, 0, 7); ctx.fill(); ctx.restore();
        if (a > .45) once('fdd' + k, () => spawn({ x, y: I.ly + 5 + len, vy: 30, g: 300, life: .4, size: 1.5, col: '#ff9a3a' })); } },
    after: (I, ts) => iconFill69(I, clamp((ts - .55) / .7)) },
};
function r70(K) { const F = FIN70[K], V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Blacksmithing as picked. Reaching the next unlock: ' + F.desc + ' (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'finale: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; } } }; }
Object.assign(FAM, { PA: r70('A'), PB: r70('B'), PC: r70('C'), PD: r70('D') });
  A: Object.assign({}, FIN70.C, { name: 'Fire across the surface' }),
  B: { name: 'Ingots, shipped', finAt: 2.45, desc: 'The magma hardens into ingots: seams split the bar into seven moulds and each cools from glowing orange to iron. A wooden crate drops in by the icon; the ingots hop into it one by one from the end, each with a clink, then the crate slides off and the icon lights. Fresh magma flows back in from the anvil.',
    lift: () => () => 0, tip: (I, ts) => ts < .55 ? null : ts < 2.3 ? I.x0 : lerp(I.x0, I.tipX, eOut(clamp((ts - 2.3) / .5))),
    fin(I, ts) { const ux = ux69(I); for (let k = 0; k < ING71; k++) { const [xa, xb] = ingSeg71(I, k), cool = clamp((ts - .15 - k * .03) / .55), lv = ingLeave71(k), u = (ts - lv) / .3;
        if (ts < .55) { ctx.save(); ctx.globalAlpha *= clamp(ts / .25); ctx.fillStyle = 'rgba(30,10,4,.85)'; ctx.fillRect(xb + .2, I.ly - 6, 2.6, 12); ctx.restore(); }
        if (ts >= .2 && u < 0) ingot71(xa, xb, I.ly, cool, clamp((ts - .2) / .3));
        else if (u >= 0 && u < 1) { const x = lerp((xa + xb) / 2, ux, u), y = lerp(I.ly, I.ly - 4, u) - Math.sin(Math.PI * u) * 9, hw = (xb - xa) / 2 * (1 - u * .4); ingot71(x - hw, x + hw, y, 1); }
        if (u >= 1) once('ib' + k, () => { mallet(784 * semi(PENT42[k % 7]), 0, .012); tone(1568 * semi(PENT42[k % 7]), .01, .003, .2, 'sine', null, .002); }); }
      if (ts >= .55) once('ic', () => { drum46(110, 0, .03); for (let q = 0; q < 6; q++) spawn({ x: ux + (Math.random() - .5) * 24, y: I.ly + 9, vx: (Math.random() - .5) * 30, vy: -10 - Math.random() * 10, g: 60, life: .5, size: 1.5, col: 'rgba(170,150,130,.6)' }); });
      if (ts >= 1.95) once('is', () => noise(0, .45, .02, 500, .6, 'lowpass')); },
    after: (I, ts) => { const ux = ux69(I); if (ts < .55 || ts > 2.4) return; const drop = ts < .7 ? eOut((ts - .55) / .15) : 1, slide = ts > 1.95 ? eOut((ts - 1.95) / .4) : 0; crate71(ux + slide * 40, I.ly - 18 * (1 - drop) + .5, 1 - slide);
      const n = S.hits.length && ts ? [...Array(ING71).keys()].filter(k => ts >= ingLeave71(k) + .3).length : 0; if (n && slide < .5) { ctx.save(); ctx.fillStyle = '#9aa2ac'; for (let q = 0; q < Math.min(n, 4); q++) ctx.fillRect(ux + slide * 40 - 9 + q * 4.6, I.ly - 10.5, 4, 2.4); ctx.restore(); } } },
  D: { name: 'The blade rises', desc: 'A sword forms in the magma: a long blade rises up out of the surface along the bar, glowing, magma dripping off it; a shine runs down its edge, then it slides off the end into the icon, which lights.', finAt: 1.75,
    lift: (I, ts) => { const a = ts < .6 ? 1.6 * Math.sin(Math.PI * ts / .6) : 0; return x => a; },
    fin(I, ts) { const xa = I.x0 + 16, xb = I.tipX - 10, rise = ts < .6 ? eOut(ts / .6) : 1, slide = ts > 1.05 ? eOut(clamp((ts - 1.05) / .45)) : 0, ux = ux69(I); if (ts > 1.5) return;
      const dx = slide * (ux - xb + 4), sc = 1 - slide * .7, y = I.ly + 6 - rise * 15, hot = clamp(1 - (ts - .2) / 1), x0 = xa + dx + (xb - xa) * (1 - sc), x1 = xb + dx;
      ctx.save(); ctx.beginPath(); ctx.rect(I.x0 - 30, I.ly - 30, I.x1 - I.x0 + 80, 25); ctx.clip();
      const g = ctx.createLinearGradient(0, y - 2.5, 0, y + 2.5); g.addColorStop(0, mix('#e8eef4', '#fff0c0', hot)); g.addColorStop(1, mix('#6a7480', '#ff7a20', hot)); ctx.fillStyle = g; if (hot > 0) { ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8 * hot; }
      ctx.beginPath(); ctx.moveTo(x0, y - 2.2); ctx.lineTo(x1 - 8 * sc, y - 2.2); ctx.lineTo(x1, y + .3); ctx.lineTo(x1 - 8 * sc, y + 2.2); ctx.lineTo(x0, y + 2.2); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#3a2a1a'; ctx.fillRect(x0 - 9 * sc, y - 1.2, 8 * sc, 2.4); ctx.fillStyle = '#c8a050'; ctx.fillRect(x0 - 1.5, y - 5 * sc, 2.2, 10 * sc);
      if (ts > .65 && ts < 1.05) { const sx = lerp(x0, x1, (ts - .65) / .4); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(sx - 6, y - 2.2, 6, 1.2); } ctx.restore();
      if (ts > .3 && ts < 1) once('bd' + Math.floor(ts / .08), () => spawn({ x: lerp(x0, x1, Math.random()), y: y + 2.5, vy: 5, g: 240, life: .35, size: 1.1, col: '#ff9a3a' }));
      if (ts > .65) once('bs', () => { bell45(1568, 0, .006); tone(2093, .04, .003, .3, 'sine', null, .002); }); if (ts > 1.05) once('bw', () => noise(0, .3, .018, 1200, .6, 'lowpass')); },
    after: (I, ts) => blaze69(ux69(I), I.ly, ts > 1.45 ? Math.max(0, 1 - (ts - 1.45) / .4) : 0) },
function r71(K) { const F = FIN71[K], V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Blacksmithing as picked. Reaching the next unlock: ' + F.desc + ' (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'finale: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; } } }; }
Object.assign(FAM, { PA: r71('A'), PB: r71('B'), PC: r71('C'), PD: r71('D') });

// Round 72 Ember swarm add-ons (FIN72, r72), moved out 2026-11-15; swarm72, INGOTS72, BLADE72 stay.
// ---- add-ons on the Ember swarm
const FIN72 = {
  A: Object.assign({}, SW, { name: 'Ember swarm' }),
  B: { name: 'Swarm + vortex', finAt: 2.05, desc: 'Add-on: the ribbon of embers doesn’t pour straight in: it whirls round the icon in a tightening vortex, faster and faster, then implodes into it with a flash.',
    lift: () => () => 0, fin(I, ts, sf) { swarm72(I, ts, { src: surfSrc72(I, sf), spin: true }); once('vb', () => chime72()); if (ts > 1.75) once('vi', () => { rumble69(.5); bell45(1568, 0, .007); }); },
    after: (I, ts) => { const ux = ux69(I); if (ts > .9 && ts < 1.9) glow58(ux, I.ly, 18, .25 + .3 * clamp((ts - .9) / .9)); blaze69(ux, I.ly, ts > 1.75 ? Math.min(1, (ts - 1.75) / .1) * Math.max(0, 1 - (ts - 1.85) / .5) : 0); } },
  C: { name: 'Swarm + heat wake', desc: 'Add-on: the magma answers the swarm: where the embers lift off, the surface flares bright and ripples, and a glowing wake follows the ribbon along the bar to the end, so the whole bar lights up in a wave under it.', finAt: 1.75,
    lift: (I, ts) => { const P = []; for (let q = 0; q < 70; q += 3) { const st = rnd53(q * 3 + 301) * .45, a = ts - st; if (a >= 0 && a < .8) P.push([lerp(I.x0 + 4, I.tipX - 2, rnd53(q * 3 + 300)), a, .35]); } return ripple66(P); },
    fin(I, ts, sf) { const wx = lerp(I.x0, I.tipX + 20, clamp(ts / 1.2)), a = ts < 1.4 ? 1 : 1 - (ts - 1.4) / .3; if (a > 0) { ctx.save(); ctx.beginPath(); ctx.rect(I.x0 - 2, I.ly - 16, Math.min(wx, I.tipX) - I.x0 + 2, 23); ctx.clip(); const g = ctx.createLinearGradient(wx - 60, 0, wx, 0); g.addColorStop(0, 'rgba(255,240,180,0)'); g.addColorStop(1, `rgba(255,240,180,${.55 * a})`); ctx.fillStyle = g; ctx.fillRect(wx - 60, I.ly - 16, 60, 23); ctx.restore(); }
      SW.fin(I, ts, sf); }, after: SW.after },
  D: { name: 'Swarm + ash rain', desc: 'Add-on: when the embers have filled the icon and it lights, it breathes out a soft burst and the embers drift back down as glowing ash, swaying, settling onto the magma along the bar with tiny ripples where they land.', finAt: 1.75,
    lift: (I, ts) => { const P = []; for (let q = 0; q < 26; q++) { const land = 1.85 + rnd53(q + 800) * 1 + .55, a = ts - land; if (a >= 0 && a < .7) P.push([ash72x(I, q), a, .3]); } return ripple66(P); },
    fin(I, ts, sf) { SW.fin(I, ts, sf); if (ts < 1.85) return; for (let q = 0; q < 26; q++) { const st = 1.85 + rnd53(q + 800) * 1, a = ts - st; if (a < 0 || a > .55) continue; const u = a / .55, x0 = ux69(I) - 4, tx = ash72x(I, q), x = lerp(x0, tx, u) + Math.sin(a * 7 + q) * 3, y = lerp(I.ly - 14 - rnd53(q) * 6, sf(tx), u * u);
        ctx.save(); ctx.globalAlpha *= .9; ctx.fillStyle = q % 2 ? '#ffb070' : '#ffe0b0'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 3; ctx.beginPath(); ctx.arc(x, y, 1, 0, 7); ctx.fill(); ctx.restore(); } if (ts >= 1.85) once('ar', () => [0, 1, 2].forEach(q => bell45(1046 * semi(PENT42[4 - q]), q * .3, .0025))); },
    after: SW.after },
  E: INGOTS72, F: BLADE72,
};
const ash72x = (I, q) => lerp(I.x0 + 6, I.tipX - 4, rnd53(q + 801));
function r72(K) { const F = FIN72[K], V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Blacksmithing as picked. Reaching the next unlock: ' + F.desc + ' (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'finale: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K > 'D' ? 'A' : K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; } } }; }
Object.assign(FAM, { PA: r72('A'), PB: r72('B'), PC: r72('C'), PD: r72('D'), PE: r72('E'), PF: r72('F') });

// The blade (BLADE72, sword72) and round 73 (cart, upright blade, r73), moved out 2026-11-15; the ingots and NOSWARM72 stay.
// ---- F: the blade, clean: a whole sword (blade with a fuller, gold crossguard, wrapped grip, pommel) rises smoothly out of the magma, the magma sheeting off
// in drips and its heat lifting off as an ember swarm; it cools to steel; a glint runs down the edge to the tip; it turns its point to the icon and flies in.
function sword72(x0, x1, y, hot, rot = 0, sc = 1) { const L = x1 - x0, cx = (x0 + x1) / 2; ctx.save(); ctx.translate(cx, y); ctx.rotate(rot); ctx.scale(sc, sc); const a = -L / 2, b = L / 2, gx = a + 13;
  const g = ctx.createLinearGradient(0, -2.6, 0, 2.6); g.addColorStop(0, mix('#f0f4f8', '#fff4c8', hot)); g.addColorStop(.5, mix('#aab4be', '#ffa040', hot)); g.addColorStop(1, mix('#6a7480', '#d8460e', hot)); if (hot > 0) { ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 8 * hot; }
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(gx, -2.5); ctx.lineTo(b - 9, -2.5); ctx.lineTo(b, 0); ctx.lineTo(b - 9, 2.5); ctx.lineTo(gx, 2.5); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(40,46,54,${.5 - hot * .3})`; ctx.fillRect(gx + 3, -.5, L - 30, 1); ctx.fillStyle = mix('#c89a40', '#ffd890', hot * .5); ctx.beginPath(); ctx.roundRect(gx - 2.5, -6, 2.8, 12, 1); ctx.fill();
  ctx.fillStyle = '#3a2416'; ctx.fillRect(a + 3, -1.6, gx - a - 5.5, 3.2); ctx.fillStyle = '#6a4a2a'; for (let k = 0; k < 3; k++) ctx.fillRect(a + 4 + k * 2.6, -1.6, 1, 3.2); ctx.fillStyle = '#c89a40'; ctx.beginPath(); ctx.arc(a + 2.2, 0, 2.2, 0, 7); ctx.fill(); ctx.restore(); }
const BLADE72 = { name: 'The blade rises (clean)', finAt: 2.15, desc: 'Clean and satisfying: a whole sword (a blade with a fuller, a gold crossguard, a wrapped grip and pommel) rises smoothly out of the magma along the bar, the magma sheeting off it in drips and its heat lifting off as an ember swarm into the icon; it cools from glowing orange to steel; a glint runs down the edge and sparkles at the tip; then it turns its point to the icon and flies in, and the icon lights.',
  lift: (I, ts) => { const a = ts < .7 ? 1.4 * Math.sin(Math.PI * ts / .7) : 0; return x => a; },
  fin(I, ts, sf) { const xa = I.x0 + 18, xb = Math.min(I.x1 - 12, I.tipX - 6), ux = ux69(I), rise = eOut(clamp(ts / .7)), hot = clamp(1 - (ts - .35) / .75), fly = ts > 1.5 ? clamp((ts - 1.5) / .45) : 0; if (fly >= 1) return;
    const e = fly * fly * (3 - 2 * fly), y = lerp(I.ly + 8 - rise * 18, I.ly - 2, e), dx = lerp(0, ux - (xa + xb) / 2, e), rot = ts > 1.35 ? -.18 * Math.sin(Math.PI * clamp((ts - 1.35) / .6)) : 0, sc = 1 - e * .8;
    ctx.save(); if (ts < .75) { ctx.beginPath(); ctx.rect(I.x0 - 40, I.ly - 40, I.x1 - I.x0 + 100, 40 - 5 + (ts > .7 ? 20 : 0)); ctx.clip(); } sword72(xa + dx, xb + dx, y, hot, rot, sc); ctx.restore();
    if (ts > .2 && ts < 1) once('dr' + Math.floor(ts / .06), () => spawn({ x: lerp(xa + 14, xb, Math.random()), y: y + 3, vy: 6, g: 240, life: .35, size: 1.1, col: '#ff9a3a' }));
    if (ts > .85 && ts < 1.25) { const gx = lerp(xa + 14, xb - 2, (ts - .85) / .4); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillRect(gx - 5, y - 2.5, 5, 1.1); } if (ts > 1.2 && ts < 1.5) glint59(xb, y, 1 - (ts - 1.2) / .3, 5);
    if (fly > 0) for (let q = 0; q < 6; q++) { const v = Math.max(0, e - q * .05); glow58(lerp((xa + xb) / 2, ux, v), lerp(I.ly - 10, I.ly - 2, v), 3, .5 - q * .07); }
    swarm72(I, ts, { t0: .35, spread: .6, n: 50, src: q => [lerp(xa + 14, xb, rnd53(q + 600)), I.ly - 9] }); if (ts >= .35) once('bch', () => chime72(.05));
    if (ts > .85) once('bs', () => { bell45(1568, 0, .006); tone(2093, .05, .003, .3, 'sine', null, .002); }); if (ts > 1.5) once('bw', () => noise(0, .35, .018, 1100, .6, 'lowpass')); },
  after: (I, ts) => blaze69(ux69(I), I.ly, ts > 1.92 ? Math.min(1, (ts - 1.92) / .12) * Math.max(0, 1 - (ts - 2.04) / .5) : 0) };
// ---------- round 73 (2026-11-15): iterate the ingots and the blade, WITHOUT the ember swarm. A/B the ingots (crate / mine cart), C/D the blade (lying / upright) ----------
// B: a mine cart below the bar's end; the row of ingots slides along the bar step by step like a conveyor, and each one tips off the end into the cart
function cart73(x, y, n, wheel) { ctx.save(); ctx.fillStyle = '#3a3c42'; ctx.beginPath(); ctx.moveTo(x - 14, y - 7); ctx.lineTo(x + 14, y - 7); ctx.lineTo(x + 11, y + 3); ctx.lineTo(x - 11, y + 3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a5e68'; ctx.fillRect(x - 14, y - 7, 28, 2); ctx.fillStyle = '#7a4a24'; ctx.fillRect(x - 10, y - 3, 20, 1.2);
  for (let j = 0; j < Math.min(n, 7); j++) { const row = j < 4 ? 0 : 1, col = row ? j - 4 : j, m = row ? 3 : 4; ing72(x + (col - (m - 1) / 2) * 6 - 3, x + (col - (m - 1) / 2) * 6 + 3, y - 8.5 - row * 3, 1, .55); }
  [-7, 7].forEach(dx => { ctx.fillStyle = '#1e2024'; ctx.beginPath(); ctx.arc(x + dx, y + 4.5, 2.6, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a8e96'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(x + dx, y + 4.5); ctx.lineTo(x + dx + Math.cos(wheel) * 2.2, y + 4.5 + Math.sin(wheel) * 2.2); ctx.stroke(); }); ctx.restore(); }
const step73 = j => 1.15 + j * .15;
const steps73 = ts => { let s = 0; for (let j = 0; j < N72; j++) s += eOut(clamp((ts - step73(j)) / .12)); return s; };
const CART73 = { name: 'Ingots onto a cart', finAt: 2.75, desc: 'The same clean start (a bright cut sweeps the bar into seven moulds, a cooling wave turns them to iron, a shine runs along them). A mine cart rolls in on a short track under the bar’s end; then the row of ingots slides along the bar step by step like a conveyor, and each time the end one tips off and drops into the cart with a clink, the cart dipping; the cart fills, then rolls away on its track and the icon lights.',
  lift: () => () => 0, tip: (I, ts) => ts < .37 ? null : ts < 2.75 ? I.x0 : lerp(I.x0, I.tipX, eOut(clamp((ts - 2.75) / .5))),
  cart: (I, ts) => { const ux = ux69(I), into = eOut(clamp((ts - .85) / .3)), away = ts > 2.3 ? clamp((ts - 2.3) / .45) : 0, n = Math.floor(clamp(steps73(ts) - .55, 0, 7) + (steps73(ts) >= 7 ? 1 : 0)), dip = [...Array(N72).keys()].reduce((m, j) => { const a = ts - step73(j) - .2; return Math.max(m, a >= 0 && a < .16 ? Math.sin(Math.PI * a / .16) * 1.6 : 0); }, 0);
    return { x: ux + 40 * (1 - into) + 50 * away * away, y: I.ly + 15 + dip, n: Math.min(7, Math.floor(steps73(ts))), a: 1 - away, wheel: ts * 9 * ((1 - into) > .01 || away > 0 ? 1 : 0) }; },
  fin(I, ts) { const w = (I.x1 - I.x0) / N72, end = I.x1 + 1, st = steps73(ts);
    for (let k = 0; k < N72; k++) { const [xa, xb] = seg72(I, k); if (ts >= cut72(k)) once('ct' + k, () => tone(1318 * semi(PENT42[k]), 0, .003, .12, 'sine', null, .002));
      if (ts < .37) { if (ts >= cut72(k) && k < N72 - 1) { ctx.fillStyle = 'rgba(30,10,4,.9)'; ctx.fillRect(xb + .1, I.ly - 7, 2.2, 13); } continue; }
      const cool = clamp((ts - cool72(k)) / .3), off = Math.min(st, N72 - 1 - k) * w, tp = st - (N72 - 1 - k);
      if (tp <= 0) ing72(xa + off, xb + off, I.ly + .5, cool); else if (tp < 1) { const C = CART73.cart(I, ts), sx = xb + off - 2, u = tp; ctx.save(); ctx.translate(lerp(sx, C.x, u), lerp(I.ly + .5, C.y - 9, u * u)); ctx.rotate(u * 1.2); ing72(-(xb - xa) / 2, (xb - xa) / 2, 0, 1, 1 - u * .45); ctx.restore(); }
      else once('cl' + k, () => { mallet(587 * semi(PENT42[(N72 - 1 - k) % 7]), 0, .014); tone(1760 * semi(PENT42[k % 5]), .01, .0025, .15, 'sine', null, .002); }); }
    if (ts < .37) { const lx = lerp(I.x0, I.x1, clamp((ts - .05) / .3)); glow58(lx, I.ly, 8, .8); ctx.fillStyle = '#fff6d8'; ctx.fillRect(lx - .8, I.ly - 7, 1.6, 14); }
    if (ts > .75 && ts < 1.05) { const sx = lerp(I.x0, I.x1, (ts - .75) / .3); ctx.save(); ctx.beginPath(); ctx.rect(I.x0, I.ly - 6, I.x1 - I.x0, 13); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(sx - 8, I.ly - 5, 8, 2); ctx.restore(); }
    if (ts > .85) once('cr', () => noise(0, .35, .014, 700, .6, 'lowpass')); if (ts > 2.3) once('ca', () => noise(0, .5, .014, 600, .6, 'lowpass')); },
  after: (I, ts) => { if (ts > .85 && ts < 2.75) { const C = CART73.cart(I, ts), ux = ux69(I); ctx.save(); ctx.globalAlpha *= C.a; ctx.fillStyle = 'rgba(90,70,50,.7)'; ctx.fillRect(ux - 22, I.ly + 22.5, 70, 1.3); cart73(C.x, C.y, C.n, C.wheel); ctx.restore(); }
    if (ts >= 2.4) blaze69(ux69(I), I.ly, Math.min(1, (ts - 2.4) / .2) * Math.max(0, 1 - Math.max(0, ts - 2.75) / .4)); } };
// D: the sword rises UPRIGHT, point first, out of the head of the magma; a glint climbs its edge; it tips over and flies into the icon
const UPRIGHT73 = { name: 'The blade rises upright', finAt: 2.1, desc: 'The sword rises point first out of the magma at the head of the bar and stands upright (glowing, magma sliding down it in drips), cools to steel; a glint climbs the edge to the point and sparkles; then it tips over, turning its point to the icon, and flies in; the icon lights.',
  lift: (I, ts) => { const hx = I.tipX - 12, a = ts < .7 ? 2.5 * Math.sin(Math.PI * ts / .7) : 0; return x => a * Math.exp(-Math.pow((x - hx) / 8, 2)); },
  fin(I, ts) { const hx = Math.min(I.x1 - 16, I.tipX - 12), ux = ux69(I), rise = eOut(clamp(ts / .75)), hot = clamp(1 - (ts - .35) / .75), fly = ts > 1.45 ? clamp((ts - 1.45) / .45) : 0; if (fly >= 1) return; const e = fly * fly * (3 - 2 * fly), L = 30;
    const cx = lerp(hx, ux, e), cy = lerp(I.ly + 22 - rise * 32, I.ly - 2, e), rot = -Math.PI / 2 + (ts > 1.3 ? Math.PI / 2 * eOut(clamp((ts - 1.3) / .4)) : 0), sc = 1 - e * .8;
    ctx.save(); if (ts < .8) { ctx.beginPath(); ctx.rect(I.x0 - 40, I.ly - 60, I.x1 - I.x0 + 100, 55); ctx.clip(); } sword72(cx - L / 2, cx + L / 2, cy, hot, rot, sc); ctx.restore();
    if (ts > .2 && ts < 1) once('ud' + Math.floor(ts / .07), () => spawn({ x: hx + (Math.random() - .5) * 4, y: cy - Math.random() * 10, vy: 12, g: 240, life: .4, size: 1.1, col: '#ff9a3a' }));
    if (ts > .85 && ts < 1.2) { const gy = lerp(cy + 10, cy - 13, (ts - .85) / .35); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillRect(hx - 2.5, gy, 1.2, 5); } if (ts > 1.15 && ts < 1.45) glint59(hx, cy - L / 2 + 1, 1 - (ts - 1.15) / .3, 5);
    if (ts > .85) once('us', () => { bell45(1568, 0, .006); tone(2093, .05, .003, .3, 'sine', null, .002); }); if (ts > 1.45) once('uw', () => noise(0, .35, .018, 1100, .6, 'lowpass')); if (ts > .05) once('ur', () => { noise(0, .6, .02, 300, .5, 'lowpass'); tone(98, .1, .015, .6, 'sine', null, .1); }); },
  after: (I, ts) => blaze69(ux69(I), I.ly, ts > 1.88 ? Math.min(1, (ts - 1.88) / .12) * Math.max(0, 1 - (ts - 2) / .5) : 0) };
const FIN73 = { A: Object.assign({}, INGOTS72, { name: 'Ingots into a crate' }), B: CART73, C: Object.assign({}, BLADE72, { name: 'The blade rises (lying)' }), D: UPRIGHT73 };
function r73(K) { const F = FIN73[K], V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Blacksmithing as picked. Reaching the next unlock (no ember swarm this round): ' + F.desc + ' (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'finale: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; NOSWARM72 = true; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; NOSWARM72 = false; } } }; }
Object.assign(FAM, { PA: r73('A'), PB: r73('B'), PC: r73('C'), PD: r73('D') });
delete FAM.PE; delete FAM.PF;

// Round 74 (ingot exits: dominoes, fuse, pyramid), moved out 2026-11-15.
// ---------- round 74 (2026-11-15): the blade scrapped; ingot finales that differ in what the ingots DO. A = into a crate (round 73 A); B dominoes;
// C slide together and fuse into one big ingot; D stack into a pyramid on top of the icon ----------
// the shared start: the cut sweeps the bar into seven moulds (0..0.37), a cooling wave turns them to iron (0.4..0.9); returns false while still magma
function form74(I, ts, k) { const [xa, xb] = seg72(I, k); if (ts >= cut72(k)) once('ct' + k, () => tone(1318 * semi(PENT42[k]), 0, .003, .12, 'sine', null, .002));
  if (ts < .37) { if (ts >= cut72(k) && k < N72 - 1) { ctx.fillStyle = 'rgba(30,10,4,.9)'; ctx.fillRect(xb + .1, I.ly - 7, 2.2, 13); } if (k === 0) { const lx = lerp(I.x0, I.x1, clamp((ts - .05) / .3)); glow58(lx, I.ly, 8, .8); ctx.fillStyle = '#fff6d8'; ctx.fillRect(lx - .8, I.ly - 7, 1.6, 14); } return false; }
  return clamp((ts - cool72(k)) / .3); }
const tip74 = end => (I, ts) => ts < .37 ? null : ts < end ? I.x0 : lerp(I.x0, I.tipX, eOut(clamp((ts - end) / .5)));
const clack74 = k => { mallet(523 * semi(PENT42[k % 7]), 0, .013); tone(1568 * semi(PENT42[(k + 2) % 7]), .005, .002, .1, 'sine', null, .002); };
// B: dominoes: the ingots stand up on end one by one, then topple in a chain toward the end; the last falls onto the icon
const stand74 = k => .95 + k * .06, fall74 = k => 1.55 + k * .11;
const DOM74 = { name: 'Dominoes', finAt: 2.45, desc: 'The ingots stand up on end one by one along the bar like dominoes; then the first tips over and knocks down the next, a chain of clacks running toward the end, each a note higher, and the last one falls onto the icon, which lights.',
  lift: () => () => 0, tip: tip74(2.45),
  fin(I, ts) { for (let k = 0; k < N72; k++) { const cool = form74(I, ts, k); if (cool === false) continue; const [xa, xb] = seg72(I, k), cx = (xa + xb) / 2, up = eOut(clamp((ts - stand74(k)) / .18)), f = clamp((ts - fall74(k)) / .16), fe = f * f;
      if (up <= 0) { ing72(xa, xb, I.ly + .5, cool); continue; } if (f >= 1) once('dm' + k, () => clack74(k));
      const ang = (Math.PI / 2) * (up - fe), px = cx - 6, py = I.ly + 5; ctx.save(); ctx.translate(px, py); ctx.rotate(-ang); ing72(0, 20, -4.5, cool, .9); ctx.restore(); } },
  after: (I, ts) => { if (ts >= fall74(N72 - 1) + .16) blaze69(ux69(I), I.ly, Math.min(1, (ts - fall74(N72 - 1) - .16) / .15) * Math.max(0, 1 - Math.max(0, ts - 2.3) / .4)); } };
// C: the ingots slide together toward the end, clacking into a row, then fuse with a flash into one big gleaming ingot that hops into the icon
const slide74 = k => .95 + (N72 - 1 - k) * .07;
const FUSE74 = { name: 'Fuse into one', finAt: 2.35, desc: 'The ingots slide together toward the end of the bar, each clacking into the one ahead, until they sit in a tight row; they fuse with a flash into one big, gleaming ingot (a shine runs across it), which hops into the icon; the icon lights.',
  lift: () => () => 0, tip: tip74(2.35),
  fin(I, ts) { const w = (I.x1 - I.x0) / N72, gx = I.x1 - 4; if (ts < 1.55) { for (let k = 0; k < N72; k++) { const cool = form74(I, ts, k); if (cool === false) continue; const [xa, xb] = seg72(I, k), tx = gx - (N72 - k) * 9, u = eOut(clamp((ts - slide74(k)) / .22)), ox = lerp(xa, tx, u), sc = lerp(1, 9 / (xb - xa), u);
        ing72(ox, ox + (xb - xa) * sc, I.ly + .5, cool); if (u >= 1) once('fs' + k, () => clack74(N72 - 1 - k)); } return; }
    const f = clamp((ts - 1.55) / .15), hop = ts > 1.95 ? clamp((ts - 1.95) / .35) : 0, e = hop * hop * (3 - 2 * hop), ux = ux69(I), cx = lerp(gx - 31, ux, e), cy = lerp(I.ly - 1, I.ly - 2, e) - Math.sin(Math.PI * hop) * 12, s = 1 - e * .6;
    if (hop >= 1) return; once('fu', () => { bell45(784, 0, .008); tone(392, 0, .012, .6, 'sine', null, .02); }); if (f < 1) glow58(gx - 31, I.ly, 26, .9 * (1 - f));
    ing72(cx - 21.4, cx + 21.4, cy, 1, 1.45 * s); if (ts > 1.65 && ts < 1.95) { const sx = lerp(cx - 26, cx + 26, (ts - 1.65) / .3); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(sx - 4, cy - 5, 4, 2); } },
  after: (I, ts) => { if (ts >= 2.28) blaze69(ux69(I), I.ly, Math.min(1, (ts - 2.28) / .1) * Math.max(0, 1 - (ts - 2.4) / .4)); } };
// D: the ingots hop one by one from the end onto the top of the icon and stack into a little pyramid (4, 2, 1); a shine runs over it; the icon lights under it
const hop74 = k => 1 + (N72 - 1 - k) * .15, PYR74 = [[-9, 0], [-3, 0], [3, 0], [9, 0], [-3, -4.4], [3, -4.4], [0, -8.8]];
const PYRAMID74 = { name: 'Pyramid on the icon', finAt: 2.6, desc: 'One by one from the end, the ingots hop up off the bar and land on top of the icon, stacking into a neat little pyramid (four, then two, then one on top), each landing with a clack a note higher; a shine runs over the finished stack and the icon lights beneath it like a trophy.',
  lift: () => () => 0, tip: tip74(2.6),
  fin(I, ts) { const ux = ux69(I), base = I.ly - 15; for (let k = 0; k < N72; k++) { const cool = form74(I, ts, k); if (cool === false) continue; const [xa, xb] = seg72(I, k), j = N72 - 1 - k, u = (ts - hop74(k)) / .3;
      if (u < 0) ing72(xa, xb, I.ly + .5, cool); else if (u < 1) { const [px, py] = PYR74[j], e = u * u * (3 - 2 * u), x = lerp((xa + xb) / 2, ux + px, e), y = lerp(I.ly + .5, base + py, e) - Math.sin(Math.PI * u) * 12, hw = lerp((xb - xa) / 2, 5.6, e); ing72(x - hw, x + hw, y, 1, lerp(1, .5, e)); }
      else once('py' + k, () => clack74(j)); } },
  after: (I, ts) => { const ux = ux69(I), base = I.ly - 15; for (let k = 0; k < N72; k++) { const j = N72 - 1 - k; if (ts >= hop74(k) + .3) { const [px, py] = PYR74[j]; ing72(ux + px - 5.6, ux + px + 5.6, base + py, 1, .5); } }
    if (ts > 2.1 && ts < 2.45) { const sx = lerp(ux - 14, ux + 14, (ts - 2.1) / .35); ctx.save(); ctx.beginPath(); ctx.rect(ux - 13, base - 12, 26, 15); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(sx - 3, base - 12, 3, 15); ctx.restore(); }
    if (ts >= 2.4) blaze69(ux, I.ly, Math.min(1, (ts - 2.4) / .15) * Math.max(0, 1 - Math.max(0, ts - 2.7) / .5)); } };
const FIN74 = { A: Object.assign({}, INGOTS72, { name: 'Into a crate' }), B: DOM74, C: FUSE74, D: PYRAMID74 };
function r74(K) { const F = FIN74[K], V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Blacksmithing as picked. Reaching the next unlock: the magma hardens into ingots (a bright cut into seven moulds, a cooling wave to iron), then: ' + F.desc + ' (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'finale: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; NOSWARM72 = true; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; NOSWARM72 = false; } } }; }
Object.assign(FAM, { PA: r74('A'), PB: r74('B'), PC: r74('C'), PD: r74('D') });

// Round 75 formations (bead75, crack75, rise75, FORM75, r75), moved out 2026-11-15; hotGrad75 and riseOrder75 stay.
// B: the magma beads up: it pulls apart into seven wobbling blobs (necks thinning and snapping), each firms up into an ingot, then cools to iron
function bead75(I, ts) { const w = (I.x1 - I.x0) / N72;
  for (let k = 0; k < N72; k++) { const [xa, xb] = seg72(I, k), cx = (xa + xb) / 2, iw = xb - xa, u = clamp(ts / .45), firm = clamp((ts - .5) / .25), cool = clamp((ts - .78 - k * .04) / .3);
    if (firm < 1) { const bw = lerp(w + 1, iw * .9, eOut(u)), wob = 1 + .18 * Math.sin(ts * 26 + k) * Math.exp(-ts * 4) * u, bh = 11 * wob, r = lerp(1, 5, u); ctx.save(); ctx.globalAlpha *= 1 - firm; ctx.fillStyle = hotGrad75(I.ly - bh / 2, I.ly + bh / 2); ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.roundRect(cx - bw / 2 / wob, I.ly + 6 - bh, bw / wob, bh, r); ctx.fill(); ctx.restore();
      if (u < 1 && k < N72 - 1) { const nx = xb + .6, nh = 10 * (1 - eOut(u)); if (nh > .5) { ctx.fillStyle = '#ff9a34'; ctx.fillRect(nx - 1.5, I.ly + .5 - nh / 2, 3, nh); } } }
    if (firm > 0) ing72(xa, xb, I.ly + .5, cool, lerp(.85, 1, firm)); if (u >= 1) once('bd' + k, () => tone(1318 * semi(PENT42[k]), 0, .003, .12, 'sine', null, .002)); } }
// C: crust and shrink: the whole bar skins over dark, splits along seven seams (glowing cracks), then each piece shrinks as it cools, pulling into ingot shape, the glow in the gaps fading
function crack75(I, ts, sf) { const order = [3, 1, 5, 0, 6, 2, 4], crust = clamp(ts / .3);
  if (ts < .62) { ctx.save(); ctx.globalAlpha *= crust * .95; ctx.fillStyle = '#3a1a10'; ctx.beginPath(); ctx.moveTo(I.x0 - 2, I.ly + 6); for (let x = I.x0 - 2; x <= I.x1; x += 2) ctx.lineTo(x, sf(x) - .5); ctx.lineTo(I.x1, I.ly + 6); ctx.closePath(); ctx.fill(); ctx.restore();
    order.forEach((k, n) => { if (k === N72 - 1) return; const t0 = .3 + n * .045; if (ts < t0) return; once('ck' + k, () => mallet(220 * semi(PENT42[n]), 0, .01)); const [, xb] = seg72(I, k), x = xb + 1.2; ctx.save(); ctx.strokeStyle = '#ffd070'; ctx.lineWidth = 1.3; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 5; ctx.beginPath(); ctx.moveTo(x, sf(x)); ctx.quadraticCurveTo(x + 1.5, I.ly, x - .5, I.ly + 6); ctx.stroke(); ctx.restore(); }); return; }
  const sh = eOut(clamp((ts - .62) / .3)), gap = 1 - clamp((ts - .8) / .3); for (let k = 0; k < N72; k++) { const [xa, xb] = seg72(I, k), w = (I.x1 - I.x0) / N72, cx = (xa + xb) / 2, hw = lerp(w / 2 + .3, (xb - xa) / 2, sh);
    if (gap > 0 && k < N72 - 1) glow58(xb + 1.2, I.ly, 5, .6 * gap); ing72(cx - hw, cx + hw, I.ly + .5, lerp(.55, 1, clamp((ts - .7) / .4)), lerp(1.2, 1, sh)); } }
// D: rise from the depths: one by one, glowing ingots rise up out of the magma while its level sinks, magma sliding off them, until they sit in the empty channel and cool
function rise75(I, ts, sf) { for (let n = 0; n < N72; n++) { const k = riseOrder75[n], t0 = .05 + n * .1, u = eOut(clamp((ts - t0) / .35)); if (u <= 0) continue; const [xa, xb] = seg72(I, k), cx = (xa + xb) / 2, y = lerp(I.ly + 12, I.ly + .5, u), cool = clamp((ts - t0 - .4) / .35);
    ctx.save(); if (ts < 1) { ctx.beginPath(); ctx.moveTo(xa - 2, I.ly - 30); ctx.lineTo(xa - 2, sf(xa)); for (let x = xa; x <= xb + 2; x += 2) ctx.lineTo(x, sf(x)); ctx.lineTo(xb + 2, I.ly - 30); ctx.closePath(); ctx.clip(); } ing72(xa, xb, y, cool); ctx.restore();
    if (u > .1 && u < 1) once('rd' + k + '_' + Math.floor(ts / .07), () => spawn({ x: lerp(xa + 3, xb - 3, Math.random()), y: y + 2, vy: 6, g: 220, life: .3, size: 1, col: '#ff9a3a' })); if (u >= 1) once('rs' + k, () => tone(1046 * semi(PENT42[n]), 0, .003, .15, 'sine', null, .002)); } }
const FORM75 = {
  A: { name: 'Cut and cool', desc: 'As round 72 E: a bright cut sweeps along the bar and splits it into seven moulds, then a cooling wave runs along them, each turning from glowing orange to iron.' },
  B: { name: 'Beading up', desc: 'The magma pulls itself apart: necks thin and snap between seven wobbling blobs (like molten metal beading), each blob firms up into an ingot shape, then cools to iron.', draw: bead75, tip: (I, ts) => ts < 1.4 ? I.x0 : null },
  C: { name: 'Crust and shrink', desc: 'The whole bar skins over dark; seams crack open in it one after another, glowing; then each piece shrinks as it cools, pulling into an ingot’s shape, the glow in the gaps between them fading out.', draw: crack75, tip: (I, ts) => ts < .62 ? null : ts < 1.4 ? I.x0 : null },
  D: { name: 'Rise from the depths', desc: 'One by one, in no set order, glowing ingots rise up out of the magma, magma sliding off them in drips, while its level sinks; by the time the last one is up the channel is empty, and they cool to iron where they sit.', draw: rise75, lift: (I, ts) => { const d = 9 * eOut(clamp(ts / 1)); return x => -d; }, tip: (I, ts) => ts < 1 ? null : ts < 1.4 ? I.x0 : null },
};
function fin75(K) { const M = FORM75[K]; if (K === 'A') return Object.assign({}, INGOTS72, { name: M.name, desc: M.desc });
  return Object.assign({}, INGOTS72, { name: M.name, desc: M.desc, lift: M.lift || INGOTS72.lift,
    tip: (I, ts) => { const t = M.tip(I, ts); return t !== null ? t : ts >= 1.4 ? INGOTS72.tip(I, ts) : null; },
    fin(I, ts, sf) { for (let k = 0; k < N72; k++) once('ct' + k, () => {}); if (ts < 1.15) { M.draw(I, ts, sf); return; } INGOTS72.fin(I, ts, sf); } }); }
function r75(K) { const F = fin75(K), V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Reaching the next unlock: how the ingots are made. ' + F.desc + ' Then the same ending for all four: a crate drops in, the ingots fly in and stack, a lid, the crate glides off, the icon lights. (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'ingots: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; NOSWARM72 = true; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; NOSWARM72 = false; } } }; }
Object.assign(FAM, { PA: r75('A'), PB: r75('B'), PC: r75('C'), PD: r75('D') });

// Round 76 options (FORM76, fin76, r76), moved out 2026-11-15; blob76, riseBead76, shaped76, beadUp76 stay.
const FORM76 = {
  A: { name: 'Rising beads', desc: 'B + D: in no set order, molten beads rise up out of the magma (dripping, wobbling) while its level sinks; then each one firms into an ingot and cools to iron where it sits.',
    sink: true, draw(I, ts, sf) { riseOrder75.forEach((k, n) => { const t0 = .05 + n * .1, firm = clamp((ts - t0 - .5) / .25); if (firm < 1) riseBead76(I, ts, sf, k, n); if (firm > 0) { const [xa, xb] = seg72(I, k); ctx.save(); ctx.globalAlpha *= firm; ing72(xa, xb, I.ly + .5, clamp((ts - t0 - .75) / .3)); ctx.restore(); } }); } },
  B: { name: 'Beads, then the blink', desc: 'The magma beads up into seven wobbling molten beads and they sit glowing for a moment; then, fast, left to right, each is struck in a white blink and snaps into an ingot (a squash that springs back, a few sparks, a soft tap a step higher each), rat-a-tat along the bar; then a cooling wave turns them to iron.',
    draw(I, ts) { for (let k = 0; k < N72; k++) { const b = blink76(I, k, ts, .8 + k * .08, false); if (!b) beadUp76(I, ts, k); else shaped76(I, k, ts, b, clamp((ts - 1.32 - k * .03) / .25)); } } },
  C: { name: 'Rising beads, then the blink', desc: 'Both: molten beads rise out of the sinking magma in no set order and sit wobbling; then the blink runs left to right, each bead struck in a flash and snapped into an ingot; a quick cooling wave turns them to iron.',
    sink: true, draw(I, ts, sf) { riseOrder75.forEach((k, n) => { const b = blink76(I, k, ts, 1.02 + k * .08, false); if (!b) riseBead76(I, ts, sf, k, n); else shaped76(I, k, ts, b, clamp((ts - 1.5 - k * .02) / .15)); }); } },
  D: { name: 'Blink to iron', desc: 'Like B, but each blink does it all at once: the bead is struck, snaps into an ingot and goes from glowing orange to iron in the same flash, so a crisp line of finished iron ingots races left to right along the bar.',
    draw(I, ts) { for (let k = 0; k < N72; k++) { const b = blink76(I, k, ts, .8 + k * .08, true); if (!b) beadUp76(I, ts, k); else shaped76(I, k, ts, b, 0); } } },
};
function fin76(K) { const M = FORM76[K], X = INGOTS72;
  return Object.assign({}, X, { name: M.name, desc: M.desc, finAt: X.finAt + SH76,
    lift: M.sink ? ((I, ts) => { const d = 9 * eOut(clamp(ts / 1)); return x => -d; }) : X.lift,
    tip: (I, ts) => M.sink ? (ts < 1 ? null : ts < 1.65 ? I.x0 : X.tip(I, ts - SH76)) : (ts < 1.65 ? I.x0 : X.tip(I, ts - SH76)),
    fin(I, ts, sf) { for (let k = 0; k < N72; k++) once('ct' + k, () => {}); if (ts < 1.65) { M.draw(I, ts, sf); return; } X.fin(I, ts - SH76, sf); },
    after: (I, ts) => X.after(I, ts - SH76) }); }
function r76(K) { const F = fin76(K), V = V69(F), g0 = V.grow; V.grow = (p, x0, y, Ln, f, t, I) => { const ts = S.closeAt === undefined ? -1 : S.age - S.closeAt; FILL70 = F.tip && ts >= 0 ? F.tip(I, ts) : null; g0(p, x0, y, Ln, f, t, I); };
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? F.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
  get desc() { return profName === 'Blacksmithing' ? 'Reaching the next unlock: how the ingots are made. ' + F.desc + ' Then the same crate ending for all four. (Pick “Reaching the next unlock”; placeholder sounds.)' : 'One profession at a time: this round is Blacksmithing’s finale. Others show their current look.'; },
  get note() { return profName === 'Blacksmithing' ? 'ingots: ' + F.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Mining') return r52('A').draw(top); if (profName !== 'Blacksmithing') return r47(K).draw(top);
    const snd0 = S.p.snd, hit0 = S.p.hit; S.p.snd = () => {}; S.p.hit = () => {}; NOSWARM72 = true; TEX62.G66 = (xa, xb, ly, bot, t, surf) => bandsGrad66(xa, xb, ly, bot, t, surf, null);
    try { barModule(top, 'M', V); } finally { S.p.snd = snd0; S.p.hit = hit0; MAGLIFT = null; FILL70 = null; NOSWARM72 = false; } } }; }
Object.assign(FAM, { PA: r76('A'), PB: r76('B'), PC: r76('C'), PD: r76('D') });

// Round 78 pounds (pound78, SND78, r78), moved out 2026-11-15; rev78 stays.
// one pound: a low sine body with a small natural drop, a muffled noise thump; dry to the output and a send into the reverb
function pound78(t, f, vol, send, len = 2.2) { if (!on()) return; const A = ac(), T = A.currentTime + t, R = rev78(len), g = A.createGain(), s = A.createGain(); g.connect(OUT); s.gain.value = send; g.connect(s).connect(R.cv);
  const o = A.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.25, T); o.frequency.exponentialRampToValueAtTime(f, T + .08); const og = A.createGain(); og.gain.setValueAtTime(0, T); og.gain.linearRampToValueAtTime(vol, T + .004); og.gain.exponentialRampToValueAtTime(.0001, T + .7); o.connect(og).connect(g); o.start(T); o.stop(T + .75);
  const n = Math.floor(A.sampleRate * .12), nb = A.createBuffer(1, n, A.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / n * 7); const ns = A.createBufferSource(), lp = A.createBiquadFilter(), ng = A.createGain(); ns.buffer = nb; lp.type = 'lowpass'; lp.frequency.value = 280; ng.gain.value = vol * 1.4; ns.connect(lp).connect(ng).connect(g); ns.start(T); }
const SND78 = {
  A: { name: 'Low pound, big hall', desc: 'One deep, low pound (a soft body, no ring) that blooms into a long dark reverb, like a hammer-fall heard across the Great Forge.', play: () => pound78(0, 52, .09, .9, 2.6) },
  B: { name: 'Double pound', desc: 'Two pounds, the second lower and heavier (doom… DOOM), in a medium reverb.', play: () => { pound78(0, 62, .06, .6, 1.8); pound78(.2, 46, .095, .8, 1.8); } },
  C: { name: 'Pound + forge breath', desc: 'The low pound with reverb, and under it a soft rush of air, like the forge’s bellows exhaling, swelling and fading into the reverb.', play: () => { pound78(0, 52, .085, .8, 2.2); noise(.02, 1.1, .022, 220, .5, 'lowpass'); } },
  D: { name: 'Short room pound', desc: 'A tighter version: the low pound in a small stone room (a short, close reverb), punchy and done quickly.', play: () => pound78(0, 56, .1, .7, .9) },
};
function r78(K) { const B = r77('C'), S8 = SND78[K];
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? S8.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
    get desc() { return profName === 'Blacksmithing' ? 'The finale as locked (rising beads, struck to iron with crunch + scale, the crate). Its closing sound, when the icon lights: ' + S8.desc + ' (Sound on; pick “Reaching the next unlock”.)' : 'One profession at a time: this round is Blacksmithing’s finale sound. Others show their current look.'; },
    get note() { return profName === 'Blacksmithing' ? 'finale sound: ' + S8.name.toLowerCase() + '.' : 'the set bar.'; },
    draw(top) { window.FINSND78 = S8.play; try { B.draw(top); } finally { window.FINSND78 = null; } } }; }
Object.assign(FAM, { PA: r78('A'), PB: r78('B'), PC: r78('C'), PD: r78('D') });

// Round 77 strike sets A, B, D (C locked), moved out 2026-11-15.
  A: { name: 'Iron clank', desc: 'A short, dull metal clank (low and damped, the pitch varied) with a soft crunch; a fan of bright spark streaks bursting up and out from each ingot.',
    snd: (k, v) => { const f = 190 * semi(pick45(k, 2) / 2); tone(f, 0, .03 * v, .09, 'triangle', null, .001); tone(f * 2.6, 0, .008 * v, .04, 'triangle', null, .001); noise(0, .05, .03 * v, 1200, .8, 'lowpass', true); drum46(110, 0, .02 * v); },
    sparks: (x, y) => { for (let q = 0; q < 12; q++) { const an = -Math.PI / 2 + (q / 11 - .5) * 2.4, sp = 70 + Math.random() * 70; spawn({ x, y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, g: 340, life: .32 + Math.random() * .12, size: .9 + Math.random() * .5, col: q % 3 ? '#ffc060' : '#fff6d8' }); } } },
  B: { name: 'Heavy thud', desc: 'A deep, heavy thud with gravel in it (felt more than heard); a big shower of sparks thrown high that rain back down, and the bar kicks harder.',
    snd: (k, v) => { drum46(78 * semi(pick45(k, 2) / 3), 0, .04 * v); noise(0, .12, .035 * v, 520, .7, 'lowpass', true); tone(62, 0, .02 * v, .16, 'sine', null, .002); }, kick: 1.6,
    sparks: (x, y) => { for (let q = 0; q < 16; q++) spawn({ x: x + (Math.random() - .5) * 10, y, vx: (Math.random() - .5) * 120, vy: -90 - Math.random() * 90, g: 420, life: .55 + Math.random() * .2, size: .9 + Math.random() * .6, col: q % 3 ? '#ffb040' : '#ffe8b0' }); } },
  D: { name: 'Clank + ember spray', desc: 'The iron clank, but each strike also throws a short sideways spray of hot embers along the bar toward the next bead, so the sparks run ahead of the strikes like a fuse.',
    snd: (k, v) => SET77.A.snd(k, v),
    sparks: (x, y) => { for (let q = 0; q < 10; q++) spawn({ x, y: y + 1, vx: 60 + Math.random() * 90, vy: -30 - Math.random() * 40, g: 300, life: .3 + Math.random() * .15, size: .9 + Math.random() * .4, col: q % 3 ? '#ffb040' : '#fff0c0' }); for (let q = 0; q < 5; q++) spawn({ x, y, vx: (Math.random() - .5) * 60, vy: -70 - Math.random() * 40, g: 340, life: .3, size: .8, col: '#fff6d8' }); } },

// Dead Blacksmithing helpers (no longer used by live rounds), moved out 2026-11-15.
const heat58 = h => h < .5 ? mix('#2a0a04', '#c83a12', h / .5) : mix('#c83a12', '#ffc860', Math.min(1, (h - .5) / .5));
const iron59 = (x0, end, y) => { if (end <= x0) return; const g = ctx.createLinearGradient(x0, 0, end, 0); g.addColorStop(0, '#2a2c30'); g.addColorStop(Math.max(0, 1 - 24 / (end - x0)), '#3a3c42'); g.addColorStop(1, '#d0602a'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 5, end - x0 + 2, 10); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0 - 2, y - 5, end - x0 + 2, 1.5); };
const spot65 = (I, k, c, seed, lo = 0, hi = 1) => I.x0 + 8 + lerp(lo, hi, rnd53(k * 13 + c * 7 + seed)) * (I.tipX - I.x0 - 16);
const BOIL65 = (xa, xb, t) => xa + (xb - xa) * (.5 + .38 * Math.sin(t * .23 + 1));
function headPops67(I) { const out = [], t = S.age; for (let k = 0; k < HB67.n; k++) { const s = slot65(k, HB67.per, HB67.spread, HB67.seed, t); for (let j = 0; j < 2; j++) { const age = (s.ph - HB67.rise) * s.per + j * s.per; if (age >= 0 && age < 1.2) out.push([hbX67(I, k, s.c - j), age, .7]); } } return out; }
function headBubbles67(I, sf) { for (let k = 0; k < HB67.n; k++) { const { c, ph } = slot65(k, HB67.per, HB67.spread, HB67.seed, S.age), x = hbX67(I, k, c), y = sf(x); if (x < I.x0 + 4) continue;
    if (ph < HB67.rise) { const u = ph / HB67.rise, r = .8 + eOut(u) * 2.6; ctx.fillStyle = 'rgba(255,214,120,.95)'; ctx.beginPath(); ctx.arc(x, y + .3, r, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,255,235,.9)'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .4, Math.max(.3, r * .25), 0, 7); ctx.fill(); }
    else once('h67' + k + '_' + c, () => splat66(x, y, 3, false)); } }
const anvilBurst67 = (I, n = 8, big) => { const ax = I.x0 - 24; for (let q = 0; q < n; q++) spawn({ x: ax + 2, y: I.ly - 8, vx: 10 + Math.random() * (big ? 90 : 60), vy: -40 - Math.random() * (big ? 70 : 45), g: 260, life: .45, size: 1, col: q % 3 ? '#ffb040' : '#fff0c0' }); };
const glob67 = (x, y, r) => { ctx.save(); ctx.fillStyle = '#ffc860'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,230,.9)'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .35, r * .35, 0, 7); ctx.fill(); ctx.restore(); };
const SHOT67 = .35;
function shot67(I, i, t) { if (t < 0 || t >= SHOT67) return; const u = t / SHOT67, ax = I.x0 - 22, hx = I.X(S.v0 + i) - 3, x = lerp(ax, hx, u), y = lerp(I.ly - 9, I.ly - 7, u) - Math.sin(Math.PI * u) * 5;
  for (let q = 1; q <= 4; q++) { const v = Math.max(0, u - q * .05); glob67(lerp(ax, hx, v), lerp(I.ly - 9, I.ly - 7, v) - Math.sin(Math.PI * v) * 5, 2.4 - q * .45); } glob67(x, y, 2.8); }
const waveLeft67 = (I, i, t, ta, tb, a = 4.5) => { if (t < ta || t > tb + .1) return () => 0; const u = clamp((t - ta) / (tb - ta)), hx = I.X(S.v0 + i), wx = lerp(hx, I.x0, u * (2 - u)), amp = a * (u < .1 ? u / .1 : 1) * (t > tb ? 1 - (t - tb) / .1 : 1); return x => amp * Math.exp(-Math.pow((x - wx) / 8, 2)) + amp * .4 * Math.exp(-Math.pow((x - wx - 12) / 8, 2)); };
function iconFill69(I, k, dy = 0) { if (k <= 0) return; const x = ux69(I), y = I.ly + dy, s = 22, h = s * Math.min(1, k); ctx.save(); ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, 3); ctx.clip();
  const g = ctx.createLinearGradient(0, y + s / 2 - h, 0, y + s / 2); g.addColorStop(0, 'rgba(255,240,170,.85)'); g.addColorStop(.4, 'rgba(255,150,50,.75)'); g.addColorStop(1, 'rgba(200,60,14,.75)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - s / 2, y + s / 2);
  for (let xx = x - s / 2; xx <= x + s / 2; xx += 2) ctx.lineTo(xx, y + s / 2 - h + Math.sin(xx * .6 + S.age * 8) * .8); ctx.lineTo(x + s / 2, y + s / 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
const rumble69 = (v = 1) => { noise(0, .7, .035 * v, 180, .6, 'lowpass'); tone(55, 0, .03 * v, .9, 'sine', null, .08); };
const flame70 = (x, y, h, a, ph) => { if (a <= 0 || h <= .5) return; const w = h * .42 * (1 + .15 * Math.sin(ph * 9)), g = ctx.createLinearGradient(0, y - h, 0, y); g.addColorStop(0, 'rgba(255,240,170,0)'); g.addColorStop(.35, `rgba(255,210,110,${.85 * a})`); g.addColorStop(1, `rgba(255,110,30,${.9 * a})`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w, y - h * .55, x + Math.sin(ph * 6) * w * .5, y - h); ctx.quadraticCurveTo(x + w, y - h * .55, x + w, y); ctx.closePath(); ctx.fill(); };
const FIN71 = {
  C: { name: 'Ember swarm', finAt: 1.75, desc: 'Embers lift off the whole surface of the magma, hundreds of them, rise and gather into a swirling ribbon that streams along above the bar and pours into the icon, which glows hotter as they arrive and lights.',
    lift: () => () => 0,
    fin(I, ts, sf) { const ux = ux69(I); once('ec', () => [0, 1, 2, 3, 4].forEach(q => bell45(784 * semi(PENT42[q + 1]), .15 + q * .17, .004)));
      for (let q = 0; q < 70; q++) { const sx = lerp(I.x0 + 4, I.tipX - 2, rnd53(q * 3 + 300)), st = rnd53(q * 3 + 301) * .45, a = ts - st; if (a < 0) continue; const u = clamp((a - .2) / .85), y0 = sf(sx) - 1;
        if (u >= 1) continue; const lift = Math.min(1, a / .2) * 6, x = lerp(sx, ux, u * u), y = lerp(y0 - lift, I.ly, u * u) - Math.sin(Math.PI * u) * (3 + rnd53(q) * 4) + Math.sin(a * 9 + q) * 2 * (1 - u);
        ctx.save(); ctx.fillStyle = q % 3 ? '#ffb040' : '#fff0c0'; ctx.shadowColor = '#ff8a30'; ctx.shadowBlur = 4; ctx.beginPath(); ctx.arc(x, y, .9 + rnd53(q + 7) * .6, 0, 7); ctx.fill(); ctx.restore(); } },
    after: (I, ts) => blaze69(ux69(I), I.ly, clamp((ts - .55) / .9) * (ts > 1.6 ? Math.max(0, 1 - (ts - 1.6) / .4) : 1)) },
const surfSrc72 = (I, sf) => q => { const x = lerp(I.x0 + 4, I.tipX - 2, rnd53(q * 3 + 300)); return [x, sf(x) - 1]; };
const SW = FIN71.C;
const segCx75 = (I, k) => { const [xa, xb] = seg72(I, k); return (xa + xb) / 2; };
function blink76(I, k, ts, tb, toIron) { const [xa, xb] = seg72(I, k), a = ts - tb; if (a < 0) return null; once('bk' + k, () => { mallet(330 * semi(PENT42[k]), 0, .016); tone(1318 * semi(PENT42[k]), 0, .003, .08, 'sine', null, .001);
    for (let q = 0; q < 3; q++) spawn({ x: (xa + xb) / 2 + (q - 1) * 6, y: I.ly - 5, vx: (q - 1) * 30, vy: -30 - Math.random() * 20, g: 300, life: .3, size: .9, col: '#fff0c0' }); });
  const sq = a < .12 ? Math.sin(Math.PI * a / .12) : 0; return { sq, flash: Math.max(0, 1 - a / .1), cool: toIron ? clamp(a / .12) : 0 }; }
function beadUp76(I, ts, k) { const [xa, xb] = seg72(I, k), w = (I.x1 - I.x0) / N72, cx = (xa + xb) / 2, u = clamp(ts / .45), B = beadAt76(I, k, ts, Math.exp(-Math.max(0, ts - .45) * 2)), bw = lerp(w + 1, B.bw, eOut(u)), r = lerp(1, 5, u);
  blob76(cx, I.ly + .5, bw, B.bh, r); if (u < 1 && k < N72 - 1) { const nh = 10 * (1 - eOut(u)); if (nh > .5) { ctx.fillStyle = '#ff9a34'; ctx.fillRect(xb - .9, I.ly + .5 - nh / 2, 3, nh); } } }

// Round 79 booms (SND79, r79), moved out 2026-11-15; bus79/vox79/nz79 stay.
const SND79 = {
  A: { name: 'Punchy boom', desc: 'A tight, chunky boom: a kick that punches and drops, a saturated mid-range thump (the chunk you feel in your chest), a short crunchy burst, all in a medium reverb.',
    play() { if (!on()) return; const T = ac().currentTime, B = bus79(.45, 1.6, 3); vox79(B, T, 'sine', 150, 52, .5, .55); vox79(B, T, 'triangle', 110, 70, .22, .25); nz79(B, T, .18, .5, 'bandpass', 900, 300, 'hit', .9); nz79(B, T, .5, .3, 'lowpass', 180, 90, 'hit'); } },
  B: { name: 'Blast', desc: 'An explosion: a burst of noise that sweeps down from bright to dark like a blast wave, a deep rumble under it, a long rolling tail.',
    play() { if (!on()) return; const T = ac().currentTime, B = bus79(.7, 2.6, 2); nz79(B, T, .9, .55, 'lowpass', 2600, 160, 'hit', .7); vox79(B, T, 'sine', 90, 38, .45, 1.2, .01); nz79(B, T + .05, 1.6, .25, 'lowpass', 140, 60, 'flat'); } },
  C: { name: 'Swell + slam', desc: 'A short rising rush (half a second sucked in) that slams into a big chunky boom, like a trailer impact: the build makes the hit land harder.',
    play() { if (!on()) return; const T = ac().currentTime, B = bus79(.55, 2, 3); nz79(B, T, .45, .28, 'bandpass', 250, 1800, 'swell', 1.2); vox79(B, T, 'sawtooth', 55, 110, .06, .45, .4); const H = T + .45; vox79(B, H, 'sine', 160, 48, .55, .7); vox79(B, H, 'triangle', 120, 65, .25, .3); nz79(B, H, .22, .5, 'bandpass', 1000, 250, 'hit', .8); } },
  D: { name: 'Boss falls', desc: 'Like a JRPG boss dying: a low crumbling rumble that flickers in fast pulses (as if the thing flashes and breaks apart) and sinks, for about a second, then one last deep boom that rolls out into a long reverb.',
    play() { if (!on()) return; const T = ac().currentTime, B = bus79(.6, 2.8, 2.2); nz79(B, T, 1.1, .38, 'lowpass', 1400, 220, 'flat', .7, 14); vox79(B, T, 'sawtooth', 72, 40, .07, 1.1, .2); vox79(B, T, 'square', 36, 30, .04, 1.1, .3);
      const H = T + 1.05; vox79(B, H, 'sine', 140, 42, .55, 1); nz79(B, H, .3, .45, 'lowpass', 900, 150, 'hit'); } },
};
function r79(K) { const B = r77('C'), S9 = SND79[K];
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? S9.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
    get desc() { return profName === 'Blacksmithing' ? 'The finale as locked. Its closing sound, when the icon lights: ' + S9.desc + ' (Sound on; pick “Reaching the next unlock”.)' : 'One profession at a time: this round is Blacksmithing’s finale sound. Others show their current look.'; },
    get note() { return profName === 'Blacksmithing' ? 'finale sound: ' + S9.name.toLowerCase() + '.' : 'the set bar.'; },
    draw(top) { window.FINSND78 = () => S9.play(); try { B.draw(top); } finally { window.FINSND78 = null; } } }; }
Object.assign(FAM, { PA: r79('A'), PB: r79('B'), PC: r79('C'), PD: r79('D') });

// Round 81 (SET81, r81, pop81), moved out 2026-11-15; PS81 is re-declared by round 82.
let PS81 = null;
function pop81(t = 0, k = 1) { if (!on()) return; const T = ac().currentTime + t, B = bus79(.35, 1.2, 2.6); vox79(B, T, 'sine', 170 * k, 70 * k, .42, .4); vox79(B, T, 'triangle', 130 * k, 80 * k, .18, .2); nz79(B, T, .12, .4, 'bandpass', 1100, 400, 'hit', .9); }
const SET81 = {
  A: { name: 'Ting + boom', desc: 'As round 80 D: soft footstep scuffs, a dull thud on the grab, and when the icon lights the firing-pin ting and the punchy boom.', ps: null, fin: () => { ting80(); boom80(.13); } },
  B: { name: 'Scamper + pop', desc: 'Light, quick wooden pitter-patter footsteps (two soft notes, left-right), a little “hup” as the peon hoists the crate, an airy whoosh as it dashes off, and a rounder, bouncier pop with a tiny ting when the icon lights: cheeky rather than epic.',
    ps: { step: (i, fast) => mallet((i % 2 ? 392 : 330) * (fast ? 1.06 : 1), 0, .006), grab: () => { tone(170, 0, .02, .1, 'triangle', 230, .005); noise(0, .08, .012, 500, .8, 'lowpass'); }, dash: () => noise(0, .3, .016, 1400, .8, 'bandpass') },
    fin: () => { ting80(); pop81(.1); } },
  C: { name: 'Rattling crate', desc: 'Footsteps, and once the crate is up the ingots rattle and clatter inside it with every step (wooden and metal knocks, getting fainter as it runs off); a solid wooden thunk on the grab; the ting + punchy boom when the icon lights.',
    ps: { step: (i, fast) => { noise(0, .03, .008, 600, .7, 'lowpass', true); if (fast) { noise(0, .04, .02, 1300, 2, 'bandpass', true); tone(520 * semi(PENT42[i % 5]), .01, .004, .05, 'triangle', null, .001); } }, grab: () => { drum46(130, 0, .03); noise(0, .06, .02, 900, 1, 'bandpass', true); }, dash: () => {} },
    fin: () => { ting80(); boom80(.13); } },
  D: { name: 'Drum steps into the boom', desc: 'The footsteps are little drum hits that climb in pitch and quicken as the peon runs off, a drum roll building, and it lands on the punchy boom (no ting) when the icon lights: a rhythmic build into one big hit.',
    ps: { step: (i, fast) => drum46(fast ? 110 * semi((i % 8) * 1.5) : 98, 0, fast ? .016 + (i % 8) * .003 : .01), grab: () => drum46(82, 0, .03), dash: () => {} },
    fin: () => boom80() },
};
function r81(K) { const B = r80('D'), Z = SET81[K];
  return { get name() { return K + '. ' + (profName === 'Blacksmithing' ? Z.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining'].includes(profName) ? profName + ' (done)' : 'Blacksmithing only this round'); },
    get desc() { return profName === 'Blacksmithing' ? 'The finale as locked, with the peon running off with the crate. Its sounds: ' + Z.desc + ' (Sound on; pick “Reaching the next unlock”.)' : 'One profession at a time: this round is Blacksmithing’s finale sound. Others show their current look.'; },
    get note() { return profName === 'Blacksmithing' ? 'peon sounds: ' + Z.name.toLowerCase() + '.' : 'the set bar.'; },
    draw(top) { const p0 = SND80.D.play; SND80.D.play = Z.fin; PS81 = Z.ps; window.PS81 = Z.ps; try { B.draw(top); } finally { SND80.D.play = p0; PS81 = null; window.PS81 = null; } } }; }
Object.assign(FAM, { PA: r81('A'), PB: r81('B'), PC: r81('C'), PD: r81('D') });

// Round 80 sounds A-C and its slot assignment, moved out 2026-11-15 (D, the peon, stays).
  A: { name: 'Punchy boom', desc: 'Round 79 A as is: a tight kick that punches and drops, a saturated mid thump, a short crunch, a medium reverb.', play: () => boom80() },
  B: { name: 'Pin ting + boom', desc: 'A tiny, bright, dry “ting”, like a firing pin being struck, and a beat later the punchy boom goes off.', play: () => { ting80(); boom80(.13); } },
  C: { name: 'Last strike + boom', desc: 'The last metal being forged: one short, damped anvil clang with a bit of grit (not a bell), and right behind it the punchy boom.', play: () => { clang80(); boom80(.16); } },
Object.assign(FAM, { PA: r80('A'), PB: r80('B'), PC: r80('C'), PD: r80('D') });

// ===== comment lines moved out of skillup-p2.html on 2026-11-16 (page size); NNNN: = their old line numbers =====
// 70: // ---------- helpers ----------
// 86: // an item icon stand-in: an emoji in a white (item quality) border; lit 0..1 (dark until reached)
// 95: // ---------- sound: the mockups' helpers (tools/render-media.html), live ----------
// 99: // (the scene autoplays on load, before any click, so the browser starts the audio paused: resume it on the first click or key)
// 107: // ---------- the tools: the same drawings as in game (tools/render-media.html) ----------
// 119: // ---------- particles ----------
// 131: // ---------- professions: material, tool and its motion, what's next ----------
// 132: // span: what Ring and Segments fill (gatherers: last unlock -> next; crafters: the rank); cspan: Constellation's (the whole rank)
// 151:   // round 12: the other two gatherers (sample unlocks: beast levels you can skin, waters you can fish)
// 167: // the tool's motion: t seconds since the strike began (it lands at HIT); returns dx, dy, rot, sx, sy
// 180: // ---------- materials along a path (Ring's arc, Constellation's line) ----------
// 181: // path: s (0..1) -> { x, y, a (tangent) }; L: its length in px
// 215: // a Segments cell drawn in the material: lit 0..1 (left to right), age since it was lit
// 224:   // empty
// 238: // ---------- scene ----------
// 248: // the skill value now (float while filling) and the time since the last strike began
// 252: // strikes: the tool's sound (a step higher each in a row) and its particles, once per hit
// 266: // the reveal under the banner (shared): the new herb or ore drops in dark, lights with rings and glints
// 276: // ---------- the families ----------
// 295:       // closing: flash + shockwave
// 302:       // the tool at the head, outside the ring (under the seam's icon)
// 305:       // the seam: the next unlock waits where the ring closes
// 339:       // the milestones on the ring
// 365:       // the stars: every unlock in the rank (crafters: milestones and the rank cap)
// 405:   // ---------- Phase 2 (2026-11-14): new designs from what the crafting picks taught (tools act on the ring, punchy beats,
// 406:   // the ring as the material, the item in the middle); A is the Phase 1 lock (Ring + road)
// 431:         // beside it: the name, the number and the road (gatherers) or the rank cap (crafters)
// 471:       // the tool: on its stone, hopping to the next one on each skill-up (lands at the strike)
// 479:   // ---------- Phase 2 round 2 (2026-11-14): skill-ups as their own draggable module (shown at its default place), each
// 480:   // option a different mechanism: the number (B), distance (C), the tool as the gauge (D)
// 490:       // the counter: each digit on its own drum
// 496:       // the line to the next unlock, in the material
// 515:       // the dotted way still to go
// 517:       // your ring: the skill number in the profession's color
// 537:       // the swing at the unlock: lifts, then strikes the icon to its right
// 554:   // ---------- Phase 2 round 3 (2026-11-14, after the budget rule): each carried by something no other option uses:
// 555:   // the reward's picture completing (B), the impact itself (C), pitch and light (D)
// 626:       // the scale under the bell: eight dots, the struck note lit
// 642:   // ---------- Phase 2 round 4 (2026-11-14): the A + D direction (resonance: sound and light), each carried differently:
// 643:   // the arc filling and ringing (B), how far the light reaches (C), a string going from slack to taut (D)
// 657:       // the light pool: everything the ripples have reached so far
// 661:       // the road as circles: the next unlock nearest, the ones after further out; icons sit on them to the upper right
// 666:       // this strike's ripple travelling out to the new reach
// 668:       // the bell
// 692:       // the string: a quadratic from your ring to the unlock, the vibration on its middle
// 696:       // knobs at both ends
// 698:       // your skill: a small ring with the number
// 708:   // ---------- Phase 2 round 5 (2026-11-14): progression first, each carried differently: where you stand on the whole
// 709:   // career (B), height you build (C), a goal you travel toward (D)
// 724:       // the ranks: tinted bands with their names
// 728:       // ticks: every 5 levels, numbers every 25 (zoomed in)
// 731:       // the line: the whole career dim, your trail lit in the material, the tool at the head
// 733:       // the unlocks on the line
// 757:       // rails
// 759:       // the ledges: the next unlocks at their levels (crafters: the rank cap)
// 766:       // the blocks (settled), then the falling one
// 789:       // the horizon glow and the road
// 794:       // the marks: one per skill point, flowing toward you; lit in the material color once passed
// 798:       // the unlocks standing on the road (the next one, then the ones after)
// 808:   // ---------- round 6 (2026-11-14): A vs B, each dressed per profession, to judge which frame customizes best
// 814:   // ---------- round 7 (2026-11-14): compact, no ring and no tool (no echo of the craft ring); each with an obvious
// 815:   // per-profession slot: the pip (B), what fills the icon (C), how the digit changes (D)
// 875:   // ---------- round 8 (2026-11-14): B and C of round 7 again; B without the repeated icons, C cleaner (nothing covers the icon)
// 921:   // ---------- round 9 (2026-11-14): the container idea, three different ways (no blocky frame); A = One notched line
// 930:       // inside the vessel
// 934:       // the delivery from above, per profession
// 957:       // the goal line and the ground
// 985:   // ---------- round 10 (2026-11-15): the tighter layout (rank, points to go, what comes after) and two bold ways
// 996:       // the notches up the side; the top one (the brim) is gold
// 1022:       // line 1: name, skill / cap, rank
// 1028:       // line 3: the unlock by name, points to go, what comes after
// 1071:   // ---------- round 11 (2026-11-15): add-ons to round 10 B (it grows along the line); A = B as it is
// 1081: // round 11: the grows-along-the-line module with its add-on (mode: plain, tip, road, unlock)
// 1101:   // the growth (road: from where the stretch began, so it slides off on the way to the next; finale: eaten from the left into the icon)
// 1120: // ---------- round 12 (2026-11-15): per profession, gatherers: four ways the line grows for each ----------
// 1202: // ---------- round 13 (2026-11-15): the gatherers again, from the round 12 feedback (Fishing: the cast + the reel, then add-ons;
// 1203: // Skinning: add-ons to the cut; Herbalism: the vine + three different mechanisms; Mining: four new ones) ----------
// 1206: // Fishing: the reel at the start of the line (the spool empties as line goes out), the line, the bobber
// 1221: // Skinning: the cut as round 12 drew it
// 1223: // Herbalism B: the plant at the tip, stage by how near the unlock is (f), bl = bloom 0..1
// 1232: // Mining B: the color of the vein by heat (1 = white-hot at the tip)
// 1328: // ---------- round 14 (2026-11-15): bolder add-ons (Fishing on rod and reel + taut line + a bite, Skinning on the cut + a stroke
// 1329: // per skill-up, Herbalism on the vine) and four Mining bases to compare ----------
// 1452: // ---------- round 15 (2026-11-15): a cleaner base. Four frames for the same growth (each profession's current base) ----------
// 1453: // The 1.3 banner was liked for being clean and quick: these strip the frame back; the growth and unlocks stay.
// 1501: // ---------- round 16 (2026-11-15): B "Just a line" picked; four ways to keep it readable on any ground ----------
// 1515: // ---------- round 17 (2026-11-15): Just a line on a fading strip (no outlines; the shade looked too big); Fishing redrawn to read ----------
// 1532: // ---------- round 18 (2026-11-15): back to a skill bar, like 1.3 ("the clear show that a skill bar was increasing") ----------
// 1533: // The header has no backing (the game's text shadow); the bar is its own backing. Like the craft rings' tools, parts may
// 1534: // reach outside the bar. Four ways each profession's current base sits in the bar.
// 1550:   // header: no backing, the game's text shadow
// 1553:   // the bar: dark track, thin border
// 1577: // ---------- round 19 (2026-11-15): the header and the bar are set (round 18); how the growth sits in it is per profession ----------
// 1578: // Herbalism breaks out (round 18 B), Mining and Skinning stay inside (A), Fishing: the whole bar is water, its top is the
// 1579: // water's surface (no border there) and the bobber floats on it at the fill's front. A-D: four ways to draw that surface.
// 1600:   // the bobber floats on the surface at the fill's front; each skill-up it dips under with a splash
// 1602:   // round 20: the reel and line from round 14 A, attached at the bar's start (like the tools on the craft rings): the reel
// 1603:   // pays out line with clicks; each skill-up the line snaps taut with a twang and shivers, then slowly sags to the water
// 1618: // ---------- round 21 (2026-11-15): Fishing locked; new Mining options and one more pass for Herbalism and Skinning, in the set bar ----------
// 1619: // Herbalism breaks out (the 6 px bar), Mining and Skinning stay inside; parts may attach outside like Fishing's reel; no tool riding.
// 1696: // ---------- round 22 (2026-11-15): Mining = the tunnel + the mine cart (four ways); Herbalism grass, roots and a mix; Skinning add-ons to the cut ----------
// 1701: // a mine cart standing on the rail at (x, ry): load 0..1 heaps ore over its rim; tilt (radians, forward); ang turns the wheels
// 1766: // ---------- round 23 (2026-11-15): one profession at a time. Herbalism: Vine or Tall grass? Two more to help decide ----------
// 1786: // ---------- round 24 (2026-11-15): Herbalism, new C and D (the mix and Picked herbs out) ----------
// 1787: // a fern frond rising from (x, y): h tall, u 0 (a tight fiddlehead coil) .. 1 (unrolled, leaflets out), sw sway
// 1791: // a broad leaf from (x, y): open 0 (folded spike) .. 1 (wide open), tilt, size
// 1805: // ---------- round 25 (2026-11-15): Herbalism C and D that are NOT something sprouting at each tick ----------
// 1827: // ---------- round 26 (2026-11-15): Herbalism base = Vine (round 25 A); bold add-ons ----------
// 1854: // ---------- round 27 (2026-11-15): Herbalism vine add-ons about picking herbs, not cultivating (sunbeam, butterfly out) ----------
// 1871: // (the user, mid-round: picking may be a new design rather than an add-on. B and C are new picking designs; D keeps the vine, plucked)
// 1886: // ---------- round 29 (2026-11-15): Herbalism LOCKED as the Vine (round 28 A); four finales for when the bar fills ----------
// 1887: // V.finAt: seconds from the bar filling to the payoff (chime, icon lit, bar flash, "Unlocked!"), so the finale plays first.
// 1930: // ---------- round 30 (2026-11-15): Herbalism DONE (Vine + Sickle sweep); Skinning: the cut + a stroke + Fur flies, add-ons on top ----------
// 1968: // ---------- round 31 (2026-11-15): Skinning keeps A Fur flies; three new add-ons on top (round 30 B-D not liked) ----------
// 1969: // V.shake(info) -> [dx, dy]: moves the whole bar module (header, bar, icon) for a jolt.
// 2001: // ---------- round 32 (2026-11-15): Skinning LOCKED as A, the cut + a stroke + Fur flies; four finales for when the bar fills ----------
// 2036: // ---------- round 34 (2026-11-15): Skinning finale = round 33 C Target lock mixed with D, but the hide gets chopped up instead of the refill ----------
// 2039: // the reticle sliding from x0 to x1 over [t0, t0 + d], locking there (eased), then held gold till it fades
// 2043: // the hide chopped at the notches, left to right: chop k (1..n) at t0 + (k - 1) * dt cuts piece k - 1 loose
// 2077: // C's payoff waits for the reticle: finAt depends on the notch count, so set it per draw
// 2086: // ---------- round 35 (2026-11-15): Skinning finale = lock first (round 34 A's order), then fast chops whose pieces fly into the locked icon (34 B) ----------
// 2087: // cfg: dt (between chops), fly (piece flight time), rtl (chop from the icon end back), react ('pulse' | 'tighten')
// 2124: // ---------- round 36 (2026-11-15): Skinning finale = round 35 D (the reticle tightens), turning 90 degrees, the pieces falling away (round 34) ----------
// 2125: // turn: 'steps' (a step per chop), 'smooth' (turns evenly as the chops run), 'snap' (all 90 on the last chop), 'kick' (steps with an overshoot)
// 2163: // ---------- round 37 (2026-11-15): Skinning DONE; Fishing (locked bar) add-ons, bold ones; the finale comes after ----------
// 2164: // window.FSW(x): extra height added to the water surface (negative = up), set per draw by an add-on and cleared after.
// 2198: // ---------- round 38 (2026-11-15): Fishing picks D The swell (round 37); new water textures inside the filled water + new swell sounds ----------
// 2199: // window.FTEX(x0, tipX, top, bot, ly, t, body): draws the texture inside the filled water (body() traces its shape).
// 2235: // ---------- round 39 (2026-11-15): Fishing = the swell + Depth bands texture (38 B) + the soft low rush (38 A sound); the skill-up sound itself (the bobber dip) ----------
// 2236: // window.FSND(i): replaces the locked bar's skill-up sound (i = which skill-up in the popup); the splash drops stay.
// 2256: // ---------- round 41 (2026-11-15): Fishing's whole sound reworked, four gentle sets (no hiss, no sharp clicks, nothing high or buzzy) ----------
// 2257: // Each set: up(i) = the skill-up (the bobber dipping), swell() = the swell rolling, reel = the reel's clicks per skill-up (false = silent).
// 2280: // ---------- round 42 (2026-11-15): Fishing sound sets, livelier but still gentle (round 41 A-C too monotone/boring) ----------
// 2305: // round 42 D replaced (the user): the hybrid, B's water drops for the skill-ups + C's swell (a low pluck + two high notes), no reel
// 2309: // ---------- round 43 (2026-11-15): Fishing set (the swell, Depth bands, the Water drops sounds: round 42 B); four finales ----------
// 2341: // ---------- round 44 (2026-11-15): Fishing finale = round 43 B Tidal wave mixed with D Leaping school, four ways ----------
// 2347: // one leap: from xa to xb starting at t0 for d seconds, h high; toIcon lands at the icon's height; s scale; k its note
// 2374: // ---------- round 45 (2026-11-15): Fishing DONE (big fish surfs the swell); Herbalism's sound revisited: four gentle sets ----------
// 2375: // Each set: up(i, v) = the skill-up (v = volume after the long-session step-down), fin() = the Sickle sweep finale.
// 2376: // Long sessions (style guide): notes vary from a scale; the first two skill-ups full, then each a step quieter (floor .5).
// 2398: // ---------- round 46 (2026-11-15): Herbalism DONE (thumb piano); Skinning's sound revisited (it was all hiss: the strike 2.6/5.2 kHz noise, the stroke 2.2 kHz, the finale clicks) ----------
// 2399: // Each set: up(i, v) = the skill-up (the cut), lock() = the reticle locking, chop(j, n) = each chop, last() = after the last chop.
// 2428: // ---------- round 47 (2026-11-15): Skinning DONE (original sounds); Mining, four new designs that use the bar as a frame (parts outside it, like the reel/bobber/vine) ----------
// 2494: // ---------- round 48 (2026-11-15): Mining, destructive designs (round 47 A/C/D too alike): blast, collapse, shatter, crushed to gravel ----------
// 2495: // The mined part is a dug-out channel; the rock still ahead stays solid, so it still reads as a bar filling.
// 2544: // ---------- round 49 (2026-11-15): Mining base LOCKED as Blast (round 48 A); add-ons on top ----------
// 2576: // ---------- round 50 (2026-11-15): Mining = the Blast, no add-on (round 49 A); four finales ----------
// 2609: // ---------- round 51 (2026-11-15): Mining finale = round 50 A Chain reaction mixed with D Ore shower, four ways ----------
// 2614: // a nugget thrown from xa at t0 landing on the bar top at xb after d, a little bounce, then rolling to the icon; returns false when done
// 2641: // ---------- round 52 (2026-11-15): Mining = the Blast + finale "every blast throws ore" (round 51 A); its sound, four sets ----------
// 2642: // Each set: up(i, v) = the skill-up blast, blast(k) = each blast of the finale chain (k 0..4, 4 = the icon), clink(j) = a nugget landing.
// 2666: // ---------- round 53 (2026-11-15): Blacksmithing, the base (first crafter). No ring, no hammer, no tool at the tip, no white-hot cooling (the craft ring has those) ----------
// 2672: // ---------- round 58 (2026-11-15): Blacksmithing base: an anvil at the start throwing sparks, a magma channel, Ironforge's magma falls ----------
// 2673: // Echo, clarified by the user: don't copy the hammer; heat, sparks, an anvil and magma (not white-hot metal) are fine.
// 2675: // B: a small black anvil (face, waist, base, horn to the left), a cool rim light so it reads on dark ground
// 2679: // ---------- round 59 (2026-11-15): Blacksmithing, where round 58 B (anvil at the start) and D (Ironforge falls) can go ----------
// 2682: // ---------- round 60 (2026-11-15): Blacksmithing, round 59 B (Spark shower) and C (Falls and mound) improved ----------
// 2683: // The anvil's sound: struck metal, short and damped (round 59's bell tones were "too chimey for an anvil getting hit").
// 2686: // a warm glow behind the anvil so the black anvil reads on dark ground
// 2688: // ---------- round 61 (2026-11-15): eight options. 1-4: add-ons on round 60 B (Lingering sparks, clank). 5-8: the magma reworked ----------
// 2689: // The sparks: n sparks flung from the anvil; each lands on the bar (or past the front, the last three) and lingers as a hot speck.
// 2700: // ---- magma, reworked: no bubbles; three textures (crust plates over glowing cracks, flow streaks, veined rock) ----
// 2703: // ---------- round 62 (2026-11-15): Blacksmithing magma, the LOOK only (animations later). The bar is open at the top like Fishing's:
// 2704: // the magma's wavy surface is the bar's top edge (no track or border showing behind it); ahead of the fill, dark cooled lava at the same level.
// 2705: // A = round 61's flow texture; B-D three different looks. Mode 'M' in barModule: border on the sides and bottom only, the growth draws the whole bar.
// 2710:   // ahead: dark cooled lava, a faint ember glow deep down
// 2715:   // the surface: bright crest over the magma, a dim one over the cooled part
// 2720:   // B: depth bands: the heat in soft layers, bright under the surface, deep red at the bottom; the band edges sway slowly
// 2724: // ---------- round 65 (2026-11-15): Bubbling (round 64 B) kept as A; three bubbling designs that differ in both the magma and the bubbles ----------
// 2726: // a bubble slot: k's current cycle c and phase ph (0..1); its spot along the fill changes every cycle
// 2728: // ---------- round 66 (2026-11-15): the mix: round 65 C's Boiling patch bubbles + D's pops (thick splat, ripples), in Depth bands with soft gradient edges ----------
// 2729: // Depth bands as a gradient: per 2 px column, the colors follow the surface down and blend into each other; plume(x) pushes the bands up (heat rising)
// 2737: // ---------- round 67 (2026-11-15): the anvil + the magma. Gradient depth bands; slow bubbles only at the head (the fill's front), each popping with a splat + ripples.
// 2738: // Each skill-up the anvil (at the bar's start) acts, four ways.
// 2741: // the anvil throws a glob of magma along the bar onto the head: t 0..SHOT
// 2742: // a big wave rolling left from the head to the anvil, between ta and tb; returns the lift
// 2747: // ---------- round 68 (2026-11-15): round 67 D (Sparks into the magma) LOCKED as the skill-up; the head's bubbles reworked to feel like swamp bubbles popping, four ways ----------
// 2748: // A bubble at the head: a glossy film dome swells slowly, then pops; the surface dimples where it was and rings of ripples run out.
// 2751: // pops of the last 1.4 s: { x, age, k, c, s (size 0.7..1.2) }
// 2754: // the surface's response: a dimple where the film was, a soft ring of ripples; D also bounces back up
// 2759: // the dome: a thin glossy film, see-through at the middle, a bright rim and a highlight
// 2772: // ---------- round 69 (2026-11-15): Blacksmithing FINALES (reaching the next unlock). The base as picked: the anvil, gradient depth-band magma
// 2773: // (open-top bar), Film burst bubbles + thick splat at the head, skill-up = Sparks into the magma. ts = seconds since the bar closed.
// 2775: // the icon filling with glowing magma from the bottom (k 0..1), drawn over the icon
// 2786: // ---------- round 70 (2026-11-15): Blacksmithing finales, four new (round 69's set aside); A drains ----------
// 2788: // ---------- round 71 (2026-11-15): finales: Fire across the surface (round 70 C) kept as A; B the magma hardens into ingots that go into a crate,
// 2789: // shipped off; C an ember swarm; D a blade rising out of the magma ----------
// 2792: // an ingot: a trapezoid (narrower on top), hot -> iron with a warm edge as cool goes 0..1
// 2796: // the crate: a wooden box, planks and two dark bands
// 2798: // ingot k leaves the bar (rightmost first) at the time below and hops into the crate
// 2800: // ---------- round 72 (2026-11-15): finale = the Ember swarm (round 71 C) as A; three add-ons on it (B-D); E the ingots and F the blade,
// 2801: // cleaned up and each with the ember swarm. Six options (keys 1-6). ----------
// 2802: // the swarm: n embers from src(q) -> [x, y], starting at t0 + spread, lifting, then streaming into the icon; spin = orbit the icon before diving in
// 2810: // ---- E: the ingots, clean: a bright cut sweeps the bar into seven moulds; a cooling wave runs along them, each ingot giving its heat off as embers that
// 2811: // stream into the icon; a crate drops in; the ingots fly in one by one and stack neatly, the crate dipping with each; a lid drops; the crate glides off.
// 2837: // ---------- round 75 (2026-11-15): four ways the INGOTS ARE CREATED (the rest as round 72 E: crate, fly in, lid, glide off). A = the cut + cooling wave ----------
// 2838: // each formation runs 0..1.15 s; from 1.15 the shared exit (INGOTS72.fin) takes over with the seven cooled ingots in their places
// 2841: // ---------- round 76 (2026-11-15): the ingots form as molten BEADS (round 75 B) rising from the depths (75 D), and the BLINK: left to right, each bead is
// 2842: // struck in a quick flash and snaps into an ingot. Formation window 0..1.65 s, then round 72 E's crate ending (shifted by SH76). ----------
// 2844: // a molten bead: a rounded glowing blob, wobbling
// 2848: // the blink at tb: a white flash over the piece, a squash that springs back, three sparks, a soft tap a step higher each time
// 2851: // rising beads: in no set order, beads rise out of the magma (clipped at its sinking surface), dripping
// 2855: // the beading-up from the whole bar (round 75 B): necks thin and snap
// 2856: // ---------- round 77 (2026-11-15): Rising beads (76 A) + Blink to iron (76 D), made SPARKY and CHUNKY, no chimes. Four strike sets (spark style + sound) ----------
// 2857: // the strike: a hard squash that springs back, the bar jolts, sparks burst, and the bead is iron in the same flash
// 2883: // ---------- round 78 (2026-11-15): the finale animation LOCKED (round 77 C: rising beads, struck to iron, crunch + scale, the crate). Its closing sound:
// 2884: // a low pound with reverb, four ways (the ding gone: the payoff calls FINSND78; the crate lid is a low thud now) ----------
// 2889: // ---------- round 79 (2026-11-15): the finale sound: CHUNKY booms (round 78's pounds were too low and too alike), four clearly different; D in the style of a
// 2890: // JRPG boss dying (a flickering, crumbling rumble that dissolves, then the final boom) ----------
// 2891: // a bus: dry + reverb send, through a soft saturator (the chunk)
// 2894: // a voice: osc f0 -> f1 over dur, attack att, into dest
// 2896: // a noise layer: filtered (type, f0 -> f1), env shape: 'hit' (fast decay), 'swell' (rises to the end), 'flat'
// 2900: // ---------- round 80 (2026-11-15): the Punchy boom (79 A) made more blacksmithy; and, for fun, a peon who runs off with the crate ----------
// 2902: // a firing-pin ting: tiny, bright, very short and dry, then the boom
// 2904: // the last strike of the forge: a short anvil clang (inharmonic, damped, not a bell) with a hit of grit, then the boom
// 2906: // the peon: a small orc worker (green, brown tunic, little tusks), simple shapes; legs swing while running
// 2912: // D: the peon runs in from the right as the lid drops, hoists the crate over its head and runs off with it, little puffs of dust behind; then the icon lights
// 2931: // ---------- round 81 (2026-11-15): the peon ending LOCKED (round 80 D). Sounds that match it, four sets: footsteps, the grab, the dash, and the closing hit ----------
// 2933: // ---------- round 82 (2026-11-15): the peon’s sounds without any boom (round 81: “all sound the same, a boom as he runs away”): the running is the sound now,
// 2934: // louder and characterful, and the icon lighting is small. Four clearly different sets. ----------
// 2935: // a little grunt: a buzzy low voice through two vowel-ish band filters, short
// 2959: // round 11 B: the flourish at the tip, t seconds after the strike lands
// 2967: // round 11 D: the unlock's icon dressed by what grew; k 0..1 progress, t seconds since the payoff
// 2979: // round 10 C: the material behind the text, from surf down to bot, across the module
// 2990:   // the surface line, bright, the profession's color
// 2993: // round 10 D: the material in a bulb, filling the rect (x, y, w, h); top = the bulb of points still to go
// 3001: // round 10: the tighter layout's text. head: name, skill / rank cap, rank; tail: next unlock, points to go, the two after it
// 3013: // round 10 B: the line grows toward the unlock, the profession's way; f 0..1 of L
// 3034: // round 9 B: the vessel per profession (simple outlines); returns its path, inner top/bottom, sides, rim color
// 3051: // round 9 C: the free-standing column under the icon, h px tall from base
// 3062: // round 9 D: the long low container per profession, filled to f, N notches on the rim
// 3078: // round 8 B: what a notch does when the material reaches it, per profession
// 3086: // round 8 C: the edge that marks the level, in the profession's style
// 3096: // a pip in the profession's shape; fill 0..1 (partial pips fill from the bottom), sweep: the unlock's light run
// 3111: // what fills the unlock's frame, per profession (round 7 C): from the bottom up to y = surf
// 3130: // one countdown digit in the profession's look; since = time since it arrived
// 3137: // ---------- per-profession dressing (round 6): hooks the frames call at the head, on each unlock icon, and at the unlock
// 3167: // a stamped seal: number (or the unlock's icon) in a rimmed disc; dark 0..1 darkens older ones
// 3175: // the bell's scale: eight notes; the closer to the next unlock the higher, a run a step each; the unlock is the top
// 3181: // ---------- loop ----------
// 3187: // ---------- panel ----------

// ===== round 83 B-D (Dye soaks in, Tooled pattern, Stretched and tacked; LW83 entries), r83, and round 84 B-C (Boot stomp, Hide throw; LW84 entries), moved out 2026-11-16 =====
  B: { name: 'Dye soaks in', desc: 'The whole strip is pale raw leather. Each skill-up a drop of dye falls onto the front and soaks forward: a dark wet edge with ragged fingers reaching ahead, glossy while wet, then it dries to rich brown with a slow sheen running along it.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(300 * semi(n), 0, .026 * v, .16, 'sine', 360 * semi(n)); noise(.02, .12, .01 * v, 600, .7, 'lowpass'); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.x1 + 2, y - 6, y + 6, '#e6d4b6', '#c4ac8c', 2);
        const o = last83(I), seep = o && o.t >= 0 ? clamp(o.t / .9) : 1, reach = Math.sin(Math.PI * seep) * 5, seed = o ? o.i : 0;
        const edge = r => I.tipX + Math.sin(r * 1.7 + 1) * 1.4 + Math.sin(r * .9 + t * .6) * .8 + reach * (.3 + .7 * rnd53(r * 3.1 + seed));
        const path = () => { ctx.beginPath(); ctx.moveTo(x0 - 2, y - 6); for (let r = 0; r <= 12; r++) ctx.lineTo(edge(r), y - 6 + r); ctx.lineTo(x0 - 2, y + 6); ctx.closePath(); };
        if (I.tipX + reach > x0) { ctx.save(); path(); ctx.clip(); hide83(x0 - 2, I.x1 + 2, y - 6, y + 6, '#8e5628', '#4e2c12', 3);
          const sx = x0 - 30 + ((t * 45) % (L + 60)), sg = ctx.createLinearGradient(sx - 12, 0, sx + 12, 0); sg.addColorStop(0, 'rgba(255,220,170,0)'); sg.addColorStop(.5, 'rgba(255,220,170,.14)'); sg.addColorStop(1, 'rgba(255,220,170,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 12, y - 6, 24, 12);
          const wet = o && o.t >= 0 ? clamp(1 - (o.t - .2) / 1.4) : 0; if (wet > 0) { ctx.fillStyle = `rgba(30,12,2,${.45 * wet})`; ctx.fillRect(o.a - 6, y - 6, I.x1, 12); ctx.fillStyle = `rgba(255,230,200,${.45 * wet})`; ctx.fillRect(o.a - 6, y - 4, I.tipX + 6 - o.a + 6, 1); }
          ctx.restore();
          ctx.strokeStyle = 'rgba(40,18,4,.65)'; ctx.lineWidth = 1.3; ctx.beginPath(); for (let r = 0; r <= 12; r++) ctx.lineTo(edge(r), y - 6 + r); ctx.stroke(); } },
      over(p, I) { const y = I.ly; hits83(I).forEach(o => { const x = o.a + 1;
          if (o.t < 0 && o.t > -.18) { const u = 1 - (-o.t) / .18, dy = lerp(y - 26, y - 7, u * u); ctx.fillStyle = '#5a3214'; ctx.beginPath(); ctx.ellipse(x, dy, 1.6, 2.4, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,225,190,.6)'; ctx.fillRect(x - .8, dy - 1.2, .8, .8); }
          if (o.t >= 0 && o.t < .45) { const u = o.t / .45; ctx.strokeStyle = `rgba(70,36,12,${.7 * (1 - u)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - 5, 2 + 9 * eOut(u), 1 + 2.5 * eOut(u), 0, 0, 7); ctx.stroke(); } }); } } },
  C: { name: 'Tooled pattern', desc: 'A plain leather strap. Each skill-up a tooled border pattern (two straight border lines, a row of round ring stamps between them) presses into the newest part: the strap dips, a dark pressure mark spreads and fades, the fresh impression stays darker for a moment, a soft dull thump. No tool is shown.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); drum46(100 * semi(n / 2), 0, .034 * v); noise(0, .05, .014 * v, 500, .7, 'lowpass', true); tone(200 * semi(n), 0, .008 * v, .2, 'triangle'); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.x1 + 2, y - 6, y + 6, '#d2a26e', '#9c6c3e', 4); const xe = I.tipX; if (xe <= x0) return;
        const o = last83(I), fresh = o && o.t >= 0 ? clamp(1 - o.t / 1.2) : 0;
        const draw = (dy, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y - 4.5 + dy); ctx.lineTo(xe, y - 4.5 + dy); ctx.moveTo(x0, y + 4.5 + dy); ctx.lineTo(xe, y + 4.5 + dy); ctx.stroke();
          ctx.fillStyle = col; for (let cx = x0 + 4; cx + 2.2 <= xe; cx += 7) { ctx.beginPath(); ctx.arc(cx, y + dy, 2.2, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, y + dy, .7, 0, 7); ctx.fill(); } };
        draw(.7, 'rgba(255,230,190,.32)', .8); draw(0, 'rgba(60,30,10,.72)', .9);
        if (fresh > 0) { ctx.save(); ctx.beginPath(); ctx.rect(o.a - 4, y - 6, xe - o.a + 4, 12); ctx.clip(); draw(0, `rgba(40,16,4,${.6 * fresh})`, 1.1); ctx.restore(); } },
      shake(I) { const o = last83(I); if (!o || o.t < 0 || o.t > .25) return [0, 0]; return [0, 1.4 * (1 - o.t / .25)]; },
      over(p, I) { const y = I.ly, o = last83(I); if (!o || o.t < 0 || o.t > .5) return; const u = o.t / .5, x = (o.a + o.b) / 2;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9); g.addColorStop(0, `rgba(30,12,2,${.45 * (1 - u)})`); g.addColorStop(1, 'rgba(30,12,2,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 9, 7, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = `rgba(255,230,190,${.4 * (1 - u)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 3 + 9 * eOut(u), 3 + 5 * eOut(u), 0, 0, 7); ctx.stroke();
        once('lwC' + o.i, () => { for (let k = 0; k < 4; k++) spawn({ x: x + (k - 1.5) * 3, y: y - 5, vx: (k - 1.5) * 18, vy: -20 - Math.random() * 20, g: 140, life: .45, size: .9, shape: 'sq', vr: 6, col: '#e6c494' }); }); } } },
  D: { name: 'Stretched and tacked', desc: 'Ahead of the fill the hide hangs loose off the bar, sagging and wrinkled. Each skill-up pulls the next stretch taut with a soft creak: the loose hide lifts, the front moves on, a brass tack drops in to pin it with a glint, and the loose part shivers and sags again. Behind, the leather is smooth, held by rows of tacks.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(150 * semi(n / 3), 0, .016 * v, .32, 'triangle', 185 * semi(n / 3)); noise(0, .28, .006 * v, 420, 3, 'bandpass'); tone(660 * semi(n), LAND83, .012 * v, .14, 'triangle'); drum46(180, LAND83, .012 * v); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 5); const o = last83(I);
        if (o && o.t >= 0 && o.t < .8) { const a = .35 * (1 - o.t / .8); ctx.strokeStyle = `rgba(70,40,15,${a})`; ctx.lineWidth = 1; for (let k = 0; k < 3; k++) { const x = I.tipX - 3 - k * 4; ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.quadraticCurveTo(x + 1.5, y, x, y + 5); ctx.stroke(); } } },
      over(p, I) { const y = I.ly, o = last83(I), fx = I.tipX, xe = I.x1 + 3, span = Math.max(1, xe - fx), t = S.age;
        let shiv = 0; if (o && o.t > -.15) { if (o.t < .45) shiv = -.55 * Math.sin(Math.PI * clamp((o.t + .15) / .6)); else shiv = .3 * Math.exp(-(o.t - .45) * 6) * Math.sin((o.t - .45) * 36); }
        const u = x => clamp((x - fx) / span), sag = x => (7 * (1 + shiv)) * Math.pow(u(x), 1.2) + Math.sin(x * .55 + 1 + t * .4) * 1.1 * u(x);
        if (fx < xe - 1) { ctx.beginPath(); ctx.moveTo(fx, y - 6); for (let x = fx; x <= xe; x += 2) ctx.lineTo(x, y - 6 + sag(x)); for (let x = xe; x >= fx; x -= 2) ctx.lineTo(x, y + 6 + sag(x) * 1.3); ctx.closePath();
          const g = ctx.createLinearGradient(0, y - 6, 0, y + 14); g.addColorStop(0, '#c49a6c'); g.addColorStop(1, '#7a5230'); ctx.fillStyle = g; ctx.fill();
          for (let k = 0; fx + 8 + k * 13 < xe - 4; k++) { const x = fx + 8 + k * 13 + Math.sin(k * 2.1) * 3, b = 2 + 2 * u(x); ctx.strokeStyle = 'rgba(60,32,12,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 6 + sag(x) + 1); ctx.quadraticCurveTo(x + b, y + sag(x) * 1.15, x - .5, y + 6 + sag(x) * 1.3 - 1); ctx.stroke();
            ctx.strokeStyle = 'rgba(255,228,190,.22)'; ctx.beginPath(); ctx.moveTo(x + 1.2, y - 6 + sag(x) + 1); ctx.quadraticCurveTo(x + b + 1.2, y + sag(x) * 1.15, x + .7, y + 6 + sag(x) * 1.3 - 1); ctx.stroke(); } }
        const tack = (x, dy = 0) => [y - 3.6, y + 3.6].forEach(ty => { const g = ctx.createRadialGradient(x - .6, ty + dy - .6, .2, x, ty + dy, 1.9); g.addColorStop(0, '#fff0b8'); g.addColorStop(.5, '#d8a840'); g.addColorStop(1, '#7a5418'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, ty + dy, 1.9, 0, 7); ctx.fill(); });
        tack(I.x0 + 1.5); for (let j = 1; j < I.N; j++) { const x = I.x0 + j / I.N * (I.x1 - I.x0) + 2.5; if (x < I.X(S.v0) - 3) tack(x); }
        hits83(I).forEach(o => { const x = o.b - 1.5; if (o.t >= LAND83) { tack(x); once('lwD' + o.i, () => spawn({ x, y: y - 3.6, shape: 'star', size: 3.5, life: .45, col: '#fff4c0' })); } else if (o.t > LAND83 - .16) { const k = 1 - (LAND83 - o.t) / .16; ctx.save(); ctx.globalAlpha *= k; tack(x, -14 * (1 - k * k)); ctx.restore(); } }); } } },
function r83(K) { const Z = LW83[K]; return { get name() { return K + '. ' + (profName === 'Leatherworking' ? Z.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only: the finale and the real sound come later; the sound is a gentle placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r83('A'), PB: r83('B'), PC: r83('C'), PD: r83('D') });
  B: { name: 'Boot stomp', desc: 'A sturdy leather boot stands on the bar at the front of the fill, tapping its toe while it waits. Each skill-up it hops up, tilts back and STOMPS down: the bar dips, dust puffs out both sides, and a fresh bootprint is pressed into the leather behind it. The filled part is a trail of its prints.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); drum46(85 * semi(n / 3), 0, .04 * v); noise(0, .07, .02 * v, 450, .7, 'lowpass', true); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 6); const o = last83(I);
        const print = (x, a) => { ctx.fillStyle = `rgba(50,24,8,${a})`; ctx.beginPath(); ctx.ellipse(x + 1.5, y + .5, 3, 2.2, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(x - 3.2, y + .5, 1.6, 1.8, 0, 0, 7); ctx.fill(); };
        for (let x = x0 + 6; x < I.X(S.v0) - 6; x += 10) print(x, .38);
        hits83(I).forEach(q => { if (q.t >= 0) print(q.b - 7, q === o ? .38 + .4 * clamp(1 - q.t / 1) : .38); }); },
      shake(I) { const o = last83(I); if (!o || o.t < 0 || o.t > .2) return [0, 0]; return [0, 2 * (1 - o.t / .2)]; },
      over(p, I) { const y = I.ly, o = last83(I); let lift = 0, tilt = 0, sq = 1, bx = I.tipX - 6;
        if (o && o.t > -.3 && o.t < 0) { const u = (o.t + .3) / .3; lift = Math.sin(Math.PI * Math.min(1, u * 1.15)) * 13 * (u < .87 ? 1 : 1 - (u - .87) / .13); tilt = -.35 * Math.sin(Math.PI * u); bx = lerp(o.a, o.b, eOut(u)) - 6; }
        else if (o && o.t >= 0 && o.t < .3) { const u = o.t / .3; sq = 1 - .22 * Math.sin(Math.PI * u) * (1 - u); bx = o.b - 6;
          once('lwB' + o.i, () => { for (let k = 0; k < 8; k++) { const s = k % 2 ? 1 : -1; spawn({ x: bx + s * 7, y: y - 6, vx: s * (30 + Math.random() * 40), vy: -10 - Math.random() * 25, g: 60, life: .5, size: 1.1, col: 'rgba(225,195,150,.85)' }); } }); }
        else { const it = S.age % 1.3; if (it < .3) tilt = -.18 * Math.sin(Math.PI * it / .3); }
        const by = y - 6 - lift; ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt); ctx.scale(1 + (1 - sq) * .6, sq);
        ctx.fillStyle = 'rgba(0,0,0,.3)'; if (lift < 1) { ctx.beginPath(); ctx.ellipse(1, .5, 7, 1.2, 0, 0, 7); ctx.fill(); }
        const g = ctx.createLinearGradient(-5, 0, 7, 0); g.addColorStop(0, LWC.md); g.addColorStop(.5, LWC.hi); g.addColorStop(1, LWC.dk); ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(-5, -13, 7, 11, [2, 2, 0, 0]); ctx.fill(); ctx.beginPath(); ctx.roundRect(-5, -4, 13, 4, [1, 3, 1, 1]); ctx.fill();
        ctx.fillStyle = '#2e1a0a'; ctx.fillRect(-5, -1.2, 13, 1.4); ctx.fillStyle = LWC.dk; ctx.fillRect(-5.5, -14, 8, 2.4); ctx.fillStyle = 'rgba(255,236,200,.4)'; ctx.fillRect(-3.5, -11, 1, 7);
        ctx.restore(); } } },
  C: { name: 'Hide throw', desc: 'Each skill-up a whole hide sails in from above, turning as it flies, and lands draped over the front of the bar with a slap: its flaps hang over the top and bottom edges and bounce as it settles. The filled part is a row of overlapping hides in slightly different tans, all hanging over the bar.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); noise(-.12, .14, .006 * v, 700, .6, 'lowpass'); drum46(110 * semi(n / 2), 0, .028 * v); noise(0, .06, .024 * v, 1000, .8, 'lowpass', true); },
    V: { grow() {},
      over(p, I) { const y = I.ly, cols = [['#d8a670', '#8e5c30'], ['#c8925c', '#7a4c26'], ['#e0b480', '#9a6a3a'], ['#be8a56', '#6e4422']];
        const draped = (x, k, hang = 0) => { ctx.save(); ctx.translate(x, y); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 3; ctx.shadowOffsetX = 1.5; pelt84(20, 17 + hang * 2, ...cols[k % 4]); ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(30,14,4,.35)'; ctx.fillRect(-9, -6.5, 18, 1.2); ctx.fillRect(-9, 5.6, 18, 1.2); ctx.fillStyle = 'rgba(255,236,200,.3)'; ctx.fillRect(-8, -5.2, 16, 1); ctx.restore(); };
        let k = 0; for (let x = I.x0 + 8; x < I.X(S.v0) - 4; x += 9, k++) draped(x, k);
        hits83(I).forEach(q => { const xl = q.b - 8;
          if (q.t < 0) { const u = (q.t + .3) / .3; if (u <= 0) return; const fx = lerp(xl - 60, xl, u), fy = lerp(y - 46, y, u) - Math.sin(Math.PI * u) * 10, r = (1 - u) * -2.4;
            ctx.save(); ctx.translate(fx, fy); ctx.rotate(r); ctx.scale(1 + .25 * (1 - u), .55 + .45 * u); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 4; pelt84(22, 18, ...cols[(k + q.i) % 4]); ctx.restore(); }
          else { const u = q.t; draped(xl, k + q.i, 1.6 * Math.exp(-u * 7) * Math.sin(u * 28));
            once('lwC4' + q.i, () => { for (let j = 0; j < 6; j++) { const s = j % 2 ? 1 : -1; spawn({ x: xl + s * 10, y: y + (j % 3 - 1) * 5, vx: s * (25 + Math.random() * 30), vy: -10 - Math.random() * 15, g: 60, life: .45, size: 1, col: 'rgba(225,195,150,.8)' }); } }); } }); } } },

// ===== round 85 B-D (Sling, Fringe, Belt and buckle; LW85 entries), moved out 2026-11-16 =====
  B: { name: 'Sling', desc: 'Left of the bar a leather sling whirls lazily in a circle. Each skill-up it whips faster and lets go: a stone arcs along the bar, high over the filled leather, and thuds into the front with a puff of dust, pushing the fill on. The sling slows and keeps turning.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); drum46(95 * semi(n / 3), 0, .036 * v); noise(0, .06, .02 * v, 600, .7, 'lowpass', true); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 7); },
      shake(I) { const o = near85(I, .7); if (!o || o.t < 0 || o.t > .18) return [0, 0]; return [1.2 * (1 - o.t / .18), 0]; },
      over(p, I) { const y = I.ly, o = near85(I, .7), hx = I.x0 - 16, hy = y - 2; let spd = 2.2, rel = false;
        if (o && o.t < -.3) spd = lerp(2.2, 9, clamp((o.t + .7) / .4)); else if (o && o.t < .6) { spd = lerp(9, 2.2, clamp((o.t + .3) / .9)); rel = true; }
        S.sl85 = (S.sl85 || 0) + spd * (1 / 60); const a = S.sl85 * 2 * Math.PI, R = 9, px = hx + Math.cos(a) * R, py = hy + Math.sin(a) * R * .45 - 4;
        ctx.strokeStyle = 'rgba(70,40,15,.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, hy + 6); ctx.lineTo(px - 1.5, py); ctx.moveTo(hx, hy + 6); ctx.lineTo(px + 1.5, py); ctx.stroke();
        ctx.fillStyle = LWC.lt; ctx.beginPath(); ctx.ellipse(px, py, 3, 2, a, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,236,200,.4)'; ctx.fillRect(px - 1, py - 1.2, 2, .8);
        if (!rel || !o) { ctx.fillStyle = '#8a8478'; ctx.beginPath(); ctx.arc(px, py - .5, 1.6, 0, 7); ctx.fill(); }
        if (o && o.t >= -.3 && o.t < 0) { const u = (o.t + .3) / .3, sx = lerp(hx + 8, o.b, u), sy = lerp(y - 12, y - 4, u) - Math.sin(Math.PI * u) * (14 + (o.b - hx) * .08);
          ctx.fillStyle = '#9a9488'; ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(sx - 1, sy - 1.4, 1, 1); }
        if (o && o.t >= 0 && o.t < .5) { const u = o.t / .5, sx = o.b + 4 + u * 8, sy = y - 4 - Math.sin(Math.PI * Math.min(1, u * 1.6)) * 5; ctx.globalAlpha *= 1 - u; ctx.fillStyle = '#9a9488'; ctx.beginPath(); ctx.arc(sx, sy, 2.2, 0, 7); ctx.fill(); ctx.globalAlpha /= Math.max(.01, 1 - u);
          once('lw85B' + o.i, () => { for (let k = 0; k < 7; k++) spawn({ x: o.b, y: y - 2 + (k % 3 - 1) * 3, vx: -10 + Math.random() * 50, vy: -20 - Math.random() * 30, g: 90, life: .5, size: 1, col: 'rgba(225,195,150,.85)' }); }); } } } },
  C: { name: 'Fringe', desc: 'Leather fringe hangs under the filled part, swaying in a light breeze. Each skill-up new strands drop in at the front and bounce, and a swing runs back along the whole fringe from the front to the start, every strand kicking in turn, then it settles into the breeze again.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); pluck(110 * semi(n), .018 * v); noise(.02, .35, .006 * v, 900, .6, 'lowpass'); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 8); },
      over(p, I) { const y = I.ly, o = near85(I, .3), xe = I.tipX; ctx.lineCap = 'round';
        for (let x = I.x0 + 1; x < xe - 1; x += 3.5) { let ang = .12 * Math.sin(S.age * 1.8 - x * .03), len = 7;
          if (o && o.t >= 0) { const d = (o.b - x) / 260, tt = o.t - d; if (tt > 0) ang += .55 * Math.exp(-tt * 4) * Math.sin(tt * 13); if (x > o.a - 2) len = 7 * eBack(clamp(o.t / .3)); }
          if (len <= .5) continue; const ex = x + Math.sin(ang) * len, ey = y + 6 + Math.cos(ang) * len;
          ctx.strokeStyle = LWC.md; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x, y + 5.5); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,230,190,.3)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(x - .4, y + 6); ctx.lineTo(ex - .4, ey - .5); ctx.stroke(); }
        ctx.lineCap = 'butt'; } } },
  D: { name: 'Belt and buckle', desc: 'The filled part is a belt, and a brass buckle sits at the front with the belt’s tip poking through. Each skill-up the belt is yanked through: the buckle jolts forward, the strap pulls tight (it thins for a moment and a bright tension streak runs back to the start), the prong drops in with a soft click and a glint.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); noise(0, .1, .016 * v, 700, .7, 'lowpass', true); tone(520 * semi(n), .05, .01 * v, .12, 'triangle'); drum46(140, .05, .012 * v); },
    V: { grow(p, x0, y, L, f, t, I) { const o = near85(I, .2); let th = 0; if (o && o.t >= 0 && o.t < .35) th = Math.sin(Math.PI * o.t / .35);
        const hh = 6 - th * 1.6; hide83(x0 - 2, I.tipX + 5, y - hh, y + hh, LWC.lt, LWC.md, 9);
        ctx.fillStyle = 'rgba(40,18,4,.35)'; ctx.fillRect(x0 - 2, y - hh + 1.2, I.tipX + 5 - x0, .8); ctx.fillRect(x0 - 2, y + hh - 2, I.tipX + 5 - x0, .8);
        if (o && o.t >= 0 && o.t < .5) { const sx = lerp(I.tipX, x0, o.t / .5), g = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0); g.addColorStop(0, 'rgba(255,240,210,0)'); g.addColorStop(.5, `rgba(255,240,210,${.55 * (1 - o.t / .5)})`); g.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 14, y - hh, 28, hh * 2); } },
      shake(I) { const o = near85(I, .2); if (!o || o.t < 0 || o.t > .15) return [0, 0]; return [1.5 * (1 - o.t / .15), 0]; },
      over(p, I) { const y = I.ly, o = near85(I, .2), bx = I.tipX - 2; let pr = 1; if (o && o.t >= 0 && o.t < .25) pr = clamp((o.t - .05) / .1);
        const g = ctx.createLinearGradient(bx - 4, y - 9, bx + 4, y + 9); g.addColorStop(0, '#fff0b0'); g.addColorStop(.45, '#d8a840'); g.addColorStop(1, '#7a5418');
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx - 4, y - 9, 8, 18, 2.5); ctx.roundRect(bx - 2, y - 7, 4, 14, 1); ctx.fill('evenodd');
        ctx.save(); ctx.translate(bx, y); ctx.rotate((1 - pr) * -1.1); ctx.fillStyle = '#c89a38'; ctx.fillRect(-.7, -1, 1.4, 7); ctx.restore();
        if (o && o.t >= .05) once('lw85D' + o.i, () => spawn({ x: bx, y: y - 9, shape: 'star', size: 3.5, life: .45, col: '#fff4c0' })); } } },

// ===== round 86 A, B, D (Trampoline, Lasso, Sail; LW86 entries), moved out 2026-11-16 =====
  A: { name: 'Trampoline', desc: 'The bar is a hide stretched in its frame like a trampoline: tanned behind the fill, raw ahead. A leather boot (the game would use a real item icon) bounces on it at the front. Each skill-up it flies up high and comes down hard on the new front: the hide sags deep out of the bottom of the frame and springs it back up, wobbling to rest.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); drum46(90 * semi(n / 3), 0, .036 * v); tone(150 * semi(n / 3), 0, .01 * v, .3, 'triangle', 175 * semi(n / 3)); noise(0, .05, .012 * v, 500, .7, 'lowpass', true); },
    V: { grow() {},
      over(p, I) { const y = I.ly, o = near85(I, .5), x0 = I.x0 - 2, x1 = I.x1 + 2, ft = I.tipX; let ix = ft - 5, iy = 0, D = 0, sq = 0;
        const hop = S.age % .55, small = Math.sin(Math.PI * hop / .55);
        if (o && o.t < 0 && o.t > -.5) { const u = (o.t + .5) / .5; ix = lerp(o.a, o.b, u) - 5; iy = -Math.sin(Math.PI * u) * 30; }
        else if (o && o.t >= 0 && o.t < 1) { ix = o.b - 5; const w = 7 * Math.exp(-o.t * 5) * Math.cos(o.t * 16); D = Math.max(0, w); sq = clamp(w / 7); iy = w < 0 ? w * 2.2 : 0; if (o.t > .45) iy = -small * 4 * clamp((o.t - .45) / .3); }
        else { iy = -small * 4; D = small < .15 ? 1.2 : 0; }
        const d = x => { const u = (x - (ix + 5)) / 70; return D * Math.max(0, 1 - u * u) * Math.min(1, (x - x0) / 30, (x1 - x) / 30); };
        const band = (xa, xb, c0, c1) => { if (xb <= xa) return; ctx.beginPath(); for (let x = xa; x <= xb; x += 2) ctx.lineTo(x, y - 5.5 + d(x)); for (let x = xb; x >= xa; x -= 2) ctx.lineTo(x, y + 5.5 + d(x)); ctx.closePath(); const g = ctx.createLinearGradient(0, y - 6, 0, y + 12); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fill(); };
        band(x0 + 1, ft, LWC.lt, LWC.dk); band(ft, x1 - 1, '#e2cfae', '#b49a76');
        ctx.strokeStyle = 'rgba(255,236,200,.3)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = x0 + 1; x <= x1 - 1; x += 2) ctx.lineTo(x, y - 4.5 + d(x)); ctx.stroke();
        if (D > 3 && o) once('lw86A' + o.i, () => { for (let k = 0; k < 6; k++) spawn({ x: ix + 5 + (k - 2.5) * 4, y: y + 6 + D, vx: (k - 2.5) * 14, vy: 10 + Math.random() * 20, g: -20, life: .45, size: 1, col: 'rgba(225,195,150,.8)' }); });
        const by = y - 5.5 + d(ix + 5) + iy; ctx.save(); ctx.translate(ix + 5, by); ctx.scale(1 + sq * .3, 1 - sq * .3); ctx.font = '15px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(PROF.Leatherworking.made, 0, 1); ctx.restore(); } } },
  B: { name: 'Lasso', desc: 'A rawhide lasso loop circles above the front of the fill. Each skill-up it is thrown ahead along the bar, drops round it, the rope snaps taut and drags the loop back to the front, pulling the fill on with it; then the loop rises and circles again.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); noise(0, .1, .01 * v, 600, .6, 'lowpass', true); pluck(98 * semi(n), .02 * v); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 10); },
      over(p, I) { const y = I.ly, o = near85(I, .45), fx = I.tipX, sp = S.age * 7; let lx = fx + 2, ly = y - 15, rx = 7, ry = 2.6, vert = 0, glow = 0;
        if (o && o.t < 0 && o.t > -.45) { const u = (o.t + .45) / .45; lx = lerp(fx + 2, o.b + 30, eOut(u)); ly = lerp(y - 15, y, u) - Math.sin(Math.PI * u) * 8; vert = clamp((u - .6) / .4); }
        else if (o && o.t >= 0 && o.t < .55) { const u = o.t / .55; if (u < .55) { lx = lerp(o.b + 30, o.b + 1, eOut(u / .55)); ly = y; vert = 1; glow = 1 - u; } else { const k = (u - .55) / .45; lx = o.b + 2; ly = lerp(y, y - 15, eOut(k)); vert = 1 - k; } }
        const rX = lerp(rx, 3, vert), rY = lerp(ry, 8.5, vert);
        ctx.strokeStyle = 'rgba(70,40,15,.9)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(fx, y - 4); if (vert > .9) ctx.lineTo(lx - rX, ly); else ctx.quadraticCurveTo(fx + (lx - fx) * .3, Math.min(y - 4, ly) - 4, lx, ly + rY); ctx.stroke();
        ctx.strokeStyle = '#a87444'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(lx, ly, rX, rY, 0, 0, 7); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,236,200,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(lx, ly, rX, rY, 0, sp % 6.28, sp % 6.28 + 1.1); ctx.stroke();
        if (glow > 0) { const g = ctx.createLinearGradient(o.b, 0, o.b + 30, 0); g.addColorStop(0, `rgba(255,236,200,${.45 * glow})`); g.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = g; ctx.fillRect(o.b, y - 6, 30, 12); } } } },
  D: { name: 'Sail', desc: 'A small leather sail stands on the front of the fill, fluttering. Each skill-up a gust streaks in from the left over the filled bar, the sail bellies out full, the mast leans forward and the front lurches on; then it rights itself and flutters again.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); noise(0, .35, .011 * v, 500, .6, 'lowpass'); drum46(100 * semi(n / 3), .06, .02 * v); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 12); },
      over(p, I) { const y = I.ly, o = near85(I, .3), mx = I.tipX - 2; let belly = 2.5 + Math.sin(S.age * 9) * 1 + Math.sin(S.age * 23) * .5, lean = 0, gust = -1;
        if (o && o.t > -.3 && o.t < .9) { const u = o.t + .3; gust = u; belly = lerp(belly, 9, clamp(u / .25) * clamp((1.2 - u) / .5)); lean = .22 * Math.sin(Math.PI * clamp(u / .7)) * (u < .7 ? 1 : 0); }
        if (gust >= 0 && gust < .5) { const k = gust / .5; ctx.strokeStyle = `rgba(235,225,205,${.5 * (1 - k)})`; ctx.lineWidth = 1; for (let j = 0; j < 4; j++) { const sy = y - 18 + j * 5, ex = lerp(I.x0, mx, k) - j * 6; ctx.beginPath(); ctx.moveTo(ex - 30, sy); ctx.lineTo(ex, sy); ctx.stroke(); } }
        ctx.save(); ctx.translate(mx, y - 6); ctx.rotate(lean);
        ctx.strokeStyle = '#5e3a1c'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -17); ctx.stroke();
        const g = ctx.createLinearGradient(0, -16, belly + 4, -4); g.addColorStop(0, LWC.hi); g.addColorStop(1, LWC.md); ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(.8, -16); ctx.quadraticCurveTo(belly + 3, -11, .8, -2.5); ctx.lineTo(.8, -16); ctx.fill(); ctx.restore(); } } },

// ===== round 88 (Snap the pelt on leather, Scraps + snap, Pull to the point; hump88), moved out 2026-11-16 =====
// ---------- round 88 (2026-11-16): Leatherworking base around the two things the user picked: Snap the pelt (Skinning round 30 C, "the one like pulling leather to the next point") and Scraps fly in (86 C):
// A Snap the pelt (on leather), B Scraps fly in, C Scraps + snap, D Pull to the point (pulled from the front, the ripple runs back); key 5 = Grip wrap ----------
// one hump travelling along the strip at wx (amp px tall), drawn only where the leather is (up to xmax)
function hump88(I, wx, amp, xmax) { if (amp <= .2) return; const y = I.ly, g = x => Math.exp(-((x - wx) * (x - wx)) / 90) * amp, xa = Math.max(I.x0 - 2, wx - 30), xb = Math.min(xmax, wx + 30); if (xb <= xa) return;
  ctx.save(); ctx.beginPath(); for (let x = xa; x <= xb; x += 2) ctx.lineTo(x, y - 6 - g(x)); for (let x = xb; x >= xa; x -= 2) ctx.lineTo(x, y + 6 + g(x)); ctx.closePath();
  const gr = ctx.createLinearGradient(0, y - 6 - amp, 0, y + 6 + amp); gr.addColorStop(0, LWC.hi); gr.addColorStop(.45, LWC.lt); gr.addColorStop(1, LWC.dk); ctx.fillStyle = gr; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255,240,210,.85)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (let x = xa; x <= xb; x += 2) ctx.lineTo(x, y - 6 - g(x)); ctx.stroke(); ctx.restore(); }
const flecks88 = (x, y, n = 8, dir = 1) => { for (let k = 0; k < n; k++) spawn({ x, y: y - 2 + (k % 3 - 1) * 3, vx: dir * (20 + Math.random() * 60), vy: -25 - Math.random() * 40, g: 120, life: .6, size: 1.1, shape: 'sq', vr: 8, col: k % 2 ? LWC.hi : LWC.md }); };
const snap88 = (I, o, t0, dur, amp) => { if (!o) return; const u = (o.t - t0) / dur; if (u > 0 && u < 1) hump88(I, lerp(I.x0 - 20, I.tipX + 4, eOut(u) * .6 + u * .4), amp * (1 - u * .3), I.tipX + 2);
  if (o.t >= t0 + dur) once('lw88s' + o.i, () => flecks88(I.tipX, I.ly, 8, 1)); };
const sndSnap88 = (i, at) => { const v = fat45(i), n = pick45(i, 3); noise(Math.max(0, at - .3), .3, .006 * v, 600, .6, 'lowpass'); drum46(130 * semi(n / 2), at, .028 * v); noise(at, .07, .02 * v, 900, .8, 'lowpass', true); };
const LW88 = {
  A: { name: 'Snap the pelt', desc: 'Skinning round 30 C brought to Leatherworking: the tanned strip is snapped out like a pelt being shaken. Each skill-up a hump runs along the whole strip from its start and cracks at the front with a thwap, leather flecks flicking off, and the front jumps on.',
    snd: i => sndSnap88(i, .38),
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 13); },
      shake(I) { const o = near85(I, .1); if (!o || o.t < .38 || o.t > .5) return [0, 0]; return [1.4 * (1 - (o.t - .38) / .12), 0]; },
      over(p, I) { snap88(I, near85(I, .1), 0, .38, 5); } } },
  B: { name: 'Scraps fly in (liked)', snd: LW86.C.snd, desc: LW86.C.desc, V: LW86.C.V },
  C: { name: 'Scraps + snap', desc: 'A and B together: each skill-up the scraps fly in from all around and slap onto the front, then the whole strip is snapped from its start: a hump runs down it and cracks at the front with a thwap, settling the new scraps into the leather.',
    snd: i => { LW86.C.snd(i); sndSnap88(i, .62); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 14); },
      shake(I) { const o = near85(I, .4); if (!o || o.t < .62 || o.t > .74) return [0, 0]; return [1.4 * (1 - (o.t - .62) / .12), 0]; },
      over(p, I) { LW86.C.V.over(p, I); snap88(I, near85(I, .4), .24, .38, 5); } } },
  D: { name: 'Pull to the point', desc: 'The strip is pulled from its front: each skill-up the front is drawn out past its new point, the leather stretching thinner and paler with a creak, then it springs back to the point, and the slack runs back down the strip as a hump to the start, where it bumps the bar’s end.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(140 * semi(n / 3), 0, .016 * v, .3, 'triangle', 175 * semi(n / 3)); noise(0, .25, .005 * v, 380, 3, 'bandpass'); drum46(110 * semi(n / 3), .2, .022 * v); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 15); },
      over(p, I) { const y = I.ly, o = near85(I, .1); if (!o || o.t < 0) return;
        if (o.t < .3) { const s = Math.sin(Math.PI * o.t / .3), ext = 9 * s, th = 6 - 2.4 * s; const g = ctx.createLinearGradient(I.tipX, 0, I.tipX + ext, 0); g.addColorStop(0, LWC.lt); g.addColorStop(1, '#e8d0a8'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(I.tipX - 1, y - 6); ctx.quadraticCurveTo(I.tipX + ext * .5, y - th, I.tipX + ext, y - th * .8); ctx.lineTo(I.tipX + ext, y + th * .8); ctx.quadraticCurveTo(I.tipX + ext * .5, y + th, I.tipX - 1, y + 6); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = `rgba(255,240,210,${.5 * s})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(I.x0, y); ctx.lineTo(I.tipX + ext, y); ctx.stroke(); }
        const u = (o.t - .2) / .6; if (u > 0 && u < 1) hump88(I, lerp(I.tipX - 6, I.x0 - 10, eOut(u)), 4.5 * (1 - u * .5), I.tipX + 2);
        if (u >= 1) once('lw88d' + o.i, () => flecks88(I.x0, y, 5, -1)); } } },
  E: LW84.D,
};
function r88(K) { const Z = LW88[K]; return { get name() { return (K === 'E' ? '5' : K) + '. ' + (profName === 'Leatherworking' ? Z.name + (K === 'E' ? ' (kept)' : '') : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only; the sound is a placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd || null; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r88('A'), PB: r88('B'), PC: r88('C'), PD: r88('D'), PE: r88('E') });

// ===== rounds 86-87 leftovers (LW86 C Scraps fly in + r86, LW87 + r87: the old Skinning options on Leatherworking), moved out 2026-11-16 =====
// ---------- round 86 (2026-11-16): Leatherworking base, four new (round 85 "still not fully liking"), simple shapes + the icon, beyond the bar:
// A Trampoline (impact on a stretched hide), B Lasso (catch and pull), C Scraps fly in (assembly from all around), D Sail (a gust pushes it); key 5 = Grip wrap (kept) ----------
const LW86 = {
  C: { name: 'Scraps fly in', desc: 'Each skill-up a burst of leather scraps in different tans comes flying in from all around the bar (above, below, behind and ahead), tumbling, and slaps onto the front all at once: the front bulges out past the bar’s edges for a moment, a puff of dust, and it settles into the strip.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); [0, .025, .045, .06].forEach((d, k) => noise(d, .04, .011 * v, 650 + k * 120, .8, 'lowpass', true)); drum46(120 * semi(n / 2), .05, .022 * v); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 11); },
      over(p, I) { const y = I.ly, o = near85(I, .4), cols = ['#d8a670', '#c8925c', '#e0b480', '#9a6a3a', '#b88050'];
        if (!o) return;
        if (o.t < 0 && o.t > -.4) { const u = eOut((o.t + .4) / .4); for (let k = 0; k < 9; k++) { const a = rnd53(k * 3.7 + o.i) * 6.28, r = 40 + rnd53(k * 5.1 + o.i) * 35, sx = o.b + Math.cos(a) * r, sy = y + Math.sin(a) * r * .6, px = lerp(sx, o.b - 1, u), py = lerp(sy, y, u);
            ctx.strokeStyle = 'rgba(230,200,160,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lerp(sx, o.b, Math.max(0, u - .25)), lerp(sy, y, Math.max(0, u - .25))); ctx.lineTo(px, py); ctx.stroke();
            ctx.save(); ctx.translate(px, py); ctx.rotate(a + u * 9); ctx.fillStyle = cols[k % 5]; ctx.beginPath(); ctx.roundRect(-2.6, -1.8, 5.2, 3.6, 1); ctx.fill(); ctx.restore(); } }
        else if (o.t >= 0 && o.t < .45) { const u = o.t / .45, b = Math.sin(Math.PI * Math.min(1, u * 2)) * (1 - u * .5), g = ctx.createLinearGradient(0, y - 10, 0, y + 10); g.addColorStop(0, LWC.hi); g.addColorStop(1, LWC.dk); ctx.fillStyle = g;
          ctx.beginPath(); ctx.ellipse(o.b - 3, y, 5 + b * 3, 6 + b * 4, 0, 0, 7); ctx.fill();
          once('lw86C' + o.i, () => { for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; spawn({ x: o.b - 3, y, vx: Math.cos(a) * 40, vy: Math.sin(a) * 30, g: 40, life: .4, size: 1, col: 'rgba(225,195,150,.8)' }); } }); } } } },
  E: LW84.D,
};
function r86(K) { const Z = LW86[K]; return { get name() { return (K === 'E' ? '5' : K) + '. ' + (profName === 'Leatherworking' ? Z.name + (K === 'E' ? ' (kept)' : '') : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only: the finale and the real sound come later; the sound is a gentle placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
// (round 86's FAM assignment removed: A, B, D archived)
// ---------- round 87 (2026-11-16): Leatherworking base. A = Scraps fly in (86 C, liked, "but none feel like leatherworking"); B-D = old Skinning options brought back as the user asked
// ("one that was like pulling leather to the next point"): B Peeled strip (VAR.Skinning.B), C Pegged out (VAR21.Skinning.B), D Laid down (VAR21.Skinning.C, "reads as Leatherworking"); key 5 = Grip wrap ----------
const LW87 = {
  A: LW86.C,
  B: Object.assign({}, VAR.Skinning.B, { name: 'Peeled strip (old Skinning option)', snd: null, desc: 'Brought back from Skinning’s early rounds: the strip of hide peels back as the fill grows: behind the front the fur side is rolled away to show the pale inner side, and the peeled strip rolls up into a curl that rides the front, getting fatter as you go.' }),
  C: Object.assign({}, VAR21.Skinning.B, { name: 'Pegged out (old Skinning option)', snd: null, desc: 'Brought back from Skinning round 21: the hide is stretched along the bar, held by wooden pegs at its top and bottom edge. Each skill-up a new pair of pegs punches in at the front with a tok, and the loose hide at the front pulls taut to them. (On a crafter’s long rank the pegs sit close together.)' }),
  D: Object.assign({}, VAR21.Skinning.C, { name: 'Laid down (old Skinning option)', snd: null, desc: 'Brought back from Skinning round 21, where you said it reads as Leatherworking: each skill-up a cut piece of hide flips down into the bar from above and lands with a slap, edge to edge with the last; the bar fills with pieces, fur side and pale side alternating.' }),
  E: LW84.D,
};
function r87(K) { const Z = LW87[K]; return { get name() { return (K === 'E' ? '5' : K) + '. ' + (profName === 'Leatherworking' ? Z.name + (K === 'E' ? ' (kept)' : K === 'A' ? ' (liked)' : '') : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only; the sound is a placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd || null; try { barModule(top, 'A', Z.V || Z); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r87('A'), PB: r87('B'), PC: r87('C'), PD: r87('D'), PE: r87('E') });

// ===== round 89 (eight pitched directions, all rejected: rollers, bosses, hide spreads, studs, beaten hide, patchwork, form, armor pieces), moved out 2026-11-16 =====
// ---------- round 89 (2026-11-16): Leatherworking base, eight pitched directions the user picked (all eight), keys 1-8 ----------
const st89 = (x, y, r) => { const g = ctx.createRadialGradient(x - r * .35, y - r * .35, .2, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#b8bcc4'); g.addColorStop(1, '#4a4c54'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
const puff89 = (x, y, n, col, sp = 30) => { for (let k = 0; k < n; k++) spawn({ x: x + (Math.random() - .5) * 8, y, vx: (Math.random() - .5) * sp * 2, vy: (Math.random() - .5) * sp - 12, g: -8, life: .9, size: 1.6 + Math.random() * 1.6, col }); };
const strap89 = (I, c0 = LWC.lt, c1 = LWC.md, s = 20) => hide83(I.x0 - 2, I.tipX, I.ly - 6, I.ly + 6, c0, c1, s);
const SC89 = ['#d8a670', '#c8925c', '#e0b480', '#a87444', '#b88050'];
const sndPat89 = (i, at = 0, f = 120) => { const v = fat45(i), n = pick45(i, 3); drum46(f * semi(n / 3), at, .03 * v); noise(at, .06, .014 * v, 600, .7, 'lowpass', true); };
const LW89 = {
  A: { name: 'Through the rollers', desc: 'A thick, rough raw hide waits ahead of the fill, taller than the bar. Two rollers sit at the front, above and below; each skill-up they spin and draw the hide in, and a neat flat strap comes out behind them, flecks squeezed out above and below.',
    snd: i => { const v = fat45(i); noise(0, .4, .012 * v, 300, .7, 'lowpass'); sndPat89(i, .3, 90); },
    V: { grow(p, x0, y, L, f, t, I) { strap89(I); }, over(p, I) { const y = I.ly, fx = I.tipX + 3, o = near85(I, .1);
        if (fx < I.x1 + 2) { const g = ctx.createLinearGradient(0, y - 9, 0, y + 9); g.addColorStop(0, '#dcb898'); g.addColorStop(1, '#8e664a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(fx, y - 9, I.x1 + 2 - fx, 18, [5, 2, 2, 5]); ctx.fill();
          ctx.fillStyle = 'rgba(60,34,18,.4)'; for (let x = Math.ceil(fx / 3) * 3; x < I.x1; x += 3) if (rnd53(x * .71) > .5) ctx.fillRect(x, y - 8 + rnd53(x * 1.3) * 15, 1, 1.4); }
        const spin = S.age * 1.5 + (o && o.t >= 0 ? 7 * eOut(clamp(o.t / .5)) : 0);
        [-1, 1].forEach(s => { const cy = y + s * 10.5, g = ctx.createRadialGradient(fx - 2, cy - 2, .5, fx, cy, 5.5); g.addColorStop(0, '#b07a4a'); g.addColorStop(1, '#3a2210'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, cy, 5.5, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(255,230,190,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(fx, cy); ctx.lineTo(fx + Math.cos(spin * s) * 4.5, cy + Math.sin(spin * s) * 4.5); ctx.stroke(); });
        if (o && o.t >= .1) once('lw89a' + o.i, () => [-1, 1].forEach(s => { for (let k = 0; k < 4; k++) spawn({ x: fx - 3, y: y + s * 4, vx: -10 - Math.random() * 30, vy: s * (20 + Math.random() * 30), g: 0, life: .5, size: 1, shape: 'sq', vr: 6, col: '#c89a6a' }); })); } } },
  B: { name: 'Wet-molded bosses', desc: 'Cuir bouilli armor: the fill is hardened leather with a row of raised round bosses. Each skill-up a puff of steam rises at the front and the soft leather there is pushed up further into the next boss; a finished boss catches the light.',
    snd: i => { const v = fat45(i); noise(0, .45, .008 * v, 700, .5, 'lowpass'); sndPat89(i, .02, 110); },
    V: { grow(p, x0, y, L, f, t, I) { strap89(I, '#b88050', '#6e4422', 21); for (let cx = x0 + 7; cx - 6 < I.tipX; cx += 12) { const pr = clamp((I.tipX - (cx - 6)) / 12), r = 4.2 * pr; if (r < .5) continue;
          ctx.fillStyle = 'rgba(20,8,2,.45)'; ctx.beginPath(); ctx.arc(cx + .8, y + .8, r + .6, 0, 7); ctx.fill(); const g = ctx.createRadialGradient(cx - r * .4, y - r * .4, .3, cx, y, r); g.addColorStop(0, pr >= 1 ? '#fbe0b0' : '#e0b484'); g.addColorStop(1, '#7a4c26'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, y, r, 0, 7); ctx.fill(); } },
      over(p, I) { const o = near85(I, .1); if (!o || o.t < 0) return; once('lw89b' + o.i, () => { puff89(o.b, I.ly - 7, 6, 'rgba(235,235,235,.45)'); const c = Math.floor((o.b - I.x0 + 6 - 7) / 12), cpr = Math.floor((o.a - I.x0 + 6 - 7) / 12); if (c > cpr) spawn({ x: I.x0 + 7 + c * 12 - 12, y: I.ly - 2, shape: 'star', size: 4, life: .5, col: '#fff4d0' }); }); } } },
  C: { name: 'The hide spreads out', desc: 'The fill is a whole hide, not a strip: behind the front it spreads out above and below the bar, with leg flaps along it. Each skill-up the newest part unfolds from folded-over to spread flat with a soft flop.',
    snd: i => sndPat89(i, .15, 100),
    V: { grow(p, x0, y, L, f, t, I) { strap89(I, LWC.lt, LWC.md, 22); }, over(p, I) { const y = I.ly, fx = I.tipX, o = near85(I, .1), L = I.x1 - I.x0; if (fx <= I.x0) return;
        const lobe = x => [.12, .34, .62, .86].reduce((s, c) => s + 5 * Math.exp(-Math.pow((x - I.x0 - c * L) / 7, 2)), 0);
        const e = x => { let k = clamp((x - I.x0 + 2) / 8) * clamp((fx - x) / 4); if (o && o.t > -.1 && x > o.a - 12) k *= eBack(clamp(o.t / .35)); return Math.max(0, (3.5 + lobe(x)) * k); };
        ctx.beginPath(); for (let x = I.x0 - 2; x <= fx; x += 2) ctx.lineTo(x, y - 6 - e(x)); for (let x = fx; x >= I.x0 - 2; x -= 2) ctx.lineTo(x, y + 6 + e(x)); ctx.closePath();
        const g = ctx.createLinearGradient(0, y - 16, 0, y + 16); g.addColorStop(0, LWC.hi); g.addColorStop(.5, LWC.lt); g.addColorStop(1, LWC.dk); ctx.fillStyle = g; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 4; ctx.fill(); ctx.shadowColor = 'transparent';
        if (o && o.t >= .2) once('lw89c' + o.i, () => puff89(fx - 4, y + 8, 4, 'rgba(225,195,150,.7)', 20)); } } },
  D: { name: 'Studded strap', desc: 'Studded leather: each skill-up a domed metal stud drops in from above at the front and is set with a squash, the strap flexing under it and a glint; a bigger stud at each notch. One straight row.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(520 * semi(n), 0, .012 * v, .16, 'triangle'); drum46(150, 0, .02 * v); },
    V: { grow(p, x0, y, L, f, t, I) { strap89(I, LWC.md, LWC.dk, 23); const N = I.N, cw = (I.x1 - x0) / N; for (let x = x0 + 4; x < I.X(S.v0) - 2; x += 6) { const j = Math.round((x - x0) / cw), nb = Math.abs(x - (x0 + j * cw)) < 3 && j > 0; st89(x, y, nb ? 2.7 : 1.7); } },
      shake(I) { const o = near85(I, .1); if (!o || o.t < 0 || o.t > .15) return [0, 0]; return [0, 1.3 * (1 - o.t / .15)]; },
      over(p, I) { const y = I.ly; hits83(I).forEach(o => { const x = o.b - 2; if (o.t >= 0) { const sq = o.t < .12 ? 1 - Math.sin(Math.PI * o.t / .12) * .35 : 1; ctx.save(); ctx.translate(x, y); ctx.scale(1 + (1 - sq), sq); st89(0, 0, 2); ctx.restore(); once('lw89d' + o.i, () => spawn({ x, y: y - 2, shape: 'star', size: 3.5, life: .4, col: '#ffffff' })); }
          else if (o.t > -.2) { const u = 1 - (-o.t) / .2; st89(x, lerp(y - 24, y, u * u), 2); } }); } } },
  E: { name: 'Beaten hide', desc: 'A hide hangs over the bar at the front, its flaps above and below. Each skill-up a paddle swings down and beats it: a big cloud of dust bursts out above and below, and the beaten part behind is flat and darker.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); drum46(80 * semi(n / 3), 0, .04 * v); noise(0, .35, .014 * v, 450, .6, 'lowpass'); },
    V: { grow(p, x0, y, L, f, t, I) { strap89(I, LWC.md, LWC.dk, 24); }, shake(I) { const o = near85(I, .3); if (!o || o.t < 0 || o.t > .15) return [0, 0]; return [0, 1.6 * (1 - o.t / .15)]; },
      over(p, I) { const y = I.ly, fx = I.tipX, o = near85(I, .3); const g = ctx.createLinearGradient(0, y - 11, 0, y + 11); g.addColorStop(0, '#e2c49c'); g.addColorStop(1, '#a07850'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(fx - 2, y - 11, 14, 22, 4); ctx.fill();
        let a = -1.25 + Math.sin(S.age * 1.3) * .05; if (o && o.t > -.3 && o.t < 0) a = lerp(-1.6, 0, Math.pow((o.t + .3) / .3, 2)); else if (o && o.t >= 0 && o.t < .4) a = lerp(0, -1.25, eOut(o.t / .4));
        ctx.save(); ctx.translate(fx - 16, y - 2); ctx.rotate(a); ctx.strokeStyle = '#6a4424'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(14, 0); ctx.stroke(); ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.roundRect(14, -3.5, 12, 7, 3); ctx.fill(); ctx.restore();
        if (o && o.t >= 0) once('lw89e' + o.i, () => { puff89(fx + 5, y - 10, 9, 'rgba(210,190,160,.55)', 45); puff89(fx + 5, y + 10, 7, 'rgba(210,190,160,.55)', 45); }); } } },
  F: { name: 'Patchwork from a pile', desc: 'A heap of leather scraps sits just left of the bar. The fill is a patchwork of straight-cut pieces in different tans. Each skill-up a scrap hops off the heap, flies along and drops into the gap at the front like a puzzle piece; its straight seam seals with a glint.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); pluck(110 * semi(n), .016 * v); sndPat89(i, 0, 130); },
    V: { grow(p, x0, y, L, f, t, I) { for (let x = x0 - 2, k = 0; x < I.tipX; x += 7, k++) { const w = Math.min(7, I.tipX - x); hide83(x, x + w, y - 6, y + 6, SC89[k % 5], mix(SC89[k % 5], '#000000', .35), k); ctx.fillStyle = 'rgba(30,14,4,.55)'; ctx.fillRect(x + 6.5, y - 6, .8, 12); } },
      over(p, I) { const y = I.ly, hx = I.x0 - 14, hy = y + 6; for (let k = 0; k < 7; k++) { ctx.save(); ctx.translate(hx + [-5, 0, 5, -3, 3, 0, -6][k], hy - [0, 0, 0, 3, 3, 6, 2][k]); ctx.rotate(k * .7); ctx.fillStyle = SC89[k % 5]; ctx.beginPath(); ctx.roundRect(-3, -2, 6, 4, 1); ctx.fill(); ctx.restore(); }
        hits83(I).forEach(o => { if (o.t > -.45 && o.t < 0) { const u = (o.t + .45) / .45, x = lerp(hx, o.b - 3, u), yy = lerp(hy - 6, y, u) - Math.sin(Math.PI * u) * 22; ctx.save(); ctx.translate(x, yy); ctx.rotate((1 - u) * 5); ctx.fillStyle = SC89[(o.i + 2) % 5]; ctx.beginPath(); ctx.roundRect(-3.5, -3, 7, 6, 1); ctx.fill(); ctx.restore(); }
          else if (o.t >= 0) once('lw89f' + o.i, () => spawn({ x: o.b - 1, y: y - 4, shape: 'star', size: 3.5, life: .45, col: '#fff4d0' })); }); } } },
  G: { name: 'Shaped on a form', desc: 'A soft wet strip hangs limp over the front edge. Each skill-up a wooden block rises from under the bar and presses it up level: it creaks and steams, and when the block drops away the leather holds its new stiff shape; a fresh limp end sags down again.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(140 * semi(n / 3), 0, .014 * v, .32, 'triangle', 170 * semi(n / 3)); sndPat89(i, 0, 95); },
    V: { grow(p, x0, y, L, f, t, I) { strap89(I, LWC.lt, LWC.md, 25); }, over(p, I) { const y = I.ly, fx = I.tipX, o = near85(I, .25); let droop = 1, blk = 1;
        if (o && o.t > -.25 && o.t < .35) { droop = o.t < 0 ? 1 - (o.t + .25) / .25 : 0; blk = o.t < 0 ? 1 - (o.t + .25) / .25 : 0; }
        if (o && o.t >= .35 && o.t < .8) { blk = clamp((o.t - .35) / .25); droop = clamp((o.t - .5) / .3); }
        ctx.save(); ctx.translate(fx, y); ctx.rotate(droop * 1.15); const g = ctx.createLinearGradient(0, -6, 0, 6); g.addColorStop(0, '#d8a874'); g.addColorStop(1, '#8a5a30'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-1, -6, 13, 12, [0, 4, 4, 0]); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(0, -5, 12, 1.5); ctx.restore();
        ctx.fillStyle = '#5a3a1e'; ctx.fillRect(fx - 1, y + 6 + blk * 9, 14, 6); ctx.fillStyle = 'rgba(255,230,190,.25)'; ctx.fillRect(fx - 1, y + 6 + blk * 9, 14, 1);
        if (o && o.t >= 0) once('lw89g' + o.i, () => puff89(fx + 6, y - 7, 6, 'rgba(235,235,235,.45)')); } } },
  H: { name: 'Armor pieces', desc: 'Each section of the bar (between notches) is a leather armor piece; the game would show real item icons on them. The section at the front fills in from scraps as you skill up; when it’s full, the finished plate locks on with a thump: it pops slightly larger than the bar and settles.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); noise(0, .05, .012 * v, 650, .8, 'lowpass', true); pluck(130 * semi(n), .012 * v); },
    V: { grow(p, x0, y, L, f, t, I) { const N = I.N, cw = (I.x1 - x0) / N; for (let j = 0; j < N; j++) { const a = x0 + j * cw; if (a >= I.tipX) break; if (a + cw > I.tipX) for (let x = a + 1, k = 0; x < I.tipX; x += 4, k++) { ctx.fillStyle = SC89[(j + k) % 5]; ctx.fillRect(x, y - 5 + (k % 3) * 3.5, 3.6, 3.2); } } },
      over(p, I) { const y = I.ly, N = I.N, cw = (I.x1 - I.x0) / N, EM = ['\u{1F97E}', '\u{1F9E4}', '\u{1F392}', '\u{1F45C}']; const o = near85(I, .1);
        for (let j = 0; j < N; j++) { const a = I.x0 + j * cw; if (a + cw > I.tipX + .5) break; let s = 1; if (o && o.t >= 0 && o.t < .4 && a + cw > o.a - .5 && a + cw <= o.b + .5) { s = 1 + .25 * (1 - eBack(clamp(o.t / .3))); once('lw89h' + o.i, () => drum46(90, 0, .03)); }
          ctx.save(); ctx.translate(a + cw / 2, y); ctx.scale(s, s); const g = ctx.createLinearGradient(0, -8, 0, 8); g.addColorStop(0, LWC.hi); g.addColorStop(1, LWC.dk); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-cw / 2 + 1, -8, cw - 2, 16, 3); ctx.fill();
          ctx.font = '9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(EM[j % 4], 0, .5); ctx.restore(); } } } },
};
function r89(K) { const Z = LW89[K]; return { get name() { return K + '. ' + (profName === 'Leatherworking' ? Z.name : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only; the sound is a placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r89('A'), PB: r89('B'), PC: r89('C'), PD: r89('D'), PE: r89('E'), PF: r89('F'), PG: r89('G'), PH: r89('H') });

// ===== round 91 add-ons on the per-notch Pegged out (ADD91, r91), moved out 2026-11-16 (rebuilt per skill-up in round 93) =====
const ADD91 = {
  B: { name: '+ Mallet taps the pegs', desc: 'Pegged out, and when the hide reaches the next notch a small mallet taps the new pegs in: the top one, then the bottom one, a soft tok each, the hide jolting taut with each tap.',
    over(p, I) { const c = cross91(I); if (!c || c.t < 0 || c.t > .7) return; const y = I.ly, hit = (t0, sy) => { const u = clamp((c.t - t0 + .14) / .14), back = clamp((c.t - t0) / .14); const d = c.t < t0 ? 1 - u : back; mallet91(c.nx + 1, y + sy * (8 + d * 9), sy < 0 ? -.2 - d * .5 : Math.PI + .2 + d * .5); };
      if (c.t < .4) hit(.3, -1); else hit(.5, 1); if (c.t >= .5) once('lw91b' + c.o.i, () => tok90(.8)); },
    shake(I) { const c = cross91(I); if (!c) return [0, 0]; const k = [.3, .5].reduce((s, t0) => s + (c.t >= t0 && c.t < t0 + .1 ? 1 - (c.t - t0) / .1 : 0), 0); return [0, 1.2 * k]; } },
  C: { name: '+ Tension shiver', desc: 'Pegged out, and when the new pegs go in a shiver runs back along the whole pegged hide to its start: the older pegs wobble one after another and a ripple of light runs back over the leather.',
    pre(I) { const c = cross91(I); PEGDY91 = !c || c.t < .3 ? null : x => { const tt = c.t - .3 - (c.nx - x) / 320; return tt > 0 && tt < .6 ? 1.4 * Math.exp(-tt * 7) * Math.sin(tt * 42) : 0; }; },
    over(p, I) { const c = cross91(I); if (!c || c.t < .3) return; const u = (c.t - .3) / .7; if (u >= 1) return; const sx = lerp(c.nx, I.x0 - 10, u), y = I.ly, g = ctx.createLinearGradient(sx - 12, 0, sx + 12, 0); g.addColorStop(0, 'rgba(255,236,200,0)'); g.addColorStop(.5, `rgba(255,236,200,${.35 * (1 - u)})`); g.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 12, y - 5, 24, 10); if (c.t > .32) once('lw91c' + c.o.i, () => noise(0, .5, .006, 380, 2, 'bandpass')); } },
  D: { name: '+ Scraps trimmed off', desc: 'Pegged out, and when the hide pulls taut at the new pegs the loose excess at the front is trimmed off: a few leather scraps drop away below the bar, tumbling, and fade.',
    over(p, I) { const c = cross91(I); if (!c || c.t < .32) return; once('lw91d' + c.o.i, () => { [[-1, .9], [1, 1], [1, .7], [-1, .6], [1, .5]].forEach(([sy, s], k) => spawn({ x: c.nx + 2 + k, y: I.ly + sy * 5, vx: 8 + Math.random() * 25, vy: sy < 0 ? -30 : 10 + Math.random() * 20, g: 260, life: .85, size: 1.6 * s, shape: 'sq', vr: (Math.random() - .5) * 14, col: SC91[k % 3] })); noise(0, .05, .012, 600, .8, 'lowpass', true); }); } },
  E: { name: '+ Stretched hide sheen', desc: 'Pegged out, and when the hide pulls taut at the new pegs a soft glint slides along the stretch it just finished (only that stretch, from the last pegs to the new ones), like leather drawn tight catching the light.',
    over(p, I) { const c = cross91(I); if (!c || c.t < .35 || c.t > .8) return; const u = (c.t - .35) / .45, sx = lerp(c.xa - 4, c.nx + 4, eOut(u)), y = I.ly; ctx.save(); ctx.beginPath(); ctx.rect(c.xa, y - 5, c.nx - c.xa, 10); ctx.clip(); const g = ctx.createLinearGradient(sx - 7, 0, sx + 7, 0); g.addColorStop(0, 'rgba(255,248,230,0)'); g.addColorStop(.5, `rgba(255,248,230,${.6 * Math.sin(Math.PI * u)})`); g.addColorStop(1, 'rgba(255,248,230,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 7, y - 5, 14, 10); ctx.restore(); } },
};
const SC91 = ['#c89a6a', '#a87444', '#e0b480'];
function r91(K) { const A = LW90.B, X = ADD91[K]; const V = !X ? A.V : { grow: A.V.grow, shake: X.shake, over(p, I) { if (X.pre) X.pre(I); try { A.V.over(p, I); } finally { PEGDY91 = null; } X.over(p, I); } };
  return { get name() { return K + '. ' + (X ? X.name : 'Pegged out (the base)'); },
    get desc() { return (X ? X.desc : 'The base, locked: the hide is pegged out at the notches; from the last pegs to the front it is pulled thin like a tarp (pale, see-through, pinched); each skill-up pulls it further with a creak and a shiver; reaching the next notch, a peg pair punches in and it settles into thick leather.') + ' (Try all three moments; the sound is a placeholder.)'; },
    get note() { return (X ? X.name : 'pegged out').toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Leatherworking' || S.p !== PROF.Leatherworking) { profName = 'Leatherworking'; const s = build(); s.age = S.age; S = s; } LWS83 = A.snd; try { barModule(top, 'A', V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r91('A'), PB: r91('B'), PC: r91('C'), PD: r91('D'), PE: r91('E') });

// ===== round 90 options (LW90, r90) and round 92 rest (pullFar92, LW92, r92), moved out 2026-11-16 (base locked: VAR21.Skinning.B on LWB92) =====
const LW90 = {
  A: { name: 'Pegged out, as it was (on Skinning’s bar)', desc: 'The Skinning round 21 option exactly as it was, shown on Skinning’s bar (the header says Skinning): the hide is stretched along the bar, held by pegs at its top and bottom edge; each skill-up a new pair of pegs punches in at the front and the loose hide pulls taut to them. Is this the one?', skin: true, V: VAR21.Skinning.B },
  B: { name: 'Pulled thin to the next peg', desc: 'Leatherworking: the hide is pegged out at the notches. From the last pegs to the front the leather is pulled out thin like a tarp: pale, see-through, pinched in at the middle, tension lines running along it. Each skill-up it is pulled further with a creak and shivers; when it reaches the next notch a pair of pegs punches in and it settles into full, thick leather with a soft slap.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(140 * semi(n / 3), 0, .016 * v, .32, 'triangle', 168 * semi(n / 3)); noise(0, .25, .005 * v, 400, 3, 'bandpass'); },
    V: { grow(p, x0, y, L, f, t, I) { const { cw, at } = sec90(I), pk = x0 + at(I.tipX) * cw, o = near85(I, .1); let k = 0, shiv = 0, xs = pk;
        if (o && o.t >= 0 && at(o.b) > at(o.a)) { xs = x0 + at(o.a) * cw; k = clamp((o.t - .3) / .25); if (k >= 1) xs = pk; else xs = x0 + at(o.a) * cw; }
        if (o && o.t >= 0) shiv = 1.2 * Math.exp(-o.t * 6) * Math.sin(o.t * 30);
        hide83(x0 - 2, xs, y - 5, y + 5, '#b0784a', '#7a4e2a', 30); tarp90(xs, I.tipX, y, k, shiv); },
      over(p, I) { const { cw, at } = sec90(I), y = I.ly, o = near85(I, .1); peg90(I.x0 + .5, y); for (let j = 1; j <= at(I.tipX); j++) { const x = I.x0 + j * cw; let s = 1; if (o && o.t >= 0 && at(o.b) >= j && at(o.a) < j) { if (o.t < .3) continue; s = 1 + .8 * (1 - clamp((o.t - .3) / .12)); once('lw90b' + o.i, () => { tok90(fat45(o.i)); spawn({ x, y: y - 5, shape: 'star', size: 3, life: .4, col: '#fff4d0' }); }); } peg90(x, y, s); } } } },
  C: { name: 'Tarp across the gap', desc: 'Leatherworking: the hide is pegged out at the notches, and the next pegs already wait at the next notch. Across that whole gap the leather is stretched thin like a tarp, see-through and pinched; each skill-up gives it a tug toward the next pegs (a jolt and a shiver), and it fills in thicker and darker. At the notch it is full leather, the next pegs pop in further on and a new thin tarp is stretched across.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); noise(0, .2, .006 * v, 450, 2, 'bandpass'); drum46(120 * semi(n / 3), 0, .02 * v); },
    V: { grow(p, x0, y, L, f, t, I) { const { cw, at } = sec90(I), j = at(I.tipX), a = x0 + j * cw, b = Math.min(I.x1, a + cw), o = near85(I, .1), k = clamp((I.tipX - a) / cw);
        let shiv = 0; if (o && o.t >= 0) shiv = 1.4 * Math.exp(-o.t * 6) * Math.sin(o.t * 30);
        hide83(x0 - 2, a, y - 5, y + 5, '#b0784a', '#7a4e2a', 31); tarp90(a, b, y, k * .85, shiv); },
      over(p, I) { const { cw, at } = sec90(I), y = I.ly, j = at(I.tipX), o = near85(I, .1); for (let q = 0; q <= Math.min(I.N, j + 1); q++) { const x = I.x0 + q * cw + (q === 0 ? .5 : 0); let s = 1; if (q === j + 1 && o && o.t >= 0 && at(o.b) > at(o.a)) { s = eBack(clamp(o.t / .25)); once('lw90c' + o.i, () => tok90(fat45(o.i))); } if (s > .05) peg90(x, y, s); } } } },
};
function r90(K) { const Z = LW90[K]; return { get name() { return K + '. ' + Z.name; },
  get desc() { return Z.desc + (Z.skin ? '' : ' (Base design only; the sound is a placeholder. Try “Five in a row”.)'); },
  get note() { return Z.name.toLowerCase() + '.'; },
  draw(top) { if (Z.skin) { const pn = profName; if (S.p !== PROF.Skinning) { profName = 'Skinning'; const s = build(); s.age = S.age; S = s; } profName = 'Skinning'; try { barModule(top, 'A', Z.V); } finally { profName = pn; } return; }
    if (profName !== 'Leatherworking' || S.p !== PROF.Leatherworking) { profName = 'Leatherworking'; const s = build(); s.age = S.age; S = s; }
    LWS83 = Z.snd; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r90('A'), PB: r90('B'), PC: r90('C') }); delete FAM.PD; delete FAM.PE; delete FAM.PF; delete FAM.PG; delete FAM.PH;
const pullFar92 = t => t < 0 ? 0 : t < .16 ? 30 * eOut(t / .16) : Math.max(0, 30 * Math.exp(-(t - .16) * 6) * Math.cos((t - .16) * 13));
const LW92 = {
  A: LW90.A,
  B: { name: 'Bigger steps (to the next recipe)', prof: LWB92, desc: 'Leatherworking’s bar runs to the next recipe unlock (here 5 points: Hillman’s Leather Vest at 125), as Skinning’s runs to the next beasts, so each skill-up pegs about a fifth of the bar: a new peg pair punches in at the front and the loose hide pulls taut to it, exactly as on Skinning.', V: VAR21.Skinning.B },
  C: { name: 'Pulled far, springs back', desc: 'The rank-long bar, pegged per notch. Each skill-up the hide is yanked far ahead of the front, stretched tissue-thin, then it springs back to the real front with a shiver; at the next notch the pegs punch in as before.', snd: LW90.B.snd,
    V: { grow(p, x0, y, L, f, t, I) { LW90.B.V.grow(p, x0, y, L, f, t, I); const o = near85(I, .1); if (!o) return; const ext = pullFar92(o.t); if (ext > .5) tarp90(I.tipX - 1, Math.min(I.x1 + 1, I.tipX + ext), y, 0, 0); }, over: LW90.B.V.over } },
};
function r92(K) { const Z = LW92[K]; if (Z.skin) return r90('A');
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Try all three moments.)'; }, get note() { return Z.name.toLowerCase() + '.'; },
    draw(top) { const P = Z.prof || PROF.Leatherworking; if (profName !== 'Leatherworking' || S.p !== P) { profName = 'Leatherworking'; const keep = PROF.Leatherworking; PROF.Leatherworking = P; try { const s = build(); s.age = S.age; S = s; } finally { PROF.Leatherworking = keep; } }
      const snd0 = S.p.snd; LWS83 = Z.snd || null; if (Z.prof) S.p.snd = k => { const v = fat45(Math.round(Math.log2(k) * 6)); tone(140 * semi(Math.round(Math.log2(k) * 6) % 5), 0, .014 * v, .3, 'triangle', 170); };
      try { barModule(top, 'A', Z.V); } finally { LWS83 = null; S.p.snd = snd0; } } }; }
LW92.D = { name: 'Tarp across the gap (round 90 C)', desc: LW90.C.desc, snd: LW90.C.snd, V: LW90.C.V };
Object.assign(FAM, { PA: r92('A'), PB: r92('B'), PC: r92('C'), PD: r92('D') }); delete FAM.PE;

// ===== round 94 A, B, D (Rawhide mallet, Silhouette mallet, One big blow; mallet94, swing94, malletRun94) and r94's FAM line, moved out 2026-11-16 (C locked) =====
function mallet94(px, py, flip, ang, style, k = 1, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(px, py); ctx.scale(k, flip * k); ctx.rotate(ang);
  if (style === 'sil') { ctx.fillStyle = '#24160a'; ctx.beginPath(); ctx.roundRect(-16, -1.1, 17, 2.2, 1.1); ctx.fill(); ctx.beginPath(); ctx.roundRect(-22, -5.5, 8.5, 11, 2.5); ctx.fill(); ctx.fillStyle = 'rgba(255,214,150,.75)'; ctx.fillRect(-21.2, -5.2, 6.9, 1.1); ctx.fillRect(-15, -1.1, 15, .7); ctx.restore(); return; }
  const hg = ctx.createLinearGradient(0, -1.4, 0, 1.4); hg.addColorStop(0, '#d8a46a'); hg.addColorStop(1, '#6a4020'); ctx.fillStyle = hg; ctx.beginPath(); ctx.moveTo(1, -1.2); ctx.lineTo(-15, -1.5); ctx.lineTo(-15, 1.5); ctx.lineTo(1, 1.2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a2c14'; ctx.beginPath(); ctx.arc(1, 0, 1.5, 0, 7); ctx.fill();
  const g = ctx.createLinearGradient(-22, 0, -13.5, 0); g.addColorStop(0, '#8a5a30'); g.addColorStop(.35, '#ecc898'); g.addColorStop(1, '#7a4c26'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-22, -5.5, 8.5, 11, 2); ctx.fill();
  ctx.fillStyle = 'rgba(70,40,15,.55)'; ctx.fillRect(-22, -2.4, 8.5, 1); ctx.fillRect(-22, 1.4, 8.5, 1);
  ctx.fillStyle = '#5a361a'; ctx.beginPath(); ctx.ellipse(-17.75, 5.3, 4.25, 1.1, 0, 0, 7); ctx.fill(); ctx.restore(); }
// the swing: raised angle -> strike (contact at tc) -> rebound; returns the angle and whether it is mid-swing
const swing94 = (t, tc, up = .95) => { if (t < tc - .14) return { a: .35, fast: 0 }; if (t < tc - .05) return { a: lerp(.35, up, eOut((t - tc + .14) / .09)), fast: 0 }; if (t < tc) { const u = (t - tc + .05) / .05; return { a: lerp(up, 0, u * u), fast: 1 }; } return { a: .3 * Math.sin(Math.PI * clamp((t - tc) / .12)) * Math.exp(-(t - tc) * 5), fast: 0 }; };
function malletRun94(I, style, k) { const y = I.ly; pegs93(I).forEach(o => { if (o.t < .2 || o.t > .9) return; const x = o.b, fade = clamp((o.t - .2) / .08) * clamp((.9 - o.t) / .1);
    [[.42, -1], [.6, 1]].forEach(([tc, sy], n) => { const live = n === 0 ? o.t < .52 : o.t >= .5; if (!live) return; const s = swing94(o.t, tc), py = y + sy * (12 * k), pxx = x + 18 * k;
      if (s.fast) for (let g = 1; g <= 2; g++) mallet94(pxx, py, -sy, s.a + g * .22, style, k, .22 / g * fade);
      mallet94(pxx, py, -sy, s.a, style, k, fade); if (o.t >= tc) once('lw94' + style + o.i + n, () => { tok90(.7); hit94(x, y + sy * 6.5); }); }); }); }
  A: { name: 'Rawhide mallet + scraps', desc: 'A rawhide mallet (a wrapped leather head on a tapered wooden handle) swings from the wrist and taps the new pegs in, the top one then the bottom one: a quick wind-up, a fast swing with a short motion trail, a soft tok and a small ring where it lands, a little rebound. The trimmed scraps drop away as before.',
    over(p, I) { malletRun94(I, 'raw', 1); } },
  B: { name: 'Silhouette mallet + scraps', desc: 'The same taps with the mallet as one clean dark shape with a warm rim light along its top: no detail to look rough, just the motion. The trimmed scraps drop away as before.',
    over(p, I) { malletRun94(I, 'sil', 1); } },
  D: { name: 'One big blow + scraps', desc: 'A bigger rawhide mallet comes down once on each new peg pair from above: one heavy, slower blow drives both pegs in at once, the bar dips, a ring spreads from each peg, one deeper tok. The trimmed scraps drop away as before.',
    shake(I) { const o = pegs93(I).pop(); if (!o || o.t < .42 || o.t > .54) return [0, 0]; return [0, 2 * (1 - (o.t - .42) / .12)]; },
    over(p, I) { const y = I.ly; pegs93(I).forEach(o => { if (o.t < .17 || o.t > .9) return; const s = swing94(o.t, .42, 1.05), fade = clamp((o.t - .17) / .08) * clamp((.9 - o.t) / .1), x = o.b;
      if (s.fast) for (let g = 1; g <= 2; g++) mallet94(x + 26, y - 14.6, 1, s.a + g * .2, 'raw', 1.45, .2 / g * fade);
      mallet94(x + 26, y - 14.6, 1, s.a, 'raw', 1.45, fade); if (o.t >= .42) once('lw94d' + o.i, () => { drum46(95, 0, .03); tok90(.9); hit94(x, y - 6.5); hit94(x, y + 6.5); }); }); } },
};
Object.assign(FAM, { PA: r94('A'), PB: r94('B'), PC: r94('C'), PD: r94('D') }); delete FAM.PE;

// ===== round 84 (LW84: A Unrolling hide (= LW83.A), D Grip wrap; pelt84, r84) and round 85 (LW85, r85), moved out 2026-11-16; both were liked references, not locked =====
function pelt84(w, h, c0, c1) { const g = ctx.createRadialGradient(-w * .15, -h * .2, 1, 0, 0, w * .6); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, 7); ctx.fill();
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.ellipse(sx * w * .36, sy * h * .42, w * .14, h * .2, sx * sy * .5, 0, 7); ctx.fill(); }); }
const LW84 = {
  A: LW83.A,
  D: { name: 'Grip wrap', desc: 'The filled part is wrapped in a leather strap like a sword grip, slanted turns all the same way. The strap’s loose tail hangs from the front and sways. Each skill-up the tail swings round the bar, behind it and back over the top, and cinches one more turn tight with a creak; the new turn catches the light.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); noise(0, .18, .005 * v, 600, .6, 'lowpass'); tone(140 * semi(n / 3), 0, .016 * v, .28, 'triangle', 175 * semi(n / 3)); noise(0, .2, .005 * v, 380, 3, 'bandpass'); drum46(150, .02, .014 * v); },
    V: { grow(p, x0, y, L, f, t, I) { const xe = I.tipX, o = last83(I); if (xe <= x0 - 2) return; ctx.save(); ctx.beginPath(); ctx.rect(x0 - 2, y - 7, xe - x0 + 2, 14); ctx.clip();
        for (let x = x0 - 12; x < xe + 8; x += 6) { ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x + 5, y + 6); ctx.lineTo(x + 9, y - 6); ctx.lineTo(x + 4, y - 6); ctx.closePath();
          const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, LWC.md); g.addColorStop(.35, LWC.hi); g.addColorStop(1, LWC.dk); ctx.fillStyle = g; ctx.fill(); }
        ctx.strokeStyle = 'rgba(30,14,4,.7)'; ctx.lineWidth = .9; for (let x = x0 - 12; x < xe + 8; x += 6) { ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x + 4, y - 6); ctx.stroke(); }
        if (o && o.t >= 0 && o.t < .6) { ctx.fillStyle = `rgba(255,240,210,${.5 * (1 - o.t / .6)})`; ctx.fillRect(xe - 7, y - 6, 7, 12); }
        ctx.restore(); },
      over(p, I) { const y = I.ly, o = last83(I), fx = I.tipX; let th = 0;
        if (o && o.t > -.3 && o.t < .05) th = clamp((o.t + .3) / .35) * Math.PI * 2;
        const sway = Math.sin(S.age * 2.2) * .18 + (o && o.t >= .05 ? .5 * Math.exp(-(o.t - .05) * 5) * Math.sin((o.t - .05) * 14) : 0);
        const R = 13, ang = th + sway, tx = fx + 4 + Math.sin(ang) * 3 + th * 1.2, ty = y + Math.cos(ang) * R, z = Math.sin(ang - Math.PI / 2) * -1, behind = th > Math.PI * .5 && th < Math.PI * 1.5;
        ctx.save(); if (behind) ctx.globalAlpha *= .45; ctx.lineCap = 'round'; ctx.strokeStyle = behind ? LWC.dk : LWC.lt; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(fx, y + (ty > y ? 5 : -5)); ctx.quadraticCurveTo(fx + 3, (y + ty) / 2 + (ty > y ? 3 : -3), tx, ty); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,236,200,.35)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); } } },
};
function r84(K) { const Z = LW84[K]; return { get name() { return K + '. ' + (profName === 'Leatherworking' ? Z.name + (K === 'A' ? ' (kept)' : '') : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only: the finale and the real sound come later; the sound is a gentle placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r84('A'), PB: r84('B'), PC: r84('C'), PD: r84('D') });
const LW85 = {
  A: LW84.D,
};
function r85(K) { const Z = LW85[K]; return { get name() { return K + '. ' + (profName === 'Leatherworking' ? Z.name + (K === 'A' ? ' (kept)' : '') : ['Fishing', 'Herbalism', 'Skinning', 'Mining', 'Blacksmithing'].includes(profName) ? profName + ' (done)' : 'Leatherworking only this round'); },
  get desc() { return profName === 'Leatherworking' ? Z.desc + ' (Base design only: the finale and the real sound come later; the sound is a gentle placeholder. Try “Five in a row”.)' : 'One profession at a time: this round is Leatherworking’s base. Others show their current look.'; },
  get note() { return profName === 'Leatherworking' ? Z.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Leatherworking') return r82('A').draw(top); LWS83 = Z.snd; try { barModule(top, 'A', Z.V); } finally { LWS83 = null; } } }; }
Object.assign(FAM, { PA: r85('A') });

// ===== round 95 finales (FIN95: A Strike cascade, B Pegs pop + hide rolls up; r95), moved out 2026-11-16 (mixed in round 96) =====
const FIN95 = {
  A: { name: 'Strike cascade', finAt: F0_95 + .75, desc: 'Reaching the next recipe: a fast run of strike streaks re-sets every peg pair from the start of the bar to its end, a white ring and a tok on each, the toks climbing a soft scale; the last and biggest streak lands on the recipe’s icon, which lights.',
    over(p, I) { const ts = ts95(); if (ts < F0_95) return; const xs = pegXs95(I), y = I.ly, gap = .07;
      xs.forEach((x, j) => { const t0 = F0_95 + j * gap, u = (ts - t0 + .06) / .06; streak95(x, y - 6.5, -1, u); streak95(x, y + 6.5, 1, u);
        if (ts >= t0) once('lw95a' + j, () => { hit94(x, y - 6.5); hit94(x, y + 6.5); tone(300 * semi(PENT42[j % 10]), 0, .014, .18, 'triangle'); drum46(140, 0, .012); }); });
      const tb = F0_95 + xs.length * gap + .1, ux = I.x1 + 18; streak95(ux, y, -1, (ts - tb + .08) / .08, 1.6);
      if (ts >= tb) once('lw95ab', () => { spawn({ x: ux, y, size: 3, shape: 'ring', grow: 18, life: .45, col: '#ffffff' }); drum46(110, 0, .028); }); } },
  B: { name: 'Pegs pop, hide rolls up', finAt: F0_95 + 1.22, desc: 'Reaching the next recipe: the finished hide rolls up from the start of the bar, the pegs popping out one pair after another just ahead of the roll, which grows fatter as it goes; at the end the roll hops off the bar and tumbles into the recipe’s icon, which lights.',
    clip(I) { const ts = ts95(); if (ts < F0_95) return null; const u = clamp((ts - F0_95) / .7); return lerp(I.x0 - 3, I.x1 + 3, eOut(u * .9 + u * u * .1)); },
    over(p, I) { const ts = ts95(); if (ts < F0_95) return; const y = I.ly, rx = FIN95.B.clip(I), rolled = rx - I.x0, r = Math.min(8, 2.5 + rolled * .028);
      pegXs95(I).forEach((x, j) => { if (rx >= x - 3) once('lw95b' + j, () => { [-1, 1].forEach(sy => spawn({ x, y: y + sy * 5, vx: 10 + Math.random() * 30, vy: sy * (40 + Math.random() * 30) - 20, g: 300, life: .7, size: 1.4, shape: 'sq', vr: 10, col: '#5a3a1e' })); tone(420 * semi(PENT42[j % 10]), 0, .01, .1, 'triangle'); }); });
      const hop = clamp((ts - F0_95 - .75) / .4), ux = I.x1 + 18, cx = lerp(rx, ux, eOut(hop)), cy = lerp(y + 5 - r, y, hop) - Math.sin(Math.PI * hop) * 14, sc = 1 - hop * .6, ang = rolled / r + hop * 8;
      if (hop >= 1) { once('lw95bi', () => { spawn({ x: ux, y, size: 3, shape: 'ring', grow: 16, life: .45, col: '#fff' }); drum46(100, 0, .026); }); return; }
      ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(1, r + .5, r * .9, 1.4, 0, 0, 7); ctx.fill();
      const g = ctx.createRadialGradient(-r * .35, -r * .4, .5, 0, 0, r); g.addColorStop(0, '#d8a874'); g.addColorStop(.6, '#9a6a3e'); g.addColorStop(1, '#4a2c14'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(60,32,12,.75)'; ctx.lineWidth = .9; ctx.beginPath(); for (let a = 0; a < 5 * Math.PI; a += .2) { const rr = r * (.15 + .8 * a / (5 * Math.PI)); ctx.lineTo(Math.cos(a + ang) * rr, Math.sin(a + ang) * rr); } ctx.stroke(); ctx.restore(); } },
};
function r95(K) { const F = FIN95[K], L = LW94.C, base = VAR21.Skinning.B;
  const V = { finAt: F.finAt, shake: L.shake || ADD93.B.shake,
    grow(p, x0, y, Ln, f, t, I) { const cx = F.clip ? F.clip(I) : null; if (cx === null) return base.grow(p, x0, y, Ln, f, t, I); ctx.save(); ctx.beginPath(); ctx.rect(cx, y - 12, I.x1 + 8 - cx, 24); ctx.clip(); base.grow(p, x0, y, Ln, f, t, I); ctx.restore(); },
    over(p, I) { L.over(p, I); ADD93.D.over(p, I); F.over(p, I); } };
  return { get name() { return K + '. ' + F.name; }, get desc() { return F.desc + ' (Pick “Reaching the next unlock”. On the locked skill-up; the sound is a placeholder.)'; }, get note() { return 'finale: ' + F.name.toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Leatherworking' || S.p !== LWB92) { profName = 'Leatherworking'; const keep = PROF.Leatherworking; PROF.Leatherworking = LWB92; try { const s = build(); s.age = S.age; S = s; } finally { PROF.Leatherworking = keep; } }
      const snd0 = S.p.snd; S.p.snd = () => {}; window.PEGAT94 = .42; try { barModule(top, 'A', V); } finally { S.p.snd = snd0; window.PEGAT94 = 0; } } }; }
Object.assign(FAM, { PA: r95('A'), PB: r95('B') }); delete FAM.PC; delete FAM.PD;

// ===== round 93 C (Tension shiver), E (Stretched hide sheen), r93 + its FAM line; round 96 A (Cascade, then roll), moved out 2026-11-16 =====
  C: { name: '+ Tension shiver', desc: 'Each skill-up, as the new pegs pull the hide taut, a shiver runs back along the whole pegged hide to its start: each older peg pair flashes and wobbles in turn and a ripple of light runs back over the leather.',
    over(p, I) { const y = I.ly; pegs93(I).forEach(o => { if (o.t < .15 || o.t > .9) return; const u = (o.t - .15) / .75, sx = lerp(o.b, I.x0 - 10, u), g = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0); g.addColorStop(0, 'rgba(255,236,200,0)'); g.addColorStop(.5, `rgba(255,236,200,${.4 * (1 - u)})`); g.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 14, y - 6, 28, 12);
      for (let v = I.lo + 1; v <= S.v0 + o.i; v++) { const x = I.X(v), tt = o.t - .15 - (o.b - x) / 260; if (tt <= 0 || tt > .35) continue; const k = 1 - tt / .35, dy = Math.sin(tt * 45) * 1.3 * k; ctx.fillStyle = `rgba(255,240,210,${.7 * k})`; for (const sy of [-5, 5]) { ctx.beginPath(); ctx.arc(x, y + sy + dy, 2.2, 0, 7); ctx.fill(); } }
      once('lw93c' + o.i, () => noise(0, .45, .006, 380, 2, 'bandpass')); }); } },
  E: { name: '+ Stretched hide sheen', desc: 'Each skill-up, as the hide pulls taut, a soft glint slides along the stretch it just pegged (from the last pegs to the new ones), like leather drawn tight catching the light.',
    over(p, I) { const y = I.ly; pegs93(I).forEach(o => { if (o.t < .15 || o.t > .6) return; const u = (o.t - .15) / .45, sx = lerp(o.a - 4, o.b + 4, eOut(u)); ctx.save(); ctx.beginPath(); ctx.rect(o.a, y - 5, o.b - o.a, 10); ctx.clip(); const g = ctx.createLinearGradient(sx - 9, 0, sx + 9, 0); g.addColorStop(0, 'rgba(255,248,230,0)'); g.addColorStop(.5, `rgba(255,248,230,${.6 * Math.sin(Math.PI * u)})`); g.addColorStop(1, 'rgba(255,248,230,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 9, y - 5, 18, 10); ctx.restore(); }); } },
function r93(K) { const base = VAR21.Skinning.B, X = ADD93[K], V = !X ? base : { grow: base.grow, shake: X.shake, over(p, I) { if (base.over) base.over(p, I); X.over(p, I); } };
  return { get name() { return K + '. ' + (X ? X.name : 'Pegged out (locked base)'); },
    get desc() { return (X ? 'Pegged out on the recipe bar, and: ' + X.desc : 'LOCKED: Pegged out exactly as on Skinning, on Leatherworking’s bar counted to the next recipe (here Hillman’s Leather Vest at 125, 5 points): the hide is pegged along the top and bottom edges; each skill-up a new peg pair punches in at the front and the loose hide pulls taut to them.') + ' (Try all three moments; sounds are placeholders.)'; },
    get note() { return (X ? X.name : 'pegged out').toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Leatherworking' || S.p !== LWB92) { profName = 'Leatherworking'; const keep = PROF.Leatherworking; PROF.Leatherworking = LWB92; try { const s = build(); s.age = S.age; S = s; } finally { PROF.Leatherworking = keep; } }
      const snd0 = S.p.snd; S.p.snd = () => {}; try { barModule(top, 'A', V); } finally { S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r93('A'), PB: r93('B'), PC: r93('C'), PD: r93('D'), PE: r93('E') });
  A: { name: 'Cascade, then roll', R0: F0_95 + .55, desc: 'The strike cascade first (streaks re-set every peg pair from the start to the end, a ring and a climbing tok each), a breath, then the hide rolls up from the start, popping the pegs out just ahead of the roll; the roll hops off the end into the recipe icon just as one big streak lands on it, and the icon lights.',
    get finAt() { return this.R0 + 1.2; },
    over(p, I) { const ts = ts95(); if (ts < F0_95) return; const y = I.ly, xs = pegXs95(I), R0 = FIN96.A.R0;
      xs.forEach((x, j) => { const t0 = F0_95 + j * .07; strikePeg96(x, y, (ts - t0 + .06) / .06); if (ts >= t0) once('lw96a' + j, () => { hit94(x, y - 6.5); hit94(x, y + 6.5); toks96(j); }); });
      const rx = rollAt96(I, ts, R0); if (rx === null) return; xs.forEach((x, j) => { if (rx >= x - 3) once('lw96ap' + j, () => popPeg96(x, y, j)); });
      bigStrike96(I, ts, R0 + 1.1); roll96(I, rx, clamp((ts - R0 - .75) / .4), (rx - I.x0) / 5 + clamp((ts - R0 - .75) / .4) * 8); } },

// Round wrappers r12-r51 (rejected gatherer options' FAM entry points), moved out 2026-11-17 for Alchemy room. Their VAR tables stay on the page (later rounds use them).
function r12(L) { return { get name() { const v = VAR[profName]; return L + '. ' + (v ? v[L].name : 'gatherers only this round'); }, get desc() { const v = VAR[profName]; return v ? v[L].desc : 'Round 12 covers the gatherers (Herbalism, Mining, Skinning, Fishing); crafters come next. This shows the locked look.'; },
  get note() { const v = VAR[profName]; return v ? v[L].name.toLowerCase() + '.' : 'the locked look.'; }, draw(top) { const v = VAR[profName]; growModule(top, 'plain', v ? v[L] : null); } }; }
Object.assign(FAM, { PA: r12('A'), PB: r12('B'), PC: r12('C'), PD: r12('D') });
function r13(L) { return { get name() { const v = VAR13[profName]; return L + '. ' + (v ? v[L].name : 'gatherers only this round'); }, get desc() { const v = VAR13[profName]; return v ? v[L].desc : 'Round 13 covers the gatherers again (Herbalism, Mining, Skinning, Fishing); crafters come next. This shows the locked look.'; },
  get note() { const v = VAR13[profName]; return v ? v[L].name.toLowerCase() + '.' : 'the locked look.'; }, draw(top) { const v = VAR13[profName]; growModule(top, 'plain', v ? v[L] : null); } }; }
Object.assign(FAM, { PA: r13('A'), PB: r13('B'), PC: r13('C'), PD: r13('D') });
function r14(L) { return { get name() { const v = VAR14[profName]; return L + '. ' + (v ? v[L].name : 'gatherers only this round'); }, get desc() { const v = VAR14[profName]; return v ? v[L].desc : 'Round 14 covers the gatherers (Herbalism, Mining, Skinning, Fishing); crafters come next. This shows the locked look.'; },
  get note() { const v = VAR14[profName]; return v ? v[L].name.toLowerCase() + '.' : 'the locked look.'; }, draw(top) { const v = VAR14[profName]; growModule(top, 'plain', v ? v[L] : null); } }; }
Object.assign(FAM, { PA: r14('A'), PB: r14('B'), PC: r14('C'), PD: r14('D') });
function r15(L) { return { get name() { return L + '. ' + LAYOUT15[L].name; }, get desc() { return LAYOUT15[L].desc + ' (The growth is each profession’s current base: the vine, Breaks away, the cut + a stroke, rod and reel.)'; },
  get note() { return LAYOUT15[L].name.toLowerCase() + '.'; }, draw(top) { cleanModule(top, L); } }; }
Object.assign(FAM, { PA: r15('A'), PB: r15('B'), PC: r15('C'), PD: r15('D') });
function r16(K) { return { get name() { return K + '. ' + VIS16[K].name; }, get desc() { return VIS16[K].desc + ' (B “Just a line”; the page opens on Bright ground.)'; },
  get note() { return 'just a line, ' + VIS16[K].name.toLowerCase() + '.'; }, draw(top) { VISK = VIS16[K]; cleanModule(top, 'B'); VISK = null; OUTLINE = false; } }; }
Object.assign(FAM, { PA: r16('A'), PB: r16('B'), PC: r16('C'), PD: r16('D') });
function r17(K) { return { get name() { return K + '. ' + VIS17[K].name; }, get desc() { return VIS17[K].desc + ' (B “Just a line”; Fishing redrawn to read better in every option: a water band, a thicker line, a bigger bobber.)'; },
  get note() { return 'just a line, ' + VIS17[K].name.toLowerCase() + '.'; }, draw(top) { VISK = VIS17[K]; FISHR = true; cleanModule(top, 'B'); VISK = null; FISHR = false; } }; }
Object.assign(FAM, { PA: r17('A'), PB: r17('B'), PC: r17('C'), PD: r17('D') });
function r18(K) { return { get name() { return K + '. ' + FIT18[K].name; }, get desc() { return FIT18[K].desc + ' (The 1.3 bar: header with no backing, a dark track with a thin gold border, the next unlock’s icon at its end, “N to X” under it. The growth is each profession’s current base.)'; },
  get note() { return FIT18[K].name.toLowerCase() + '.'; }, draw(top) { FISHR = true; barModule(top, K); FISHR = false; } }; }
Object.assign(FAM, { PA: r18('A'), PB: r18('B'), PC: r18('C'), PD: r18('D') });
function r19(K) { return { get name() { return profName === 'Fishing' ? K + '. ' + SURF19[K].name : K + '. (same for A-D)'; },
  get desc() { const fit = FIT19[profName]; return profName === 'Fishing' ? SURF19[K].desc + ' The whole bar is water, the bobber floats on it at the fill’s front and dips with a splash each skill-up.' : (fit === 'B' ? 'Herbalism breaks out: the vine full size over a slimmer bar, its leaves reaching past the edges.' : 'Inside the bar: the growth is the fill, clipped to the bar.') + ' The four options only differ for Fishing (its water surface).'; },
  get note() { return profName === 'Fishing' ? SURF19[K].name.toLowerCase() + '.' : 'the set bar, per profession.'; }, draw(top) { FISHR = true; FISHV = K; barModule(top, FIT19[profName] || 'A'); FISHR = false; } }; }
Object.assign(FAM, { PA: r19('A'), PB: r19('B'), PC: r19('C'), PD: r19('D') });
function r21(K) { const v = () => VAR21[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : 'gatherers only this round'); },
  get desc() { return v() ? v()[K].desc : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : 'Round 21 covers Mining, Herbalism and Skinning; crafters come next.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = v(); barModule(top, FIT19[profName] || 'A', o ? o[K] : null); FISHR = false; } }; }
Object.assign(FAM, { PA: r21('A'), PB: r21('B'), PC: r21('C'), PD: r21('D') });
function r22(K) { const v = () => VAR22[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : 'gatherers only this round'); },
  get desc() { return v() ? v()[K].desc : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : 'Round 22 covers Mining, Herbalism and Skinning; crafters come next.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = v(); barModule(top, FIT19[profName] || 'A', o ? o[K] : null); FISHR = false; } }; }
Object.assign(FAM, { PA: r22('A'), PB: r22('B'), PC: r22('C'), PD: r22('D') });
function r23(K) { const v = () => VAR23[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : 'Herbalism only this round'); },
  get desc() { return v() ? v()[K].desc : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : 'One profession at a time: this round is Herbalism. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = v(); barModule(top, FIT19[profName] || 'A', o ? o[K] : null); FISHR = false; } }; }

Object.assign(FAM, { PA: r23('A'), PB: r23('B'), PC: r23('C'), PD: r23('D') });
function r26(K) { const v = () => VAR26[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : 'Herbalism only this round'); },
  get desc() { return v() ? v()[K].desc : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : 'One profession at a time: this round is Herbalism. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = v(); barModule(top, FIT19[profName] || 'A', o ? o[K] : null); FISHR = false; } }; }

Object.assign(FAM, { PA: r26('A'), PB: r26('B'), PC: r26('C'), PD: r26('D') });
function r29(K) { const v = () => VAR29[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : 'Herbalism only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : 'One profession at a time: this round is Herbalism’s finale. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = v(); barModule(top, FIT19[profName] || 'A', o ? o[K] : null); FISHR = false; } }; }
Object.assign(FAM, { PA: r29('A'), PB: r29('B'), PC: r29('C'), PD: r29('D') });
function r30(K) { const v = () => VAR30[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Try “Reaching the next unlock” for the finale.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null; barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r30('A'), PB: r30('B'), PC: r30('C'), PD: r30('D') });
function r31(K) { const v = () => VAR31[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Try “Reaching the next unlock” for the finale.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null; barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r31('A'), PB: r31('B'), PC: r31('C'), PD: r31('D') });
function r32(K) { const v = () => VAR32[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning’s finale. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; const o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null; barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r32('A'), PB: r32('B'), PC: r32('C'), PD: r32('D') });
function r34(K) { const v = () => VAR34[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning’s finale. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; let o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null;
    if (o && v() && K !== 'C') { const n = S.p && S.nx ? Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15) : 6, N = n >= 4 ? n : 6; if (K === 'B') o = Object.assign({}, o, { finAt: (N - 1) * .07 + .38 + .05 }); if (K === 'D') o = Object.assign({}, o, { finAt: (N - 1) * .06 + .25 + .45 }); if (K === 'A') o = Object.assign({}, o, { finAt: .55 + (N - 1) * .07 + .35 }); }
    if (o && v() && K === 'C') { const n = S.p && S.nx ? Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15) : 6, N = n >= 4 ? n : 6; o = Object.assign({}, o, { finAt: (N + 1) * .12 + .05 }); }
    barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r34('A'), PB: r34('B'), PC: r34('C'), PD: r34('D') });
function r35(K) { const v = () => VAR35[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning’s finale. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; let o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null;
    if (o && v()) { const n = S.p && S.nx ? Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15) : 6, N = n >= 4 ? n : 6, c = CFG35[K]; o = Object.assign({}, o, { finAt: CHOP35 + (N - 1) * c.dt + c.fly + .02 }); }
    barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r35('A'), PB: r35('B'), PC: r35('C'), PD: r35('D') });
function r36(K) { const v = () => VAR36[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Fishing' ? 'Fishing (locked)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : profName === 'Fishing' ? 'Locked in round 20: the water bar, the bright surface over the filled water, the reel and line.' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : 'One profession at a time: this round is Skinning’s finale. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; let o = profName === 'Herbalism' ? VAR29.Herbalism.B : v() ? v()[K] : null;
    if (o && v()) { const n = S.p && S.nx ? Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15) : 6, N = n >= 4 ? n : 6; o = Object.assign({}, o, { finAt: CHOP35 + (N - 1) * DT36 + .2 }); }
    barModule(top, FIT19[profName] || 'A', o); FISHR = false; } }; }
Object.assign(FAM, { PA: r36('A'), PB: r36('B'), PC: r36('C'), PD: r36('D') });
function r37(K) { const v = () => VAR37[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Fishing only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Try “Five in a row”.)' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : profName === 'Skinning' ? 'Done: the cut + Fur flies, and the reticle chop when the bar fills.' : 'One profession at a time: this round is Fishing. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; let o = profName === 'Herbalism' ? VAR29.Herbalism.B : profName === 'Skinning' ? VAR36.Skinning.A : v() ? v()[K] : null;
    if (o === VAR36.Skinning.A) { const n = Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15), N = n >= 4 ? n : 6; o = Object.assign({}, o, { finAt: CHOP35 + (N - 1) * DT36 + .2 }); }
    window.FSW = null; if (o && o.pre) { const st = state(), lo = S.p.span[0], n = Math.max(1, S.nx.lv - lo), x0 = W / 2 - 128, L = 230; window.FSW = o.pre({ hitAge: st.hitAge, x0, x1: x0 + L, tipX: x0 + clamp((st.v - lo) / n) * L }); }
    barModule(top, FIT19[profName] || 'A', o); window.FSW = null; FISHR = false; } }; }
Object.assign(FAM, { PA: r37('A'), PB: r37('B'), PC: r37('C'), PD: r37('D') });
function r38(K) { const v = () => VAR38[profName]; return { get name() { return K + '. ' + (v() ? v()[K].name : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Fishing only this round'); },
  get desc() { return v() ? v()[K].desc + ' (Try “Five in a row”.)' : profName === 'Herbalism' ? 'Done: the Vine, and the Sickle sweep when the bar fills.' : profName === 'Skinning' ? 'Done: the cut + Fur flies, and the reticle chop when the bar fills.' : 'One profession at a time: this round is Fishing. Others show their current look.'; },
  get note() { return v() ? v()[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { FISHR = true; FISHV = 'D'; let o = profName === 'Herbalism' ? VAR29.Herbalism.B : profName === 'Skinning' ? VAR36.Skinning.A : v() ? v()[K] : null;
    if (o === VAR36.Skinning.A) { const n = Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15), N = n >= 4 ? n : 6; o = Object.assign({}, o, { finAt: CHOP35 + (N - 1) * DT36 + .2 }); }
    window.FSW = null; window.FTEX = o && o.tex ? o.tex : null; if (o && o.pre) { const st = state(), lo = S.p.span[0], n = Math.max(1, S.nx.lv - lo), x0 = W / 2 - 128, L = 230; window.FSW = o.pre({ hitAge: st.hitAge, x0, x1: x0 + L, tipX: x0 + clamp((st.v - lo) / n) * L }); }
    barModule(top, FIT19[profName] || 'A', o); window.FSW = null; window.FTEX = null; FISHR = false; } }; }
Object.assign(FAM, { PA: r38('A'), PB: r38('B'), PC: r38('C'), PD: r38('D') });
function r41(K) { return { get name() { return K + '. ' + (VAR41[profName] ? VAR41[profName][K].name : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Fishing only this round'); },
  get desc() { return VAR41[profName] ? VAR41[profName][K].desc + ' (Sound on; try “Five in a row”.)' : 'One profession at a time: this round is Fishing. Others show their current look.'; },
  get note() { return VAR41[profName] ? VAR41[profName][K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { const keep = VAR39.Fishing, fish = profName === 'Fishing'; VAR39.Fishing = VAR41.Fishing; window.FREEL = fish ? VAR41.Fishing[K].reel : null; const snd0 = S.p.snd; if (fish) S.p.snd = () => {}; try { r39(K).draw(top); } finally { VAR39.Fishing = keep; window.FREEL = null; S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r41('A'), PB: r41('B'), PC: r41('C'), PD: r41('D') });
function r43(K) { return { get name() { return K + '. ' + (VAR43[profName] ? VAR43[profName][K].name : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Fishing only this round'); },
  get desc() { return VAR43[profName] ? VAR43[profName][K].desc + ' (Pick “Reaching the next unlock” to see it.)' : 'One profession at a time: this round is Fishing’s finale. Others show their current look.'; },
  get note() { return VAR43[profName] ? VAR43[profName][K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { const keep = VAR39.Fishing, fish = profName === 'Fishing'; VAR39.Fishing = VAR43.Fishing; window.FREEL = fish ? false : null; const snd0 = S.p.snd; if (fish) S.p.snd = () => {}; try { r39(K).draw(top); } finally { VAR39.Fishing = keep; window.FREEL = null; S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r43('A'), PB: r43('B'), PC: r43('C'), PD: r43('D') });
function r46(K) { const c = SET46[K]; return { get name() { return K + '. ' + (profName === 'Skinning' ? c.name : profName === 'Fishing' ? 'Fishing (done)' : profName === 'Herbalism' ? 'Herbalism (done)' : 'Skinning only this round'); },
  get desc() { return profName === 'Skinning' ? 'Skinning as picked (the cut + Fur flies, the reticle chop finale) with a new sound set. ' + c.desc + ' Long sessions: the notes vary, and after two skill-ups in a row each is a step quieter. (Sound on; try “Five in a row” and “Reaching the next unlock”.)' : 'One profession at a time: this round is Skinning’s sound. Others show their current look.'; },
  get note() { return profName === 'Skinning' ? c.name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName === 'Fishing') return r44('D').draw(top); if (profName === 'Herbalism') return r45('D').draw(top); if (profName !== 'Skinning') return r42('B').draw(top);
    const n = Math.min(Math.max(1, S.nx.lv - S.p.span[0]), 15), N = n >= 4 ? n : 6, base = VAR36.Skinning.A, cc = { dt: DT36, rtl: false };
    S.hits.forEach((h, i) => { S.fired['sk' + i] = true; }); ['r36r0', 'r36r1', 'r36d'].forEach(k => S.fired[k] = true); for (let j = 0; j < 15; j++) S.fired['c36' + j] = true;
    const o = Object.assign({}, base, { finAt: CHOP35 + (N - 1) * DT36 + .2,
      over(p, I) { base.over(p, I); onHits('sup46', i => c.up(i, fat45(i))); if (!I.done) return; const ts = S.age - S.closeAt, { n: m, at } = ch35(I, cc);
        if (ts >= LOCK35) once('slk46', c.lock); for (let j = 0; j < m; j++) if (ts >= at(j)) once('sch46' + j, () => c.chop(j, m)); if (ts >= at(m - 1) + .12) once('sla46', c.last); } });
    const snd0 = S.p.snd; S.p.snd = () => {}; try { barModule(top, FIT19[profName] || 'A', o); } finally { S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r46('A'), PB: r46('B'), PC: r46('C'), PD: r46('D') });
function r48(K) { return { get name() { return K + '. ' + (profName === 'Mining' ? MIN48[K].name : profName === 'Fishing' ? 'Fishing (done)' : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Mining only this round'); },
  get desc() { return profName === 'Mining' ? MIN48[K].desc + ' Sounds follow the fatigue rule (soft and low, varied, stepping down after two in a row). (Try “Five in a row” and “Reaching the next unlock”.)' : 'One profession at a time: this round is Mining. Others show their current look.'; },
  get note() { return profName === 'Mining' ? MIN48[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Mining') return r47(K).draw(top); const snd0 = S.p.snd; S.p.snd = () => {}; try { barModule(top, 'A', MIN48[K]); } finally { S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r48('A'), PB: r48('B'), PC: r48('C'), PD: r48('D') });
function r49(K) { return { get name() { return K + '. ' + (profName === 'Mining' ? ADD49[K].name : profName === 'Fishing' ? 'Fishing (done)' : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Mining only this round'); },
  get desc() { return profName === 'Mining' ? ADD49[K].desc + ' (Try “Five in a row”.)' : 'One profession at a time: this round is Mining. Others show their current look.'; },
  get note() { return profName === 'Mining' ? ADD49[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Mining') return r47(K).draw(top); const snd0 = S.p.snd; S.p.snd = () => {}; try { barModule(top, 'A', VAR49.Mining[K]); } finally { S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r49('A'), PB: r49('B'), PC: r49('C'), PD: r49('D') });
function r50(K) { return { get name() { return K + '. ' + (profName === 'Mining' ? FIN50[K].name : profName === 'Fishing' ? 'Fishing (done)' : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Mining only this round'); },
  get desc() { return profName === 'Mining' ? 'Mining as picked (the Blast). Reaching the next ore: ' + FIN50[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : 'One profession at a time: this round is Mining’s finale. Others show their current look.'; },
  get note() { return profName === 'Mining' ? FIN50[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Mining') return r47(K).draw(top); const snd0 = S.p.snd; S.p.snd = () => {}; try { barModule(top, 'A', VAR50.Mining[K]); } finally { S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r50('A'), PB: r50('B'), PC: r50('C'), PD: r50('D') });
function r51(K) { return { get name() { return K + '. ' + (profName === 'Mining' ? MIX51[K].name : profName === 'Fishing' ? 'Fishing (done)' : profName === 'Herbalism' ? 'Herbalism (done)' : profName === 'Skinning' ? 'Skinning (done)' : 'Mining only this round'); },
  get desc() { return profName === 'Mining' ? 'Mining as picked (the Blast). Reaching the next ore: ' + MIX51[K].desc + ' (Pick “Reaching the next unlock” to see it.)' : 'One profession at a time: this round is Mining’s finale. Others show their current look.'; },
  get note() { return profName === 'Mining' ? MIX51[K].name.toLowerCase() + '.' : 'the set bar.'; },
  draw(top) { if (profName !== 'Mining') return r47(K).draw(top); const snd0 = S.p.snd; S.p.snd = () => {}; try { barModule(top, 'A', VAR51.Mining[K]); } finally { S.p.snd = snd0; } } }; }
Object.assign(FAM, { PA: r51('A'), PB: r51('B'), PC: r51('C'), PD: r51('D') });

// Round 98 (Alchemy base, 5 options; the user mixed A + C + E into round 99), moved out 2026-11-17. Uses the page's ALB98, hits98, liq98, emo98, HERB98, HUE98.
function drop98(x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - s * 1.6); ctx.quadraticCurveTo(x + s, y - s * .2, x, y + s * .9); ctx.quadraticCurveTo(x - s, y - s * .2, x, y - s * 1.6); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(x - s * .35, y - s * .3, s * .3, s * .5); }
const AL98 = {
  A: { name: 'Herbs dissolve', desc: 'A violet potion fills the bar. Each skill-up a real herb drops in at the front, splashes, shrinks and dissolves; its color blooms through the liquid and pushes the front forward, then fades into the violet.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(520 * semi(n), 0, .016 * v, .14, 'sine', 300 * semi(n)); noise(.02, .25, .004 * v, 900, .7, 'lowpass'); },
    V: { grow(p, x0, y, L, f, t, I) { liq98(x0 - 2, I.tipX, y, '#c08aff', '#5a2aa0');
        hits98(I).forEach(o => { if (o.t < 0) return; const k = 1 - clamp((o.t - .15) / 1), c = HERB98[(S.v0 + o.i) % 5][1], r = 6 + 34 * eOut(clamp(o.t / .6)); if (k <= 0) return;
          const g = ctx.createRadialGradient(o.a, y, 0, o.a, y, r); g.addColorStop(0, hexA(c, .85 * k)); g.addColorStop(1, hexA(c, 0)); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12);
          for (let j = 0; j < 7; j++) { const sx = o.a + (j - 3) * 3.5 + o.t * 14 * (j % 2 ? 1 : -.6), sy = y - 3 + (j * 5) % 8 + o.t * 3; ctx.fillStyle = hexA(c, .9 * k); ctx.fillRect(sx, sy, 1.4, 1.4); } }); },
      over(p, I) { const y = I.ly; hits98(I).forEach(o => { const [e, c] = HERB98[(S.v0 + o.i) % 5];
        if (o.t < 0) { const u = (o.t + .45) / .45; emo98(e, o.a + 2, lerp(y - 40, y - 7, u * u), 14, (1 - u) * 1.6); return; }
        once('al98a' + o.i, () => { spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 12, life: .4, col: '#e8d8ff' }); for (let k = 0; k < 5; k++) spawn({ x: o.a, y: y - 6, vx: (Math.random() - .5) * 60, vy: -40 - Math.random() * 40, g: 280, life: .45, size: 1.3, col: k % 2 ? c : '#e8d8ff' }); });
        if (o.t < .55) emo98(e, o.a + 2, y - 7 + o.t * 10, 14 * (1 - o.t / .55 * .8), o.t * 2, 1 - o.t / .55); }); } } },
  B: { name: 'Lead to gold', desc: 'The whole bar is dull lead; what you have earned is gold. Each skill-up a thin transmutation circle turns over the new stretch, a white-hot front sweeps it from lead to gold, a glint lands on the new front and gold dust lifts off.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(392 * semi(n), 0, .012 * v, .5, 'triangle', null, .03); tone(784 * semi(n), .32, .009 * v, .7, 'sine'); },
    V: { grow(p, x0, y, L, f, t, I) { liq98(x0 - 2, I.x1 + 2, y, '#8a8a94', '#3e3e46'); ctx.fillStyle = 'rgba(20,20,26,.35)'; for (let x = x0; x < I.x1; x += 3) if (rnd53(x * .7) > .6) ctx.fillRect(x, y - 4 + rnd53(x * 1.3) * 8, 1, 1);
        liq98(x0 - 2, I.tipX, y, '#fff0b0', '#b07a1a'); const sx = x0 + ((t * 60) % (L + 60)) - 30; if (sx < I.tipX) { const g = ctx.createLinearGradient(sx - 14, 0, sx + 14, 0); g.addColorStop(0, 'rgba(255,255,240,0)'); g.addColorStop(.5, 'rgba(255,255,240,.45)'); g.addColorStop(1, 'rgba(255,255,240,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 14, y - 6, Math.min(28, I.tipX - sx + 14), 12); }
        hits98(I).forEach(o => { if (o.t < 0 || o.t > .8) return; const k = 1 - o.t / .8; ctx.fillStyle = `rgba(255,250,220,${.5 * k})`; ctx.fillRect(o.a, y - 6, I.tipX - o.a, 12);
          const g = ctx.createRadialGradient(I.tipX, y, 0, I.tipX, y, 10); g.addColorStop(0, `rgba(255,255,255,${k})`); g.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = g; ctx.fillRect(I.tipX - 10, y - 6, 20, 12); }); },
      over(p, I) { const y = I.ly; hits98(I).forEach(o => { const u = (o.t + .3) / 1, al = clamp(u / .15) * clamp((.9 - u) / .25); if (al > 0) { const mx = (o.a + o.b) / 2, r = 11 + eOut(clamp(u)) * 5;
          ctx.save(); ctx.strokeStyle = `rgba(255,211,106,${.8 * al})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx, y, r, 0, 7); ctx.stroke(); ctx.strokeStyle = `rgba(255,240,200,${.5 * al})`; ctx.beginPath(); ctx.arc(mx, y, r - 3, 0, 7); ctx.stroke();
          for (let q = 0; q < 4; q++) { const an = q * Math.PI / 2 + u * 2.4; ctx.beginPath(); ctx.moveTo(mx + Math.cos(an) * (r - 3), y + Math.sin(an) * (r - 3)); ctx.lineTo(mx + Math.cos(an) * (r + 3), y + Math.sin(an) * (r + 3)); ctx.stroke(); } ctx.restore(); }
        if (o.t >= .42) once('al98b' + o.i, () => { spawn({ x: o.b, y: y - 5, size: 6, shape: 'star', life: .5, col: '#fff8d0' }); for (let k = 0; k < 6; k++) spawn({ x: lerp(o.a, o.b, Math.random()), y: y - 6, vx: (Math.random() - .5) * 16, vy: -14 - Math.random() * 18, g: -8, life: .9, size: 1, col: k % 2 ? '#ffd36a' : '#fff4c0' }); }); }); } } },
  C: { name: 'Titration flash', desc: 'One drop falls into the front; the whole potion flashes white and turns to its next color from where the drop landed outward, then the front steps on. The colors run violet, blue, teal, green, lime to gold at the recipe, and a soft glow of the new color spills past the bar.',
    snd: i => { const v = fat45(i), n = pick45(i, 4); tone(660 * semi(n), 0, .014 * v, .1, 'sine', 420 * semi(n)); tone(262 * semi(n), .03, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), .03, .007 * v, .8, 'sine', null, .08); },
    V: { grow(p, x0, y, L, f, t, I) { const H = j => HUE98[clamp(j, 0, 5)], A = hits98(I).filter(o => o.t >= 0 && o.t < 1).pop();
        if (!A) { const c = H(Math.floor(I.v + 1e-6) - I.lo); liq98(x0 - 2, I.tipX, y, mix(c, '#ffffff', .35), mix(c, '#000000', .45)); return; }
        const c0 = H(S.v0 + A.i - I.lo), c1 = H(S.v0 + A.i + 1 - I.lo), d = 420 * A.t; liq98(x0 - 2, I.tipX, y, mix(c0, '#ffffff', .35), mix(c0, '#000000', .45));
        ctx.save(); ctx.beginPath(); ctx.rect(A.a - d, y - 6, 2 * d, 12); ctx.clip(); liq98(x0 - 2, I.tipX, y, mix(c1, '#ffffff', .35), mix(c1, '#000000', .45)); const w = 1 - clamp(A.t / .35); ctx.fillStyle = `rgba(255,255,255,${.75 * w})`; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12); ctx.restore(); },
      over(p, I) { const y = I.ly; hits98(I).forEach(o => { const c1 = HUE98[clamp(S.v0 + o.i + 1 - I.lo, 0, 5)];
        if (o.t < 0) { const u = (o.t + .45) / .45; drop98(o.a, lerp(y - 42, y - 7, u * u), 3, mix(c1, '#ffffff', .4)); return; }
        once('al98c' + o.i, () => { spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 10, life: .35, col: '#ffffff' }); for (let k = 0; k < 3; k++) spawn({ x: o.a, y: y - 6, vx: (Math.random() - .5) * 40, vy: -40 - Math.random() * 30, g: 300, life: .4, size: 1.2, col: '#ffffff' }); });
        const gl = 1 - clamp(o.t / .9); if (gl > 0) { ctx.save(); ctx.shadowColor = c1; ctx.shadowBlur = 14; ctx.strokeStyle = hexA(c1, .7 * gl); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(I.x0 - 3, y - 7, I.tipX - I.x0 + 4, 14, 4); ctx.stroke(); ctx.restore(); } }); } } },
  D: { name: 'Layers settle', desc: 'Inside, the potion stands in three layers: dark below, violet, a glowing pale top. Each skill-up the bar sloshes, the liquid clouds over and a few drops jump the rim; then it settles back into layers (the tilt easing out, straight lines) one stretch longer.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); noise(0, .35, .008 * v, 500, .7, 'lowpass'); tone(196 * semi(n), .5, .01 * v, .6, 'sine', null, .1); },
    V: { shake(I) { const o = hits98(I).filter(o => o.t > -.1 && o.t < .55).pop(); return o ? [Math.sin((o.t + .1) * 28) * 2.4 * (1 - (o.t + .1) / .65), 0] : [0, 0]; },
      grow(p, x0, y, L, f, t, I) { const xb = I.tipX; if (xb <= x0) return; const o = hits98(I).filter(o => o.t > -.1 && o.t < 1.3).pop(), s = o ? eOut(clamp((o.t - .15) / .9)) : 1, cloud = o ? clamp((o.t + .1) / .15) * (1 - s) : 0;
        const tilt = o ? Math.sin((o.t + .1) * 14) * .09 * (1 - s) : 0, cx = (x0 + xb) / 2, yy = (b, x) => b + (x - cx) * tilt;
        ctx.fillStyle = '#f0dcff'; ctx.fillRect(x0 - 2, y - 6, xb - x0 + 2, 12);
        const band = (b, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0 - 2, yy(b, x0 - 2)); ctx.lineTo(xb, yy(b, xb)); ctx.lineTo(xb, y + 7); ctx.lineTo(x0 - 2, y + 7); ctx.closePath(); ctx.fill(); };
        band(y - 2, '#9a5ae0'); band(y + 2, '#3a1a6a');
        ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 2, yy(y - 2, x0 - 2)); ctx.lineTo(xb, yy(y - 2, xb)); ctx.stroke();
        if (cloud > 0) { ctx.fillStyle = `rgba(150,110,190,${.9 * cloud})`; ctx.fillRect(x0 - 2, y - 6, xb - x0 + 2, 12); } },
      over(p, I) { const y = I.ly; hits98(I).forEach(o => { if (o.t >= -.05) once('al98d' + o.i, () => { for (let k = 0; k < 4; k++) spawn({ x: I.tipX - 4 - k * 5, y: y - 6, vx: (Math.random() - .3) * 40, vy: -45 - Math.random() * 35, g: 300, life: .55, size: 1.4, col: k % 2 ? '#d0a8ff' : '#f0dcff' }); });
        const u = clamp((o.t - .9) / .4); if (u > 0 && u < 1) { const x = lerp(I.x0, I.tipX, u); ctx.fillStyle = `rgba(255,255,255,${.8 * Math.sin(Math.PI * u)})`; ctx.fillRect(x - 6, y - 6, 12, 1.5); } }); } } },
  E: { name: 'Grind powder', desc: 'The bar fills with ground powder, not liquid. Each skill-up a grinding ring turns above the front (the pestle shown only by its circling streak), fine powder pours from under it into the bar, the front heaps forward and a little dust puffs off.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); noise(0, .14, .007 * v, 1400, 1.5, 'bandpass'); noise(.17, .14, .006 * v, 1250, 1.5, 'bandpass'); tone(330 * semi(n), .38, .009 * v, .25, 'triangle'); },
    V: { grow(p, x0, y, L, f, t, I) { liq98(x0 - 2, I.tipX, y, '#e8dcf8', '#8a6ab8'); for (let x = x0; x < I.tipX; x += 2) { const r = rnd53(x * .9); ctx.fillStyle = r > .7 ? 'rgba(255,255,255,.6)' : r < .25 ? 'rgba(60,30,100,.35)' : 'rgba(180,150,220,.5)'; ctx.fillRect(x, y - 5 + rnd53(x * 2.1) * 10, 1, 1); }
        hits98(I).forEach(o => { if (o.t < 0 || o.t > .7) return; ctx.fillStyle = `rgba(255,255,255,${.35 * (1 - o.t / .7)})`; ctx.fillRect(o.a, y - 6, I.tipX - o.a, 12); }); },
      over(p, I) { const y = I.ly; hits98(I).forEach(o => { const gx = lerp(o.a, o.b, .5), gy = y - 13, al = clamp((o.t + .45) / .1) * clamp((.45 - o.t) / .15);
        if (al > 0) { ctx.save(); ctx.strokeStyle = `rgba(232,216,255,${.35 * al})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(gx, gy, 5, 0, 7); ctx.stroke(); const an = (o.t + .45) * 20;
          ctx.strokeStyle = `rgba(255,255,255,${.9 * al})`; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(gx, gy, 5, an, an + 1.8); ctx.stroke(); ctx.restore(); }
        for (let q = 0; q < 16; q++) { const age = o.t - (-.3 + q * .04); if (age <= 0 || age > .3) continue; const gyy = gy + 4 + age * age * 200; if (gyy > y - 5) continue; ctx.fillStyle = q % 3 ? '#e8dcf8' : '#ffffff'; ctx.fillRect(gx + (skHash(q + o.i * 17) - .5) * 9, gyy, 1.3, 1.3); }
        if (o.t >= .35) once('al98e' + o.i, () => { for (let k = 0; k < 6; k++) spawn({ x: o.b - 2, y: y - 6, vx: (k - 2.5) * 12, vy: -8 - Math.random() * 10, g: -4, life: .7, size: 1.6, col: 'rgba(232,220,248,.7)' }); }); }); } } },
};
function r98(K) { const Z = AL98[K];
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Alchemy’s bar counts to the next recipe. Try all three moments; the sound is a gentle placeholder.)'; }, get note() { return Z.name.toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Alchemy' || S.p !== ALB98) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = ALB98; try { const s = build(); s.age = S.age; S = s; } finally { PROF.Alchemy = keep; } }
      S.hits.forEach((h, i) => { if (S.age >= h + HIT) once('al98s' + i, () => Z.snd(i)); }); barModule(top, 'A', Z.V); } }; }
Object.assign(FAM, { PA: r98('A'), PB: r98('B'), PC: r98('C'), PD: r98('D'), PE: r98('E') }); delete FAM.PF; delete FAM.PG; delete FAM.PH;

// Round 100 (Alchemy: ways to grind the herb; the user took B Wheel grinder into round 101), moved out 2026-11-17. Uses the page's r99 (cfg.grind hook), fall100, crumb100, emo98.
const GR100 = {
  B: { name: 'Wheel grinder', desc: 'A small stone wheel on a wooden axle rolls back and forth along the bar’s top edge (the bar is its trough) over the herb: three passes, the herb flattening on each, green crumbs dropping into the potion; then the flash.',
    grind(o, I, e, hc, y) { const top = y - 6; if (fall100(o, e, o.a, top - 3, y)) return;
      const k = clamp((o.t + .38) / .38), al = clamp((o.t + .45) / .08) * clamp((.1 - o.t) / .12);
      if (k < 1) { ctx.save(); ctx.translate(o.a, top - 3 + k * 2); ctx.scale(1 + k * .3, 1 - k * .75); emo98(e, 0, 0, 13, 0, 1 - k * .5); ctx.restore(); }
      if (al <= 0) return; const ph = clamp((o.t + .38) / .38) * 3 * Math.PI, wx = o.a + 12 * Math.cos(ph), r = 7, wy = top - r;
      ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(wx - 13, wy); ctx.lineTo(wx + 13, wy); ctx.stroke();
      const g = ctx.createRadialGradient(wx - 2, wy - 2, 1, wx, wy, r); g.addColorStop(0, '#d8d0c8'); g.addColorStop(1, '#6e6660'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wx, wy, r, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(40,34,30,.8)'; ctx.lineWidth = 1; const an = (wx - o.a) / r; for (let q = 0; q < 2; q++) { const a = an + q * Math.PI / 2; ctx.beginPath(); ctx.moveTo(wx - Math.cos(a) * r * .8, wy - Math.sin(a) * r * .8); ctx.lineTo(wx + Math.cos(a) * r * .8, wy + Math.sin(a) * r * .8); ctx.stroke(); }
      ctx.fillStyle = '#c8955a'; ctx.beginPath(); ctx.arc(wx, wy, 1.6, 0, 7); ctx.fill(); ctx.restore();
      for (let q = 0; q < 3; q++) if (o.t >= -.38 + (q * 2 + 1) / 6 * .38) once('al100b' + o.i + q, () => { crumb100(o.a, top + 1, hc, 4); const v = fat45(o.i); noise(0, .1, .006 * v, 500, .8, 'lowpass'); noise(.02, .03, .004 * v, 1600, 2, 'bandpass', true); }); } },
  C: { name: 'Millstones', desc: 'Two flat millstones sit above the front. The herb drops into the hole in the top stone; the top stone turns (its handle peg sweeps across, the grooves on its edge slide) and fine powder spills from the gap between the stones on both sides into the potion; then the flash.',
    grind(o, I, e, hc, y) { const cx = o.a, sy = y - 13; if (fall100(o, e, cx, sy - 6, y)) { } const al = clamp((o.t + .55) / .08) * clamp((.1 - o.t) / .12); if (al <= 0) return;
      const turn = clamp((o.t + .38) / .38), ang = turn * 2.5 * Math.PI; ctx.save(); ctx.globalAlpha *= al;
      const stone = (y0, h, c0, c1) => { const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(cx - 12, y0, 24, h, 2); ctx.fill(); };
      stone(sy, 4, '#a49a90', '#6a625a'); stone(sy - 5, 4.5, '#cec4ba', '#8a8078');
      ctx.fillStyle = 'rgba(40,34,30,.7)'; for (let q = 0; q < 6; q++) { const a = ang + q * Math.PI / 3, c = Math.cos(a); if (Math.sin(a) < 0) continue; ctx.fillRect(cx + c * 11 - .5, sy - 4.5, 1, 3.5); }
      const px = cx + Math.cos(ang) * 8, front = Math.sin(ang) > 0; ctx.strokeStyle = front ? '#8a5a30' : 'rgba(138,90,48,.6)'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px, sy - 5); ctx.lineTo(px, sy - 10); ctx.stroke();
      ctx.fillStyle = '#3a302a'; ctx.fillRect(cx - 2, sy - 5, 4, 1.5); ctx.restore();
      if (o.t > -.38 && o.t < -.3) emo98(e, cx, sy - 6, 13 * (1 - (o.t + .38) / .08 * .7), 0, 1 - (o.t + .38) / .08);
      for (let q = 0; q < 16; q++) { const age = o.t - (-.32 + q * .02); if (age <= 0 || age > .3) continue; const sd = q % 2 ? 1 : -1, xx = cx + sd * (12 + age * 14), yy = sy + 1 + age * age * 120; if (yy > y - 5) continue; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(xx, yy, 1.2, 1.2); }
      if (o.t >= -.38) once('al100c' + o.i, () => { const v = fat45(o.i); noise(0, .38, .007 * v, 260, .9, 'lowpass'); noise(.05, .3, .003 * v, 1800, 1.5, 'bandpass'); }); } },
  D: { name: 'Sieve', desc: 'A shallow sieve tray (a straight mesh with low sides) hangs above the front. The herb lands in it, the tray shakes side to side and the ground herb sifts through as an even fine rain into the potion, the herb shrinking away; then the flash.',
    grind(o, I, e, hc, y) { const sy = y - 15; if (fall100(o, e, o.a, sy - 4, y)) { } const al = clamp((o.t + .55) / .08) * clamp((.1 - o.t) / .12); if (al <= 0) return;
      const sh = o.t > -.38 && o.t < 0 ? Math.sin((o.t + .38) * 50) * 3 : 0, cx = o.a + sh, k = clamp((o.t + .38) / .38);
      if (o.t >= -.38 && k < 1) emo98(e, cx, sy - 4, 13 * (1 - k * .85), sh * .1, 1 - k * .6);
      ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = '#a07a50'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 13, sy - 5); ctx.lineTo(cx - 12, sy); ctx.lineTo(cx + 12, sy); ctx.lineTo(cx + 13, sy - 5); ctx.stroke();
      ctx.strokeStyle = 'rgba(232,220,200,.75)'; ctx.lineWidth = .8; for (let x = -10; x <= 10; x += 2.5) { ctx.beginPath(); ctx.moveTo(cx + x, sy - .5); ctx.lineTo(cx + x, sy + 1.5); ctx.stroke(); } ctx.restore();
      if (o.t > -.36 && o.t < .02) for (let q = 0; q < 22; q++) { const age = ((o.t + .36 + q * .037) % .16); const xx = cx + (skHash(q + o.i * 31) - .5) * 22, yy = sy + 2 + age * 50 + age * age * 300; if (yy > y - 5) continue; ctx.fillStyle = q % 3 ? hexA(hc, .9) : 'rgba(255,255,255,.8)'; ctx.fillRect(xx, yy, 1, 1); }
      if (o.t >= -.38) once('al100d' + o.i, () => { const v = fat45(o.i); for (let q = 0; q < 4; q++) noise(q * .09, .07, .004 * v, 2400, 1.2, 'bandpass'); }); } },
};
function r100(K) { if (K === 'A') { const A = r99('A'); return { get name() { return 'A. Grinding ring (round 99 A)'; }, get desc() { return 'The current pick: ' + A.desc; }, get note() { return A.note; }, draw: top => A.draw(top) }; }
  const G = GR100[K]; CFG99['G' + K] = Object.assign({}, CFG99.A, { name: G.name, desc: G.desc, grind: G.grind }); const R = r99('G' + K); return { get name() { return K + '. ' + G.name; }, get desc() { return R.desc; }, get note() { return R.note; }, draw: top => R.draw(top) }; }
Object.assign(FAM, { PA: r100('A'), PB: r100('B'), PC: r100('C'), PD: r100('D') });

// Round 101 W101 entries B-D (Own trough, One rolling pass, Edge-runner; the user kept A Edge roll), moved out 2026-11-17. They go inside the page's W101 object.
  B: { name: 'Own trough', desc: 'A shallow wooden trough settles above the front; the herb lands in its dip with a squash and the wheel rolls back and forth along the trough’s curve over it (three passes, the herb flattening each time); powder slides off the trough’s ends into the potion; the trough lifts away, then the flash.',
    run(o, I, e, hc, y) { const cx = o.a, by = y - 12, al = clamp((o.t + 1.05) / .12) * clamp((.02 - o.t) / .12), T = [0, 1, 2].map(k => -.62 + (k * 2 + 1) / 6 * .5), crush = steps101(o.t, T);
      if (al > 0) { ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 22, by - 7); ctx.quadraticCurveTo(cx, by + 7, cx + 22, by - 7); ctx.stroke(); ctx.restore(); }
      herb101(o, e, hc, cx, by - 1, crush, y);
      const ph = clamp((o.t + .62) / .5) * 3 * Math.PI, wx = cx + 15 * Math.cos(ph), r = 7, wy = by - 1.5 - 7 * Math.pow((wx - cx) / 22, 2) - r;
      wheel101(wx, wy, r, (wx - cx) / r, clamp((o.t + .78) / .1) * clamp((-.06 - o.t) / .1));
      [-1, 1].forEach(sd => { for (let q = 0; q < 8; q++) { const age = o.t - (-.5 + q * .05); if (age <= 0 || age > .28) continue; const xx = cx + sd * (22 + age * 10), yy = by - 7 + age * age * 220; if (yy > y - 5) continue; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(xx, yy, 1.4, 1.4); } });
      return T; } },
  C: { name: 'One rolling pass', desc: 'The herb lands at the old front; the wheel rolls in from behind, crushes it flat in one heavy pass and keeps rolling to the new front, smearing a green line of herb along the top of the new stretch that sinks in; then the flash runs from where the herb was.',
    run(o, I, e, hc, y) { const top = y - 6, r = 9, wy = top - r, T = [-.5], crush = steps101(o.t, T) ;
      const wx = o.t < -.5 ? lerp(o.a - 34, o.a, eOut(clamp((o.t + .75) / .25))) : lerp(o.a, o.b, eOut(clamp((o.t + .5) / .38)));
      herb101(o, e, hc, o.a, top, crush, y);
      if (o.t > -.5 && o.t < .05) { const tr = Math.max(o.a, wx - 4), al = clamp((.05 - o.t) / .15); ctx.fillStyle = hexA(hc, .8 * al); ctx.fillRect(o.a, top - 1.5, tr - o.a, 2.5); }
      wheel101(wx, wy, r, (wx - o.a) / r, clamp((o.t + .8) / .1) * clamp((.04 - o.t) / .1)); return T; } },
  D: { name: 'Edge-runner', desc: 'A stone wheel on an arm circles a short post standing on the front (seen from the side it swings left and right, bigger as it comes toward you); the herb lies in a flat basin on the bar and is crushed each time the wheel passes in front (twice); then the flash.',
    run(o, I, e, hc, y) { const top = y - 6, al = clamp((o.t + .95) / .12) * clamp((.02 - o.t) / .12), ph = clamp((o.t + .7) / .6) * 4 * Math.PI - Math.PI / 2, dep = Math.sin(ph), wx = o.a + 15 * Math.cos(ph), sc = 1 + dep * .22, r = 7 * sc;
      const T = [0, 1].map(k => -.7 + (k + .5) / 2 * .6), crush = steps101(o.t, T);
      const post = () => { ctx.save(); ctx.globalAlpha *= al; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(o.a, top - 1); ctx.lineTo(o.a, top - 24); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.a, top - 12); ctx.lineTo(wx, top - r); ctx.stroke(); ctx.restore(); };
      if (al > 0) { ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = 'rgba(160,140,120,.8)'; ctx.fillRect(o.a - 20, top - 1.5, 40, 1.5); ctx.restore(); }
      herb101(o, e, hc, o.a, top - 1, crush, y);
      if (dep < 0) { wheel101(wx, top - r, r, ph * 2, al, 0); post(); } else { post(); wheel101(wx, top - r, r, ph * 2, al, 0); } return T; } },

// Moved out 2026-11-17 (round 103 prep): round 99 (r99, CFG99, hits99; the herb-grind-flash mix), round 100's fall100, round 102's ring102 + W102 + r102 (Edge roll looks), round 83's LW83 (Unrolling hide).
const LW83 = {
  A: { name: 'Unrolling hide', desc: 'A rolled-up hide sits at the front of the fill, poking out over the bar. Each skill-up it rolls forward (the rolled layers turn), lays the hide down behind it, and the new piece flops flat with a soft leather slap: a light flash, a small hop of the roll, a puff of dust. The roll gets thinner as you near the next rank.',
    snd: i => { const v = fat45(i), n = pick45(i, 3); noise(0, .3, .01 * v, 260, .7, 'lowpass'); drum46(120 * semi(n / 2), LAND83, .03 * v); noise(LAND83, .06, .022 * v, 900, .8, 'lowpass', true); },
    V: { grow(p, x0, y, L, f, t, I) { hide83(x0 - 2, I.tipX, y - 6, y + 6, LWC.lt, LWC.md, 1); const o = last83(I);
        if (o && o.t > LAND83 && o.t < LAND83 + .4) { const k = 1 - (o.t - LAND83) / .4; ctx.fillStyle = `rgba(255,235,200,${.35 * k})`; ctx.fillRect(o.a - 3, y - 6, I.tipX - o.a + 3, 12); } },
      shake(I) { const o = last83(I); if (!o || o.t < LAND83 || o.t > LAND83 + .15) return [0, 0]; return [0, 1.2 * (1 - (o.t - LAND83) / .15)]; },
      over(p, I) { const y = I.ly, r = lerp(8.5, 5.5, I.f), o = last83(I); let hop = 0;
        if (o && o.t >= LAND83) { const u = o.t - LAND83; hop = Math.max(0, Math.sin(u * 14)) * 2.5 * Math.exp(-u * 7);
          once('lwA' + o.i, () => { for (let k = 0; k < 7; k++) spawn({ x: lerp(o.a - 6, I.tipX - r, k / 6), y: y + 5, vx: (Math.random() - .5) * 40, vy: -15 - Math.random() * 25, g: 50, life: .55, size: 1, col: 'rgba(225,195,150,.8)' }); }); }
        const cx = I.tipX, cy = y + 6 - r - hop, ang = (I.tipX - I.x0) / r;
        ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(cx + 1, y + 6.5, r * .9, 1.6, 0, 0, 7); ctx.fill();
        const g = ctx.createRadialGradient(cx - r * .35, cy - r * .4, 1, cx, cy, r); g.addColorStop(0, LWC.hi); g.addColorStop(.55, LWC.lt); g.addColorStop(1, LWC.dk);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(70,40,15,.75)'; ctx.lineWidth = .9; ctx.beginPath(); for (let a = 0; a < 5 * Math.PI; a += .2) { const rr = r * (.15 + .8 * a / (5 * Math.PI)); ctx.lineTo(cx + Math.cos(a + ang) * rr, cy + Math.sin(a + ang) * rr); } ctx.stroke(); } } },
};
// ---------- round 99 (2026-11-17): Alchemy base, "I like C's animation; mix A and C, and mix E in: grinding the herbs into the mixture". Each skill-up: a herb drops into a grinding ring
// above the front, is ground to powder that pours in, and the potion flashes to its next color (98 C). Four ways to join them: A In order (the hue ladder), B The herb's own color,
// C Ground on the surface (the ring sits on the potion), D Ground along the new stretch (the ring travels, the flash follows the powder) ----------
const hits99 = I => S.hits.map((h, i) => ({ i, t: S.age - h - HIT, a: I.X(S.v0 + i), b: I.X(S.v0 + i + 1) })).filter(o => o.t > -.55 && o.t < 1.4);
const CFG99 = {
  A: { name: 'Herb, ground, flash', hue: 'ladder', gy: -13, flash: 'out', desc: 'In order: a herb drops into a grinding ring just above the front, the ring’s streak circles and the herb shrinks to powder that pours into the potion; where it lands the potion flashes white and turns its next color outward (violet, blue, teal, green, lime, gold at the recipe), the front steps on and a glow spills past the bar.' },
  B: { name: 'The herb’s own color', hue: 'herb', gy: -13, flash: 'out', desc: 'As A, but the potion turns the color of the herb that was ground (green, pink, gold...), so each skill-up you see which herb went in; the flash and glow are that herb’s color.' },
  C: { name: 'Ground on the surface', hue: 'ladder', gy: -3, flash: 'out', desc: 'As A, but the grinding happens on the potion itself: the herb lands on the surface at the front, the ring grinds it in place half sunk in the liquid, and the flash spreads from under it.' },
  D: { name: 'Ground along the new stretch', hue: 'ladder', gy: -13, flash: 'trail', desc: 'As A, but the grinding ring travels from the old front to the new one while it grinds, laying a line of powder along the new stretch; the new color follows the powder instead of spreading from one point.' },
};
function r99(K) { const cfg = CFG99[K];
  // the potion's color after hit index i (j = i + 1); before any hit: the color for the current level
  const hueAt = (I, n) => cfg.hue === 'herb' ? (n <= 0 ? HUE98[0] : HERB98[(I.lo + n - 1) % 5][1]) : HUE98[clamp(n, 0, 5)];
  const ringX = (o) => cfg.flash === 'trail' ? lerp(o.a, o.b, clamp((o.t + .3) / .3)) : o.a;
  const V = {
    grow(p, x0, y, L, f, t, I) { const A = hits99(I).filter(o => o.t >= 0 && o.t < 1).pop(), lv = n => mix(n, '#ffffff', .35), dk = n => mix(n, '#000000', .45);
      if (!A) { const c = hueAt(I, Math.floor(I.v + 1e-6) - I.lo); liq98(x0 - 2, I.tipX, y, lv(c), dk(c)); return; }
      const n0 = S.v0 + A.i - I.lo, c0 = hueAt(I, n0), c1 = hueAt(I, n0 + 1); liq98(x0 - 2, I.tipX, y, lv(c0), dk(c0));
      ctx.save(); ctx.beginPath(); if (cfg.flash === 'trail') { const xs = lerp(A.a, x0 - 2, eOut(clamp(A.t / .4))); ctx.rect(xs, y - 6, I.tipX + 2 - xs, 12); } else { const d = 420 * A.t; ctx.rect(A.a - d, y - 6, 2 * d, 12); } ctx.clip();
      liq98(x0 - 2, I.tipX, y, lv(c1), dk(c1)); const w = 1 - clamp(A.t / .35); ctx.fillStyle = `rgba(255,255,255,${.75 * w})`; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12); ctx.restore();
      if (cfg.flash === 'trail') hits99(I).forEach(o => { if (o.t < -.3 || o.t > .6) return; const xe = ringX(o), al = 1 - clamp(o.t / .6); ctx.fillStyle = hexA(HERB98[(S.v0 + o.i) % 5][1], .8 * al); for (let x = o.a; x < xe; x += 2) ctx.fillRect(x, y - 5 + rnd53(x * 1.7) * 3, 1.3, 1.3); }); },
    over(p, I) { const y = I.ly; hits99(I).forEach(o => { const [e, hc] = HERB98[(S.v0 + o.i) % 5], c1 = hueAt(I, S.v0 + o.i + 1 - I.lo), gx = ringX(o), gy = y + cfg.gy, onS = cfg.gy > -6;
      if (cfg.grind) cfg.grind(o, I, e, hc, y); else {
      // 1. the herb falls into the ring (-.55..-.3)
      if (o.t < -.3) { const u = (o.t + .55) / .25; emo98(e, o.a + 1, lerp(y - 32, gy, u * u), 13, (1 - u) * 1.6); }
      // 2. the ring grinds it (-.32..0): its streak circles, the herb shrinks, powder pours
      const al = clamp((o.t + .36) / .06) * clamp((.08 - o.t) / .1);
      if (al > 0) { const k = clamp((o.t + .3) / .3); if (k < 1) emo98(e, gx, gy, 13 * (1 - k * .85), k * 6, 1 - k * .6);
        ctx.save(); ctx.strokeStyle = `rgba(232,216,255,${.35 * al})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(gx, gy, 6, 0, 7); ctx.stroke(); const an = (o.t + .36) * 22;
        ctx.strokeStyle = `rgba(255,255,255,${.9 * al})`; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(gx, gy, 6, an, an + 1.8); ctx.stroke(); ctx.restore(); }
      if (!onS) for (let q = 0; q < 14; q++) { const age = o.t - (-.28 + q * .02); if (age <= 0 || age > .3) continue; const yy = gy + 5 + age * age * 200; if (yy > y - 5) continue; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(gx + (skHash(q + o.i * 17) - .5) * 8, yy, 1.3, 1.3); }
      else if (o.t > -.3 && o.t < .1) for (let q = 0; q < 6; q++) { const an = q + (o.t + .3) * 12; ctx.fillStyle = hexA(hc, .9); ctx.fillRect(gx + Math.cos(an) * 8, gy + Math.sin(an) * 3, 1.3, 1.3); }
      if (o.t >= -.3) once('al99g' + o.i, () => { const v = fat45(o.i), n = pick45(o.i, 4); tone(520 * semi(n), 0, .012 * v, .12, 'sine', 320 * semi(n)); noise(.02, .28, .006 * v, 1300, 1.4, 'bandpass'); });
      }
      // 3. the flash (t >= 0): ring, droplets, glow past the bar
      if (o.t >= 0) once('al99f' + o.i, () => { const v = fat45(o.i), n = pick45(o.i, 4); tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08);
        spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 10, life: .35, col: '#ffffff' }); for (let k = 0; k < 3; k++) spawn({ x: o.a, y: y - 6, vx: (Math.random() - .5) * 40, vy: -40 - Math.random() * 30, g: 300, life: .4, size: 1.2, col: '#ffffff' }); });
      const gl = o.t >= 0 ? 1 - clamp(o.t / .9) : 0; if (gl > 0) { ctx.save(); ctx.shadowColor = c1; ctx.shadowBlur = 14; ctx.strokeStyle = hexA(c1, .7 * gl); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(I.x0 - 3, y - 7, I.tipX - I.x0 + 4, 14, 4); ctx.stroke(); ctx.restore(); } }); } };
  return { get name() { return K + '. ' + cfg.name; }, get desc() { return cfg.desc + ' (Try all three moments; the sound is a gentle placeholder.)'; }, get note() { return cfg.name.toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Alchemy' || S.p !== ALB98) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = ALB98; try { const s = build(); s.age = S.age; S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r99('A'), PB: r99('B'), PC: r99('C'), PD: r99('D') }); delete FAM.PE; delete FAM.PF; delete FAM.PG; delete FAM.PH;
const fall100 = (o, e, x, y1, y) => { if (o.t < -.38) { const u = (o.t + .55) / .17; emo98(e, x, lerp(y - 32, y1, clamp(u) * clamp(u)), 13, (1 - u) * 1.6); return true; } return false; };
function ring102(x, y, r, ang, al) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al;
  ctx.strokeStyle = 'rgba(255,211,106,.85)'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r - 7, y); ctx.lineTo(x + r + 7, y); ctx.stroke();
  ctx.shadowColor = '#d0a8ff'; ctx.shadowBlur = 8; ctx.strokeStyle = '#f4ecff'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(208,168,255,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r * .45, 0, 7); ctx.stroke();
  ctx.fillStyle = '#ffffff'; star4(x + Math.cos(ang) * r, y + Math.sin(ang) * r, 3.2, ang); ctx.restore(); }
const W102 = {
  B: { name: 'Carved stone', desc: 'The same roll, drawn properly: a lit stone wheel (light from the top left, a dark rim, chiselled notches turning with it, a wooden hub) on a turned wooden axle with knobbed ends, a soft shadow under it and faint motion ghosts; each pass squeezes green juice flecks and a few glints out of the herb.',
    run(o, I, e, hc, y) { const top = y - 6, r = 8.5, crush = steps101(o.t, T102); herb101(o, e, hc, o.a, top, crush, y); const wx = wx102(o), al = al102(o);
      [.05, .025].forEach((d, k) => { const w0 = wx102(Object.assign({}, o, { t: o.t - d })); if (Math.abs(w0 - wx) > 1.5) { ctx.save(); ctx.globalAlpha *= .12 * (k + 1) * al; ctx.fillStyle = '#c8beb4'; ctx.beginPath(); ctx.arc(w0, top - r, r, 0, 7); ctx.fill(); ctx.restore(); } });
      carved102(wx, top - r, r, (wx - o.a) / r, al); return T102; },
    fx(o, y, hc) { for (let k = 0; k < 6; k++) spawn({ x: o.a + (Math.random() - .5) * 8, y: y - 7, vx: (Math.random() - .5) * 50, vy: -30 - Math.random() * 40, g: 320, life: .45, size: 1.1, col: k % 3 ? hc : '#e8ffe0' }); spawn({ x: o.a, y: y - 9, size: 3, shape: 'star', life: .3, col: '#ffffff' }); crumb100(o.a, y - 5, hc, 3, 16); } },
  C: { name: 'Ring and glint', desc: 'No drawn wheel at all: a bright violet-white rim ring rolls on the edge with a glint riding its rim (so you see it turn), a thin gold axle line through it; each pass a white impact ring pops under it, leaf bits of the herb flip up and out and a couple of glints sparkle.',
    run(o, I, e, hc, y) { const top = y - 6, r = 8, crush = steps101(o.t, T102); herb101(o, e, hc, o.a, top, crush, y); const wx = wx102(o); ring102(wx, top - r, r, (wx - o.a) / r, al102(o)); return T102; },
    fx(o, y, hc) { spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 12, life: .3, col: '#ffffff' }); for (let k = 0; k < 4; k++) spawn({ x: o.a + (k - 1.5) * 3, y: y - 8, vx: (k - 1.5) * 26, vy: -40 - Math.random() * 25, g: 220, life: .55, size: 2, shape: 'leaf', vr: 9, rot: k, col: hc });
      for (let k = 0; k < 2; k++) spawn({ x: o.a + (Math.random() - .5) * 14, y: y - 12 - Math.random() * 6, size: 3.5, shape: 'star', life: .35, col: '#fff8e0' }); } },
  D: { name: 'Heavy wheel', desc: 'A bigger, heavier stone wheel: it rolls slower at the turns, the whole bar jolts down under it on each pass over the herb, dust puffs from the edge where it turns back, and the herb splats a little wider each pass.',
    run(o, I, e, hc, y) { const top = y - 6, r = 11.5, crush = steps101(o.t, T102); herb101(o, e, hc, o.a, top, crush, y); const wx = wx102(o, 16);
      [1, 2].forEach(k => { const at = -.62 + k / 3 * .5; if (o.t >= at) once('al102d' + o.i + k, () => { const x = o.a + (k === 1 ? -16 : 16); for (let q = 0; q < 5; q++) spawn({ x, y: top - 1, vx: (q - 2) * 14 + (Math.random() - .5) * 8, vy: -8 - Math.random() * 10, g: -6, life: .6, size: 1.8, col: 'rgba(200,190,180,.55)' }); }); });
      carved102(wx, top - r, r, (wx - o.a) / r, al102(o), 19); return T102; },
    shake(I) { let k = 0; hits101(I).forEach(o => T102.forEach(a => { const d = o.t - a; if (d >= 0 && d < .14) k = Math.max(k, 1 - d / .14); })); return [0, 1.8 * k]; },
    fx(o, y, hc) { crumb100(o.a, y - 5, hc, 6, 34); const v = fat45(o.i); drum46(70, 0, .012 * v); } },
};
function r102(K) { if (K === 'A') { const A = r101('A'); return { get name() { return 'A. Edge roll (round 101 A)'; }, get desc() { return 'The current pick: ' + A.desc; }, get note() { return A.note; }, draw: top => A.draw(top) }; }
  W101['V' + K] = W102[K]; const R = r101('V' + K); return { get name() { return K + '. ' + W102[K].name; }, get desc() { return R.desc; }, get note() { return 'edge roll: ' + W102[K].name.toLowerCase() + '.'; }, draw: top => R.draw(top) }; }
Object.assign(FAM, { PA: r102('A'), PB: r102('B'), PC: r102('C'), PD: r102('D') });

// Moved out 2026-11-17 (round 104 prep): round 101's wheel101, W101 (Edge roll) and r101; round 103's SC103 A-D (Apothecary trough, Glass and juice, Herbs in a row, Juice press stream) and r103 (E Big herb on stage stays on the page as SC103.E, the base).
function wheel101(x, y, r, ang, al, axle = 1) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x + 1, y + r + .5, r * .8, 1.5, 0, 0, 7); ctx.fill();
  if (axle) { ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r - 7, y); ctx.lineTo(x + r + 7, y); ctx.stroke(); }
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r); g.addColorStop(0, '#e0d8d0'); g.addColorStop(1, '#6a625c'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r - 1, 0, 7); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,34,30,.8)'; for (let q = 0; q < 2; q++) { const a = ang + q * Math.PI / 2; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * r * .8, y - Math.sin(a) * r * .8); ctx.lineTo(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8); ctx.stroke(); }
  ctx.fillStyle = '#c8955a'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill(); ctx.restore(); }
// the herb at (x, yb = its base): falls -1.05..-.85, squashes on landing, then flattens by crush (0..1) into a smear; sinks -.1..0
const W101 = {
  A: { name: 'Edge roll', desc: '100 B made readable: the herb lands on the bar’s top edge with a squash, the wheel rolls in, makes three slow passes over it (the herb flattening a step each pass into a green smear, crumbs dropping in), rolls off, the smear sinks in, then the flash.',
    run(o, I, e, hc, y) { const top = y - 6, r = 8, wy = top - r, T = [0, 1, 2].map(k => -.62 + (k * 2 + 1) / 6 * .5), crush = steps101(o.t, T);
      herb101(o, e, hc, o.a, top, crush, y); const ph = clamp((o.t + .62) / .5) * 3 * Math.PI;
      let wx = o.a + 14 * Math.cos(ph); if (o.t < -.62) wx = o.a + 14 + 20 * clamp((-.62 - o.t) / .14); if (o.t > -.12) wx = o.a - 14 - 24 * clamp((o.t + .12) / .14);
      wheel101(wx, wy, r, (wx - o.a) / r, clamp((o.t + .78) / .1) * clamp((.04 - o.t) / .1)); return T; } },
};
function r101(K) { const W = W101[K], lv = n => mix(n, '#ffffff', .35), dk = n => mix(n, '#000000', .45), hueAt = n => HUE98[clamp(n, 0, 5)];
  const V = { shake(I) { return W.shake ? W.shake(I) : [0, 0]; },
    grow(p, x0, y, L, f, t, I) { const A = hits101(I).filter(o => o.t >= 0 && o.t < 1).pop();
      if (!A) { const c = hueAt(Math.floor(I.v + 1e-6) - I.lo); liq98(x0 - 2, I.tipX, y, lv(c), dk(c)); return; }
      const n0 = S.v0 + A.i - I.lo, c0 = hueAt(n0), c1 = hueAt(n0 + 1), d = 420 * A.t; liq98(x0 - 2, I.tipX, y, lv(c0), dk(c0));
      ctx.save(); ctx.beginPath(); ctx.rect(A.a - d, y - 6, 2 * d, 12); ctx.clip(); liq98(x0 - 2, I.tipX, y, lv(c1), dk(c1)); ctx.fillStyle = `rgba(255,255,255,${.75 * (1 - clamp(A.t / .35))})`; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12); ctx.restore(); },
    over(p, I) { const y = I.ly; hits101(I).forEach(o => { const [e, hc] = HERB98[(S.v0 + o.i) % 5], c1 = hueAt(S.v0 + o.i + 1 - I.lo);
      if (o.t < 0) { const T = W.run(o, I, e, hc, y); const v = fat45(o.i), n = pick45(o.i, 4);
        if (o.t >= -.85) once('al101l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
        T.forEach((a, k) => { if (o.t >= a) once('al101c' + o.i + k, () => { if (W.fx) W.fx(o, y, hc, k); else crumb100(o.a, y - 6, hc, 5, 26); noise(0, .16, .006 * v, 420, .8, 'lowpass'); noise(.01, .03, .004 * v, 1500, 2, 'bandpass', true); }); }); }
      if (o.t >= 0) once('al101f' + o.i, () => { const v = fat45(o.i), n = pick45(o.i, 4); tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08);
        spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 10, life: .35, col: '#ffffff' }); for (let k = 0; k < 3; k++) spawn({ x: o.a, y: y - 6, vx: (Math.random() - .5) * 40, vy: -40 - Math.random() * 30, g: 300, life: .4, size: 1.2, col: '#ffffff' }); });
      const gl = o.t >= 0 ? 1 - clamp(o.t / .9) : 0; if (gl > 0) { ctx.save(); ctx.shadowColor = c1; ctx.shadowBlur = 14; ctx.strokeStyle = hexA(c1, .7 * gl); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(I.x0 - 3, y - 7, I.tipX - I.x0 + 4, 14, 4); ctx.stroke(); ctx.restore(); } }); } };
  return { get name() { return K + '. ' + W.name; }, get desc() { return W.desc + ' (Skill-ups are 1.5 s apart on this round so each one reads; the sound is a gentle placeholder.)'; }, get note() { return 'wheel grinder: ' + W.name.toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Alchemy' || S.p !== ALB98 || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = ALB98; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r101('A') });
  A: { name: 'Apothecary trough', desc: 'The bar is a carved wooden trough. The herb lands on its rim and the stone wheel rolls three passes over it; a lump of green paste plops into the trough at the front, and the older paste behind it glows into finished violet potion, the glow line following the front.',
    grow(p, x0, y, L, f, t, I) { const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#5a361a'); g.addColorStop(.5, '#7a4e2a'); g.addColorStop(1, '#3a2210'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, I.x1 - x0 + 4, 12);
      ctx.fillStyle = 'rgba(30,16,6,.45)'; [-3, 0, 3.5].forEach((d, k) => { for (let x = x0; x < I.x1; x += 9) if (rnd53(x * .3 + k) > .35) ctx.fillRect(x, y + d, 5 + rnd53(x + k) * 4, .8); });
      const tip = I.tipX; if (tip <= x0) return; const pg = ctx.createLinearGradient(0, y - 5, 0, y + 6); pg.addColorStop(0, '#a8e070'); pg.addColorStop(1, '#3a6a20'); ctx.fillStyle = pg; ctx.fillRect(x0 - 2, y - 4.5, tip - x0 + 2, 10.5);
      ctx.fillStyle = 'rgba(30,60,10,.5)'; for (let x = x0; x < tip; x += 2) if (rnd53(x * 1.7) > .55) ctx.fillRect(x, y - 3 + rnd53(x * 2.3) * 7, 1, 1);
      const px = tip - 26; if (px > x0) { ctx.save(); ctx.beginPath(); ctx.rect(x0 - 2, y - 6, px - x0 + 2, 12); ctx.clip(); liq98(x0 - 2, px + 2, y, '#d0a0ff', '#5a2aa0'); ctx.restore();
        const gg = ctx.createLinearGradient(px - 2, 0, px + 10, 0); gg.addColorStop(0, 'rgba(208,160,255,.9)'); gg.addColorStop(1, 'rgba(208,160,255,0)'); ctx.fillStyle = gg; ctx.fillRect(px - 2, y - 4.5, 12, 10.5);
        ctx.fillStyle = `rgba(255,255,255,${.6 + .3 * Math.sin(t * 6)})`; for (let k = 0; k < 3; k++) ctx.fillRect(px - 1, y - 3 + k * 3, 1.2, 1.2); } },
    over(p, I, o, e, hc) { const y = I.ly; if (o.t < 0) { herb101(o, e, hc, o.a, y - 6, steps101(o.t, T102), y); wheel103(o, o.a, y - 6); }
      else if (o.t < .4) { const k = o.t / .4, h = 4 * (1 - eOut(k)); ctx.fillStyle = '#8ac850'; ctx.beginPath(); ctx.ellipse(I.tipX - 5, y - 5, 6, h + .5, 0, Math.PI, 0); ctx.fill(); } } },
  B: { name: 'Glass and juice', desc: 'The bar is a glass vessel: dark glass with bright edges and a glint, the potion inside. The herb lands on the glass lid and a clear crystal wheel (a ring of light with turning facets) presses it; each pass a drop of herb juice drips through into the potion and swirls; then the potion turns its next color.',
    grow(p, x0, y, L, f, t, I) { ctx.fillStyle = 'rgba(190,210,255,.10)'; ctx.fillRect(x0 - 2, y - 6, I.x1 - x0 + 4, 12); pot103(x0, y, I, .9);
      hits101(I).forEach(o => T102.forEach((a, k) => { const u = (o.t - a) / .7; if (u <= 0 || u >= 1) return; const [, hc] = HERB98[(S.v0 + o.i) % 5]; for (let q = 0; q < 5; q++) { const an = q * 1.26 + u * 5 + k, rr = 2 + u * 9; ctx.fillStyle = hexA(hc, .8 * (1 - u)); ctx.fillRect(o.a + Math.cos(an) * rr, y + Math.sin(an) * Math.min(4, rr * .4), 1.5, 1.5); } }));
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x0 - 1, y - 5.5, I.x1 - x0 + 2, 1); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0 - 1, y + 4, I.x1 - x0 + 2, 1);
      const gx = x0 + ((t * 40) % (L + 80)) - 40; ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(gx, y - 4, 10, 1.5); ctx.fillRect(gx + 4, y - 2, 5, 1); },
    over(p, I, o, e, hc) { const y = I.ly; if (o.t >= 0) return; herb101(o, e, hc, o.a, y - 6, steps101(o.t, T102), y); const wx = wx102(o), r = 8.5, wy = y - 6 - r, al = al102(o); if (al <= 0) return;
      ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = 'rgba(220,240,255,.22)'; ctx.beginPath(); ctx.arc(wx, wy, r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = 'rgba(200,230,255,.6)'; ctx.lineWidth = 1; const an = (wx - o.a) / r; for (let q = 0; q < 3; q++) { const a = an + q * Math.PI / 3; ctx.beginPath(); ctx.moveTo(wx + Math.cos(a) * r * .9, wy + Math.sin(a) * r * .9); ctx.lineTo(wx - Math.cos(a) * r * .9, wy - Math.sin(a) * r * .9); ctx.stroke(); }
      ctx.fillStyle = '#ffffff'; star4(wx - r * .45, wy - r * .45, 2.5, 0); ctx.restore();
      T102.forEach((a, k) => { const u = (o.t - a) / .15; if (u > 0 && u < 1) { ctx.fillStyle = hc; ctx.beginPath(); ctx.arc(o.a, y - 6 + u * 5, 1.8, 0, 7); ctx.fill(); } }); } },
  C: { name: 'Herbs in a row', desc: 'The rest of the bar shows what is left to the next recipe: one herb sitting on the bar for every point still to go. Each skill-up the wheel rolls in over the next herb in the row, crushes it in three passes, and that slot fills with potion (the color flash), so you watch the row of herbs being used up.',
    grow(p, x0, y, L, f, t, I) { pot103(x0, y, I); },
    pre(p, I) { const y = I.ly, busy = new Set(hits101(I).filter(o => o.t > -.8).map(o => S.v0 + o.i)); for (let j = Math.floor(I.v + 1e-6); j < S.nx.lv; j++) { if (busy.has(j)) continue; emo98(HERB98[j % 5][0], I.X(j + .5), y - 12, 12, 0, .9); } },
    over(p, I, o, e, hc) { const y = I.ly, hx = I.X(S.v0 + o.i + .5); if (o.t <= -.8 || o.t >= 0) return; herb101(Object.assign({}, o, { t: Math.max(o.t, -.74) }), e, hc, hx, y - 6, steps101(o.t, T102), y, 12 + 4 * clamp((o.t + .8) / .1)); wheel103(o, hx, y - 6, 8, 11); } },
  D: { name: 'Juice press stream', desc: 'The wheel squeezes the herb and its juice runs along the top of the bar as a bright stream in the herb’s color, a little farther each pass; then it pours in and the fill catches up to it. The fill keeps each herb’s color, so the bar shows a stripe for every herb you pressed.',
    grow(p, x0, y, L, f, t, I) { const tip = I.tipX; for (let j = I.lo; j < S.nx.lv; j++) { const a = I.X(j), b = Math.min(I.X(j + 1), tip); if (b <= a) break; const c = HERB98[j % 5][1]; liq98(a - (j === I.lo ? 2 : 0), b, y, lv103(c), dk103(c)); }
      const pl = hits101(I).filter(o => o.t >= 0 && o.t < .5).pop(); if (pl) { const k = 1 - pl.t / .5; ctx.fillStyle = `rgba(255,255,255,${.45 * k})`; ctx.fillRect(pl.a, y - 6, tip - pl.a, 12); } },
    over(p, I, o, e, hc) { const y = I.ly; if (o.t < 0) { herb101(o, e, hc, o.a, y - 6, steps101(o.t, T102), y); wheel103(o, o.a, y - 6); }
      const fr = steps101(o.t, T102), fade = o.t >= 0 ? 1 - clamp(o.t / .45) : 1; if (fr > 0 && fade > 0) { const xe = lerp(o.a + 5, o.b, fr); ctx.save(); ctx.globalAlpha *= fade; ctx.strokeStyle = hc; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(o.a + 5, y - 6.5); ctx.lineTo(xe, y - 6.5); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.shadowColor = hc; ctx.shadowBlur = 6; ctx.beginPath(); ctx.arc(xe, y - 6.5, 1.8, 0, 7); ctx.fill(); ctx.restore(); }
      if (o.t >= .3) once('al103d' + o.i, () => spawn({ x: o.b, y: y - 4, size: 2, shape: 'ring', grow: 9, life: .35, col: hc })); } },
function r103(K) { const Z = SC103[K];
  const V = { grow: Z.grow,
    over(p, I) { const y = I.ly; if (Z.pre) Z.pre(p, I); hits101(I).forEach(o => { const [e, hc] = HERB98[(S.v0 + o.i) % 5]; Z.over(p, I, o, e, hc); const v = fat45(o.i), n = pick45(o.i, 4);
      if (o.t >= -.85 && o.t < 0) once('al103l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
      T102.forEach((a, k) => { if (o.t >= a && o.t < 0) once('al103c' + o.i + k, () => { if (K !== 'E') crumb100(K === 'C' ? I.X(S.v0 + o.i + .5) : o.a, y - 6, hc, 3, 18); noise(0, .16, .006 * v, 420, .8, 'lowpass'); noise(.01, .03, .004 * v, 1500, 2, 'bandpass', true); }); });
      if (o.t >= 0) once('al103f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); }); }); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Skill-ups 1.5 s apart; the sound is a gentle placeholder.)'; }, get note() { return Z.name.toLowerCase() + '.'; },
    draw(top) { if (profName !== 'Alchemy' || S.p !== ALB98 || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = ALB98; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r103('A'), PB: r103('B'), PC: r103('C'), PD: r103('D'), PE: r103('E') });

// Moved out 2026-11-17 (round 105 prep): round 103's SC103.E (Big herb on stage) and round 104's SC104 (A-G scenes incl. C Mortar pour, the base of round 105), ladle104, r104. The page keeps alb104/pot104/act104/fall104/bead104 and the gap switch.
const SC103 = {
  E: { name: 'Big herb on stage', desc: 'A small wooden stand sits on the start of the bar. A big herb lands on it and a big stone wheel rolls over it; each pass squeezes a glowing drop of essence that arcs over into the front of the potion with a splash; then the color flash.',
    grow(p, x0, y, L, f, t, I) { pot103(x0, y, I); },
    pre(p, I) { const y = I.ly, sx = I.x0 + 14, yS = y - 15; ctx.fillStyle = '#5a3a1e'; ctx.fillRect(sx - 2, yS + 4, 4, 5); const g = ctx.createLinearGradient(0, yS, 0, yS + 4); g.addColorStop(0, '#b8865a'); g.addColorStop(1, '#6a4424'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(sx - 17, yS, 34, 4, 1.5); ctx.fill(); },
    over(p, I, o, e, hc) { const y = I.ly, sx = I.x0 + 14, yS = y - 15; if (o.t < 0) { herb101(o, e, hc, sx, yS, steps101(o.t, T102), y, 24); wheel103(o, sx, yS, 11, 10); }
      T102.forEach((a, k) => { const u = (o.t - a) / .3; if (u > 0 && u < 1) { const x = lerp(sx + 4, o.a, u), yy = lerp(yS - 3, y - 5, u) - Math.sin(Math.PI * u) * 16; ctx.save(); ctx.shadowColor = hc; ctx.shadowBlur = 8; ctx.fillStyle = mix(hc, '#ffffff', .3); ctx.beginPath(); ctx.arc(x, yy, 2.6, 0, 7); ctx.fill(); ctx.restore(); }
        if (u >= 1) once('al103e' + o.i + k, () => { spawn({ x: o.a, y: y - 5, size: 2, shape: 'ring', grow: 8, life: .3, col: hc }); for (let q = 0; q < 3; q++) spawn({ x: o.a, y: y - 6, vx: (Math.random() - .5) * 40, vy: -30 - Math.random() * 25, g: 300, life: .35, size: 1.1, col: hc }); }); }); } },
};
const SC104 = {
  A: Object.assign({}, SC103.E, { name: 'Big herb on stage (round 103 E)' }),
  B: { name: 'Alembic drip', desc: 'A glass flask sits at the start of the bar with a straight glass pipe sloping down to the front. The herb drops into the flask, which glows its color; one bright bead of essence slides down the pipe and drips into the potion.',
    pre(p, I) { const y = I.ly, fx = I.x0 + 8, fy = y - 21, pe = Math.max(I.tipX, fx + 30), A = act104(I), g = A && A.t > -.85 && A.t < -.2 ? Math.sin(Math.PI * (A.t + .85) / .65) : 0;
      ctx.strokeStyle = 'rgba(220,235,255,.55)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(fx + 5, fy - 4); ctx.lineTo(pe, y - 9); ctx.stroke(); ctx.strokeStyle = 'rgba(40,50,70,.8)'; ctx.lineWidth = 1; ctx.stroke(); ctx.lineCap = 'butt';
      if (g > 0) { const c = HERB98[(S.v0 + A.i) % 5][1], rg = ctx.createRadialGradient(fx, fy, 1, fx, fy, 16); rg.addColorStop(0, hexA(c, .6 * g)); rg.addColorStop(1, hexA(c, 0)); ctx.fillStyle = rg; ctx.fillRect(fx - 16, fy - 16, 32, 32); }
      ctx.fillStyle = 'rgba(200,220,255,.14)'; ctx.beginPath(); ctx.arc(fx, fy, 7, 0, 7); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, 6, 0, 7); ctx.clip(); const c = hue104(I, Math.floor(I.v + 1e-6)); ctx.fillStyle = hexA(c, .8); ctx.fillRect(fx - 7, fy, 14, 7); ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(fx, fy, 7, 0, 7); ctx.stroke(); ctx.strokeRect(fx - 1.8, fy - 13, 3.6, 6); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(fx - 4, fy - 4, 1.5, 3); },
    over(p, I, o, e, hc) { const y = I.ly, fx = I.x0 + 8, fy = y - 21; if (o.t < -.85) { fall104(o, e, fx, y - 46, fy - 12, 13); return; } if (o.t < -.75) emo98(e, fx, fy - 10 + (o.t + .85) * 60, 13 * (1 - (o.t + .85) / .1 * .7), 0, 1 - (o.t + .85) / .1);
      if (o.t > -.45 && o.t < -.05) { const u = (o.t + .45) / .4; bead104(lerp(fx + 5, o.a, u * u), lerp(fy - 4, y - 9, u * u), hc); }
      if (o.t >= -.05 && o.t < 0) bead104(o.a, lerp(y - 9, y - 6, (o.t + .05) / .05), hc, 2);
      if (o.t >= 0) once('al104b' + o.i, () => spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 9, life: .35, col: hc })); } },
  C: { name: 'Mortar pour', desc: 'A stone mortar sits at the start of the bar. The herb drops in, a pestle streak circles inside the bowl as the herb is ground down, then the powder pours from the bowl’s lip as a thin stream that runs along the top of the bar and settles in at the front.',
    pre(p, I) { const y = I.ly, mx = I.x0 + 12, my = y - 13, g = ctx.createLinearGradient(0, my, 0, my + 8); g.addColorStop(0, '#b8b0a6'); g.addColorStop(1, '#5e5852'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(mx, my, 11, 7, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#3a3430'; ctx.beginPath(); ctx.ellipse(mx, my, 11, 2.2, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#d8d0c6'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = '#d8d0c6'; ctx.beginPath(); ctx.moveTo(mx + 10, my - 1); ctx.lineTo(mx + 15, my - .5); ctx.lineTo(mx + 10, my + 1.5); ctx.fill(); },
    over(p, I, o, e, hc) { const y = I.ly, mx = I.x0 + 12, my = y - 13; if (o.t < -.85) { fall104(o, e, mx, y - 46, my - 6, 13); return; }
      if (o.t < -.4) { const k = clamp((o.t + .85) / .45); emo98(e, mx, my - 3, 13 * (1 - k * .8), k * 5, 1 - k * .5); const ph = (o.t + .85) * 24; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(mx, my - 1, 8, 3, 0, ph, ph + 1.6); ctx.stroke(); ctx.restore(); }
      if (o.t > -.42 && o.t < .05) { const px = mx + 15, L1 = y - 6.5 - my, L2 = Math.max(1, o.a - px - 4); for (let q = 0; q < 16; q++) { const s = (o.t + .42) / .42 * 1.5 - q * .06; if (s < 0 || s > 1) continue; const d = s * (L1 + L2), x = d < L1 ? px + d * .3 : px + L1 * .3 + (d - L1), yy = d < L1 ? my + d : y - 6.5;
        ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(Math.min(x, o.a), yy - .6, 1.3, 1.3); } } } },
  D: { name: 'Balance pan', desc: 'A small balance stands over the front. The herb drops onto the right pan, the beam dips under its weight, the herb crumbles to powder on the pan, then the pan tips and spills the powder into the potion right at the front; the beam settles level again.',
    pre(p, I) { const y = I.ly, A = act104(I), px = I.tipX - 13, py = y - 20; let th = 0, tip = 0;
      if (A) { const t = A.t; th = t < -.85 ? 0 : t < -.6 ? .22 * eBack(clamp((t + .85) / .25)) : t < 0 ? .22 : .22 * (1 - eOut(clamp(t / .4))); tip = t < -.3 ? 0 : t < 0 ? eOut(clamp((t + .3) / .15)) : 1 - clamp(t / .3); }
      ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(px, y - 6); ctx.lineTo(px, py); ctx.stroke(); ctx.fillStyle = '#c8955a'; ctx.beginPath(); ctx.arc(px, py, 1.6, 0, 7); ctx.fill();
      const ex = s => px + s * 13 * Math.cos(th), ey = s => py + s * 13 * Math.sin(th); ctx.strokeStyle = '#d8b070'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ex(-1), ey(-1)); ctx.lineTo(ex(1), ey(1)); ctx.stroke();
      [-1, 1].forEach(s => { const hx = ex(s), hy = ey(s), r = s > 0 ? tip * .9 : 0; ctx.strokeStyle = 'rgba(230,210,170,.6)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy + 5); ctx.stroke();
        ctx.save(); ctx.translate(hx, hy + 6); ctx.rotate(r); ctx.fillStyle = '#c8a060'; ctx.beginPath(); ctx.ellipse(0, 0, 5.5, 2, 0, 0, Math.PI); ctx.fill(); ctx.restore(); });
      this.pan = { x: ex(1), y: ey(1) + 6, tip }; },
    over(p, I, o, e, hc) { const y = I.ly, P = SC104.D.pan || { x: I.tipX, y: y - 14, tip: 0 }; if (o.t < -.85) { fall104(o, e, P.x, y - 46, P.y - 7, 12); return; }
      if (o.t < -.25) { const k = clamp((o.t + .65) / .35); emo98(e, P.x, P.y - 6, 12 * (1 - k * .75), 0, 1 - k * .4); if (o.t > -.65) once('al104d' + o.i, () => crumb100(P.x, P.y - 3, hc, 4, 14)); }
      if (o.t > -.3 && o.t < .05) for (let q = 0; q < 12; q++) { const s = (o.t + .3) / .3 * 1.4 - q * .05; if (s < 0 || s > 1) continue; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(P.x + 4 + q % 3, P.y + s * (y - 6 - P.y), 1.2, 1.2); } } },
  E: { name: 'Herb press', desc: 'A small wooden press stands at the start of the bar: two plates between two posts. The herb drops between the plates; the top plate squeezes down three times, the herb flattening a step each time, and each squeeze squirts an arc of juice farther along the bar, the last one landing at the front.',
    pre(p, I) { const y = I.ly, sx = I.x0 + 12, A = act104(I, -1.1, .1); let pr = 0; if (A) T102.forEach(a => { const d = A.t - a; if (d > -.06 && d < .12) pr = Math.max(pr, d < 0 ? 1 + d / .06 : 1 - d / .12); }); const gap = 9 - 6 * pr, b = y - 13;
      ctx.strokeStyle = '#6a4424'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 12, y - 6); ctx.lineTo(sx - 12, y - 32); ctx.moveTo(sx + 12, y - 6); ctx.lineTo(sx + 12, y - 32); ctx.stroke();
      const plate = yy => { const g = ctx.createLinearGradient(0, yy, 0, yy + 3); g.addColorStop(0, '#c8955a'); g.addColorStop(1, '#7a4e2a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(sx - 11, yy, 22, 3, 1); ctx.fill(); }; plate(b); plate(b - 3 - gap); ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx, b - 3 - gap); ctx.lineTo(sx, y - 34); ctx.stroke(); },
    over(p, I, o, e, hc) { const y = I.ly, sx = I.x0 + 12, b = y - 13; if (o.t < -.85) { fall104(o, e, sx, y - 46, b - 5, 12); return; } const cr = steps101(o.t, T102); if (o.t < 0) { ctx.save(); ctx.translate(sx, b); ctx.scale(1 + cr * .5, Math.max(.2, 1 - cr * .8)); emo98(e, 0, -5, 12, 0, 1 - cr * .5); ctx.restore(); }
      T102.forEach((a, k) => { const u = (o.t - a) / .28, lx = lerp(sx + 16, o.a, (k + 1) / 3); for (let q = 0; q < 5; q++) { const s = u - q * .06; if (s <= 0 || s >= 1) continue; ctx.fillStyle = q ? hexA(hc, .85) : mix(hc, '#ffffff', .4); ctx.beginPath(); ctx.arc(lerp(sx + 11, lx, s), lerp(b - 1, y - 6, s) - Math.sin(Math.PI * s) * (8 + k * 4), q ? 1.1 : 1.6, 0, 7); ctx.fill(); }
        if (u >= 1) once('al104e' + o.i + k, () => spawn({ x: lx, y: y - 6, size: 1.5, shape: 'ring', grow: 6, life: .25, col: hc })); }); } },
  F: { name: 'Stirred in', desc: 'The herb drops straight into the potion at the front with a splash and sinks; a stirring streak circles there and ribbons of the herb’s color twist into the liquid, which glows brighter at the front before the color flash.',
    over(p, I, o, e, hc) { const y = I.ly, cx = o.a - 5; if (o.t < -.85) { fall104(o, e, o.a, y - 46, y - 10, 13); return; } if (o.t < -.6) { const k = (o.t + .85) / .25; emo98(e, o.a, y - 9 + k * 6, 13 * (1 - k * .7), k * 2, 1 - k); }
      once('al104f' + o.i, () => { spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 10, life: .35, col: '#ffffff' }); for (let q = 0; q < 4; q++) spawn({ x: o.a, y: y - 6, vx: (Math.random() - .5) * 40, vy: -35 - Math.random() * 25, g: 300, life: .4, size: 1.2, col: hc }); });
      if (o.t > -.75 && o.t < .1) { const al = clamp((o.t + .75) / .1) * clamp((.1 - o.t) / .15), ph = (o.t + .75) * 14; ctx.save(); ctx.globalAlpha *= al;
        const rg = ctx.createRadialGradient(cx, y, 1, cx, y, 12); rg.addColorStop(0, hexA(hc, .55)); rg.addColorStop(1, hexA(hc, 0)); ctx.fillStyle = rg; ctx.fillRect(cx - 12, y - 6, 24, 12);
        for (let q = 0; q < 12; q++) { const a = ph - q * .32, rr = 9 - q * .55; ctx.fillStyle = q % 4 ? hexA(hc, .9 - q * .06) : 'rgba(255,255,255,.8)'; ctx.fillRect(cx + Math.cos(a) * rr, y + Math.sin(a) * rr * .42, 1.4, 1.4); }
        ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(cx, y - 1, 10, 4.2, 0, ph, ph + 1.4); ctx.stroke(); ctx.restore(); } } },
  G: { name: 'Ladle pour', desc: 'A small ladle rests over the start of the bar. The herb drops into it; it dips into the potion to scoop, lifts and swings along an arc to the front, tips and pours a thin stream of herb-colored potion into the front, then swings back before the next herb.',
    pre(p, I) { if (!act104(I, -1.1, 1.4)) ladle104(I.x0 + 10, I.ly - 20, 0, null); },
    over(p, I, o, e, hc) { const Lh = act104(I, -1.1, 1.4); if (!Lh || Lh.i !== o.i) return; const y = I.ly, rx = I.x0 + 10, ry = y - 20, t = o.t; let x = rx, yy = ry, rot = 0, pour = 0;
      if (t >= -.85 && t < -.65) yy = ry + Math.sin(Math.PI * (t + .85) / .2) * 17; else if (t >= -.65 && t < -.35) { const u = eOut(clamp((t + .65) / .3)); x = lerp(rx, o.a - 6, u); yy = ry - Math.sin(Math.PI * u) * 8; }
      else if (t >= -.35 && t < .15) { x = o.a - 6; rot = .95 * eOut(clamp((t + .35) / .1)) * (t > .08 ? 1 - clamp((t - .08) / .07) : 1); pour = t > -.27 && t < .08 ? 1 : 0; } else if (t >= .15) { const u = eOut(clamp((t - .15) / .25)); x = lerp(o.a - 6, rx, u); yy = ry - Math.sin(Math.PI * u) * 8; }
      if (t < -.85) fall104(o, e, rx, y - 46, ry - 5, 11); else if (t < -.65) emo98(e, x, yy - 4, 11 * (1 - (t + .85) / .2 * .7), 0, 1 - (t + .85) / .2);
      if (pour) { ctx.strokeStyle = hc; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 4.5, yy + 1); ctx.lineTo(x + 5, y - 6); ctx.stroke(); }
      ladle104(x, yy, rot, t > -.75 && t < -.1 ? hc : null); } },
};
function ladle104(x, yy, rot, fill) { ctx.save(); ctx.translate(x, yy); ctx.rotate(rot); ctx.strokeStyle = '#b8b0a6'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-4, -1); ctx.lineTo(-14, -9); ctx.stroke();
      ctx.fillStyle = '#9a928a'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI); ctx.fill(); ctx.strokeStyle = '#e0d8ce'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke();
  if (fill) { ctx.fillStyle = hexA(fill, .9); ctx.beginPath(); ctx.ellipse(0, .5, 4, 1.4, 0, 0, 7); ctx.fill(); } ctx.restore(); }
function r104(K) { const Z = SC104[K];
  const V = { grow(p, x0, y, L, f, t, I) { pot104(x0, y, I); },
    over(p, I) { const y = I.ly; if (Z.pre) Z.pre.call(Z, p, I); hits101(I).forEach(o => { const [e, hc] = HERB98[(S.v0 + o.i) % 5]; Z.over(p, I, o, e, hc); const v = fat45(o.i), n = pick45(o.i, 4);
      if (o.t >= -.85 && o.t < 0) once('al104l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
      T102.forEach((a, k) => { if (o.t >= a && o.t < 0) once('al104c' + o.i + k, () => { noise(0, .14, .005 * v, 420, .8, 'lowpass'); noise(.01, .03, .003 * v, 1500, 2, 'bandpass', true); }); });
      if (o.t >= 0) once('al104f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); }); }); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Use the gap buttons to see 5-, 15- and 50-point gaps to the next recipe. Skill-ups 1.5 s apart; placeholder sound.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r104('A'), PB: r104('B'), PC: r104('C'), PD: r104('D'), PE: r104('E'), PF: r104('F'), PG: r104('G') });

// Round 105 options (MO105 A-E, r105), moved out 2026-11-17; the page keeps the mortar helpers (pestle105, bowlBack105, bowlFront105, pour105, bowlHerb105, grind105, MX105) that round 106 builds on.
const MO105 = {
  A: { name: 'Mortar pour + pestle', desc: 'Mortar pour as you liked it, now with a real pestle: it leans in the bowl, the herb drops in, the pestle grinds round inside the bowl while the herb shrinks, then leans back as the powder pours from the lip along the bar into the front.',
    grow(p, x0, y, L, f, t, I) { pot104(x0, y, I); },
    scene(I, o, e, hc) { const [mx, my] = MX105(I), y = I.ly; bowlBack105(mx, my); if (o) bowlHerb105(o, e, mx, my); const [hx, hy, an] = grind105(o, mx, my); pestle105(hx, hy, an); bowlFront105(mx, my); if (o) pour105(o, mx, my, y, hc, o.a); } },
  B: { name: 'Pounding pestle', desc: 'The pestle stands upright and pounds the herb three times (a soft thud and a puff of crumbs each); the bar is ground powder, grainy and pale, with a little heap at the front: the poured powder lands on the heap, it swells, then slumps forward to the new front.',
    grow(p, x0, y, L, f, t, I) { const tip = I.tipX; if (tip <= x0) return; const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#e8e0b8'); g.addColorStop(1, '#8a7c48'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, tip - x0 + 2, 12);
      for (let x = x0; x < tip; x += 1.6) { const r = rnd53(x * 1.3); ctx.fillStyle = r > .75 ? 'rgba(255,255,240,.7)' : r < .3 ? 'rgba(90,70,30,.45)' : 'rgba(200,190,140,.6)'; ctx.fillRect(x, y - 5 + rnd53(x * 2.7) * 10, 1, 1); } },
    scene(I, o, e, hc) { const [mx, my] = MX105(I), y = I.ly; bowlBack105(mx, my); let hx = mx + 3, hy = my + .5, an = -1.15;
      if (o && o.t >= -.85 && o.t < .05) { const k = Math.floor(clamp((o.t + .85) / .45) * 3), u = ((o.t + .85) / .15) % 1; hx = mx; an = -Math.PI / 2 + .12; hy = o.t < -.4 ? my - 1 - 9 * (u < .65 ? eOut(u / .65) : 1 - Math.pow((u - .65) / .35, 2)) : my - 1;
        if (o.t < -.4) { const sq = 1 - clamp(k / 3) * .8; emo98(e, mx, my - 3, 13 * sq, 0, .6 + .4 * sq); [0, 1, 2].forEach(n => { if (o.t >= -.85 + (n + 1) * .15 - .01) once('al105b' + o.i + n, () => { crumb100(mx, my - 2, hc, 4, 22); spawn({ x: mx, y: my - 1, size: 2, shape: 'ring', grow: 7, life: .25, col: 'rgba(255,255,255,.8)' }); drum46(85, 0, .012 * fat45(o.i)); }); }); } }
      if (o && o.t < -.85) bowlHerb105(o, e, mx, my); pestle105(hx, hy, an); bowlFront105(mx, my); if (o) pour105(o, mx, my, y, '#e8e0b8', o.a);
      const hp = o ? (o.t < -.2 ? 0 : o.t < 0 ? (o.t + .2) / .2 : 1 - eOut(clamp(o.t / .5))) : 0, hh = 2 + 3.5 * hp, hxp = I.tipX; ctx.fillStyle = '#d8cf9c'; ctx.beginPath(); ctx.ellipse(hxp - 2, y - 6, 5 + hp * 2, hh, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = 'rgba(255,255,240,.6)'; ctx.fillRect(hxp - 4, y - 6 - hh + 1, 2, 1); } },
  C: { name: 'Bar is the mortar', desc: 'No bowl: the bar itself is a long stone trough. The herb drops straight into the trough at the front, and the pestle grinds it back and forth right there inside the bar, three strokes, the herb crumbling; the ground herb is the fill, green-gold and grainy, left exactly where it was ground. The pestle rests at the front between skill-ups.',
    grow(p, x0, y, L, f, t, I) { const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#8a827a'); g.addColorStop(.3, '#4e4842'); g.addColorStop(1, '#6e665e'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, I.x1 - x0 + 4, 12);
      ctx.fillStyle = 'rgba(20,18,16,.5)'; ctx.fillRect(x0 - 2, y - 3, I.x1 - x0 + 4, 7); ctx.fillStyle = 'rgba(220,210,200,.25)'; for (let x = x0; x < I.x1; x += 5) if (rnd53(x * .9) > .6) ctx.fillRect(x, y - 5 + rnd53(x * 1.9) * 2, 1, 1);
      const tip = I.tipX; if (tip > x0) { const pg = ctx.createLinearGradient(0, y - 3, 0, y + 4); pg.addColorStop(0, '#c8d070'); pg.addColorStop(1, '#5a6a20'); ctx.fillStyle = pg; ctx.fillRect(x0 - 2, y - 3, tip - x0 + 2, 7);
        for (let x = x0; x < tip; x += 1.6) { const r = rnd53(x * 2.1); ctx.fillStyle = r > .7 ? 'rgba(240,250,190,.7)' : 'rgba(40,60,10,.45)'; ctx.fillRect(x, y - 2.5 + rnd53(x * 3.1) * 6, 1, 1); } } },
    scene(I, o, e, hc) { const y = I.ly, x = o ? o.a : I.tipX; let hx = I.tipX + 1, hy = y - 1, an = -1.0;
      if (o && o.t < -.85) fall104(o, e, x + 3, y - 40, y - 4, 12); else if (o && o.t < -.05) { const cr = steps101(o.t, T102); emo98(e, x + 3, y - 4 + cr * 2, 12 * (1 - cr * .75), 0, 1 - cr * .5); }
      if (o && o.t >= -.8 && o.t < -.1) { const ph = clamp((o.t + .8) / .7) * 3 * Math.PI; hx = x + 3 + Math.sin(ph) * 7; hy = y - 1; an = -1.0 - Math.cos(ph) * .18; }
      pestle105(hx, hy, an); } },
  D: { name: 'Powder dissolves', desc: 'As A, but you see the powder go into the potion: it lands as a pale floating film on top of the liquid at the front, spreads a little, then sinks and blooms into the potion as a soft cloud of the herb’s color while the potion takes its next color.',
    grow(p, x0, y, L, f, t, I) { pot104(x0, y, I); hits101(I).forEach(o => { const [, hc] = HERB98[(S.v0 + o.i) % 5];
      if (o.t > -.2 && o.t < .7) { const k = clamp(o.t / .6), w = 6 + 10 * clamp((o.t + .2) / .3); ctx.fillStyle = `rgba(246,240,220,${.9 * (1 - k)})`; ctx.fillRect(o.a - w, y - 6 + k * 6, w + 2, 2.5);
        if (o.t > 0) { const r = 4 + 16 * eOut(k), rg = ctx.createRadialGradient(o.a - 4, y + 1, 0, o.a - 4, y + 1, r); rg.addColorStop(0, hexA(hc, .7 * (1 - k))); rg.addColorStop(1, hexA(hc, 0)); ctx.fillStyle = rg; ctx.fillRect(o.a - 4 - r, y - 6, 2 * r, 12); } } }); },
    scene(I, o, e, hc) { MO105.A.scene(I, o, e, hc); } },
  E: { name: 'Puff of powder', desc: 'After the grind, the pestle taps the rim twice and a soft cloud of fine powder puffs out of the bowl, drifts over the bar and settles down onto the front, glittering; the bar is a glittering powder (fine sparkles that twinkle), not a liquid.',
    grow(p, x0, y, L, f, t, I) { const tip = I.tipX; if (tip <= x0) return; const g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#e0d0ff'); g.addColorStop(1, '#6a4aa8'); ctx.fillStyle = g; ctx.fillRect(x0 - 2, y - 6, tip - x0 + 2, 12);
      for (let x = x0 + 1; x < tip; x += 3) { const tw = .5 + .5 * Math.sin(t * 3 + x * 1.7); ctx.fillStyle = `rgba(255,255,255,${.25 + .6 * tw * (rnd53(x) > .5 ? 1 : .3)})`; ctx.fillRect(x, y - 5 + rnd53(x * 1.4) * 10, 1, 1); } },
    scene(I, o, e, hc) { const [mx, my] = MX105(I), y = I.ly; bowlBack105(mx, my); if (o) bowlHerb105(o, e, mx, my); let [hx, hy, an] = grind105(o, mx, my);
      if (o && o.t >= -.4 && o.t < -.2) { const u = ((o.t + .4) / .1) % 1; hx = mx + 9; hy = my - 1 - Math.sin(Math.PI * u) * 4; an = -1.5; [0, 1].forEach(n => { if (o.t >= -.4 + n * .1 + .05) once('al105e' + o.i + n, () => spawn({ x: mx + 9, y: my - 1, size: 1.5, shape: 'ring', grow: 6, life: .2, col: 'rgba(255,255,255,.8)' })); }); }
      pestle105(hx, hy, an); bowlFront105(mx, my);
      if (o && o.t > -.32 && o.t < .45) for (let q = 0; q < 9; q++) { const s = clamp((o.t + .32) / .34 - q * .04); if (s <= 0) continue; const set = clamp(o.t / .45), x = lerp(mx + 6, o.a - 2, eOut(s)) + Math.sin(q * 2.1) * 4, yy = lerp(my - 6, y - 9, s) - Math.sin(Math.PI * s) * 7 + set * 5 + Math.cos(q * 1.3) * 2;
        ctx.fillStyle = `rgba(240,232,255,${.32 * (1 - set)})`; ctx.beginPath(); ctx.arc(x, yy, 3 + q % 3 + s * 2, 0, 7); ctx.fill(); if (q % 3 === 0) { ctx.fillStyle = `rgba(255,255,255,${.8 * (1 - set)})`; ctx.fillRect(x, yy, 1, 1); } } } },
};
function r105(K) { const Z = MO105[K];
  const V = { grow: Z.grow,
    over(p, I) { const y = I.ly, L = act104(I, -1.1, 1.4), o = L && L.t < .6 ? L : null, [e, hc] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0]; Z.scene(I, o, e, hc);
      hits101(I).forEach(o => { const v = fat45(o.i), n = pick45(o.i, 4);
        if (o.t >= -.85 && o.t < 0) once('al105l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
        if (K !== 'B' && o.t >= -.85 && o.t < -.4) once('al105g' + o.i, () => noise(0, .45, .005 * v, 700, .9, 'bandpass'));
        if (o.t >= -.42 && o.t < 0) once('al105p' + o.i, () => noise(0, .4, .004 * v, 2400, .7, 'lowpass'));
        if (o.t >= 0) once('al105f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); }); }); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Gap switch under the moments; skill-ups 1.5 s apart; placeholder sound.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r105('A'), PB: r105('B'), PC: r105('C'), PD: r105('D'), PE: r105('E') }); delete FAM.PF; delete FAM.PG; delete FAM.PH;

// Round 106 AD106 A-D (base + puff, drop + bubbles, mix sweeps right, fizz + color ring) and r106, moved out 2026-11-17; AD106.E (sinks and fans out), puff106 and scene106 stay (round 107 uses them).
  A: { name: 'Base + puff when done', desc: 'The locked base (Mortar pour + pestle) with the puff add-on: the moment the pestle stops, a soft puff of powder rises up out of the bowl (not toward the bar) with a few sparkles, then the powder pours along the bar into the front.' },
  B: { name: '+ Drop + bubbles', pour: false, desc: 'With the puff. No stream along the top: the ground powder lifts out of the bowl as a small clump, arcs over to just above the front and drops straight down into the potion; there the potion bubbles up, a few bubbles rising and popping at the surface.',
    over(o, I, mx, my, y, hc) { if (o.t > -.42 && o.t < -.18) { const u = (o.t + .42) / .24; ctx.fillStyle = hc; ctx.beginPath(); ctx.arc(lerp(mx + 6, o.a, eOut(u)), lerp(my - 4, y - 18, u) - Math.sin(Math.PI * u) * 8, 2.6, 0, 7); ctx.fill(); }
      if (o.t >= -.18 && o.t < .02) for (let q = 0; q < 8; q++) { const s = (o.t + .18) / .2 * 1.4 - q * .05; if (s < 0 || s > 1) continue; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(o.a - 1 + (q % 3 - 1), lerp(y - 18, y - 6, s), 1.3, 1.3); }
      for (let q = 0; q < 5; q++) { const u = (o.t - .05 - q * .1) / .45; if (u >= 1 && u < 1.25) { const k = (u - 1) / .25; ctx.strokeStyle = `rgba(255,255,255,${.8 * (1 - k)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(o.a - 4 + q * 2.5, y - 6.5, 1.5 + k * 3, Math.PI, 0); ctx.stroke(); } } },
    grow(o, I, y, hc) { for (let q = 0; q < 5; q++) { const u = (o.t - .05 - q * .1) / .45; if (u <= 0 || u >= 1) continue; const r = 1.2 + u * 1.3 + q % 2 * .5; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(o.a - 4 + q * 2.5, lerp(y + 4, y - 5, u), r, 0, 7); ctx.stroke(); ctx.fillStyle = hexA(hc, .45); ctx.fill(); } } },
  C: { name: '+ Mix sweeps right', desc: 'With the puff. The powder pours in as before, then streaks of its color sweep rightward through the potion like a current, carrying it to the new front where they fade in; the potion takes its next color behind them.',
    grow(o, I, y, hc) { if (o.t < 0 || o.t > .9) return; for (let q = 0; q < 7; q++) { const s = clamp((o.t - q * .05) / .6); if (s <= 0 || s >= 1) continue; const yy = y - 4 + (q * 5) % 9, xh = lerp(o.a - 18, o.b + 2, eOut(s)), len = 6 + q % 3 * 3;
      const g = ctx.createLinearGradient(xh - len, 0, xh, 0); g.addColorStop(0, hexA(hc, 0)); g.addColorStop(1, hexA(hc, .95 * (1 - s * .6))); ctx.fillStyle = g; ctx.fillRect(xh - len, yy, len, 1.4); } } },
  D: { name: '+ Fizz + color ring', desc: 'With the puff. Where the powder lands, a quick fizz of tiny sparks jumps up out of the potion, and a ring of the herb’s color spreads out through the liquid from the spot and fades.',
    over(o, I, mx, my, y, hc) { if (o.t >= 0) once('al106d' + o.i, () => { for (let q = 0; q < 9; q++) spawn({ x: o.a + (Math.random() - .5) * 6, y: y - 6, vx: (Math.random() - .5) * 50, vy: -40 - Math.random() * 50, g: 260, life: .4, size: 1, col: q % 3 ? mix(hc, '#ffffff', .5) : '#ffffff' }); noise(0, .2, .003 * fat45(o.i), 5000, 1, 'highpass'); }); },
    grow(o, I, y, hc) { if (o.t < 0 || o.t > .7) return; const k = o.t / .7, rx = 4 + 34 * eOut(k); ctx.strokeStyle = hexA(hc, .9 * (1 - k)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(o.a, y, rx, Math.min(5, 2 + rx * .2), 0, 0, 7); ctx.stroke(); } },
function r106(K) { const Z = AD106[K];
  const V = { grow(p, x0, y, L, f, t, I) { pot104(x0, y, I); if (Z.grow) hits101(I).forEach(o => Z.grow(o, I, y, HERB98[(S.v0 + o.i) % 5][1])); },
    over(p, I) { const y = I.ly, Lh = act104(I, -1.1, 1.4), o = Lh && Lh.t < .6 ? Lh : null, [e, hc] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0], [mx, my] = MX105(I); scene106(I, o, e, hc, Z.pour !== false);
      hits101(I).forEach(o => { const hc = HERB98[(S.v0 + o.i) % 5][1], v = fat45(o.i), n = pick45(o.i, 4); if (Z.over) Z.over(o, I, mx, my, y, hc);
        if (o.t >= -.85 && o.t < 0) once('al106l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
        if (o.t >= -.85 && o.t < -.4) once('al106g' + o.i, () => noise(0, .45, .005 * v, 700, .9, 'bandpass'));
        if (o.t >= -.42 && o.t < 0 && Z.pour !== false) once('al106s' + o.i, () => noise(0, .4, .004 * v, 2400, .7, 'lowpass'));
        if (o.t >= 0) once('al106f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); if (K === 'B') for (let q = 0; q < 3; q++) tone(600 * semi(pick45(o.i + q, 4)), .5 + q * .1, .004 * v, .08, 'sine', 900); }); }); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Base locked: Mortar pour + pestle. Gap switch under the moments; placeholder sound.)'; }, get note() { return 'add-on: ' + Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r106('A'), PB: r106('B'), PC: r106('C'), PD: r106('D'), PE: r106('E') });

// Round 107 (bar looks x motions: CF107, DESC107, topBubbles107, r107) and round 106 AD106.E (sinks and fans out), moved out 2026-11-17. fill107/tip107/col107 stay (round 108's bar).
const AD106 = {
  E: { name: '+ Sinks and fans out', desc: 'With the puff. The powder enters at the front and sinks as a falling column of grains down through the potion, then fans out both ways along the bottom and dissolves.',
    grow(o, I, y, hc) { if (o.t < -.05 || o.t > .9) return; for (let q = 0; q < 14; q++) { const s = (o.t + .05 - q * .015) / .3; if (s <= 0) continue; let x = o.a - 2 + (q % 3 - 1) * 1.2, yy = lerp(y - 6, y + 4.5, clamp(s)), al = 1;
      if (s > 1) { const f = clamp((s - 1) / 1.6); x += (q % 2 ? 1 : -1) * (4 + q) * eOut(f); al = 1 - f; } ctx.fillStyle = q % 3 ? hexA(hc, .95 * al) : `rgba(255,255,255,${.9 * al})`; ctx.fillRect(x, yy, 1.3, 1.3); } } },
};
// ---------- round 107 (2026-11-17): "you've barely touched the bar and how it moves". Kept on all: the mortar + pestle, the puff when done, bubbles on the potion's surface where the powder
// enters, and 106 E sinks/fans out. Bar looks (picked): Glass vial, Clears as it nears, Living potion; bar motions (picked, all four): Slosh and settle, Surge past + ease back,
// Swell and glow, Fizzing front. Four pairings: A Vial + slosh, B Clears + surge, C Living + swell, D Clears + fizzing front ----------
const CF107 = { A: { look: 'vial', mo: 'slosh', name: 'Glass vial + slosh' }, B: { look: 'clear', mo: 'surge', name: 'Clears as it nears + surge' }, C: { look: 'living', mo: 'swell', name: 'Living potion + swell and glow' }, D: { look: 'clear', mo: 'fizz', name: 'Clears as it nears + fizzing front' } };
const DESC107 = { vial: 'The bar is a long glass vial (glass across the whole bar, a bright highlight along the top, rounded glass ends) with the potion inside, a thin gap of air above it.', clear: 'The potion starts the gap dark and murky with specks in it and clears as it nears the recipe, brighter and glowing as it gets close.', living: 'Slow motes of light drift through the potion all the time, so it looks alive; each skill-up they rush for a moment.',
  slosh: 'When the powder lands the surface tilts (a straight tilted line), rocks back and forth a couple of times and settles level.', surge: 'The front surges a little past the new point and eases back to it, like liquid poured in fast.', swell: 'The filled part swells taller than the bar and glows for a moment, then shrinks back.', fizz: 'The front is a bright edge that fizzes all the time (tiny dots rising along it); on a skill-up it bursts with sparks and pushes forward.' };
function topBubbles107(o, y) { for (let q = 0; q < 6; q++) { const t0 = -.08 + q * .1, u = (o.t - t0) / .32; if (u <= 0 || u > 1.3) continue; const x = o.a - 5 + (q * 7) % 11, r = 1 + Math.min(1, u) * 1.8 + q % 2 * .4;
  if (u <= 1) { ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(x, y - 6 - r * .6, r, Math.PI, 0); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill(); }
  else { const k = (u - 1) / .3; ctx.strokeStyle = `rgba(255,255,255,${.7 * (1 - k)})`; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(x, y - 6, 2 + k * 3, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } } }
function r107(K) { const cfg = CF107[K];
  const V = { grow(p, x0, y, L, f, t, I) { fill107(cfg, x0, y, I, t); hits101(I).forEach(o => AD106.E.grow(o, I, y, HERB98[(S.v0 + o.i) % 5][1])); },
    over(p, I) { const y = I.ly, Lh = act104(I, -1.1, 1.4), o = Lh && Lh.t < .6 ? Lh : null, [e, hc] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0]; scene106(I, o, e, hc, true);
      if (cfg.look === 'vial') { ctx.strokeStyle = 'rgba(220,235,255,.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(I.x0 - 2, y, 6, Math.PI * .5, Math.PI * 1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(I.x1 + 2, y, 6, -Math.PI * .5, Math.PI * .5); ctx.stroke(); }
      if (cfg.look === 'clear') { const f = clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo)); if (f > .5) { ctx.save(); ctx.shadowColor = col107(cfg, I); ctx.shadowBlur = 12 * (f - .5) * 2; ctx.strokeStyle = hexA('#ffd36a', .35 * (f - .5) * 2); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(I.x0 - 3, y - 7, tip107(cfg, I) - I.x0 + 4, 14, 4); ctx.stroke(); ctx.restore(); } }
      hits101(I).forEach(o => { const hc = HERB98[(S.v0 + o.i) % 5][1], v = fat45(o.i), n = pick45(o.i, 4); topBubbles107(o, y);
        if (cfg.mo === 'swell' && o.t >= 0 && o.t < .55) { const k = Math.sin(Math.PI * o.t / .55), c = col107(cfg, I), tip = I.tipX; ctx.save(); ctx.globalAlpha *= .85 * k; ctx.shadowColor = c; ctx.shadowBlur = 14; const g = ctx.createLinearGradient(0, y - 6 - 3 * k, 0, y + 6 + 3 * k); g.addColorStop(0, lv103(c)); g.addColorStop(1, dk103(c)); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(I.x0 - 2, y - 6 - 3 * k, tip - I.x0 + 2, 12 + 6 * k, 4); ctx.fill(); ctx.restore(); }
        if (cfg.mo === 'fizz' && o.t >= 0) once('al107z' + o.i, () => { for (let q = 0; q < 8; q++) spawn({ x: o.b, y: y - 4 + Math.random() * 8, vx: 20 + Math.random() * 40, vy: (Math.random() - .5) * 40 - 20, g: 120, life: .4, size: 1, col: q % 2 ? '#ffffff' : '#ffe8a0' }); });
        if (o.t >= -.85 && o.t < 0) once('al107l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
        if (o.t >= -.85 && o.t < -.4) once('al107g' + o.i, () => noise(0, .45, .005 * v, 700, .9, 'bandpass'));
        if (o.t >= -.42 && o.t < 0) once('al107s' + o.i, () => noise(0, .4, .004 * v, 2400, .7, 'lowpass'));
        if (o.t >= 0) once('al107f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); for (let q = 0; q < 3; q++) tone(640 * semi(pick45(o.i + q, 4)), .15 + q * .1, .003 * v, .07, 'sine', 900); }); }); } };
  return { get name() { return K + '. ' + cfg.name; }, get desc() { return DESC107[cfg.look] + ' ' + DESC107[cfg.mo] + ' (On all: mortar + pestle, the puff when done, bubbles on the surface where the powder enters, then it sinks and fans out. Looks and motions can be swapped between options. Gap switch under the moments.)'; }, get note() { return cfg.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r107('A'), PB: r107('B'), PC: r107('C'), PD: r107('D') }); delete FAM.PE;

// Round 108 (EN108, mortar108, mote108, r108: six ways the herb goes in; the user: 'not liking how it's all put together, start clean'), moved out 2026-11-17.
// ---------- round 108 (2026-11-17): the bar LOCKED as a mix: 107 C Living potion + swell and glow, D's fizzing front, A's slosh. "Not liking the herb drop (the bubbles, the spread)": six ways
// the herb goes into the mix, picked from a brainstorm. With the mortar (+ the puff): A Powder becomes motes, B Front flares, C Glow drawn down, D Bowl tips, current carries.
// No mortar: E Herb dissolves to motes, F Herb rides the current ----------
const BAR108 = { look: 'living', mo: 'swell', slosh: true, fizz: true };
// the mortar, optionally tipped by ang around its spout
function mortar108(I, o, e, hc, ang = 0) { const [mx, my] = MX105(I), sx = mx + 15, sy = my; ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang); ctx.translate(-sx, -sy); bowlBack105(mx, my); if (o) bowlHerb105(o, e, mx, my); const [hx, hy, an] = grind105(o, mx, my); pestle105(hx, hy, an); bowlFront105(mx, my); ctx.restore(); puff106(o, mx, my); }
const mote108 = (x, y, c, a = 1, r = 1.4) => { ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = c; ctx.shadowBlur = 5; ctx.fillStyle = mix(c, '#ffffff', .45); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); };
const EN108 = {
  A: { name: 'Powder becomes motes', mortar: true, desc: 'After the puff, the ground herb leaves the bowl as a stream of glowing motes in its color that fly in a curve into the front of the potion, then keep drifting inside it and join the motes already there.',
    over(o, I, y, hc) { const [mx, my] = MX105(I); for (let q = 0; q < 12; q++) { const s = (o.t + .4) / .4 - q * .045; if (s > 0 && s < 1) { const u = eOut(s), x = lerp(mx + 6, o.a - 2, u), yy = lerp(my - 3, y - 2, u) - Math.sin(Math.PI * u) * 14 + Math.sin(q * 2.3) * 2; mote108(x, yy, hc); }
      else if (s >= 1 && o.t < .9) { const k = clamp(o.t / .9), x = o.a - 2 + (q % 4) * 3 + k * (10 + q % 3 * 6), yy = y - 3 + (q * 5) % 7 + Math.sin(q + o.t * 4) * 1.5; mote108(x, yy, hc, 1 - k, 1.1); } } } },
  B: { name: 'Front flares', mortar: true, pour: true, desc: 'The powder pours along the bar onto the fizzing front; the front flares in the herb’s color (a bright edge and a glow around it) and bursts forward with sparks of that color.',
    over(o, I, y, hc) { if (o.t >= 0) once('al108b' + o.i, () => { for (let q = 0; q < 10; q++) spawn({ x: o.a, y: y - 4 + Math.random() * 8, vx: 25 + Math.random() * 50, vy: (Math.random() - .5) * 50 - 15, g: 140, life: .45, size: 1.2, col: q % 3 ? hc : '#ffffff' }); });
      if (o.t > -.05 && o.t < .6) { const k = o.t < 0 ? 1 : 1 - o.t / .6, x = I.tipX; ctx.save(); const rg = ctx.createRadialGradient(x, y, 0, x, y, 14); rg.addColorStop(0, hexA(hc, .7 * k)); rg.addColorStop(1, hexA(hc, 0)); ctx.fillStyle = rg; ctx.fillRect(x - 14, y - 14, 28, 28);
        ctx.fillStyle = hexA(hc, k); ctx.fillRect(x - 2, y - 7, 2.5, 14); ctx.restore(); } } },
  C: { name: 'Glow drawn down', mortar: true, pour: true, desc: 'The powder pours along the bar and settles on the potion’s surface at the front as a glowing patch of the herb’s color; then the patch narrows and is drawn down into the potion as it swells, leaving a soft glow that fades.',
    over(o, I, y, hc) { if (o.t > -.15 && o.t < .7) { const grow = clamp((o.t + .15) / .2), down = clamp((o.t - .1) / .45), w = (4 + 8 * grow) * (1 - down * .7), yy = y - 6 + down * 7; ctx.save(); ctx.shadowColor = hc; ctx.shadowBlur = 10; ctx.fillStyle = hexA(hc, .85 * (1 - down * .8)); ctx.beginPath(); ctx.ellipse(o.a - 3, yy, w, 1.6 + down, 0, 0, 7); ctx.fill(); ctx.restore(); } } },
  D: { name: 'Bowl tips, current carries', mortar: true, tip: true, desc: 'After the puff the whole mortar tips forward and pours its powder into the start of the bar; the potion sloshes and a current of the herb’s color carries it along the bar to the front, where it joins in.',
    over(o, I, y, hc) { const [mx, my] = MX105(I), px = mx + 15; if (o.t > -.36 && o.t < -.08) for (let q = 0; q < 10; q++) { const s = (o.t + .36) / .2 - q * .06; if (s < 0 || s > 1) continue; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(px + 2 + s * 4, lerp(my + 1, y - 6, s), 1.3, 1.3); }
      if (o.t > -.15 && o.t < .45) { const s = clamp((o.t + .15) / .45); for (let q = 0; q < 6; q++) { const xh = lerp(px + 4, o.a, eOut(clamp(s * 1.2 - q * .04))), len = 8 + q % 3 * 4, yy = y - 4 + (q * 3) % 8, g = ctx.createLinearGradient(xh - len, 0, xh, 0); g.addColorStop(0, hexA(hc, 0)); g.addColorStop(1, hexA(hc, .9 * (1 - s * .5))); ctx.fillStyle = g; ctx.fillRect(xh - len, yy, len, 1.5); } } } },
  E: { name: 'Herb dissolves to motes', desc: 'No mortar: the herb itself drops onto the potion at the front and floats there, bobbing; then it breaks up into motes of its color that spread out through the living potion as the front moves on.',
    over(o, I, y, hc, e) { if (o.t < -.85) { fall104(o, e, o.a, y - 44, y - 10, 15); return; } if (o.t < -.25) { const b = Math.sin((o.t + .85) * 9) * 1.2; emo98(e, o.a, y - 10 + b, 15, Math.sin((o.t + .85) * 5) * .15); }
      else if (o.t < .05) { const k = (o.t + .25) / .3; emo98(e, o.a, y - 9 + k * 3, 15 * (1 - k * .9), 0, 1 - k); }
      if (o.t > -.25 && o.t < .8) for (let q = 0; q < 14; q++) { const k = clamp((o.t + .25) / 1.05), an = q * .9, r = eOut(k) * (8 + q % 4 * 5), x = o.a + Math.cos(an) * r * 1.4 + k * 6, yy = y - 4 + Math.sin(an) * Math.min(5, r * .4) + k * 3; mote108(x, yy, hc, 1 - k * k); } } },
  F: { name: 'Herb rides the current', desc: 'No mortar: the herb drops in at the start of the bar and the potion carries it along the surface to the front, the herb shrinking and leaving a fading trail of its color as it dissolves; it vanishes just as it reaches the front.',
    over(o, I, y, hc, e) { const sx = I.x0 + 6; if (o.t < -.85) { fall104(o, e, sx, y - 40, y - 10, 15); return; } if (o.t < 0) { const k = clamp((o.t + .85) / .85), x = lerp(sx, o.a, k * k * (3 - 2 * k)), b = Math.sin((o.t + .85) * 10) * 1;
        const g = ctx.createLinearGradient(sx, 0, x, 0); g.addColorStop(0, hexA(hc, 0)); g.addColorStop(1, hexA(hc, .7)); ctx.fillStyle = g; ctx.fillRect(sx, y - 6, Math.max(0, x - sx), 2); emo98(e, x, y - 10 + b + k * 2, 15 * (1 - k * .65), Math.sin((o.t + .85) * 6) * .25, 1 - k * .4); }
      if (o.t >= 0) once('al108f' + o.i, () => { for (let q = 0; q < 6; q++) spawn({ x: o.a, y: y - 5, vx: (Math.random() - .3) * 40, vy: -20 - Math.random() * 20, g: 100, life: .4, size: 1.2, col: hc }); }); } },
};
function r108(K) { const Z = EN108[K];
  const V = { grow(p, x0, y, L, f, t, I) { fill107(BAR108, x0, y, I, t); },
    over(p, I) { const y = I.ly, Lh = act104(I, -1.1, 1.4), o = Lh && Lh.t < .6 ? Lh : null, [e, hc] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0];
      if (Z.mortar) { mortar108(I, o, e, hc, Z.tip && o ? .9 * (o.t < -.42 ? 0 : o.t < -.32 ? eOut((o.t + .42) / .1) : o.t < -.05 ? 1 : 1 - eOut(clamp((o.t + .05) / .25))) : 0); if (o && Z.pour) { const [mx, my] = MX105(I); pour105(o, mx, my, y, hc, o.a); } }
      hits101(I).forEach(o => { const [e, hc] = HERB98[(S.v0 + o.i) % 5], v = fat45(o.i), n = pick45(o.i, 4); Z.over(o, I, y, hc, e);
        if (o.t >= 0 && o.t < .55) { const k = Math.sin(Math.PI * o.t / .55), c = col107(BAR108, I); ctx.save(); ctx.globalAlpha *= .85 * k; ctx.shadowColor = c; ctx.shadowBlur = 14; const g = ctx.createLinearGradient(0, y - 6 - 3 * k, 0, y + 6 + 3 * k); g.addColorStop(0, lv103(c)); g.addColorStop(1, dk103(c)); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(I.x0 - 2, y - 6 - 3 * k, I.tipX - I.x0 + 2, 12 + 6 * k, 4); ctx.fill(); ctx.restore(); }
        if (o.t >= 0) once('al108z' + o.i, () => { for (let q = 0; q < 8; q++) spawn({ x: o.b, y: y - 4 + Math.random() * 8, vx: 20 + Math.random() * 40, vy: (Math.random() - .5) * 40 - 20, g: 120, life: .4, size: 1, col: q % 2 ? '#ffffff' : '#ffe8a0' }); });
        if (o.t >= -.85 && o.t < 0) once('al108l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n)));
        if (Z.mortar && o.t >= -.85 && o.t < -.4) once('al108g' + o.i, () => noise(0, .45, .005 * v, 700, .9, 'bandpass'));
        if (o.t >= -.42 && o.t < 0) once('al108s' + o.i, () => noise(0, .4, .004 * v, Z.mortar ? 2400 : 1200, .7, 'lowpass'));
        if (o.t >= 0) once('al108f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); }); }); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (The bar, locked: living potion, swell and glow, fizzing front, slosh. Gap switch under the moments; placeholder sound.)'; }, get note() { return 'herb goes in: ' + Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r108('A'), PB: r108('B'), PC: r108('C'), PD: r108('D'), PE: r108('E'), PF: r108('F') });

// Moved out 2026-11-17 (round 110 prep, a fresh brainstorm): helpers and options of rounds 100-109 (crumb100, herb101, steps101, pot103, wheel103, the mortar helpers 105, puff106/scene106, fill107 family, round 109 CL109/r109, round 102 T102/wx102/al102/carved102).
// ---------- round 100 (2026-11-17): Alchemy base = 99 A (herb, ground, flash; the hue ladder). "Differing variations of grinding the herbs, like a wheeled herb grinder for one".
// The herb and the flash stay; only the grinding changes (t -.55..0, the flash at 0): A the ring (99 A), B Wheel grinder (a stone wheel on an axle rolls back and forth over the herb
// on the bar's top edge, the bar is its trough), C Millstones (two flat stones above the front; the herb drops in the top, the top stone turns, powder spills from the gap),
// D Sieve (a shallow mesh tray; the herb is shaken on it and sifts through as a fine rain) ----------
const crumb100 = (x, y, hc, n = 3, sp = 20) => { for (let k = 0; k < n; k++) spawn({ x: x + (Math.random() - .5) * 6, y, vx: (Math.random() - .5) * sp, vy: 10 + Math.random() * 15, g: 260, life: .22, size: .9, shape: 'sq', vr: 8, col: k % 2 ? hc : '#ffffff' }); };
// ---------- round 101 (2026-11-17): Alchemy base = 99 A with 100 B's wheel grinder; "differing variations of wheel grinder", and "it's abrupt and hard to tell what's going on, especially
// with the herb". Readability for all four: skill-ups spaced 1.5 s here (a craft cast is longer than that in game), a bigger herb (18 px) that lands with a squash, flattens a step per pass into a
// green smear that sinks in, and only then the flash (98 C). A Edge roll (100 B, slower), B Own trough, C One rolling pass along the new stretch, D Edge-runner (circles a post) ----------
function herb101(o, e, hc, x, yb, crush, y, s = 18) { const t = o.t; if (t < -.85) { const u = (t + 1.05) / .2; emo98(e, x, lerp(y - 40, yb - 9, u * u), s, (1 - u) * 1.2); return; }
  const sq = t < -.75 ? Math.sin((t + .85) / .1 * Math.PI) * .25 : 0, sink = clamp((t + .1) / .1), al = 1 - sink;
  if (al <= 0) return; const sy = Math.max(.15, 1 - crush * .85) - sq, sx = 1 + crush * .6 + sq;
  ctx.save(); ctx.globalAlpha *= al; if (crush > .05) { ctx.fillStyle = hexA(hc, .85 * crush); ctx.beginPath(); ctx.ellipse(x, yb - 1, 6 + crush * 7, 1.6, 0, 0, 7); ctx.fill(); }
  ctx.translate(x, yb + sink * 3); ctx.scale(sx, sy); emo98(e, 0, -s / 2, s, 0, 1 - crush * .7); ctx.restore(); }
// crush steps: each time the wheel passes over (times in t), eased
const steps101 = (t, at) => at.reduce((s, a) => s + eOut(clamp((t - a) / .08)) / at.length, 0);
// ---------- round 103 (2026-11-17): Alchemy, the herb + wheel grinder direction as five whole scenes (bar, herb, wheel, payoff all different), picked from a brainstorm first:
// A Apothecary trough, B Glass and juice, C Herbs in a row, D Juice press stream, E Big herb on stage. Same unhurried timing as 101 (skill-ups 1.5 s apart, three passes at T102) ----------
// the potion in the ladder colors, flashing to the next color outward from the front (98 C)
function pot103(x0, y, I, al = 1) { const A = hits101(I).filter(o => o.t >= 0 && o.t < 1).pop();
  if (!A) { const c = hue103(Math.floor(I.v + 1e-6) - I.lo); liq98(x0 - 2, I.tipX, y, lv103(c), dk103(c), al); return; }
  const n0 = S.v0 + A.i - I.lo, c0 = hue103(n0), c1 = hue103(n0 + 1), d = 420 * A.t; liq98(x0 - 2, I.tipX, y, lv103(c0), dk103(c0), al);
  ctx.save(); ctx.beginPath(); ctx.rect(A.a - d, y - 6, 2 * d, 12); ctx.clip(); liq98(x0 - 2, I.tipX, y, lv103(c1), dk103(c1), al); ctx.fillStyle = `rgba(255,255,255,${.75 * (1 - clamp(A.t / .35))})`; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12); ctx.restore(); }
const wheel103 = (o, x, yb, r = 8.5, amp = 14) => { const wx = wx102(Object.assign({}, o, { a: x }), amp); carved102(wx, yb - r, r, (wx - x) / r, al102(o)); return wx; };
// ---------- round 105 (2026-11-17): Alchemy base = 104 C Mortar pour ("pretty good, just needs the little grinder handle thing"): A = it with a real pestle in the bowl. Variations the user
// picked from a brainstorm, each changing the bar, the grinding and how it goes in: B Pounding pestle (powder bar with a heap at the front), C Bar is the mortar (a stone trough bar, the
// pestle grinds inside it), D Powder dissolves (floats, sinks, blooms in the potion), E Puff of powder (the pestle taps the rim; a cloud drifts over and settles; a glittering powder bar).
// The user expects to keep A and add on to it next. Gap switch moved inside the panel ----------
const MX105 = I => [I.x0 + 12, I.ly - 13];
function pestle105(hx, hy, ang, al = 1) { const L = 17, tx = hx + Math.cos(ang) * L, ty = hy + Math.sin(ang) * L; ctx.save(); ctx.globalAlpha *= al; ctx.lineCap = 'round';
  ctx.strokeStyle = '#6e665e'; ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke(); ctx.strokeStyle = '#d4ccc2'; ctx.lineWidth = 2.6; ctx.stroke();
  const g = ctx.createRadialGradient(hx - 1, hy - 1, .5, hx, hy, 3.6); g.addColorStop(0, '#f0e8de'); g.addColorStop(1, '#8a827a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, 3.6, 0, 7); ctx.fill();
  ctx.fillStyle = '#b8b0a6'; ctx.beginPath(); ctx.arc(tx, ty, 2, 0, 7); ctx.fill(); ctx.restore(); }
const bowlBack105 = (mx, my) => { ctx.fillStyle = '#2e2824'; ctx.beginPath(); ctx.ellipse(mx, my, 11, 2.4, 0, 0, 7); ctx.fill(); };
const bowlFront105 = (mx, my) => { const g = ctx.createLinearGradient(0, my, 0, my + 8); g.addColorStop(0, '#c4bcb2'); g.addColorStop(1, '#5e5852'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(mx, my, 11, 7, 0, 0, Math.PI); ctx.fill();
  ctx.strokeStyle = '#e4dcd2'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(mx, my, 11, 2.4, 0, 0, Math.PI); ctx.stroke(); ctx.fillStyle = '#d8d0c6'; ctx.beginPath(); ctx.moveTo(mx + 10, my - 1); ctx.lineTo(mx + 15, my - .5); ctx.lineTo(mx + 10, my + 1.5); ctx.fill(); };
// the stream of powder from the spout, down to the bar top, along it to the front (t -.42..0)
function pour105(o, mx, my, y, hc, xEnd) { if (o.t <= -.42 || o.t >= .05) return; const px = mx + 15, L1 = y - 6.5 - my, L2 = Math.max(1, xEnd - px - 4);
  for (let q = 0; q < 16; q++) { const s = (o.t + .42) / .42 * 1.5 - q * .06; if (s < 0 || s > 1) continue; const d = s * (L1 + L2), x = d < L1 ? px + d * .3 : px + L1 * .3 + (d - L1), yy = d < L1 ? my + d : y - 6.5; ctx.fillStyle = q % 3 ? hc : '#ffffff'; ctx.fillRect(Math.min(x, xEnd), yy - .6, 1.3, 1.3); } }
// the herb in the bowl: falls in, shrinks while ground (-.85..-.4)
function bowlHerb105(o, e, mx, my) { if (o.t < -.85) { fall104(o, e, mx, my - 33, my - 6, 13); return; } if (o.t < -.4) { const k = clamp((o.t + .85) / .45); emo98(e, mx, my - 3, 13 * (1 - k * .8), k * 5, 1 - k * .5); } }
// the pestle's grinding circle (-.85..-.4); resting, leaning on the rim, otherwise
const grind105 = (o, mx, my) => { if (o && o.t > -.85 && o.t < -.4) { const ph = (o.t + .85) * 24; return [mx + Math.cos(ph) * 6, my + 1 + Math.sin(ph) * 1.4, -1.1 + Math.sin(ph) * .22]; } return [mx + 3, my + .5, -1.15]; };
// ---------- round 106 (2026-11-17): Alchemy base LOCKED as 105 A (Mortar pour + pestle). Add-ons the user picked: a puff with sparkles rising from the bowl when the grinding is done
// (on all), and how the powder goes in: B Drop + bubbles (flies over, drops straight down, the potion bubbles), C Mix sweeps right (streaks carry it to the new front),
// D Fizz + color ring (sparks jump, a ring of the herb's color spreads), E Sinks and fans out (a falling column inside the potion fans out along the bottom) ----------
function puff106(o, mx, my) { if (!o || o.t < -.42 || o.t > .25) return; const u = (o.t + .42) / .67;
  for (let q = 0; q < 6; q++) { const a = (q - 2.5) * .45, r = 2.5 + u * 5 + q % 2, x = mx + Math.sin(a) * (3 + u * 9), yy = my - 3 - u * (14 + q % 3 * 4); ctx.fillStyle = `rgba(236,228,214,${.4 * (1 - u)})`; ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill(); }
  once('al106p' + o.i, () => { for (let q = 0; q < 6; q++) spawn({ x: mx + (Math.random() - .5) * 12, y: my - 4, vx: (Math.random() - .5) * 24, vy: -30 - Math.random() * 30, g: 15, life: .75, size: 2 + Math.random() * 1.5, shape: 'star', col: q % 2 ? '#fff4c0' : '#ffffff' }); tone(1046 * semi(pick45(o.i, 3)), .02, .004 * fat45(o.i), .3, 'sine'); }); }
// the base scene; pour = false leaves the powder in the bowl for an add-on to move
function scene106(I, o, e, hc, pour = true) { const [mx, my] = MX105(I), y = I.ly; bowlBack105(mx, my); if (o) bowlHerb105(o, e, mx, my); const [hx, hy, an] = grind105(o, mx, my); pestle105(hx, hy, an); bowlFront105(mx, my); puff106(o, mx, my); if (o && pour) pour105(o, mx, my, y, hc, o.a); }
const lastHit107 = I => act104(I, -.1, 1.4);
function tip107(cfg, I) { if (cfg.mo !== 'surge') return I.tipX; const o = lastHit107(I); if (!o || o.t < 0) return I.tipX; const u = clamp(o.t / .7), base = S.v0 + o.i; return I.X(base + Math.min(1, eOut(u * 1.6)) + .45 * Math.sin(Math.PI * u) * (1 - u)); }
const mixHex107 = (a, b, k) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], k)).toString(16).padStart(2, '0')).join('');
function col107(cfg, I) { const f = clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo)), c = hue104(I, Math.floor(I.v + 1e-6)); return cfg.look === 'clear' ? mixHex107(c, '#241e2c', (1 - f) * .78) : c; }
function fill107(cfg, x0, y, I, t) { const tip = tip107(cfg, I); if (tip <= x0) return; const c = col107(cfg, I), f = clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo)), top = cfg.look === 'vial' ? y - 3.5 : y - 6;
  if (cfg.look === 'vial') { ctx.fillStyle = 'rgba(200,220,255,.10)'; ctx.fillRect(x0 - 2, y - 6, I.x1 - x0 + 4, 12); }
  const o = lastHit107(I), sl = (cfg.mo === 'slosh' || cfg.slosh) && o && o.t < 1.2 ? .14 * Math.sin(o.t * 13) * Math.exp(-o.t * 3.5) : 0, cx = (x0 + tip) / 2, sy = x => top + (x - cx) * sl;
  const g = ctx.createLinearGradient(0, top, 0, y + 6); g.addColorStop(0, lv103(c)); g.addColorStop(1, dk103(c)); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x0 - 2, sy(x0 - 2)); ctx.lineTo(tip, sy(tip)); ctx.lineTo(tip, y + 7); ctx.lineTo(x0 - 2, y + 7); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 - 2, sy(x0 - 2) + .5); ctx.lineTo(tip, sy(tip) + .5); ctx.stroke();
  if (o && o.t >= 0 && o.t < .35) { ctx.fillStyle = `rgba(255,255,255,${.45 * (1 - o.t / .35)})`; ctx.fillRect(x0 - 2, y - 6, tip - x0 + 2, 12); }
  if (cfg.look === 'clear') { ctx.fillStyle = `rgba(20,16,12,${.55 * (1 - f)})`; for (let x = x0; x < tip; x += 3) if (rnd53(x * 1.1) > .55) ctx.fillRect(x, y - 4 + rnd53(x * 2.2) * 8, 1.2, 1.2); }
  if (cfg.look === 'living') { let off = t * 10; S.hits.forEach(h => { off += 30 * eOut(clamp((S.age - h - HIT) / .8)); }); for (let k = 0; k < 18; k++) { const w = Math.max(1, tip - x0), x = x0 + ((k * 37.3 + off * (.6 + (k % 3) * .25)) % w), yy = y + Math.sin(k * 1.7 + t * (1 + k % 2)) * 3.5;
      ctx.fillStyle = `rgba(255,255,255,${.35 + .4 * (k % 2)})`; ctx.fillRect(x, yy, 1.2, 1.2); } }
  if (cfg.look === 'vial') { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x0, y - 5.5, I.x1 - x0, 1); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0, y + 4, I.x1 - x0, 1); const gx = x0 + ((t * 35) % (I.x1 - x0 + 60)) - 30; ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(gx, y - 3, 9, 1.4); }
  if (cfg.mo === 'fizz' || cfg.fizz) { ctx.fillStyle = mix(c, '#ffffff', .6); ctx.fillRect(tip - 1.5, y - 6, 1.5, 12); for (let q = 0; q < 6; q++) { const u = ((t * 1.6 + q / 6) % 1); ctx.fillStyle = `rgba(255,255,255,${.8 * (1 - u)})`; ctx.fillRect(tip - 3 - (q % 2) * 2, y + 5 - u * 11, 1, 1); } }
  return tip; }
// ---------- round 109 (2026-11-17): clean restart ("over-zealous with the additions; start clean, a few options that read clean, satisfying, room to improve"; and not old ideas trimmed).
// One bar, one action, one payoff each: A Grind and pour (the one kept: mortar + pestle, one pour, the living potion swells), and three new: B Toward the recipe's color,
// C Pulse charge, D Essence drawn from the herb ----------
const LIV109 = { look: 'living' };
const one109 = (I, a = -1.1, b = .6) => { const L = act104(I, -1.1, 1.4); return L && L.t > a && L.t < b ? L : null; };
function swell109(I, y, c, o) { if (!o || o.t < 0 || o.t > .55) return; const k = Math.sin(Math.PI * o.t / .55); ctx.save(); ctx.globalAlpha *= .8 * k; ctx.shadowColor = c; ctx.shadowBlur = 12; const g = ctx.createLinearGradient(0, y - 8, 0, y + 8); g.addColorStop(0, lv103(c)); g.addColorStop(1, dk103(c)); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(I.x0 - 2, y - 6 - 2.5 * k, I.tipX - I.x0 + 2, 12 + 5 * k, 4); ctx.fill(); ctx.restore(); }
const TGT109 = '#e8504a', BASE109 = '#5a5870';
const CL109 = {
  A: { name: 'Grind and pour', desc: 'The living potion bar (slow motes drifting in it). The herb drops into a mortar at the start of the bar, the pestle grinds it, and one clean stream of powder pours along the bar into the front; the potion swells and glows one step forward. Nothing else.',
    grow(x0, y, I, t) { fill107(LIV109, x0, y, I, t); },
    over(I, y, o, e, hc) { const [mx, my] = MX105(I); bowlBack105(mx, my); if (o) bowlHerb105(o, e, mx, my); const [hx, hy, an] = grind105(o, mx, my); pestle105(hx, hy, an); bowlFront105(mx, my); if (o) pour105(o, mx, my, y, hc, o.a); swell109(I, y, col107(LIV109, I), o); },
    snd(o, v, n) { if (o.t >= -.85 && o.t < -.4) once('c9g' + o.i, () => noise(0, .45, .005 * v, 700, .9, 'bandpass')); if (o.t >= -.42 && o.t < 0) once('c9p' + o.i, () => noise(0, .4, .004 * v, 2400, .7, 'lowpass')); } },
  B: { name: 'Toward the recipe’s color', desc: 'New: the recipe has a color (a ring of it around the recipe icon: Strong Troll’s Blood is red). The potion starts dull grey-violet; each skill-up one drop of the herb lands at the front with a small ring, and the potion shifts one step closer to the recipe’s color, the new color washing back from the front. When the bar fills, the color matches and the icon lights.',
    col(I, j) { return mixHex107(BASE109, TGT109, clamp((j - I.lo) / Math.max(1, S.nx.lv - I.lo))); },
    grow(x0, y, I, t) { const o = one109(I, -.05, .7), j = Math.floor(I.v + 1e-6); if (!o) { const c = this.col(I, j); liq98(x0 - 2, I.tipX, y, lv103(c), dk103(c)); return; }
      const c0 = this.col(I, S.v0 + o.i), c1 = this.col(I, S.v0 + o.i + 1), xs = lerp(I.tipX, x0 - 2, eOut(clamp(o.t / .6))); liq98(x0 - 2, I.tipX, y, lv103(c0), dk103(c0)); ctx.save(); ctx.beginPath(); ctx.rect(xs, y - 6, I.tipX - xs + 1, 12); ctx.clip(); liq98(x0 - 2, I.tipX, y, lv103(c1), dk103(c1)); ctx.restore(); },
    over(I, y, o, e, hc) { const ux = I.x1 + 18; ctx.strokeStyle = hexA(TGT109, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ux, y, 13, 0, 7); ctx.stroke();
      if (!o) return; if (o.t < 0 && o.t > -.4) { const u = (o.t + .4) / .4; ctx.fillStyle = hc; ctx.beginPath(); const yy = lerp(y - 30, y - 7, u * u); ctx.moveTo(o.a, yy - 4); ctx.quadraticCurveTo(o.a + 3, yy, o.a, yy + 2.5); ctx.quadraticCurveTo(o.a - 3, yy, o.a, yy - 4); ctx.fill(); }
      if (o.t >= 0) once('c9b' + o.i, () => spawn({ x: o.a, y: y - 6, size: 2, shape: 'ring', grow: 10, life: .4, col: '#ffffff' })); },
    snd(o, v, n) { if (o.t >= -.05) once('c9d' + o.i, () => tone(700 * semi(n), 0, .012 * v, .1, 'sine', 420 * semi(n))); } },
  C: { name: 'Pulse charge', desc: 'New, no tools: the potion’s front breathes with a soft glow. Each skill-up a bright pulse of light runs from the start of the bar to the front in a blink, and where it arrives the front steps forward with a flash and a soft ring; the pulse leaves the potion a touch brighter.',
    grow(x0, y, I, t) { const c = hue104(I, Math.floor(I.v + 1e-6)); liq98(x0 - 2, I.tipX, y, lv103(c), dk103(c)); const br = .25 + .15 * Math.sin(t * 3), g = ctx.createLinearGradient(I.tipX - 16, 0, I.tipX, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,255,255,${br})`); ctx.fillStyle = g; ctx.fillRect(I.tipX - 16, y - 6, 16, 12);
      const o = one109(I, -.4, .2); if (o && o.t < 0) { const x = lerp(x0, o.a, eOut(clamp((o.t + .35) / .35))), pg = ctx.createLinearGradient(x - 26, 0, x + 4, 0); pg.addColorStop(0, 'rgba(255,255,255,0)'); pg.addColorStop(.85, 'rgba(255,255,255,.9)'); pg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = pg; ctx.fillRect(x - 26, y - 6, 30, 12); } },
    over(I, y, o) { if (o && o.t >= 0) once('c9c' + o.i, () => { spawn({ x: o.a, y, size: 3, shape: 'ring', grow: 12, life: .4, col: '#ffffff' }); spawn({ x: o.a, y, size: 4, shape: 'star', life: .3, col: '#ffffff' }); }); swell109(I, y, hue104(I, Math.floor(I.v + 1e-6)), o); },
    snd(o, v, n) { if (o.t >= -.35) once('c9u' + o.i, () => tone(330 * semi(n), 0, .008 * v, .4, 'sine', 660 * semi(n), .2)); } },
  D: { name: 'Essence drawn from the herb', desc: 'New: a herb sits above the start of the bar, glowing gently. Each skill-up a straight thread of light is drawn from the herb down to the front of the potion and a bead of its essence slides along it into the potion; the front steps forward and the herb grows a little paler, spent as the bar fills toward the recipe.',
    grow(x0, y, I, t) { fill107(LIV109, x0, y, I, t); },
    over(I, y, o, e, hc) { const hx = I.x0 + 8, hy = y - 22, used = clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo)), [he, hcol] = HERB98[S.v0 % 5];
      const rg = ctx.createRadialGradient(hx, hy, 1, hx, hy, 14); rg.addColorStop(0, hexA(hcol, .45 * (1 - used * .7))); rg.addColorStop(1, hexA(hcol, 0)); ctx.fillStyle = rg; ctx.fillRect(hx - 14, hy - 14, 28, 28);
      const pul = o && o.t > -.5 && o.t < 0 ? Math.sin(Math.PI * (o.t + .5) / .5) * .12 : 0; emo98(he, hx, hy, 18 * (1 + pul), 0, 1 - used * .55);
      if (o && o.t > -.5 && o.t < .2) { const ext = clamp((o.t + .5) / .2), fade = o.t > 0 ? 1 - o.t / .2 : 1, ex = lerp(hx + 6, o.a, ext), ey = lerp(hy + 6, y - 6, ext); ctx.strokeStyle = hexA(hcol, .8 * fade); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(hx + 6, hy + 6); ctx.lineTo(ex, ey); ctx.stroke();
        if (o.t > -.3 && o.t < 0) { const u = (o.t + .3) / .3; bead104(lerp(hx + 6, o.a, u * u), lerp(hy + 6, y - 6, u * u), hcol); } }
      if (o && o.t >= 0) once('c9e' + o.i, () => spawn({ x: o.a, y: y - 5, size: 2, shape: 'ring', grow: 8, life: .35, col: hcol })); swell109(I, y, col107(LIV109, I), o); },
    snd(o, v, n) { if (o.t >= -.5) once('c9h' + o.i, () => tone(523 * semi(n), 0, .007 * v, .5, 'sine', null, .15)); } },
};
function r109(K) { const Z = CL109[K];
  const V = { grow(p, x0, y, L, f, t, I) { Z.grow(x0, y, I, t); },
    over(p, I) { const y = I.ly, o = one109(I), [e, hc] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0]; Z.over(I, y, o, e, hc);
      hits101(I).forEach(o => { const v = fat45(o.i), n = pick45(o.i, 4); if (K === 'A' && o.t >= -.85 && o.t < 0) once('c9l' + o.i, () => tone(330 * semi(n), 0, .01 * v, .12, 'sine', 220 * semi(n))); Z.snd(o, v, n);
        if (o.t >= 0) once('c9f' + o.i, () => { tone(262 * semi(n), 0, .01 * v, .8, 'sine', null, .08); tone(392 * semi(n), 0, .007 * v, .8, 'sine', null, .08); }); }); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Gap switch under the moments; placeholder sound.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r109('A'), PB: r109('B'), PC: r109('C'), PD: r109('D') }); delete FAM.PE; delete FAM.PF;
// bubbles sitting on the surface where the powder enters (t -.1..0.7): they swell, then pop
// ---------- round 102 (2026-11-17): Alchemy base LOCKED as 101 A Edge roll (herb lands, a wheel rolls three passes over it on the bar's top edge, smear sinks in, flash). "Work on the
// animations/visuals, I'd like to see it look better". Same timing, three looks: B Carved stone (a lit, chiselled wheel on a turned axle, motion ghosts, juice flecks), C Ring and glint
// (no drawn object: a bright rim ring with a rolling glint, leaf bits and an impact ring per pass), D Heavy wheel (bigger and weighty: the bar jolts on each pass, dust at each turn) ----------
const T102 = [0, 1, 2].map(k => -.62 + (k * 2 + 1) / 6 * .5);
const wx102 = (o, amp = 14) => { if (o.t < -.62) return o.a + amp + 20 * clamp((-.62 - o.t) / .14); if (o.t > -.12) return o.a - amp - 24 * clamp((o.t + .12) / .14); return o.a + amp * Math.cos(clamp((o.t + .62) / .5) * 3 * Math.PI); };
const al102 = o => clamp((o.t + .78) / .1) * clamp((.04 - o.t) / .1);
function carved102(x, y, r, ang, al, ax = 15) { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al;
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(x + 1.5, y + r + .8, r * .95, 1.8, 0, 0, 7); ctx.fill();
  const wg = ctx.createLinearGradient(0, y - 2, 0, y + 2); wg.addColorStop(0, '#c8955a'); wg.addColorStop(1, '#6a4020'); ctx.strokeStyle = wg; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - ax, y); ctx.lineTo(x + ax, y); ctx.stroke();
  [-1, 1].forEach(s => { ctx.fillStyle = '#8a5a30'; ctx.beginPath(); ctx.arc(x + s * ax, y, 2.4, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,220,170,.5)'; ctx.beginPath(); ctx.arc(x + s * ax - .6, y - .7, .9, 0, 7); ctx.fill(); });
  ctx.fillStyle = '#4e4842'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  const g = ctx.createRadialGradient(x - r * .35, y - r * .4, 1, x, y, r - 1.5); g.addColorStop(0, '#f0e8de'); g.addColorStop(.6, '#a89e94'); g.addColorStop(1, '#7a7068'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r - 1.5, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r - .5, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
  ctx.strokeStyle = 'rgba(50,42,36,.55)'; for (let q = 0; q < 8; q++) { const a = ang + q * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r - 4.5), y + Math.sin(a) * (r - 4.5)); ctx.lineTo(x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2)); ctx.stroke(); }
  ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill(); ctx.fillStyle = '#3a2410'; ctx.beginPath(); ctx.arc(x, y, 1, 0, 7); ctx.fill(); ctx.restore(); }

// Round 110 (eight story bars: ST110, blob110, r110; the user: only the Bottle shelf was unique, the bar itself never changed), moved out 2026-11-17.
// ---------- round 110 (2026-11-17): a fresh brainstorm ("branch out like Mining's blasts + peon, Leatherworking's pulled tarp, Fishing's reel + big fish, the cooking pan flip;
// unique, fun, clean, super satisfying, no echo of the craft ring, calm for 100+ crafts"). The eight picked, each its own little story on the bar, one calm beat per point
// (finales come later): A Bottle shelf, B Slime pet, C Stretching ooze, D Bouncing droplet, E Red goo stone (the philosopher's stone take), F Homunculus, G Happy accident,
// H Balance scale ----------
const mixHex110 = (a, b, k) => '#' + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], k)).toString(16).padStart(2, '0')).join('');
const cur110 = I => hits101(I).filter(o => o.t > -.7 && o.t < 1.2).pop();
const fr110 = I => clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo));
const blob110 = (x, y, rx, ry, c, eyes = 0, look = 0) => { const g = ctx.createRadialGradient(x - rx * .3, y - ry * .4, .5, x, y, Math.max(rx, ry)); g.addColorStop(0, mix(c, '#ffffff', .55)); g.addColorStop(.6, c); g.addColorStop(1, mix(c, '#000000', .35)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(x - rx * .35, y - ry * .45, rx * .22, ry * .15, -.4, 0, 7); ctx.fill();
  if (eyes) { [-1, 1].forEach(s => { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + s * rx * .32 + look, y - ry * .1, eyes, 0, 7); ctx.fill(); ctx.fillStyle = '#1a1020'; ctx.beginPath(); ctx.arc(x + s * rx * .32 + look * 1.3, y - ry * .1, eyes * .5, 0, 7); ctx.fill(); }); } };
const GO110 = '#d8344a';
const ST110 = {
  A: { name: 'Bottle shelf', desc: 'The bar is a wooden shelf. Each skill-up a small potion bottle in its own color drops onto the shelf at the front, squashes on landing and clinks against its neighbor; the row of bottles is your progress toward the recipe (thin vials when the gap is long).',
    grow(x0, y, I, t) { ctx.fillStyle = 'rgba(70,44,22,.55)'; ctx.fillRect(x0 - 2, y + 2, I.x1 - x0 + 4, 4); },
    over(I, y, t) { const g = ctx.createLinearGradient(0, y + 3, 0, y + 7); g.addColorStop(0, '#b8865a'); g.addColorStop(1, '#5a3a1e'); ctx.fillStyle = g; ctx.fillRect(I.x0 - 4, y + 3, I.x1 - I.x0 + 8, 3.5);
      const n = S.nx.lv - I.lo, slot = (I.x1 - I.x0) / n, w = Math.min(9, slot * .78), o = cur110(I), lvl = Math.floor(I.v + 1e-6);
      const topJ = S.v0 + S.hits.filter(h => S.age - h - HIT >= -.45).length; for (let j = I.lo; j < topJ && j < S.nx.lv; j++) { const cx = I.X(j + .5), last = o && j === S.v0 + o.i; let dy = 0, sq = 0; if (last && o.t < 0) dy = -26 * (1 - Math.pow(clamp((o.t + .45) / .45), 2)); if (last && o.t >= 0 && o.t < .25) sq = Math.sin(Math.PI * o.t / .25) * .25;
        const h = 13, c = HUE98[(j * 2 + 1) % 6], bx = cx - w / 2, by = y + 3 - h + dy; ctx.save(); ctx.translate(cx, y + 3 + dy); ctx.scale(1 + sq, 1 - sq); ctx.translate(-cx, -(y + 3 + dy));
        ctx.fillStyle = 'rgba(210,225,255,.25)'; ctx.beginPath(); ctx.roundRect(bx, by + 4, w, h - 4, Math.min(3, w / 2)); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(bx + .5, by + 6, w - 1, h - 6.5, Math.min(2.5, w / 2)); ctx.fill();
        ctx.fillStyle = 'rgba(210,225,255,.45)'; ctx.fillRect(cx - w * .18, by + 1, w * .36, 3.5); ctx.fillStyle = '#8a5a30'; ctx.fillRect(cx - w * .22, by, w * .44, 1.5); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(bx + 1, by + 6, 1, h - 8); ctx.restore(); }
      if (o && o.t >= 0) once('s0a' + o.i, () => spawn({ x: I.X(S.v0 + o.i + .5) - w / 2, y: y - 4, size: 2.5, shape: 'star', life: .25, col: '#ffffff' })); },
    snd(o, v, n) { if (o.t >= 0) once('s0as' + o.i, () => { tone(1568 * semi(n), 0, .006 * v, .25, 'sine'); tone(2349 * semi(n), .01, .003 * v, .18, 'sine'); }); } },
  B: { name: 'Slime pet', desc: 'A little green slime with two dot eyes lives at the front of the bar. Each skill-up a herb drops in front of it; it leans in, gulps the herb, wobbles, and scoots forward to the new front leaving a glossy slime trail (the fill). It grows a little as the bar fills.',
    grow(x0, y, I, t) { liq98(x0 - 2, I.tipX - 4, y, '#a8f070', '#3a8a2a'); },
    over(I, y, t) { const o = cur110(I), f = fr110(I), s = 1 + f * .4, [e] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0]; let x = I.tipX, lean = 0, wob = Math.sin(t * 2) * .04;
      if (o && o.t < -.3) { const u = clamp((o.t + .7) / .3); emo98(e, o.a + 14, lerp(y - 34, y - 12, u * u), 11); }
      if (o && o.t >= -.3 && o.t < 0) { const u = (o.t + .3) / .3; lean = Math.sin(Math.PI * u) * 4; emo98(e, o.a + 14 - u * 8, y - 12 + u * 2, 11 * (1 - u), 0, 1 - u); if (u > .6) wob = .15 * Math.sin(u * 30); }
      if (o && o.t >= 0 && o.t < .6) wob = .12 * Math.sin(o.t * 25) * (1 - o.t / .6);
      blob110(x + lean, y - 8 * s, 8 * s * (1 + wob), 6.5 * s * (1 - wob), '#6ad84a', 1.6 * s, lean > 1 ? 1 : 0); },
    snd(o, v, n) { if (o.t >= -.12) once('s0bs' + o.i, () => { tone(180 * semi(n), 0, .012 * v, .12, 'sine', 120 * semi(n)); tone(520 * semi(n), .05, .005 * v, .1, 'sine', 900 * semi(n)); }); } },
  C: { name: 'Stretching ooze', desc: 'The potion is a living violet goo with a rounded front. Each skill-up the front stretches out a thin reaching arm to the new point, its tip sticks there with a little splat, then the whole body slides up to it and jiggles as it settles.',
    grow(x0, y, I, t) { const o = cur110(I); let tip = I.tipX, jig = o && o.t > 0 && o.t < .8 ? Math.sin(o.t * 22) * 1.6 * (1 - o.t / .8) : 0; liq98(x0 - 2, tip - 5, y, '#c890ff', '#5a2aa0'); },
    over(I, y, t) { const o = cur110(I); const tip = I.tipX, jig = o && o.t > 0 && o.t < .8 ? Math.sin(o.t * 22) * (1 - o.t / .8) : 0, g = ctx.createLinearGradient(0, y - 6, 0, y + 6); g.addColorStop(0, '#c890ff'); g.addColorStop(1, '#5a2aa0');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(tip - 5, y, 6 + jig * 1.5, 6 - jig * .8, 0, -Math.PI / 2, Math.PI / 2); ctx.fill();
      if (o && o.t > -.4 && o.t < .45) { const ext = o.t < -.1 ? eOut((o.t + .4) / .3) : 1, ret = o.t > 0 ? clamp(o.t / .45) : 0, x1 = lerp(o.a, o.b, ext), x0a = lerp(o.a, o.b, eOut(ret)); if (x1 > x0a + 1) { ctx.fillStyle = '#a870f0'; ctx.beginPath(); ctx.roundRect(x0a, y - 1.6, x1 - x0a, 3.2, 1.6); ctx.fill(); ctx.beginPath(); ctx.arc(x1, y, 2.6, 0, 7); ctx.fill(); } }
      if (o && o.t >= -.1) once('s0c' + o.i, () => spawn({ x: o.b, y, size: 1.5, shape: 'ring', grow: 6, life: .25, col: '#e8d0ff' })); },
    snd(o, v, n) { if (o.t >= -.1) once('s0cs' + o.i, () => tone(392 * semi(n), 0, .008 * v, .15, 'sine', 600 * semi(n))); if (o.t >= .1) once('s0ct' + o.i, () => tone(196 * semi(n), 0, .008 * v, .25, 'sine')); } },
  D: { name: 'Bouncing droplet', desc: 'One glossy drop of potion sits on top of the bar at the front. Each skill-up it squats, then hops in a little arc to the new front, squashes as it lands with a tiny splash, and its color fills the stretch it jumped over.',
    grow(x0, y, I, t) { liq98(x0 - 2, I.tipX, y, '#a0c8ff', '#2a5ab0'); },
    over(I, y, t) { const o = cur110(I); let x = I.tipX, yy = y - 10, sx = 1, sy = 1;
      if (o && o.t > -.15 && o.t < 0) { const k = Math.sin(Math.PI * (o.t + .15) / .15); sx = 1 + .25 * k; sy = 1 - .25 * k; }
      if (o && o.t >= 0 && o.t < .45) { const u = o.t / .45; x = lerp(o.a, o.b, u); yy = y - 10 - Math.sin(Math.PI * u) * 14; sx = .9; sy = 1.12; }
      if (o && o.t >= .45 && o.t < .65) { const k = Math.sin(Math.PI * (o.t - .45) / .2); sx = 1 + .35 * k; sy = 1 - .3 * k; }
      if (o && o.t >= .45) once('s0d' + o.i, () => { spawn({ x: o.b, y: y - 6, size: 2, shape: 'ring', grow: 7, life: .3, col: '#d0e8ff' }); for (let q = 0; q < 3; q++) spawn({ x: o.b, y: y - 6, vx: (q - 1) * 25, vy: -25, g: 300, life: .3, size: 1, col: '#d0e8ff' }); });
      ctx.save(); ctx.translate(x, yy + 4); ctx.scale(sx, sy); ctx.translate(-x, -(yy + 4)); blob110(x, yy, 4.2, 4.2, '#5a9aff'); ctx.restore(); },
    snd(o, v, n) { if (o.t >= 0) once('s0ds' + o.i, () => tone(520 * semi(n), 0, .006 * v, .1, 'sine', 780 * semi(n))); if (o.t >= .45) once('s0dt' + o.i, () => tone(440 * semi(n), 0, .009 * v, .14, 'sine', 300 * semi(n))); } },
  E: { name: 'Red goo stone', desc: 'The philosopher’s-stone take: the bar ahead is dull lead grey; behind the front it is glowing red goo. A small red stone sits at the front. Each skill-up the stone melts down into the bar, its goo flows forward to the new front, then pulls itself back up into a stone with a glint.',
    grow(x0, y, I, t) { liq98(x0 - 2, I.x1 + 2, y, '#7a7a84', '#3a3a42'); liq98(x0 - 2, I.tipX, y, '#ff5a6a', '#7a0a1a'); for (let k = 0; k < 8; k++) { const x = x0 + ((k * 41 + t * 7) % Math.max(1, I.tipX - x0)); ctx.fillStyle = `rgba(255,200,200,${.25 + .25 * Math.sin(t * 2 + k)})`; ctx.fillRect(x, y - 3 + (k * 3) % 6, 3, 1); } },
    over(I, y, t) { const o = cur110(I); let x = I.tipX, h = 1, w = 1;
      if (o && o.t > -.35 && o.t < 0) { const u = (o.t + .35) / .35; h = 1 - u * .8; w = 1 + u * .8; x = o.a; }
      else if (o && o.t >= 0 && o.t < .35) { h = .2; w = 1.8; } else if (o && o.t >= .35 && o.t < .65) { const u = (o.t - .35) / .3; h = .2 + .8 * eBack(u); w = 1.8 - .8 * eOut(u); }
      if (o && o.t >= .6) once('s0e' + o.i, () => spawn({ x: x - 2, y: y - 13, size: 3, shape: 'star', life: .35, col: '#ffe0e0' }));
      ctx.save(); ctx.shadowColor = '#ff3040'; ctx.shadowBlur = 8; ctx.fillStyle = GO110; ctx.beginPath(); ctx.ellipse(x - 1, y - 6 - 5 * h, 5 * w, 5 * h + .5, 0, 0, 7); ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,220,220,.75)'; ctx.beginPath(); ctx.ellipse(x - 2.5, y - 6 - 7 * h, 1.6 * w, 1.1 * h + .2, -.4, 0, 7); ctx.fill(); ctx.restore(); },
    snd(o, v, n) { if (o.t >= -.35) once('s0es' + o.i, () => tone(147 * semi(n), 0, .01 * v, .5, 'sine', 110 * semi(n), .1)); if (o.t >= .6) once('s0et' + o.i, () => tone(1175 * semi(n), 0, .004 * v, .3, 'sine')); } },
  F: { name: 'Homunculus', desc: 'A tiny red goo creature made from the stone walks along the bar. Each skill-up it hops forward to the new front, and as the bar fills it grows: a blob, then a head, then little arms, then legs; a sparkle each time it grows a part. The red goo it walks on is the fill.',
    grow(x0, y, I, t) { liq98(x0 - 2, I.tipX, y, '#ff6a7a', '#6a0a1a'); },
    over(I, y, t) { const o = cur110(I), f = fr110(I), st = Math.min(3, Math.floor(f * 4 + 1e-6)); let x = I.tipX - 3, hop = 0; if (o && o.t >= 0 && o.t < .45) hop = Math.sin(Math.PI * o.t / .45) * 7;
      const by = y - 13 - hop, bob = Math.sin(t * 4) * .5; ctx.save(); ctx.strokeStyle = GO110; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
      if (st >= 3) { ctx.beginPath(); ctx.moveTo(x - 2, by + 4); ctx.lineTo(x - 3, by + 7 + (hop ? -1 : 0)); ctx.moveTo(x + 2, by + 4); ctx.lineTo(x + 3, by + 7); ctx.stroke(); }
      if (st >= 2) { const a = hop ? -1.5 : Math.sin(t * 3) * .4; ctx.beginPath(); ctx.moveTo(x - 4, by); ctx.lineTo(x - 7, by - 2 + a * 2); ctx.moveTo(x + 4, by); ctx.lineTo(x + 7, by - 2 + a * 2); ctx.stroke(); }
      ctx.restore(); blob110(x, by + bob, 5, 5, GO110, st >= 1 ? 0 : 1, 1); if (st >= 1) blob110(x + .5, by - 6 + bob, 3.6, 3.4, '#e8445a', 1, 1);
      hits101(I).forEach(o => { const s0 = Math.min(3, Math.floor(clamp((S.v0 + o.i - I.lo) / Math.max(1, S.nx.lv - I.lo)) * 4 + 1e-6)), s1 = Math.min(3, Math.floor(clamp((S.v0 + o.i + 1 - I.lo) / Math.max(1, S.nx.lv - I.lo)) * 4 + 1e-6)); if (s1 > s0 && o.t >= .45) once('s0f' + o.i, () => { for (let q = 0; q < 5; q++) spawn({ x: o.b - 3, y: y - 16, vx: (Math.random() - .5) * 40, vy: -30 - Math.random() * 20, g: 60, life: .5, size: 2, shape: 'star', col: q % 2 ? '#ffd0d8' : '#ffffff' }); tone(1047, 0, .006, .3, 'sine'); }); }); },
    snd(o, v, n) { if (o.t >= 0) once('s0fs' + o.i, () => tone(600 * semi(n), 0, .006 * v, .08, 'sine', 900 * semi(n))); if (o.t >= .45) once('s0ft' + o.i, () => tone(300 * semi(n), 0, .007 * v, .1, 'sine')); } },
  G: { name: 'Happy accident', desc: 'A little alchemist humor: each skill-up a small harmless poof of colored smoke pops up from the front of the potion (a different soft color each time) and drifts away as the front steps forward. Gentle: one puff, no bang.',
    grow(x0, y, I, t) { const c = hue104(I, Math.floor(I.v + 1e-6)); liq98(x0 - 2, I.tipX, y, lv103(c), dk103(c)); },
    over(I, y, t) { hits101(I).forEach(o => { if (o.t < 0 || o.t > 1) return; const c = HUE98[(S.v0 + o.i * 2) % 6], u = o.t; for (let q = 0; q < 7; q++) { const a = q * .9, r = (3 + q % 3) * (.6 + u * 1.4), x = o.a + Math.cos(a) * (2 + u * 9) + u * 4, yy = y - 8 - u * 16 + Math.sin(a) * (2 + u * 4);
      ctx.fillStyle = hexA(c, .55 * (1 - u)); ctx.beginPath(); ctx.arc(x, yy, r, 0, 7); ctx.fill(); } if (o.t < .1) { ctx.fillStyle = `rgba(255,255,255,${1 - o.t / .1})`; ctx.beginPath(); ctx.arc(o.a, y - 7, 4, 0, 7); ctx.fill(); } }); },
    snd(o, v, n) { if (o.t >= 0) once('s0gs' + o.i, () => { noise(0, .25, .006 * v, 900, .6, 'lowpass'); tone(660 * semi(n), 0, .005 * v, .15, 'sine', 990 * semi(n)); }); } },
  H: { name: 'Balance scale', desc: 'The whole bar hangs like a balance beam on a little post: heavy on the left at the start of the gap, it tips toward level as you skill up. Each skill-up a small gold weight drops onto the right end with a clink and the beam rocks and settles a little closer to level; level means the recipe.',
    tilt: I => { const o = cur110(I), base = -.11 * (1 - fr110(I)); return base + (o && o.t >= 0 && o.t < .9 ? Math.sin(o.t * 14) * .025 * (1 - o.t / .9) : 0); },
    grow(x0, y, I, t) { liq98(x0 - 2, I.tipX, y, '#ffe08a', '#a8761a'); },
    over(I, y, t) { const o = cur110(I), n = Math.min(5, S.v0 - I.lo + S.hits.filter(h => S.age - h - HIT >= -.35).length); for (let k = 0; k < n; k++) { const last = o && k === n - 1 && o.t < 0, dy = last ? -24 * (1 - Math.pow(clamp((o.t + .35) / .35), 2)) : 0; ctx.fillStyle = '#e8b84a'; ctx.beginPath(); ctx.roundRect(I.x1 + 3 - 4, y - 10 - k * 3.4 + dy, 8, 3, 1); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(I.x1, y - 10 - k * 3.4 + dy, 3, .8); } },
    snd(o, v, n) { if (o.t >= 0) once('s0hs' + o.i, () => { tone(1319 * semi(n), 0, .005 * v, .3, 'sine'); tone(988 * semi(n), .03, .003 * v, .3, 'sine'); }); } },
};
function r110(K) { const Z = ST110[K];
  const V = { grow(p, x0, y, L, f, t, I) { Z.grow(x0, y, I, t); }, over(p, I) { Z.over(I, I.ly, S.age); hits101(I).forEach(o => Z.snd(o, fat45(o.i), pick45(o.i, 4))); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Fresh brainstorm; skill-ups 1.5 s apart; finales and sounds come later. Gap switch under the moments.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      if (Z.tilt) { const px = W / 2 - 13, py = top + 34; ctx.save(); ctx.fillStyle = '#6a4424'; ctx.beginPath(); ctx.moveTo(px, py + 6); ctx.lineTo(px - 6, py + 18); ctx.lineTo(px + 6, py + 18); ctx.fill(); ctx.restore(); let a = 0; const I0 = { lo: S.p.span[0], v: state().v }; a = -.11 * (1 - clamp((I0.v - I0.lo) / Math.max(1, S.nx.lv - I0.lo)));
        const o = S.hits.map((h, i) => ({ i, t: S.age - h - HIT })).filter(o => o.t >= 0 && o.t < .9).pop(); if (o) a += Math.sin(o.t * 14) * .025 * (1 - o.t / .9); ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.translate(-px, -py); try { barModule(top, 'A', V); } finally { ctx.restore(); } return; }
      barModule(top, 'A', V); } }; }
Object.assign(FAM, { PA: r110('A'), PB: r110('B'), PC: r110('C'), PD: r110('D'), PE: r110('E'), PF: r110('F'), PG: r110('G'), PH: r110('H') });

// Round 111 OB111 entries B (Vial rack), D (Recipe scroll), E (Setting up the lab), F (Cascade of bulbs) and LAB111, moved out 2026-11-17 (the user kept A Shelf to cabinet and C Ingredient jars). They go inside OB111.
  B: { name: 'Vial rack', desc: 'The bar is a wooden rack of empty glass vials. Each point a thin stream pours into the next vial and its potion rises; a full vial glows softly. No boiling, nothing on top: calm vials filling one by one (a long gap fills each vial over a few points).',
    draw(I, y, t, G, o) { wood111(I.x0 - 6, y - 9, I.x1 - I.x0 + 12, 2.5); wood111(I.x0 - 6, y + 5, I.x1 - I.x0 + 12, 4); const vw = Math.min(7, G.sw * .58), kc = o ? G.kOf(S.v0 + o.i) : -1;
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k), c = HUE98[Math.min(5, Math.floor(k * 6 / G.N))], top = y - 17, bot = y + 5;
        if (fr >= 1) { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 6; ctx.fillStyle = hexA(c, .25); ctx.fillRect(cx - vw / 2, top, vw, bot - top); ctx.restore(); }
        ctx.fillStyle = 'rgba(210,225,255,.12)'; ctx.beginPath(); ctx.roundRect(cx - vw / 2, top, vw, bot - top, [1, 1, vw / 2, vw / 2]); ctx.fill(); if (fr > 0) { const lh = (bot - top - 2) * fr; ctx.save(); ctx.beginPath(); ctx.roundRect(cx - vw / 2, top, vw, bot - top, [1, 1, vw / 2, vw / 2]); ctx.clip(); ctx.fillStyle = c; ctx.fillRect(cx - vw / 2, bot - lh, vw, lh); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(cx - vw / 2, bot - lh, vw, 1); ctx.restore(); }
        ctx.strokeStyle = 'rgba(230,240,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(cx - vw / 2, top, vw, bot - top, [1, 1, vw / 2, vw / 2]); ctx.stroke(); }
      if (o && o.t > -.4 && o.t < .15) { const cx = G.sx(kc), al = o.t > 0 ? 1 - o.t / .15 : 1, y0 = y - 36 + 0, y1 = y + 4 - (y + 4 - (y - 15)) * G.fr(kc); ctx.strokeStyle = hexA(HUE98[Math.min(5, Math.floor(kc * 6 / G.N))], .9 * al); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx, y0 + 10 * clamp((o.t + .4) / .1) * 0); ctx.lineTo(cx, lerp(y0, y1, clamp((o.t + .4) / .12))); ctx.stroke(); } },
    snd(o, v, n) { if (o.t >= -.4) once('o1bs' + o.i, () => noise(0, .35, .004 * v, 1600, .8, 'lowpass')); if (o.t >= 0) once('o1bt' + o.i, () => tone(880 * semi(n), 0, .005 * v, .3, 'sine')); } },
  D: { name: 'Recipe scroll', desc: 'The bar is a parchment scroll with rolled ends. Each point a quill sweeps across the next entry: the herb is stamped in and a straight ink line is written under it; the inked entries are your progress (a long gap writes each line over a few points).',
    draw(I, y, t, G, o) { const g = ctx.createLinearGradient(0, y - 14, 0, y + 10); g.addColorStop(0, '#f0e2bc'); g.addColorStop(1, '#c8b080'); ctx.fillStyle = g; ctx.fillRect(I.x0 - 2, y - 14, I.x1 - I.x0 + 4, 24);
      [I.x0 - 8, I.x1 + 2].forEach(x => { const rg = ctx.createLinearGradient(x, 0, x + 6, 0); rg.addColorStop(0, '#9a7a4a'); rg.addColorStop(.5, '#e8d4a4'); rg.addColorStop(1, '#8a6a3a'); ctx.fillStyle = rg; ctx.beginPath(); ctx.roundRect(x, y - 16, 6, 28, 3); ctx.fill(); });
      const kc = o ? G.kOf(S.v0 + o.i) : -1, sz = Math.min(11, G.sw * .8);
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k); if (fr <= 0) { ctx.fillStyle = 'rgba(90,70,40,.18)'; ctx.fillRect(cx - G.sw * .32, y + 4, G.sw * .64, 1); continue; } const [e] = HERB98[k % 5];
        let s = 1; if (k === kc && o && o.t >= 0 && o.t < .2 && G.first(S.v0 + o.i)) s = 1.5 - .5 * (o.t / .2); emo98(e, cx, y - 5, sz * s, 0, .9); ctx.fillStyle = '#3a2a16'; ctx.fillRect(cx - G.sw * .32, y + 4, G.sw * .64 * fr, 1.3); }
      if (o && o.t > -.3 && o.t < .15) { const u = clamp((o.t + .3) / .45), cx = G.sx(kc), qx = cx - G.sw * .32 + G.sw * .64 * u, qy = y + 4; ctx.save(); ctx.translate(qx, qy); ctx.rotate(-.9); ctx.fillStyle = '#f4f0ea'; ctx.beginPath(); ctx.ellipse(10, 0, 9, 2.6, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18, 0); ctx.stroke(); ctx.restore(); } },
    snd(o, v, n) { if (o.t >= -.3) once('o1ds' + o.i, () => { noise(0, .18, .004 * v, 3000, 2, 'bandpass'); noise(.2, .12, .003 * v, 2600, 2, 'bandpass'); }); if (o.t >= 0) once('o1dt' + o.i, () => tone(392 * semi(n), 0, .006 * v, .2, 'triangle')); } },
  E: { name: 'Setting up the lab', desc: 'The bar is a workbench with faint outlines of a lab to come. Each point the next piece (an alembic, a candle, scales, herbs, a scroll, a gem…) drops onto the bench with a little bounce and a puff of dust, building the scene until the lab is ready (a long gap brings each piece in over a few points).',
    draw(I, y, t, G, o) { wood111(I.x0 - 6, y + 4, I.x1 - I.x0 + 12, 5); ctx.fillStyle = '#4a2c14'; ctx.fillRect(I.x0 - 2, y + 9, 4, 5); ctx.fillRect(I.x1 - 2, y + 9, 4, 5); const sz = Math.min(15, G.sw * .9), kc = o ? G.kOf(S.v0 + o.i) : -1, drop = o && G.first(S.v0 + o.i);
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k), e = LAB111[k % LAB111.length], falling = drop && k === kc && o.t < 0 && o.t > -.4; let dy = 0;
        if (falling) dy = -28 * (1 - Math.pow((o.t + .4) / .4, 2)); else if (drop && k === kc && o.t >= 0 && o.t < .3) dy = -Math.abs(Math.sin(Math.PI * o.t / .3)) * 3;
        emo98(e, cx, y - sz / 2 + 3 + dy, sz, 0, fr > 0 || falling ? .45 + .55 * Math.max(fr, falling ? 1 : 0) : .12); }
      if (o && o.t >= 0 && drop) once('o1e' + o.i, () => { for (let q = 0; q < 5; q++) spawn({ x: G.sx(kc) + (q - 2) * 3, y: y + 3, vx: (q - 2) * 14, vy: -6 - Math.random() * 8, g: 10, life: .5, size: 1.5, col: 'rgba(220,200,170,.6)' }); }); },
    snd(o, v, n) { if (o.t >= 0) once('o1es' + o.i, () => { drum46(140 * semi(n / 2), 0, .012 * v); tone(330 * semi(n), .02, .004 * v, .12, 'triangle'); }); } },
  F: { name: 'Cascade of bulbs', desc: 'The bar is a little fountain of glass bulbs stepping down from left to right, joined by short spouts. Each point potion spills from one bulb into the next lower one and it fills; the filled bulbs are your progress (a long gap fills each bulb over a few points).',
    draw(I, y, t, G, o) { const r = Math.min(6.5, G.sw * .42), by = k => y - 11 + (G.N > 1 ? k / (G.N - 1) : 0) * 16, kc = o ? G.kOf(S.v0 + o.i) : -1;
      for (let k = 0; k < G.N - 1; k++) { ctx.strokeStyle = 'rgba(230,240,255,.4)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(G.sx(k) + r * .8, by(k) + r * .2); ctx.lineTo(G.sx(k + 1) - r * .6, by(k + 1) - r * .8); ctx.stroke(); }
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), cy = by(k), fr = G.fr(k), c = HUE98[Math.min(5, Math.floor(k * 6 / G.N))];
        ctx.fillStyle = 'rgba(210,225,255,.12)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); if (fr > 0) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - .5, 0, 7); ctx.clip(); ctx.fillStyle = c; ctx.fillRect(cx - r, cy + r - 2 * r * fr, 2 * r, 2 * r * fr); ctx.restore(); if (fr >= 1) { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 6; ctx.strokeStyle = hexA(c, .6); ctx.beginPath(); ctx.arc(cx, cy, r + .5, 0, 7); ctx.stroke(); ctx.restore(); } }
        ctx.strokeStyle = 'rgba(230,240,255,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(cx - r * .5, cy - r * .55, 1.5, 1.5); }
      if (o && o.t > -.35 && o.t < .15) { const al = o.t > 0 ? 1 - o.t / .15 : 1, c = HUE98[Math.min(5, Math.floor(kc * 6 / G.N))], x0 = kc > 0 ? G.sx(kc - 1) + r * .8 : G.sx(0) - 2, y0 = kc > 0 ? by(kc - 1) + r * .2 : y - 34, x1 = G.sx(kc) - (kc > 0 ? r * .6 : 0), y1 = by(kc) - r * .8, u = clamp((o.t + .35) / .15);
        ctx.strokeStyle = hexA(c, .9 * al); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, u), lerp(y0, y1, u)); ctx.stroke(); } },
    snd(o, v, n) { if (o.t >= -.35) once('o1fs' + o.i, () => noise(0, .3, .004 * v, 1400, .8, 'lowpass')); if (o.t >= 0) once('o1ft' + o.i, () => tone(1046 * semi(n), 0, .004 * v, .35, 'sine')); } },

// Round 112 prep: OB111.C Ingredient jars moved out 2026-11-17 (misread pick: the user meant E Setting up the lab).
  C: { name: 'Ingredient jars', desc: 'The bar is a row of lidded ingredient jars, each full of a different colored ingredient. Each point the next jar’s lid pops off with a hop, a pinch of its ingredient puffs out, and the jar empties a step; open, empty jars are your progress (a long gap empties each jar over a few points).',
    draw(I, y, t, G, o) { wood111(I.x0 - 6, y + 4, I.x1 - I.x0 + 12, 4); const jw = Math.min(13, G.sw * .8), kc = o ? G.kOf(S.v0 + o.i) : -1, pop = o && G.first(S.v0 + o.i);
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k), c = HERB98[(k * 3) % 5][1], top = y - 9, bot = y + 4;
        ctx.fillStyle = 'rgba(210,225,255,.16)'; ctx.beginPath(); ctx.roundRect(cx - jw / 2, top, jw, bot - top, 3); ctx.fill(); const lh = (bot - top - 2) * (1 - fr); if (lh > 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(cx - jw / 2 + 1, bot - 1 - lh, jw - 2, lh, 2); ctx.fill(); }
        ctx.strokeStyle = 'rgba(230,240,255,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(cx - jw / 2, top, jw, bot - top, 3); ctx.stroke();
        let lx = cx, ly = top - 2, la = 0; const popping = pop && k === kc && o.t > -.3 && o.t < .2; if (popping) { const u = (o.t + .3) / .5; ly = top - 2 - Math.sin(Math.PI * Math.min(1, u * 1.2)) * 11; lx = cx + u * jw * .7; la = u * 1.3; } else if (fr > 0) { lx = cx + jw * .7; ly = top + 1; la = 1.3; }
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(la); wood111(-jw / 2 - 1, -1.5, jw + 2, 3, '#b8865a', '#6a4424'); ctx.restore(); }
      if (o && o.t >= -.15) once('o1c' + o.i, () => { const c = HERB98[(kc * 3) % 5][1]; for (let q = 0; q < 6; q++) spawn({ x: G.sx(kc) + (Math.random() - .5) * 6, y: y - 11, vx: (Math.random() - .5) * 30, vy: -25 - Math.random() * 25, g: 30, life: .6, size: 1.6, col: q % 2 ? c : '#ffffff' }); }); },
    snd(o, v, n) { if (o.t >= -.3) once('o1cs' + o.i, () => { tone(700 * semi(n), 0, .007 * v, .06, 'sine', 1100 * semi(n)); noise(.04, .2, .004 * v, 1200, .8, 'lowpass'); }); } },

// Round 112 OB111 X (Bottle xylophone), N (Homunculus nursery), O (Ooze leaves its flask) and its option list, moved out 2026-11-17 (the user: Slime came out pretty good, A the best).
  X: { name: 'Bottle xylophone', desc: 'The bar is a row of glass bottles rising in height, unlit. A glossy droplet sits on the last lit bottle. Each point it squats and hops onto the next bottle, which lights up in its color with a chime; the chimes climb up the row like a scale (a long gap lights each bottle over a few hops, a softer tap in between).',
    draw(I, y, t, G, o) { wood111(I.x0 - 5, y + 5, I.x1 - I.x0 + 10, 3.5); const bw = Math.min(10, G.sw * .7), hk = k => 7 + 10 * (G.N > 1 ? k / (G.N - 1) : 1), kc = o ? G.kOf(S.v0 + o.i) : G.kOf(Math.floor(I.v + 1e-6));
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), h = hk(k), fr = G.fr(k), c = HUE98[Math.min(5, Math.floor(k * 6 / G.N))], bx = cx - bw / 2, by = y + 5 - h;
        if (fr > 0) { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = fr >= 1 ? 6 : 0; ctx.fillStyle = hexA(c, .35 + .55 * fr); ctx.beginPath(); ctx.roundRect(bx, by + 3, bw, h - 3, 2); ctx.fill(); ctx.restore(); }
        ctx.strokeStyle = fr > 0 ? 'rgba(240,245,255,.7)' : 'rgba(200,210,230,.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(bx, by + 3, bw, h - 3, 2); ctx.stroke(); ctx.strokeRect(cx - bw * .18, by, bw * .36, 3); }
      let dx, dy, sx = 1, sy = 1; const top = k => y + 5 - hk(k) - 4.5; if (!o || o.t < -.15 || o.t > .55) { const kk = G.kOf(Math.max(I.lo, Math.ceil(I.v - 1e-6) - 1)); dx = G.sx(kk); dy = top(kk); }
      else { const a = G.kOf(S.v0 + o.i - (S.v0 + o.i > I.lo ? 1 : 0)), b = G.kOf(S.v0 + o.i); if (o.t < 0) { const k = Math.sin(Math.PI * (o.t + .15) / .15); dx = G.sx(a); dy = top(a); sx = 1 + .25 * k; sy = 1 - .25 * k; } else if (o.t < .4) { const u = o.t / .4; dx = lerp(G.sx(a), G.sx(b), u); dy = lerp(top(a), top(b), u) - Math.sin(Math.PI * u) * 12; } else { const k = Math.sin(Math.PI * (o.t - .4) / .15); dx = G.sx(b); dy = top(b); sx = 1 + .3 * k; sy = 1 - .3 * k; } }
      ctx.save(); ctx.translate(dx, dy + 3); ctx.scale(sx, sy); ctx.translate(-dx, -(dy + 3)); const gg = ctx.createRadialGradient(dx - 1, dy - 1.5, .5, dx, dy, 3.6); gg.addColorStop(0, '#ffffff'); gg.addColorStop(1, '#6aa8ff'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(dx, dy, 3.4, 0, 7); ctx.fill(); ctx.restore();
      if (o && o.t >= .4) once('o2x' + o.i, () => spawn({ x: dx, y: dy + 3, size: 1.5, shape: 'ring', grow: 6, life: .25, col: '#ffffff' })); },
    snd(o, v, n) { if (o.t >= .4) once('o2xs' + o.i, () => { const G = g111({ lo: S.p.span[0], v: S.v0, x0: 0, x1: 1 }), k = G.kOf(S.v0 + o.i), fst = G.first(S.v0 + o.i), f = 523 * semi(PENT42[k % 10]); tone(f, 0, (fst ? .012 : .006) * v, .6, 'sine'); tone(f * 2.01, 0, (fst ? .004 : .002) * v, .35, 'sine'); }); } },
  N: { name: 'Homunculus nursery', desc: 'The bar is a row of little glass domes on a stand. Each point a drop of red goo falls into the next dome and swells into a blob that wobbles, then blinks its eyes open; awake blobs sway gently. A long gap grows each blob over a few points (it wakes when full).',
    draw(I, y, t, G, o) { wood111(I.x0 - 5, y + 5, I.x1 - I.x0 + 10, 3.5); const dw = Math.min(14, G.sw * .86), kc = o ? G.kOf(S.v0 + o.i) : -1;
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k), dh = 14; if (fr > 0) { let jig = 0; if (k === kc && o && o.t >= 0 && o.t < .5) jig = Math.sin(o.t * 25) * .15 * (1 - o.t / .5); const s = .35 + .65 * fr, rx = dw * .36 * s * (1 + jig), ry = dw * .3 * s * (1 - jig), by = y + 5 - ry, sw = fr >= 1 ? Math.sin(t * 2 + k) * .6 : 0;
          const g = ctx.createRadialGradient(cx - rx * .3 + sw, by - ry * .4, .5, cx + sw, by, Math.max(rx, ry)); g.addColorStop(0, '#ff9aa6'); g.addColorStop(.6, '#d8344a'); g.addColorStop(1, '#7a0a1a'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx + sw, by, rx, ry, 0, 0, 7); ctx.fill();
          if (fr >= 1) { const wake = k === kc && o ? clamp((o.t - .5) / .15) : 1, bl = (t * .7 + k * .37) % 3 < .08 ? .1 : 1; eyes112(cx + sw, by - ry * .1, Math.max(.8, rx * .2), Math.min(wake, bl)); } }
        ctx.fillStyle = 'rgba(210,225,255,.1)'; ctx.beginPath(); ctx.ellipse(cx, y + 5, dw / 2, dh, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = 'rgba(230,240,255,.5)'; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(cx - dw * .28, y - 6, 1.2, 4); }
      if (o && o.t > -.35 && o.t < 0) { const u = (o.t + .35) / .35, cx = G.sx(kc); ctx.fillStyle = '#d8344a'; ctx.beginPath(); ctx.arc(cx, lerp(y - 30, y + 2, u * u), 2, 0, 7); ctx.fill(); } },
    snd(o, v, n) { if (o.t >= 0) once('o2ns' + o.i, () => tone(220 * semi(n), 0, .01 * v, .2, 'sine', 160 * semi(n))); if (o.t >= .5) once('o2nt' + o.i, () => tone(1175 * semi(n), 0, .004 * v, .15, 'sine')); } },
  O: { name: 'Ooze leaves its flask', desc: 'A round flask lies on its side at the start of a wooden rail, full of violet ooze. The ooze creeps out along the rail: each point its front reaches out to the new point, grips with a little splat, and the body pulls after it with a jiggle, while the flask behind it empties.',
    draw(I, y, t, G, o) { wood111(I.x0 - 6, y + 5, I.x1 - I.x0 + 12, 3.5); const fx = I.x0 - 4, f = clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo)), mouth = I.x0 + 9;
      ctx.save(); ctx.beginPath(); ctx.arc(fx, y - 3, 8, 0, 7); ctx.clip(); ctx.fillStyle = '#9a5ae0'; ctx.fillRect(fx - 8, y - 3 + 16 * (f * .85) - 8, 16, 16); ctx.restore();
      ctx.strokeStyle = 'rgba(230,240,255,.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(fx, y - 3, 8, .5, Math.PI * 2 - .5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(fx + 7, y - 7); ctx.lineTo(mouth, y - 6); ctx.moveTo(fx + 7, y + 1); ctx.lineTo(mouth, y); ctx.stroke();
      const tip = Math.max(mouth + 2, I.tipX), jig = o && o.t > 0 && o.t < .8 ? Math.sin(o.t * 22) * (1 - o.t / .8) : 0, g = ctx.createLinearGradient(0, y - 4, 0, y + 5); g.addColorStop(0, '#c890ff'); g.addColorStop(1, '#5a2aa0');
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(mouth - 3, y - 3 - jig * .6, tip - mouth + 3, 8 + jig * .6, [2, 4 + jig, 2, 2]); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(mouth, y - 2, Math.max(0, tip - mouth - 4), 1);
      if (o && o.t > -.4 && o.t < .45) { const ext = o.t < -.1 ? eOut((o.t + .4) / .3) : 1, ret = o.t > 0 ? clamp(o.t / .45) : 0, xe = lerp(o.a, o.b, ext), xs = lerp(o.a, o.b, eOut(ret)); if (xe > xs + 1) { ctx.fillStyle = '#a870f0'; ctx.beginPath(); ctx.roundRect(xs, y + 1, xe - xs, 3, 1.5); ctx.fill(); ctx.beginPath(); ctx.arc(xe, y + 2.5, 2.4, 0, 7); ctx.fill(); } }
      if (o && o.t >= -.1) once('o2o' + o.i, () => spawn({ x: o.b, y: y + 3, size: 1.5, shape: 'ring', grow: 6, life: .25, col: '#e8d0ff' })); },
    snd(o, v, n) { if (o.t >= -.1) once('o2os' + o.i, () => tone(392 * semi(n), 0, .007 * v, .15, 'sine', 600 * semi(n))); if (o.t >= .1) once('o2ot' + o.i, () => tone(196 * semi(n), 0, .007 * v, .25, 'sine')); } },
Object.assign(FAM, { PA: r112('A', 'A'), PB: r112('B', 'E'), PC: r112('C', 'S'), PD: r112('D', 'X'), PE: r112('E', 'N'), PF: r112('F', 'O') }); delete FAM.PG; delete FAM.PH;

// Moved out 2026-11-17 (round 114 prep): round 111 LAB111/OB111 (A cabinet, E lab, + 112's S slime tank)/r111, round 112 eyes112/r112, round 113 BT113 B (crate), C (test subject), D (chain pop). Round 113 A (clean shelf) stays.
const LAB111 = ['⚗️', '\u{1F56F}️', '⚖️', '\u{1F33F}', '\u{1F4DC}', '\u{1F344}', '\u{1F48E}', '\u{1F52E}', '\u{1F9C2}', '\u{1F330}', '\u{1F338}', '\u{1F36F}', '\u{1F944}', '\u{1F525}', '\u{1F9B4}'];
const OB111 = {
  A: { name: 'Shelf to cabinet', desc: 'The bar is a small wooden cabinet, its left door swung open. Each point a bottle (a herb’s color, a gold wax seal on top) drops onto the shelf, squashes, clinks, and fills; with a long gap a bottle takes a few points to fill. The row of bottles is your progress.',
    draw(I, y, t, G, o) { ctx.fillStyle = '#1e140c'; ctx.fillRect(I.x0 - 6, y - 17, I.x1 - I.x0 + 12, 25); ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3; ctx.strokeRect(I.x0 - 6, y - 17, I.x1 - I.x0 + 12, 25);
      ctx.fillStyle = '#5a3a1e'; ctx.beginPath(); ctx.moveTo(I.x0 - 8, y - 18); ctx.lineTo(I.x0 - 20, y - 22); ctx.lineTo(I.x0 - 20, y + 13); ctx.lineTo(I.x0 - 8, y + 9); ctx.fill(); ctx.fillStyle = '#d8a84a'; ctx.beginPath(); ctx.arc(I.x0 - 17, y - 7, 1.4, 0, 7); ctx.fill();
      wood111(I.x0 - 5, y + 3, I.x1 - I.x0 + 10, 4); const bw = Math.min(10, G.sw * .72), kc = o ? G.kOf(S.v0 + o.i) : -1, drop = o && G.first(S.v0 + o.i);
      for (let k = 0; k < G.N; k++) { const fr = G.fr(k), falling = drop && k === kc && o.t < 0 && o.t > -.4; if (fr <= 0 && !falling) continue; const cx = G.sx(k), c = HERB98[k % 5][1]; let dy = 0, sq = 0;
        if (falling) dy = -28 * (1 - Math.pow((o.t + .4) / .4, 2)); if (drop && k === kc && o.t >= 0 && o.t < .25) sq = Math.sin(Math.PI * o.t / .25) * .22;
        const h = 16, bx = cx - bw / 2, by = y + 3 - h + dy; ctx.save(); ctx.translate(cx, y + 3 + dy); ctx.scale(1 + sq, 1 - sq); ctx.translate(-cx, -(y + 3 + dy));
        ctx.fillStyle = 'rgba(210,225,255,.2)'; ctx.beginPath(); ctx.roundRect(bx, by + 5, bw, h - 5, Math.min(3, bw / 2)); ctx.fill(); ctx.fillRect(cx - bw * .2, by + 1.5, bw * .4, 4);
        const lh = (h - 6) * Math.max(fr, falling ? .15 : 0); ctx.fillStyle = c; ctx.fillRect(bx + 1, y + 2 + dy - lh, bw - 2, lh); ctx.fillStyle = '#e8b84a'; ctx.beginPath(); ctx.roundRect(cx - bw * .26, by, bw * .52, 2.2, 1); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(bx + 1, by + 6, 1, h - 8); ctx.restore(); }
      if (o && o.t >= 0) once('o1a' + o.i, () => spawn({ x: G.sx(kc) - bw / 2, y: y - 9, size: 2.5, shape: 'star', life: .25, col: '#ffffff' })); },
    snd(o, v, n) { if (o.t >= 0) once('o1as' + o.i, () => { tone(1568 * semi(n), 0, .006 * v, .25, 'sine'); tone(2349 * semi(n), .01, .003 * v, .18, 'sine'); }); } },
  E: { name: 'Setting up the lab', desc: 'The bar is a workbench with faint outlines of a lab to come. Each point the next piece (an alembic, a candle, scales, herbs, a scroll, a gem…) drops onto the bench with a little bounce and a puff of dust, building the scene until the lab is ready (a long gap brings each piece in over a few points).',
    draw(I, y, t, G, o) { wood111(I.x0 - 6, y + 4, I.x1 - I.x0 + 12, 5); ctx.fillStyle = '#4a2c14'; ctx.fillRect(I.x0 - 2, y + 9, 4, 5); ctx.fillRect(I.x1 - 2, y + 9, 4, 5); const sz = Math.min(15, G.sw * .9), kc = o ? G.kOf(S.v0 + o.i) : -1, drop = o && G.first(S.v0 + o.i);
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k), e = LAB111[k % LAB111.length], falling = drop && k === kc && o.t < 0 && o.t > -.4; let dy = 0;
        if (falling) dy = -28 * (1 - Math.pow((o.t + .4) / .4, 2)); else if (drop && k === kc && o.t >= 0 && o.t < .3) dy = -Math.abs(Math.sin(Math.PI * o.t / .3)) * 3;
        emo98(e, cx, y - sz / 2 + 3 + dy, sz, 0, fr > 0 || falling ? .45 + .55 * Math.max(fr, falling ? 1 : 0) : .12); }
      if (o && o.t >= 0 && drop) once('o1e' + o.i, () => { for (let q = 0; q < 5; q++) spawn({ x: G.sx(kc) + (q - 2) * 3, y: y + 3, vx: (q - 2) * 14, vy: -6 - Math.random() * 8, g: 10, life: .5, size: 1.5, col: 'rgba(220,200,170,.6)' }); }); },
    snd(o, v, n) { if (o.t >= 0) once('o1es' + o.i, () => { drum46(140 * semi(n / 2), 0, .012 * v); tone(330 * semi(n), .02, .004 * v, .12, 'triangle'); }); } },
};
function r111(K) { const Z = OB111[K];
  const V = { grow(p, x0, y, L, f, t, I) { Z.draw(I, y, t, g111(I), cur111(I)); }, over(p, I) { hits101(I).forEach(o => Z.snd(o, fat45(o.i), pick45(o.i, 4))); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (The bar is drawn from scratch: no track. Try the gap switch: 5, 15, 50 points. Finales and sounds come later.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'X', V); } }; }
// ---------- round 112 (2026-11-17): bar-as-object kept ("much happier with this direction"): A Shelf to cabinet and B Ingredient jars ("very cute") as they were; round 110's stories
// reworked so the bar is the object (picked from a brainstorm): C Slime tank, D Bottle xylophone, E Homunculus nursery, F Ooze leaves its flask ----------
const eyes112 = (x, y, s, open = 1) => [-1, 1].forEach(d => { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(x + d * s * 1.3, y, s, s * open + .2, 0, 0, 7); ctx.fill(); if (open > .3) { ctx.fillStyle = '#1a1020'; ctx.beginPath(); ctx.arc(x + d * s * 1.3 + s * .3, y, s * .5 * open, 0, 7); ctx.fill(); } });
Object.assign(OB111, {
  S: { name: 'Slime tank', desc: 'The bar is a glass tank with a wooden lid, and a green slime lives inside. Each point a herb drops in through the lid just ahead of it; the slime lunges, gulps it and grows longer, so the slime filling the tank is your progress. Its eyes ride at its front.',
    draw(I, y, t, G, o) { const x0 = I.x0 - 3, x1 = I.x1 + 3, top = y - 13, bot = y + 7; ctx.fillStyle = 'rgba(160,200,180,.08)'; ctx.beginPath(); ctx.roundRect(x0, top, x1 - x0, bot - top, 4); ctx.fill();
      let tip = Math.max(I.x0 + 10, I.tipX), lunge = 0; const [e] = o ? HERB98[(S.v0 + o.i) % 5] : HERB98[0];
      if (o && o.t > -.55 && o.t < 0) { const hx = o.b - 3; if (o.t < -.2) { const u = (o.t + .55) / .35; emo98(e, hx, lerp(y - 30, y - 1, u * u), 10, (1 - u)); } else { const u = (o.t + .2) / .2; lunge = Math.sin(Math.PI * u) * Math.max(0, hx - tip) * .8; emo98(e, hx - u * 4, y - 1, 10 * (1 - u), 0, 1 - u); } }
      const br = Math.sin(t * 2.2) * .6, g = ctx.createLinearGradient(0, y - 6, 0, bot); g.addColorStop(0, '#9af07a'); g.addColorStop(1, '#2e8a2a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x0 + 1, y - 5 - br, tip + lunge - x0 - 1, bot - y + 4 + br, [3, 7, 2, 2]); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x0 + 3, y - 4 - br, Math.max(0, tip + lunge - x0 - 10), 1.2); eyes112(tip + lunge - 6, y - 1 - br, 1.7);
      ctx.strokeStyle = 'rgba(220,240,230,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x0, top, x1 - x0, bot - top, 4); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x0 + 4, top + 2, x1 - x0 - 8, 1);
      wood111(x0 - 2, top - 3, x1 - x0 + 4, 3); },
    snd(o, v, n) { if (o.t >= -.12) once('o2s' + o.i, () => { tone(160 * semi(n), 0, .012 * v, .14, 'sine', 110 * semi(n)); tone(500 * semi(n), .06, .004 * v, .1, 'sine', 820 * semi(n)); }); } },
});
function r112(L, K) { const R = r111(K); return { get name() { return L + '. ' + OB111[K].name; }, get desc() { return R.desc; }, get note() { return R.note; }, draw: top => R.draw(top) }; }
  B: { name: 'Bench + packed in a crate', finAt: 1.75, desc: 'The bottles on a workbench, set up like the lab: each point the next bottle drops onto the bench with a little bounce and a puff of dust; faint outlines show the rest. Finale: a wooden crate drops over the row with a thump, twine ties round it (two straight cords), and the crate hops into the recipe icon.',
    draw(I, y, t, G, o) { const ts = ts95(); bench113(I, y, t, G, o); if (ts <= 0) return; const x0 = I.x0 - 4, x1 = I.x1 + 4, drop = ts < .4 ? -40 * (1 - Math.pow(ts / .4, 2)) : 0, hop = clamp((ts - 1.2) / .45), ux = I.x1 + 18;
      if (hop >= 1) return; const sc = 1 - hop * .85, cx = lerp((x0 + x1) / 2, ux, eOut(hop)), cy = lerp(y - 4, y, hop) - Math.sin(Math.PI * hop) * 16 + drop, w = (x1 - x0) * sc, h = 20 * sc;
      ctx.save(); ctx.translate(cx, cy); const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#b8865a'); g.addColorStop(1, '#6a4424'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = 'rgba(40,24,10,.7)'; ctx.lineWidth = 1;
      for (let q = 1; q < 3; q++) { ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + q * h / 3); ctx.lineTo(w / 2, -h / 2 + q * h / 3); ctx.stroke(); } ctx.strokeRect(-w / 2, -h / 2, w, h);
      const tie = clamp((ts - .6) / .4); if (tie > 0) { ctx.strokeStyle = '#e8d8a8'; ctx.lineWidth = 1.6 * sc; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2 + w * tie, 0); ctx.moveTo(0, -h / 2); ctx.lineTo(0, -h / 2 + h * clamp(tie * 1.5)); ctx.stroke(); } ctx.restore(); },
    fsnd(ts) { if (ts >= .4) once('b3fb0', () => { drum46(90, 0, .02); noise(0, .1, .006, 600, .8, 'lowpass', true); }); if (ts >= .6) once('b3fb1', () => noise(0, .35, .004, 2200, 1.5, 'bandpass')); if (ts >= 1.2) once('b3fb2', () => tone(330, 0, .008, .2, 'sine', 520)); },
    snd(o, v, n) { if (o.t >= 0) once('b3bs' + o.i, () => { drum46(140 * semi(n / 2), 0, .01 * v); tone(1568 * semi(n), .02, .004 * v, .2, 'sine'); }); } },
  C: { name: 'Bench + test subject', finAt: 2.2, desc: 'The bench of bottles. Finale: the slime from the tank slides in from the right onto the bench, gulps the last bottle, flashes through the potion colors, swells and sparkles, then happily hops into the recipe icon.',
    draw(I, y, t, G, o) { const ts = ts95(), last = G.N - 1; bench113(I, y, t, G, o, k => ts > .95 && k === last); if (ts <= 0) return; const lx = G.sx(last), ux = I.x1 + 18, hop = clamp((ts - 1.75) / .45);
      if (ts > .7 && ts < .95) { const u = (ts - .7) / .25; bottle113(lerp(lx, lx + 8, u), y + 4 - u * 4, Math.min(9, G.sw * .7), 15, col113(last), 1, 1 - u, 1); }
      if (hop >= 1) return; const sx = ts < .55 ? lerp(I.x1 + 40, lx + 13, eOut(ts / .55)) : lerp(lx + 13, ux, eOut(hop)), sy = y - 3 - Math.sin(Math.PI * hop) * 18, cyc = ts > 1 && ts < 1.6 ? HUE98[Math.floor((ts - 1) * 12) % 6] : '#6ad84a', sw = ts > 1 && ts < 1.6 ? 1 + .25 * Math.sin((ts - 1) * 20) : 1, gulp = ts > .7 && ts < .95 ? Math.sin(Math.PI * (ts - .7) / .25) * .2 : 0, s = (1 - hop * .5) * sw;
      const g = ctx.createRadialGradient(sx - 2, sy - 3, .5, sx, sy, 8 * s); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, cyc); g.addColorStop(1, mix(cyc, '#000000', .35)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx, sy, 8 * s * (1 + gulp), 6.5 * s * (1 - gulp), 0, 0, 7); ctx.fill(); eyes112(sx - 1, sy - 2, 1.6 * s * (ts > 1 && ts < 1.6 ? 1.3 : 1));
      if (ts > 1) once('b3c0', () => { for (let q = 0; q < 8; q++) spawn({ x: sx + (Math.random() - .5) * 16, y: sy - 4, vx: (Math.random() - .5) * 40, vy: -30 - Math.random() * 30, g: 40, life: .7, size: 2.2, shape: 'star', col: q % 2 ? '#fff4c0' : '#ffffff' }); }); },
    fsnd(ts) { if (ts >= 0) once('b3fc0', () => noise(0, .5, .004, 700, .8, 'lowpass')); if (ts >= .75) once('b3fc1', () => { tone(170, 0, .012, .14, 'sine', 110); tone(200, .12, .01, .14, 'sine', 130); }); if (ts >= 1) once('b3fc2', () => [0, 4, 7, 12].forEach((s, i) => tone(523 * semi(s), i * .1, .006, .3, 'sine'))); if (ts >= 1.75) once('b3fc3', () => tone(440, 0, .008, .15, 'sine', 700)); },
    snd(o, v, n) { if (o.t >= 0) once('b3cs' + o.i, () => { drum46(140 * semi(n / 2), 0, .01 * v); tone(1568 * semi(n), .02, .004 * v, .2, 'sine'); }); } },
  D: { name: 'Bench + chain pop', desc: 'The bench of bottles. Finale: the bottles pop one after another down the bench, left to right, each a soft puff of its own color with a little pop that climbs the scale, and the last pop lands as the recipe lights.',
    get finAt() { return .25 + Math.min(15, Math.max(1, S.nx.lv - S.p.span[0])) * .08 + .2; },
    draw(I, y, t, G, o) { const ts = ts95(), at = k => .25 + k * .08; bench113(I, y, t, G, o, k => ts > 0 && ts >= at(k)); if (ts <= 0) return;
      for (let k = 0; k < G.N; k++) { const u = (ts - at(k)) / .6; if (u > 0 && u < 1) { puff113(G.sx(k), y - 4, col113(k), u, 6, 2.5); if (u < .12) { ctx.fillStyle = `rgba(255,255,255,${1 - u / .12})`; ctx.beginPath(); ctx.arc(G.sx(k), y - 4, 4, 0, 7); ctx.fill(); } } } },
    fsnd(ts) { const N = Math.min(15, Math.max(1, S.nx.lv - S.p.span[0])); for (let k = 0; k < N; k++) if (ts >= .25 + k * .08) once('b3fd' + k, () => { tone(392 * semi(PENT42[k % 10]), 0, .006, .12, 'sine', 600 * semi(PENT42[k % 10])); noise(0, .06, .003, 1200, .8, 'lowpass', true); }); },
    snd(o, v, n) { if (o.t >= 0) once('b3ds' + o.i, () => { drum46(140 * semi(n / 2), 0, .01 * v); tone(1568 * semi(n), .02, .004 * v, .2, 'sine'); }); } },

// Moved out 2026-11-17 (round 116 prep): round 113 BT113 (A clean shelf + doors close) and r113; round 114's option list; round 115 AO115 C (seal + confetti), D (label + into the icon) and its option list.
const BT113 = {
  A: { name: 'Clean shelf + doors close', finAt: 2.1, desc: 'The shelf tidied so it reads like a skill-up bar: a dark recessed niche the size of the bar, a wooden lip under it, faint outlines of the bottles still to come. Each point the next bottle pops into its spot (a quick overshoot and a glint), a soft clink. Finale: two cabinet doors swing shut over the shelf, it rattles, three muffled pops behind the doors puff colored smoke out of the cracks, and the doors creak back open on an empty, scorched shelf as the recipe lights.',
    draw(I, y, t, G, o) { const ts = ts95(); ctx.fillStyle = '#140e0a'; ctx.beginPath(); ctx.roundRect(I.x0 - 3, y - 9, I.x1 - I.x0 + 6, 16, 3); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(I.x0 - 3, y - 9, I.x1 - I.x0 + 6, 2);
      const bw = Math.min(8, G.sw * .62), h = 12, kc = o ? G.kOf(S.v0 + o.i) : -1, pop = o && G.first(S.v0 + o.i), gone = ts > 1.45;
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), fr = G.fr(k); if (gone) { ctx.fillStyle = 'rgba(40,30,24,.6)'; ctx.beginPath(); ctx.ellipse(cx, y + 5, bw * .6, 1.2, 0, 0, 7); ctx.fill(); continue; } if (fr <= 0) { ghost113(cx, y + 5, bw, h); continue; }
        let sc = 1; if (pop && k === kc && o.t >= 0 && o.t < .3) sc = eBack(clamp(o.t / .25)); bottle113(cx, y + 5, bw, h, col113(k), fr, 1, Math.max(.01, sc)); }
      wood111(I.x0 - 5, y + 5, I.x1 - I.x0 + 10, 3.5); ctx.fillStyle = '#6a4424'; ctx.fillRect(I.x0 - 5, y - 10, I.x1 - I.x0 + 10, 1.5);
      if (pop && o.t >= 0) once('b3a' + o.i, () => spawn({ x: G.sx(kc) - bw / 2, y: y - 4, size: 2.5, shape: 'star', life: .25, col: '#ffffff' }));
      if (ts > 0) { const cl = ts < .4 ? eOut(ts / .4) : ts < 1.5 ? 1 : 1 - eOut(clamp((ts - 1.5) / .4)) * .85, half = (I.x1 - I.x0 + 10) / 2, bulge = [.75, 1, 1.25].reduce((s, a) => s + (ts > a && ts < a + .15 ? Math.sin(Math.PI * (ts - a) / .15) : 0), 0);
        [-1, 1].forEach(s => { const w = half * cl, x = s < 0 ? I.x0 - 5 : I.x1 + 5 - w; if (w < .5) return; const g = ctx.createLinearGradient(0, y - 11, 0, y + 9); g.addColorStop(0, '#8a5a30'); g.addColorStop(1, '#4a2c14'); ctx.fillStyle = g; ctx.fillRect(x, y - 11 - bulge, w, 20 + bulge * 2);
          ctx.strokeStyle = 'rgba(30,18,8,.6)'; ctx.lineWidth = 1; ctx.strokeRect(x + 2, y - 8 - bulge, w - 4, 14 + bulge * 2); ctx.fillStyle = '#d8a84a'; ctx.beginPath(); ctx.arc(s < 0 ? x + w - 4 : x + 4, y - 1, 1.3, 0, 7); ctx.fill(); });
        [.75, 1, 1.25].forEach((a, n) => { const k = (ts - a) / .7; if (k > 0 && k < 1) { const sx = (I.x0 + I.x1) / 2 + (n - 1) * 30; puff113(sx, y - 11, HUE98[(n * 2 + 1) % 6], k, 5, 2.5); puff113((I.x0 + I.x1) / 2, y + 9 - k * 2, HUE98[(n * 2) % 6], k * .7, 3, 2); } }); } },
    shake(I) { const ts = ts95(); if (ts < .55 || ts > 1.45) return [0, 0]; const k = [.75, 1, 1.25].reduce((s, a) => s + (ts > a && ts < a + .12 ? 1 - (ts - a) / .12 : 0), 0); return [Math.sin(ts * 70) * .8 * (ts < .7 ? 1 : 0), 1.6 * k]; },
    fsnd(ts) { if (ts >= 0) once('b3fa0', () => tone(180, 0, .01, .3, 'triangle', 120)); if (ts >= .4) once('b3fa1', () => { drum46(110, 0, .016); noise(0, .05, .006, 800, .8, 'lowpass', true); });
      [.75, 1, 1.25].forEach((a, n) => { if (ts >= a) once('b3fp' + n, () => { drum46(70 + n * 12, 0, .02); noise(0, .3, .008, 500, .7, 'lowpass'); }); }); if (ts >= 1.5) once('b3fc', () => tone(150, 0, .008, .5, 'triangle', 190)); },
    snd(o, v, n) { if (o.t >= 0) once('b3as' + o.i, () => { tone(1568 * semi(n), 0, .005 * v, .22, 'sine'); tone(2349 * semi(n), .01, .0025 * v, .16, 'sine'); }); } },
};
function r113(K) { const Z = BT113[K];
  const V = { get finAt() { return Z.finAt; }, shake: I => Z.shake ? Z.shake(I) : [0, 0], grow(p, x0, y, L, f, t, I) { Z.draw(I, y, t, g111(I), cur111(I)); },
    over(p, I) { hits101(I).forEach(o => Z.snd(o, fat45(o.i), pick45(o.i, 4))); const ts = ts95(); if (ts >= 0) Z.fsnd(ts); } };
  return { get name() { return K + '. ' + Z.name; }, get desc() { return Z.desc + ' (Pick “Reaching the next unlock” to see the finale. Placeholder sounds, kept soft: no big booms.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 4.4 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'X', V); } }; }
Object.assign(FAM, { PA: r114('A'), PB: r114('B'), PC: r114('C'), PD: r114('D') });
  C: { name: 'Seal stamped on + gold confetti', fx: .6, desc: 'Each point: after the bottle lands, its gold seal hovers, then stamps down onto the neck with a little press and a glint. Finale add-on: as the seals pop, each bursts into a few flakes of gold confetti that twinkle as they drift down.',
    hide: (k, G, o) => o && G.first(S.v0 + o.i) && k === kc115(G, o) && o.t >= 0 && o.t < .4,
    over(I, y, G, o) { const kc = kc115(G, o); if (o && G.first(S.v0 + o.i) && o.t >= 0 && o.t < .4) { const bw = Math.min(9, G.sw * .7), sd = o.t < .12 ? -7 : o.t < .2 ? lerp(-7, 0, (o.t - .12) / .08) : 0, sq = o.t >= .2 && o.t < .3 ? Math.sin(Math.PI * (o.t - .2) / .1) * .06 : 0; bottle113(G.sx(kc), y + 4, bw, 15, col113(kc), G.fr(kc), 1, 1 - sq, sd);
      if (o.t >= .2) once('a5c' + o.i, () => { spawn({ x: G.sx(kc) + 2, y: y - 11, size: 2.5, shape: 'star', life: .3, col: '#fff4c0' }); tone(1319 * semi(pick45(o.i, 3)), 0, .004 * fat45(o.i), .15, 'triangle'); }); } },
    fin(I, y, G, ts, C) { for (let k = 0; k < G.N; k++) if (ts >= C.pop(k)) once('a5g' + k, () => { for (let q = 0; q < 3; q++) spawn({ x: G.sx(k), y: y - 11, vx: (Math.random() - .5) * 50, vy: -90 - Math.random() * 40, g: 70, life: 1.6, size: 1.3, shape: 'sq', vr: 10, col: q % 2 ? '#ffd36a' : '#fff0b0' }); spawn({ x: G.sx(k) + (Math.random() - .5) * 10, y: y - 30 - Math.random() * 10, size: 2, shape: 'star', life: .5, col: '#ffffff' }); }); } },
  D: { name: 'Label slapped on + into the icon', fx: .55, desc: 'Each point: after the bottle lands, a little paper label with the herb’s color slaps onto its front. Finale add-on: the labels blow off as the seals pop, and every bottle’s spray arcs over into the recipe icon, which glows brighter as it fills.',
    deco(k, cx, base, w, h, falling, G, o, ts, popped, since) { if (falling) return; const kc = kc115(G, o), slap = !ts && o && G.first(S.v0 + o.i) && k === kc ? clamp((o.t - .05) / .15) : 1; if (popped) return; label115(cx, base, w, h, k, 1 + .8 * (1 - slap), slap > 0 ? 1 : 0); if (!ts && o && k === kc && o.t >= .2) once('a5d' + o.i, () => noise(0, .04, .004 * fat45(o.i), 900, .8, 'lowpass', true)); },
    fin(I, y, G, ts, C) { const ux = I.x1 + 18; let got = 0; for (let k = 0; k < G.N; k++) { const p = C.pop(k); if (ts >= p) once('a5l' + k, () => spawn({ x: G.sx(k), y: y - 3, vx: (Math.random() - .3) * 40, vy: -60 - Math.random() * 30, g: 60, life: 1.4, size: 2.2, shape: 'sq', vr: 7, col: '#efe2c0' }));
      for (let q = 0; q < 3; q++) { const u = (ts - p - .1 - q * .05) / .45; if (u >= 1) got++; if (u > 0 && u < 1) { ctx.fillStyle = col113(k); ctx.beginPath(); ctx.arc(lerp(G.sx(k), ux, u), lerp(y - 11, y, u) - Math.sin(Math.PI * u) * 26, 1.5, 0, 7); ctx.fill(); } } }
      const gl = got / (G.N * 3); if (gl > 0) { ctx.save(); ctx.shadowColor = '#d0a8ff'; ctx.shadowBlur = 14 * gl; ctx.strokeStyle = `rgba(255,240,200,${.8 * gl})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ux, y, 13, 0, 7); ctx.stroke(); ctx.restore(); } } },
Object.assign(FAM, { PA: r115('A'), PB: r115('B'), PC: r115('C'), PD: r115('D') });

// Moved out 2026-11-17 (Tailoring prep): unused Alchemy helpers and wrappers (hits98, emo98, pot104, act104, fall104, bead104, puff113, r114, label115, r115). Alchemy's done look r117('C') stays.
const hits98 = I => S.hits.map((h, i) => ({ i, t: S.age - h - HIT, a: I.X(S.v0 + i), b: I.X(S.v0 + i + 1) })).filter(o => o.t > -.45 && o.t < 1.4);
function emo98(e, x, y, s, rot = 0, al = 1) { ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${s}px "Segoe UI Emoji", serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, 0, 0); ctx.restore(); }
function pot104(x0, y, I) { const A = hits101(I).filter(o => o.t >= 0 && o.t < 1).pop();
  if (!A) { const c = hue104(I, Math.floor(I.v + 1e-6)); liq98(x0 - 2, I.tipX, y, lv103(c), dk103(c)); return; }
  const c0 = hue104(I, S.v0 + A.i), c1 = hue104(I, S.v0 + A.i + 1), d = 420 * A.t; liq98(x0 - 2, I.tipX, y, lv103(c0), dk103(c0));
  ctx.save(); ctx.beginPath(); ctx.rect(A.a - d, y - 6, 2 * d, 12); ctx.clip(); liq98(x0 - 2, I.tipX, y, lv103(c1), dk103(c1)); ctx.fillStyle = `rgba(255,255,255,${.6 * (1 - clamp(A.t / .3))})`; ctx.fillRect(x0 - 2, y - 6, I.tipX - x0 + 2, 12); ctx.restore(); }
const act104 = (I, a = -1.1, b = .6) => hits101(I).filter(o => o.t > a && o.t < b).pop();
const fall104 = (o, e, x, y0, y1, s = 13) => { const u = clamp((o.t + 1.05) / .2); if (o.t < -.85) emo98(e, x, lerp(y0, y1, u * u), s, (1 - u) * 1.2); return o.t >= -.85; };
const bead104 = (x, y, c, r = 2.2) => { ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 7; ctx.fillStyle = mix(c, '#ffffff', .35); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); };
const puff113 = (x, y, c, k, n = 6, r0 = 3) => { for (let q = 0; q < n; q++) { const a = q * 1.1, r = r0 * (.6 + k * 1.2) + q % 2, px = x + Math.cos(a) * k * 7, py = y - k * 10 + Math.sin(a) * k * 4; ctx.fillStyle = hexA(c, .55 * (1 - k)); ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); } };
function r114(K) { const Z = BT114[K];
  const V = { get finAt() { return Z.finAt; }, shake: I => Z.shake ? Z.shake(I) : [0, 0], grow(p, x0, y, L, f, t, I) { Z.draw(I, y, t, g111(I), cur111(I)); },
    over(p, I) { hits101(I).forEach(o => Z.snd(o, fat45(o.i), pick45(o.i, 4))); const ts = ts95(); if (ts >= 0) Z.fsnd(ts); } };
  return { get name() { return K + '. ' + (K === 'A' ? 'Clean shelf + doors close (113 A)' : 'Bench + ' + Z.name); }, get desc() { return Z.desc + ' (Pick “Reaching the next unlock” to see the finale; try the 5-point gap too. Placeholder sounds, kept soft.)'; }, get note() { return Z.name.toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 5 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'X', V); } }; }
const label115 = (cx, base, w, h, k, sc = 1, al = 1) => { if (al <= 0) return; ctx.save(); ctx.globalAlpha *= al; ctx.translate(cx, base - h * .42); ctx.scale(sc, sc); ctx.fillStyle = '#efe2c0'; ctx.fillRect(-w * .42, -2.6, w * .84, 5.2); ctx.fillStyle = col113(k); ctx.beginPath(); ctx.arc(0, 0, 1.4, 0, 7); ctx.fill(); ctx.restore(); };
function r115(K) { const Z = AO115[K], base = BT114.B;
  const V = { get finAt() { return base.finAt + (Z ? Z.fx : 0); }, shake: I => base.shake(I),
    grow(p, x0, y, L, f, t, I) { const G = g111(I), o = cur111(I), ts = ts95();
      if (ts <= 0) return bench113(I, y, t, G, o, Z && Z.hide ? k => Z.hide(k, G, o) : null, Z && Z.deco ? (k, cx, b, w, h, fl) => Z.deco(k, cx, b, w, h, fl, G, o, 0, false) : null);
      chain114('B', I, y, G, ts, Z && Z.deco ? (k, cx, by, w, h, popped, since) => Z.deco(k, cx, by + h, w, h, false, G, o, ts, popped, since) : null); },
    over(p, I) { const G = g111(I), o = cur111(I), ts = ts95(); if (Z && Z.over && ts <= 0) Z.over(I, I.ly, G, o); if (Z && Z.fin && ts > 0) Z.fin(I, I.ly, G, ts, ch114(I, G).B);
      hits101(I).forEach(o => base.snd(o, fat45(o.i), pick45(o.i, 4))); if (ts >= 0) base.fsnd(ts); } };
  return { get name() { return K + '. ' + (Z ? Z.name : 'As locked (114 B)'); }, get desc() { return (Z ? Z.desc : 'The locked look: the bench of bottles, the fizz, pop, spray finale.') + ' (Try one skill-up for the per-point add-on and “Reaching the next unlock” for the finale.)'; }, get note() { return (Z ? Z.name : 'as locked').toLowerCase() + ', ' + GAP104 + '-point gap.'; },
    draw(top) { const P = alb104(GAP104); if (profName !== 'Alchemy' || S.p !== P || !S.slow101) { profName = 'Alchemy'; const keep = PROF.Alchemy; PROF.Alchemy = P; try { const s = build(); s.hits = s.hits.map((h, k) => 1.15 + k * 1.5); s.dur = s.hits[s.hits.length - 1] + (s.reaches ? 5.5 : 2.6); s.slow101 = true; s.age = Math.min(S.age, .02); S = s; } finally { PROF.Alchemy = keep; } }
      barModule(top, 'X', V); } }; }

// Round 118 TL118 C (Clothes rack: 'just the same as the clothesline') and D (Measuring tape), moved out 2026-11-17. They go inside TL118.
  C: { name: 'Clothes rack', desc: 'A shop rail on two little wheeled legs, with empty hangers waiting. Each point the next garment comes sliding along the rail from the left on its hanger, stops at its spot with a clack and swings to rest; the filled hangers are your progress.',
    draw(I, y, t, G, o) { const rail = y - 12; ctx.strokeStyle = '#b8b8c0'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(I.x0 - 8, rail); ctx.lineTo(I.x1 + 8, rail); ctx.stroke(); [I.x0 - 7, I.x1 + 7].forEach(x => { ctx.beginPath(); ctx.moveTo(x, rail); ctx.lineTo(x, y + 11); ctx.stroke(); ctx.fillStyle = '#4a4a52'; ctx.beginPath(); ctx.arc(x, y + 12.5, 1.8, 0, 7); ctx.fill(); });
      const kn = new118(G, o), sz = Math.min(15, G.sw * .95), hanger = (x, al) => { ctx.strokeStyle = `rgba(200,170,120,${al})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, rail + 1.5, 1.5, Math.PI, 0); ctx.moveTo(x, rail + 3); ctx.lineTo(x - sz * .4, rail + 6); ctx.lineTo(x + sz * .4, rail + 6); ctx.closePath(); ctx.stroke(); };
      for (let k = 0; k < G.N; k++) { const fr = G.fr(k), sliding = k === kn && o.t < 0 && o.t > -.45; let x = G.sx(k), a = 0; if (fr <= 0 && !sliding) { hanger(x, .2); continue; }
        if (sliding) { const u = eOut((o.t + .45) / .45); x = lerp(I.x0 - 10, G.sx(k), u); a = -.25 * (1 - u); } else if (k === kn && o.t >= 0 && o.t < .7) a = Math.sin(o.t * 16) * .3 * (1 - o.t / .7);
        ctx.save(); ctx.translate(x, rail + 1.5); ctx.rotate(a); ctx.translate(-x, -(rail + 1.5)); hanger(x, .9); emo98(WEAR118[(k + 3) % 8], x, rail + 6 + sz * .48, sz, 0, .45 + .55 * Math.max(fr, sliding ? 1 : 0)); ctx.restore(); } },
    snd(o, v, n) { if (o.t >= -.4) once('t8cs' + o.i, () => noise(0, .3, .0015 * v, 2000, 1, 'bandpass')); if (o.t >= 0) once('t8ct' + o.i, () => { tone(1320 * semi(n), 0, .004 * v, .08, 'triangle'); drum46(200, 0, .004 * v); }); } },
  D: { name: 'Measuring tape', desc: 'The bar is a tailor’s measuring tape pulled out of a little brass case at the start: yellow, with tick marks and a number at each mark. Each point the tape pulls out to the new length with a quick tug that overshoots a hair and snaps back, its metal end tab catching the light.',
    draw(I, y, t, G, o) { const cx = I.x0 - 9, g = ctx.createLinearGradient(0, y - 8, 0, y + 8); g.addColorStop(0, '#f0d080'); g.addColorStop(1, '#8a6a20'); ctx.strokeStyle = 'rgba(200,190,160,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(I.x0, y + 2); ctx.lineTo(I.x1, y + 2); ctx.stroke();
      let tip = I.tipX; if (o && o.t >= 0 && o.t < .5) tip = I.X(S.v0 + o.i + eBack(clamp(o.t / .35))); tip = Math.max(cx + 6, tip);
      const tg = ctx.createLinearGradient(0, y - 2, 0, y + 6); tg.addColorStop(0, '#ffe680'); tg.addColorStop(1, '#d8b030'); ctx.fillStyle = tg; ctx.fillRect(cx + 4, y - 2, tip - cx - 4, 7);
      ctx.fillStyle = '#5a4410'; for (let x = I.x0, q = 0; x < tip - 1; x += 3, q++) ctx.fillRect(x, y - 2, .8, q % 5 ? 2 : 4);
      for (let k = 1; k <= G.N; k++) { const x = I.X(I.lo + k * G.per); if (x < tip - 4) { ctx.font = '6px system-ui'; ctx.fillStyle = '#5a4410'; ctx.textAlign = 'center'; ctx.fillText(String(Math.round(I.lo + k * G.per) % 100), x - 3, y + 4.5); } }
      ctx.fillStyle = '#c8c8d0'; ctx.fillRect(tip - 1, y - 3, 2, 9); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(tip - .5, y - 2, .8, 3);
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(cx - 8, y - 8, 14, 16, 4); ctx.fill(); ctx.strokeStyle = '#6a5010'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx - 1, y, 3.5, 0, 7); ctx.stroke(); ctx.fillStyle = '#6a5010'; ctx.beginPath(); ctx.arc(cx - 1, y, 1, 0, 7); ctx.fill();
      if (o && o.t >= .3) once('t8d' + o.i, () => spawn({ x: o.b, y: y - 2, size: 2.5, shape: 'star', life: .25, col: '#ffffff' })); },
    snd(o, v, n) { if (o.t >= 0) once('t8ds' + o.i, () => { noise(0, .12, .002 * v, 1500, 1, 'bandpass'); tone(990 * semi(n), .12, .004 * v, .07, 'triangle'); }); } },

// Comment lines moved off the page 2026-11-18 (room for Tailoring; the rounds log keeps every round):
// ---------- round 83 (2026-11-16): Leatherworking, the base (pitched first; no punch, no knife cut: the ring and Skinning own those). A Unrolling hide, B Dye soaks in, C Tooled pattern, D Stretched and tacked ----------
// a strip of leather: a soft vertical gradient, sparse grain, a faint light lip on top
// this run's skill-ups: t = seconds since it landed (negative while the strike comes in), a/b = the front before/after
// ---------- round 84 (2026-11-16): Leatherworking base, A (Unrolling hide) kept; the user: "don't play it safe inside the bar". Three bold ones that use the bar as a frame: B Boot stomp, C Hide throw, D Grip wrap ----------
// a pelt: a soft blob with four leg flaps (simple shapes), centred at 0,0, w x h
// ---------- round 85 (2026-11-16): Leatherworking base, A = Grip wrap (round 84 D, "not a bad idea"); three more, each a different mechanism outside the bar: B Sling, C Fringe, D Belt and buckle ----------
// ---------- round 90 (2026-11-16): the user's remembered Skinning option, "a tarp thinly stretched and pulled to the next point". Best match: Pegged out (round 21 B) at Skinning's scale
// (each skill-up ~1/5 of the bar). A = it as it was, on Skinning's bar; B, C = Leatherworking versions at a scale that reads (the pull is per notch section, not per 3 px point) ----------
// the thin stretched sheet from xa to xb: k 0..1 how thick (0 = tissue-thin, 1 = full leather), shiv = its vibration
// ---------- round 91 (2026-11-16): Leatherworking base LOCKED as Pegged out, a peg pair per notch (round 90 B: the hide pulled thin like a tarp to the next pegs). Add-ons the user picked, one each:
// B Mallet taps the pegs, C Tension shiver, D Scraps trimmed off, E Stretched hide sheen. The single skill-up starts at 124 so every moment reaches a notch ----------
// the latest skill-up that reached a notch: nx = that notch, xa = the notch before
// ---------- round 92 (2026-11-16): "I liked Pegged out when it stretched further; lock that in first". How far each skill-up pulls on Leatherworking:
// A the Skinning original (reference), B Bigger steps (the bar runs to the next recipe unlock, 5 points, so each skill-up is ~1/5 of the bar, pegs per point as on Skinning),
// C Pulled far, springs back (the rank-long bar with pegs per notch; each skill-up yanks the thin hide far ahead, then it springs back) ----------
// ---------- round 93 (2026-11-16): LOCKED base: Pegged out as on Skinning ("definitely A"), on Leatherworking's bar counted to the next recipe (round 92 B, `LWB92`: ~1/5 of the bar per skill-up).
// The add-ons the user picked (round 91), now on every skill-up (each one pegs a big step): B Mallet taps, C Tension shiver, D Scraps trimmed off, E Stretched hide sheen ----------
// this run's skill-ups on the recipe bar: t since it landed, a = the last pegs, b = the new pegs
// ---------- round 94 (2026-11-16): the user likes 93 B (mallet) and D (scraps trimmed); the mallet "doesn't look too good". Four mallet treatments, each with the scraps:
// A Rawhide mallet (drawn properly, swings from the wrist, motion trail), B Silhouette mallet, C Strike only (no mallet), D One big blow (both pegs at once) ----------
// the mallet in pivot coords: handle along -x, the head's axis vertical, its face at +y; style 'raw' | 'sil'; k = size
// ---------- round 95 (2026-11-16): Leatherworking LOCKED skill-up (94 C: Pegged out on the recipe bar, strike streaks set the pegs, scraps trimmed). The finale (reaching the next recipe),
// the two the user picked from the pitch: A Strike cascade, B Pegs pop, hide rolls up. Both start after the last skill-up's strikes and scraps (F0 = .8 s after the bar fills) ----------
// a strike streak arcing down (sy -1) or up (sy 1) onto (x, y); u 0..1.6 its life; k size
// ---------- round 96 (2026-11-16): the finale, "mix A and B" (Strike cascade + Pegs pop, hide rolls up): A Cascade, then roll; B One sweep (the strikes knock the pegs out just ahead of the roll) ----------
// one shared shape: roll from R0 for D seconds, hop at R0+D+.05 for .4 s
// ---------- round 97 (2026-11-16): Leatherworking's look is LOCKED (Pegged out on the recipe bar, strike streaks set the pegs, scraps trimmed; finale One sweep). Its sound, four sets.
// Each set: taut (the hide pulls to the new front), strike (each peg; n 0 top, 1 bottom), scraps, ftok (each peg knocked out in the finale), big (the last streak on the icon), pay (the icon lights).
// Sound fatigue: gentle, low, notes varied from a scale, repeats step down (fat45 by skill-up index); the finale plays in full ----------
// ---------- round 98 (2026-11-17): Alchemy, the base (pitched first; no tube boiling over, no cork: the craft ring owns those). The bar counts to the next recipe (each skill-up 1/5),
// the finale plays when it fills (a rank-up celebration is a later item). The five the user picked: A Herbs dissolve, B Lead to gold, C Titration flash, D Layers settle, E Grind powder ----------
// this run's skill-ups: t = seconds since it landed (negative while it comes in), a = the front before, b = after
// ---------- round 104 (2026-11-17): Alchemy, base = 103 E Big herb on stage (A); six new whole scenes from the brainstorm: B Alembic drip, C Mortar pour, D Balance pan, E Herb press,
// F Stirred in, G Ladle pour. The user's scale worry ("incremental like Fishing/Mining, what about 50+ points to the next unlock?"): the bar always counts the points to the next unlock,
// so a gap switch (5 / 15 / 50 points) shows each scene with big and small steps; the potion's color steps every fifth of the gap (white flash every point) ----------
// ---------- round 111 (2026-11-17): the bar IS the object ("you keep not doing anything with the bar"; only the Bottle shelf was unique). A new barModule mode 'X' (no track, no
// notches, no border: the scene draws the whole bar). Picked from a brainstorm: A Shelf to cabinet, B Vial rack, C Ingredient jars, D Recipe scroll, E Setting up the lab,
// F Cascade of bulbs. The bar is N objects (N = the gap, max 15; with a long gap each object holds a few points and fills part by part). Finales later ----------
// ---------- round 113 (2026-11-17): the bottles win ("A is the best"; "slime came out pretty good"). A Clean shelf: the shelf tidied to read like a skill-up bar, finale the doors close
// and the bottles blow up behind them (the user's idea). B-D: bottles on a workbench like 111 E's lab, each with its own funny finale: B Packed in a crate, C Test subject (the slime
// drinks one), D Chain pop. Finales play when the bar fills (pick "Reaching the next unlock", or Five in a row with the 5-point gap) ----------
// the bottles on the workbench (B-D): drop in with a bounce and dust, ghosts for the rest
// ---------- round 114 (2026-11-17): "A is nice; explore D more: a dramatic chain reaction with fizzles, pops and spraying liquid, like Mining's chain of blasts". The user's idea is B:
// all bottles fizzle and shake, the tops pop left to right in a "trrrink", the liquid sprays up like a shaken soda can. C Knock-on chain (each spray sets off the next, faster and faster),
// D Pressure burst (pressure builds, a hush, then they all burst from the middle outward). The tops are the bottles' gold seals (the craft ring owns the cork pop). A = 113 A as it was ----------
// ---------- round 115 (2026-11-17): add-ons on the locked look (bench of bottles + fizz, pop, spray). Picked per skill-up: Neighbor clink, Seal stamped on, Label slapped on; and "add-ons to
// the finale too". One of each per option: A as locked; B Neighbor clink + the spray rains back down; C Seal stamped on + seals fly off as gold confetti; D Label slapped on + labels blow
// off and the spray arcs into the recipe icon ----------
// ---------- round 116 (2026-11-17): add-ons LOCKED = 115 B (neighbor clink + rain back; "the sound is a little much", later). More finale add-ons, picked: Bottles hop (during the fizz build-up),
// Domino tip-over (after the eruption). A as is, B + hop, C + domino, D + both ----------
// ---------- round 117 (2026-11-17): Alchemy's look LOCKED (116 A: the bench of bottles, neighbor clink, fizz/pop/spray finale, rain back). The sound, toned down ("a little much"): four sets.
// Each: land (the bottle on the bench), clink (it bumps its neighbor), fizz (the build-up), pop (each seal, k left to right), spray, rain (a few drops), pay (the icon lights).
// Sound fatigue: soft, lower, notes from the scale, repeats step down (fat45); the finale fuller but still gentle ----------

// Moved out 2026-11-18 (Tailoring locked: clothesline + gust and fold): TL118 B-E (cloth bolt, pincushion, ironing board, loom), round 118's option list, cloth120/table120, FN120 A2/B1/B2.
  B: { name: 'Cloth bolt unrolls', desc: 'A bolt of cloth sits on a long cutting table. Each point the bolt rolls forward, laying the cloth out behind it (the bolt gets thinner as the cloth runs out), and a quick chalk stroke marks the new length with a puff of chalk dust.',
    draw(I, y, t, G, o) { wood111(I.x0 - 8, y + 5, I.x1 - I.x0 + 16, 5); ctx.fillStyle = '#4a2c14'; ctx.fillRect(I.x0 - 4, y + 10, 4, 5); ctx.fillRect(I.x1, y + 10, 4, 5);
      const tip = Math.max(I.x0, I.tipX), f = clamp((I.v - I.lo) / Math.max(1, S.nx.lv - I.lo)), r = 8.5 - 3.5 * f, c = '#5a7ac8';
      if (tip > I.x0) { const g = ctx.createLinearGradient(0, y + 1, 0, y + 5); g.addColorStop(0, '#7a9ae0'); g.addColorStop(1, '#3a5aa0'); ctx.fillStyle = g; ctx.fillRect(I.x0 - 4, y + 1, tip - I.x0 + 4, 4); ctx.fillStyle = 'rgba(255,255,255,.18)'; for (let x = I.x0; x < tip; x += 6) ctx.fillRect(x, y + 1, 1, 4); }
      for (let k = 1; k < G.N; k++) { const x = I.X(I.lo + k * G.per); if (x <= tip - 1) { ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillRect(x - .5, y + .5, 1, 5); } }
      const cy = y + 5 - r, ang = (tip - I.x0) / r; ctx.save(); ctx.translate(tip, cy); const rg = ctx.createRadialGradient(-r * .3, -r * .3, .5, 0, 0, r); rg.addColorStop(0, '#9ab8f0'); rg.addColorStop(1, '#2a4a8a'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(20,30,60,.5)'; ctx.lineWidth = .8; for (let q = 1; q < 3; q++) { ctx.beginPath(); ctx.arc(0, 0, r * q / 3, 0, 7); ctx.stroke(); } ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.moveTo(Math.cos(ang) * r * .7, Math.sin(ang) * r * .7); ctx.lineTo(-Math.cos(ang) * r * .7, -Math.sin(ang) * r * .7); ctx.stroke();
      ctx.fillStyle = '#c8a46a'; ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, 7); ctx.fill(); ctx.restore();
      if (o && o.t >= .4 && o.t < .7) { const u = (o.t - .4) / .3; ctx.strokeStyle = `rgba(255,255,255,${.9 * (1 - u)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(o.b - 4 + u * 4, y - 3); ctx.lineTo(o.b - 4 + u * 4 + 3, y + 6); ctx.stroke(); }
      if (o && o.t >= .45) once('t8b' + o.i, () => { for (let q = 0; q < 4; q++) spawn({ x: o.b, y: y + 2, vx: (Math.random() - .5) * 20, vy: -10 - Math.random() * 10, g: 10, life: .5, size: 1.2, col: 'rgba(255,255,255,.6)' }); }); },
    snd(o, v, n) { if (o.t >= 0) once('t8bs' + o.i, () => noise(0, .35, .003 * v, 700, .7, 'lowpass')); if (o.t >= .45) once('t8bt' + o.i, () => noise(0, .08, .002 * v, 2500, 1.5, 'bandpass')); } },
C: { name: 'Pincushion', desc: 'New: the bar is a long stuffed pincushion (soft red fabric, seams). Each point a pin with a colored glass head drops in at an angle and pokes into the cushion with a little dent and a puff of fluff; with a long gap the next points push the same pin deeper. The row of pins is your progress.',
draw(I, y, t, G, o) { const g = ctx.createLinearGradient(0, y - 7, 0, y + 7); g.addColorStop(0, '#e86a6a'); g.addColorStop(1, '#8a1e2a'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(I.x0 - 6, y - 6, I.x1 - I.x0 + 12, 13, 6.5); ctx.fill();
ctx.strokeStyle = 'rgba(60,10,16,.45)'; ctx.lineWidth = 1; for (let k = 1; k < 6; k++) { const x = lerp(I.x0 - 6, I.x1 + 6, k / 6); ctx.beginPath(); ctx.moveTo(x, y - 5.5); ctx.lineTo(x, y + 6); ctx.stroke(); } ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(I.x0, y - 4.5, I.x1 - I.x0, 1.5);
const kc = o ? G.kOf(S.v0 + o.i) : -1, first = o && G.first(S.v0 + o.i);
for (let k = 0; k < G.N; k++) { const fr = G.fr(k), falling = first && k === kc && o.t < 0 && o.t > -.4; if (fr <= 0 && !falling) continue; const cx = G.sx(k), ang = (k % 3 - 1) * .22, depth = 6 + 4 * Math.min(1, fr); let dy = 0, sq = 0;
if (falling) dy = -26 * (1 - Math.pow((o.t + .4) / .4, 2)); if (first && k === kc && o.t >= 0 && o.t < .2) sq = Math.sin(Math.PI * o.t / .2) * 1.5;
if (!falling) { ctx.fillStyle = 'rgba(60,10,16,.35)'; ctx.beginPath(); ctx.ellipse(cx, y - 5 + sq * .5, 2.2 + sq, 1, 0, 0, 7); ctx.fill(); }
ctx.save(); ctx.translate(cx, y - 5 + dy); ctx.rotate(ang); ctx.strokeStyle = '#d8d8e0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -(16 - depth)); ctx.stroke();
const hg = ctx.createRadialGradient(-.8, -(16 - depth) - .8, .3, 0, -(16 - depth), 2.6); hg.addColorStop(0, '#ffffff'); hg.addColorStop(1, CLR118[k % 8]); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, -(16 - depth), 2.6, 0, 7); ctx.fill(); ctx.restore(); }
if (first && o.t >= 0) once('t9c' + o.i, () => { for (let q = 0; q < 4; q++) spawn({ x: G.sx(kc), y: y - 5, vx: (Math.random() - .5) * 24, vy: -12 - Math.random() * 10, g: 20, life: .5, size: 1.2, col: 'rgba(255,230,230,.7)' }); }); },
snd(o, v, n) { if (o.t >= 0) once('t9cs' + o.i, () => { tone(1568 * semi(n), 0, .003 * v, .05, 'triangle'); noise(.01, .08, .002 * v, 600, .8, 'lowpass', true); }); } },
D: { name: 'Ironing board', desc: 'New: the bar is an ironing board with a crumpled cloth on it: creased and dull ahead, pressed smooth and bright behind. Each point the iron glides forward to the new length with a soft puff of steam from its nose, a light sheen sliding along the freshly pressed cloth behind it.',
draw(I, y, t, G, o) { ctx.fillStyle = '#3a3a44'; ctx.beginPath(); ctx.moveTo(I.x0 - 8, y - 5); ctx.lineTo(I.x1 + 2, y - 5); ctx.quadraticCurveTo(I.x1 + 12, y, I.x1 + 2, y + 6); ctx.lineTo(I.x0 - 8, y + 6); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#5a5a66'; ctx.fillRect(I.x0 + 10, y + 6, 3, 8); ctx.fillRect(I.x1 - 14, y + 6, 3, 8);
const tip = Math.max(I.x0, I.tipX); ctx.fillStyle = '#7a6aa8'; ctx.fillRect(tip, y - 4, I.x1 - tip, 9); ctx.strokeStyle = 'rgba(30,20,60,.55)'; ctx.lineWidth = 1; for (let x = tip + 2; x < I.x1 - 2; x += 7) { const s = rnd53(x) > .5 ? 1 : -1; ctx.beginPath(); ctx.moveTo(x, y - 3); ctx.lineTo(x + 4 * s, y + 4); ctx.stroke(); }
if (tip > I.x0) { const g = ctx.createLinearGradient(0, y - 4, 0, y + 5); g.addColorStop(0, '#c8b8f8'); g.addColorStop(1, '#8a7ac8'); ctx.fillStyle = g; ctx.fillRect(I.x0 - 4, y - 4, tip - I.x0 + 4, 9); const sx = I.x0 + ((t * 40) % (I.x1 - I.x0 + 40)) - 20; if (sx < tip) { const sg = ctx.createLinearGradient(sx - 10, 0, sx + 10, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.4)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 10, y - 4, Math.min(20, tip - sx + 10), 9); } }
const ix = tip; ctx.fillStyle = '#c8ccd8'; ctx.beginPath(); ctx.moveTo(ix - 14, y - 4); ctx.lineTo(ix + 4, y - 4); ctx.quadraticCurveTo(ix + 9, y - 4.5, ix + 6, y - 9); ctx.lineTo(ix - 12, y - 9); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#8a8ea0'; ctx.fillRect(ix - 14, y - 5, 18, 1.5);
ctx.strokeStyle = '#5a3a2a'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ix - 9, y - 9); ctx.quadraticCurveTo(ix - 4, y - 15, ix + 2, y - 9); ctx.stroke(); ctx.lineCap = 'butt';
if (o && o.t > -.05 && o.t < .7) { const u = (o.t + .05) / .75; for (let q = 0; q < 3; q++) { const k = clamp(u * 1.3 - q * .15); if (k <= 0 || k >= 1) continue; ctx.fillStyle = `rgba(240,240,250,${.45 * (1 - k)})`; ctx.beginPath(); ctx.arc(ix + 8 + k * 6 + q * 2, y - 8 - k * 12, 2 + k * 4, 0, 7); ctx.fill(); } } },
snd(o, v, n) { if (o.t >= 0) once('t9ds' + o.i, () => { noise(0, .45, .002 * v, 500, .7, 'lowpass'); noise(.05, .3, .0012 * v, 1200, .8, 'lowpass'); }); } },
  E: { name: 'Loom weaving', desc: 'The bar is a small wooden loom: threads stretched along it, the woven cloth growing from the left. Each point the shuttle shoots across the threads at the front, leaving a new band of colored weave, and the beater bar taps it tight with a soft thud.',
    draw(I, y, t, G, o) { const top = y - 10, bot = y + 8; [I.x0 - 7, I.x1 + 7].forEach(x => wood111(x - 2, top - 3, 4, bot - top + 6, '#a8763e', '#5a3a1e')); wood111(I.x0 - 7, top - 3, I.x1 - I.x0 + 14, 2.5); wood111(I.x0 - 7, bot + .5, I.x1 - I.x0 + 14, 2.5);
      ctx.fillStyle = 'rgba(230,220,200,.35)'; for (let yy = top + 1; yy < bot; yy += 2.6) ctx.fillRect(I.x0 - 5, yy, I.x1 - I.x0 + 10, .6);
      const tip = I.tipX; for (let k = 0; k < G.N; k++) { const a = I.X(I.lo + k * G.per), b = Math.min(I.X(I.lo + (k + 1) * G.per), tip); if (b <= a) break; const c = CLR118[k % 8]; ctx.fillStyle = c; ctx.fillRect(a, top, b - a, bot - top);
        ctx.fillStyle = 'rgba(0,0,0,.22)'; for (let yy = top, r = 0; yy < bot; yy += 2.6, r++) for (let x = a + (r % 2) * 1.5; x < b; x += 3) ctx.fillRect(x, yy, 1.5, 1.3); }
      if (o && o.t > -.3 && o.t < .05) { const u = (o.t + .3) / .3, sy = lerp(top - 6, bot + 4, u), x = o.a + 3; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, sy - 10); ctx.lineTo(x, sy); ctx.stroke(); ctx.save(); ctx.translate(x, sy); ctx.fillStyle = '#c8955a'; ctx.beginPath(); ctx.ellipse(0, 0, 2, 5, 0, 0, 7); ctx.fill(); ctx.restore(); }
      const bx = o && o.t >= 0 && o.t < .5 ? lerp(o.b + 5, I.tipX + 1, Math.sin(Math.PI * clamp(o.t / .5))) : I.tipX + 3; ctx.fillStyle = '#7a5230'; ctx.fillRect(bx, top - 2, 2, bot - top + 4); },
    snd(o, v, n) { if (o.t >= -.3) once('t8es' + o.i, () => noise(0, .2, .002 * v, 1800, 1, 'bandpass')); if (o.t >= .2) once('t8et' + o.i, () => drum46(120 * semi(n / 2), 0, .008 * v)); } },
Object.assign(FAM, { PA: r118('A'), PB: r118('B'), PC: r118('C'), PD: r118('D'), PE: r118('E') }); delete FAM.PF; delete FAM.PG; delete FAM.PH;
function cloth120(I, y, x0, x1, al = 1) { if (x1 <= x0) return; ctx.save(); ctx.globalAlpha *= al; const g = ctx.createLinearGradient(0, y + 1, 0, y + 5); g.addColorStop(0, '#7a9ae0'); g.addColorStop(1, '#3a5aa0'); ctx.fillStyle = g; ctx.fillRect(x0, y + 1, x1 - x0, 4); ctx.fillStyle = 'rgba(255,255,255,.18)'; for (let x = x0; x < x1; x += 6) ctx.fillRect(x, y + 1, 1, 4); ctx.restore(); }
function table120(I, y) { wood111(I.x0 - 8, y + 5, I.x1 - I.x0 + 16, 5); ctx.fillStyle = '#4a2c14'; ctx.fillRect(I.x0 - 4, y + 10, 4, 5); ctx.fillRect(I.x1, y + 10, 4, 5); }
  A2: { base: 'A', name: 'Clothesline: pegs pop into a basket', finAt: 2.1, desc: 'Finale: a long wicker basket slides in under the line; the pegs pop off one after another, left to right (a quick run of wooden ticks climbing up), each garment dropping into the basket; then the full basket hops into the recipe icon.',
    fin(I, y, G, ts) { posts120(I, y); const sz = Math.min(15, G.sw * .95), bin = eOut(clamp(ts / .35)), hop = clamp((ts - 1.65) / .45), ux = I.x1 + 18, bx0 = I.x0 - 4, bx1 = I.x1 + 4, by = y + 5;
      for (let k = 0; k < G.N; k++) { const cx = G.sx(k), ly = line120(I, y, cx), p = .5 + k * .06, u = clamp((ts - p) / .28); if (ts < p) { const a = Math.sin(ts * 1.6 + k) * .06; ctx.save(); ctx.translate(cx, ly); ctx.rotate(a); emo98(WEAR118[k % 8], 0, sz * .52, sz, 0, 1); ctx.restore(); ctx.fillStyle = '#c89a5a'; ctx.fillRect(cx - 3.5, ly - 2.5, 1.6, 4.5); ctx.fillRect(cx + 2, ly - 2.5, 1.6, 4.5); continue; }
        once('f0b' + k, () => [-1, 1].forEach(s => spawn({ x: cx + s * 3, y: ly, vx: s * 30, vy: -60 - Math.random() * 20, g: 300, life: .5, size: 1.2, shape: 'sq', vr: 15, col: '#c89a5a' }))); if (u < 1 && hop <= 0) emo98(WEAR118[k % 8], cx, lerp(ly + sz * .52, by - 1, u * u), sz * (1 - u * .3), u * .5, 1 - u * .6); }
      if (hop >= 1) return; const sc = 1 - hop * .75, cx = lerp((bx0 + bx1) / 2, ux, eOut(hop)), cy = lerp(by + 3 + (1 - bin) * 20, y, hop) - Math.sin(Math.PI * hop) * 18, w = (bx1 - bx0) * sc, h = 8 * sc; ctx.save(); ctx.globalAlpha *= bin;
      ctx.fillStyle = '#b8864a'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 3 * sc); ctx.fill(); ctx.strokeStyle = 'rgba(90,56,24,.6)'; ctx.lineWidth = 1; for (let x = cx - w / 2 + 3; x < cx + w / 2; x += 4) { ctx.beginPath(); ctx.moveTo(x, cy - h / 2); ctx.lineTo(x, cy + h / 2); ctx.stroke(); } ctx.fillStyle = '#d8a86a'; ctx.fillRect(cx - w / 2, cy - h / 2, w, 1.5 * sc); ctx.restore(); },
    fsnd(ts, N) { if (ts >= 0) once('f1a', () => noise(0, .3, .002, 800, .7, 'lowpass')); for (let k = 0; k < N; k++) if (ts >= .5 + k * .06) once('f1p' + k, () => tone(523 * semi(PENT42[k % 10]), 0, .004, .05, 'triangle')); if (ts >= 1.65) once('f1h', () => { drum46(120, 0, .008); tone(392, .05, .005, .2, 'sine', 523); }); } },
  B1: { base: 'B', name: 'Cloth bolt: snip and fold', finAt: 2.0, desc: 'Finale: a bright scissor glint runs along the cloth from the bolt back to the start, leaving a crisp cut; the cloth folds over on itself twice (into thirds, a soft flip each time), and the folded bundle hops into the recipe icon.',
    fin(I, y, G, ts) { table120(I, y); const L = I.x1 - I.x0, cut = clamp((ts - .1) / .55), f1 = clamp((ts - .8) / .25), f2 = clamp((ts - 1.1) / .25), hop = clamp((ts - 1.5) / .45), ux = I.x1 + 18;
      if (hop >= 1) return; if (hop > 0) { const w = L / 3 * (1 - hop * .7), x = lerp(I.x0 + L / 6, ux, eOut(hop)), yy = lerp(y + 2, y, hop) - Math.sin(Math.PI * hop) * 16; for (let s = 0; s < 3; s++) cloth120(I, yy - 4 - s * 1.6 * (1 - hop * .5), x - w / 2, x + w / 2); return; }
      const right = I.x0 + L * (1 - f1 / 3 - f2 / 3); cloth120(I, y, I.x0 - 4, right); if (f1 > 0 && f1 < 1) { const hx = I.x0 + L * 2 / 3, w = L / 3 * Math.cos(Math.PI * f1); cloth120(I, y - 2 - Math.sin(Math.PI * f1) * 6, hx - Math.max(0, -w), hx + Math.max(0, w), .9); }
      if (f2 > 0 && f2 < 1) { const hx = I.x0 + L / 3, w = L / 3 * Math.cos(Math.PI * f2); cloth120(I, y - 3.5 - Math.sin(Math.PI * f2) * 6, hx - Math.max(0, -w), hx + Math.max(0, w), .9); }
      if (f1 >= 1) cloth120(I, y - 1.6, I.x0 - 4, right); if (f2 >= 1) cloth120(I, y - 3.2, I.x0 - 4, right);
      if (cut > 0 && cut < 1) { const x = lerp(I.x1, I.x0, cut); ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 6; star4(x, y + 1, 3, ts * 8); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + 1); ctx.lineTo(I.x1, y + 1); ctx.stroke(); } },
    fsnd(ts) { if (ts >= .1) once('f2s', () => { for (let q = 0; q < 6; q++) noise(q * .09, .05, .0018, 3000, 2, 'bandpass'); }); if (ts >= .8) once('f2f1', () => noise(0, .2, .0025, 700, .7, 'lowpass')); if (ts >= 1.1) once('f2f2', () => noise(0, .2, .0025, 650, .7, 'lowpass')); if (ts >= 1.5) once('f2h', () => tone(392, 0, .006, .2, 'sine', 523)); } },
  B2: { base: 'B', name: 'Cloth bolt: twirl into the garment', finAt: 2.0, desc: 'Finale: the laid-out cloth lifts off the table, gathers toward the middle and twirls up in a spiral, sparkling, and becomes the recipe’s garment, which flies into the recipe icon.',
    fin(I, y, G, ts) { table120(I, y); const L = I.x1 - I.x0, lift = clamp(ts / .35), gath = clamp((ts - .35) / .7), into = clamp((ts - 1.3) / .45), cx = (I.x0 + I.x1) / 2, ux = I.x1 + 18, e = S.nx.emo;
      if (into <= 0) { const w = L * (1 - gath * .92), yy = y - lift * 8 - gath * 10, rot = gath * gath * 9; ctx.save(); ctx.translate(cx, yy + 3); ctx.rotate(rot); ctx.translate(-cx, -(yy + 3)); cloth120(I, yy, cx - w / 2, cx + w / 2, 1); ctx.restore();
        if (gath > .3) once('f3sp', () => { for (let q = 0; q < 8; q++) spawn({ x: cx + (Math.random() - .5) * 20, y: y - 14, vx: (Math.random() - .5) * 40, vy: -20 - Math.random() * 30, g: 20, life: .7, size: 2.2, shape: 'star', col: q % 2 ? '#c8d8ff' : '#ffffff' }); }); return; }
      if (into >= 1) return; emo98(e, lerp(cx, ux, eOut(into)), lerp(y - 15, y, into) - Math.sin(Math.PI * into) * 10, 16 + 6 * Math.sin(Math.PI * into), 0, 1); },
    fsnd(ts) { if (ts >= 0) once('f3a', () => noise(0, .9, .0025, 900, .7, 'lowpass')); if (ts >= .7) once('f3b', () => [0, 4, 7, 12].forEach((s, q) => tone(784 * semi(s), q * .08, .003, .3, 'sine'))); if (ts >= 1.3) once('f3c', () => tone(523, 0, .006, .25, 'sine', 784)); } },

// Round 123 (Wooden pegs + music-box endings; the user: 'never mind, leave it as it was'), moved out 2026-11-18.
// ---------- round 123 (2026-11-18): sound "A but I like the final trill of music box": A Wooden pegs + the music-box close; B Wooden pegs + the music-box fold run and close ----------
SET122.E = Object.assign({}, SET122.A, { name: 'Wooden pegs + music-box close', pay: SET122.C.pay, desc: 'Wooden pegs throughout (soft swish, two light wooden clicks, a low hum for the dip; wind, cloth pats, wooden taps for the folds); the recipe lights with the music box’s soft three-note close.' });
SET122.F = Object.assign({}, SET122.A, { name: 'Wooden pegs + music-box run and close', fold: SET122.C.fold, hop: SET122.C.hop, pay: SET122.C.pay, desc: 'Wooden pegs for every skill-up and the wind; the folds play as a music-box run up the scale, the stack hop a soft music-box note, then the music box’s three-note close.' });
{ const a = r122('E'), b = r122('F'); Object.assign(FAM, { PA: { get name() { return 'A. ' + SET122.E.name; }, get desc() { return a.desc; }, get note() { return a.note; }, draw: t => a.draw(t) }, PB: { get name() { return 'B. ' + SET122.F.name; }, get desc() { return b.desc; }, get note() { return b.note; }, draw: t => b.draw(t) } }); delete FAM.PC; delete FAM.PD; }
setTimeout(() => { const x = [...document.querySelectorAll('button')].find(z => z.textContent.includes('Reaching')); if (x) x.click(); }, 220);
