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
