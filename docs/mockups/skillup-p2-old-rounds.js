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
