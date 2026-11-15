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
