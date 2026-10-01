// The map: seven layer bands, one chip per participant, and a canvas underneath
// that draws the links and the moving money.
import { LAYERS, NODES, NODE, LINKS, KINDS } from './data.js?v=20261002-stars';

const LAYER = Object.fromEntries(LAYERS.map((l) => [l.id, l]));
const ROW = Object.fromEntries(LAYERS.map((l, i) => [l.id, i]));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// which kind of thing usually moves along a link, for the ambient animation
function ambientKind(a, b) {
  const L = (id) => NODE[id].layer;
  const off = (id) => ['bank', 'broker', 'pay', 'treasury', 'inst'].includes(id);
  if (off(a) && off(b)) return 'fiat';
  if ([a, b].some((id) => ['stable', 'issuer', 'lending', 'pay', 'ramp'].includes(id))) return 'stable';
  if ([a, b].some((id) => L(id) === 'outer' || id === 'oracle' || id === 'rpc')) return 'info';
  if (off(a) || off(b)) return Math.random() < 0.5 ? 'fiat' : 'claim';
  return 'crypto';
}

export class MapView {
  constructor(stage, { onPick, onHover } = {}) {
    this.stage = stage;
    this.bandsEl = stage.querySelector('#bands');
    this.nodesEl = stage.querySelector('#nodes');
    this.canvas = stage.querySelector('#fx');
    this.ctx = this.canvas.getContext('2d');
    // moving dots, labels and rings go on a canvas above the chips
    this.top = stage.querySelector('#fxTop');
    this.tctx = this.top.getContext('2d');
    this.onPick = onPick;
    this.onHover = onHover;
    this.pos = {};
    this.chips = {};
    this.bands = {};
    this.view = { ambient: true };
    this.amb = [];
    this.spawnT = 0;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.build();
    new ResizeObserver(() => this.layout()).observe(stage);
    if (document.fonts?.ready) document.fonts.ready.then(() => this.layout());
  }

  build() {
    for (const L of LAYERS) {
      const b = document.createElement('div');
      b.className = 'band';
      b.style.setProperty('--c', L.color);
      b.innerHTML = `<div class="lbl"><small>${L.n}</small><b>${L.name}</b><em>${L.en}</em></div>`;
      this.bandsEl.appendChild(b);
      this.bands[L.id] = b;
    }
    for (const n of NODES) {
      const el = document.createElement('button');
      el.className = 'node';
      el.type = 'button';
      el.textContent = n.name;
      el.style.setProperty('--c', LAYER[n.layer].color);
      el.setAttribute('aria-label', `${n.name}：${n.full}`);
      el.addEventListener('click', () => this.onPick && this.onPick(n.id));
      el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && this.onHover) this.onHover(n.id, el); });
      el.addEventListener('pointerleave', () => this.onHover && this.onHover(null));
      el.addEventListener('focus', () => this.onHover && this.onHover(n.id, el));
      el.addEventListener('blur', () => this.onHover && this.onHover(null));
      this.nodesEl.appendChild(el);
      this.chips[n.id] = el;
    }
  }

  layout() {
    const W = this.stage.clientWidth, H = this.stage.clientHeight;
    if (!W || !H) return;
    this.W = W; this.H = H;
    const small = W < 640;
    const lbl = small ? 38 : W < 820 ? 66 : 84;
    this.stage.style.setProperty('--lbl', lbl + 'px');
    const top = small ? 22 : 28, pad = small ? 6 : 12;
    const rowH = (H - top - 4) / LAYERS.length;
    this.rowH = rowH;
    LAYERS.forEach((L, i) => {
      const b = this.bands[L.id];
      b.style.top = top + i * rowH + 'px';
      b.style.height = rowH + 'px';
    });
    const x0 = lbl + pad, x1 = W - pad, avail = x1 - x0, gap = small ? 5 : 10;
    for (const L of LAYERS) {
      const nodes = NODES.filter((n) => n.layer === L.id).sort((a, b) => a.x - b.x);
      const sz = nodes.map((n) => ({ n, w: this.chips[n.id].offsetWidth, h: this.chips[n.id].offsetHeight }));
      const total = sz.reduce((s, q) => s + q.w, 0) + gap * (sz.length - 1);
      let lines = [sz];
      if (total > avail) lines = [sz.filter((_, i) => i % 2 === 0), sz.filter((_, i) => i % 2 === 1)];
      const h = sz[0].h;
      const lineGap = Math.min(10, Math.max(3, rowH - 2 * h - 8) / 2);
      const cy = top + ROW[L.id] * rowH + rowH / 2;
      lines.forEach((line, j) => {
        const y = cy + (j - (lines.length - 1) / 2) * (h + lineGap);
        this.placeLine(line, x0, x1, gap, avail, y);
      });
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const [cv, g] of [[this.canvas, this.ctx], [this.top, this.tctx]]) {
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  placeLine(line, x0, x1, gap, avail, y) {
    const total = line.reduce((s, q) => s + q.w, 0) + gap * (line.length - 1);
    const lefts = [];
    if (total > avail) {
      // does not fit even so: squeeze evenly
      const g = (avail - line.reduce((s, q) => s + q.w, 0)) / Math.max(1, line.length - 1);
      let x = x0;
      for (const q of line) { lefts.push(x); x += q.w + g; }
    } else {
      let prev = x0 - gap;
      for (const q of line) {
        const ideal = x0 + q.n.x * avail - q.w / 2;
        const l = Math.max(ideal, prev + gap, x0);
        lefts.push(l);
        prev = l + q.w;
      }
      let next = x1 + gap;
      for (let i = line.length - 1; i >= 0; i--) {
        const r = Math.min(lefts[i] + line[i].w, next - gap, x1);
        lefts[i] = r - line[i].w;
        next = lefts[i];
      }
    }
    line.forEach((q, i) => {
      const left = Math.round(lefts[i]), topY = Math.round(y - q.h / 2);
      this.chips[q.n.id].style.transform = `translate(${left}px, ${topY}px)`;
      this.pos[q.n.id] = { x: left + q.w / 2, y, w: q.w, h: q.h, left, top: topY };
    });
  }

  // v: { focus:Set|null, sel, bad:Set, layer, links:[[a,b,color]], flow:{steps,cur,t}, ambient }
  setView(v) {
    this.view = v;
    const step = v.flow ? v.flow.steps[v.flow.cur] : null;
    for (const n of NODES) {
      const el = this.chips[n.id];
      const on = !v.focus || v.focus.has(n.id);
      el.classList.toggle('dim', !on);
      el.classList.toggle('on', !!v.focus && on);
      el.classList.toggle('sel', v.sel === n.id);
      el.classList.toggle('bad', !!v.bad && v.bad.has(n.id));
      const isSrc = step && step.from === n.id && step.from !== step.to;
      const isDst = step && step.to === n.id;
      el.classList.toggle('src', !!isSrc);
      el.classList.toggle('dst', !!isDst);
      if (step) el.style.setProperty('--k', KINDS[step.kind].color);
    }
    for (const L of LAYERS) {
      this.bands[L.id].classList.toggle('hi', v.layer === L.id);
      this.bands[L.id].classList.toggle('lo', !!v.layer && v.layer !== L.id);
    }
    if (!v.ambient) this.amb.length = 0;
  }

  // -------------------------------------------------------------- geometry
  curve(a, b) {
    const A = this.pos[a], B = this.pos[b];
    if (!A || !B) return null;
    const p0 = [A.x, A.y], p3 = [B.x, B.y];
    if (Math.abs(A.y - B.y) < this.rowH * 0.45) {
      const dx = B.x - A.x;
      const lift = Math.min(this.rowH * 0.9, Math.abs(dx) * 0.3) + 10;
      const s = A.y <= this.H / 2 ? 1 : -1; // arc away from the middle of the map
      return [p0, [A.x + dx * 0.2, A.y + s * lift], [B.x - dx * 0.2, B.y + s * lift], p3];
    }
    const my = (A.y + B.y) / 2;
    return [p0, [A.x, my], [B.x, my], p3];
  }
  static at(c, t) {
    const u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t;
    return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
  }
  static tangent(c, t) {
    const u = 1 - t;
    const x = 3 * u * u * (c[1][0] - c[0][0]) + 6 * u * t * (c[2][0] - c[1][0]) + 3 * t * t * (c[3][0] - c[2][0]);
    const y = 3 * u * u * (c[1][1] - c[0][1]) + 6 * u * t * (c[2][1] - c[1][1]) + 3 * t * t * (c[3][1] - c[2][1]);
    const l = Math.hypot(x, y) || 1;
    return [x / l, y / l];
  }

  // -------------------------------------------------------------- drawing
  stroke(c, color, alpha, width, dash) {
    const g = this.ctx;
    g.save();
    g.globalAlpha = alpha;
    g.strokeStyle = color;
    g.lineWidth = width;
    g.lineCap = 'round';
    if (dash) g.setLineDash(dash);
    g.beginPath();
    g.moveTo(...c[0]);
    g.bezierCurveTo(...c[1], ...c[2], ...c[3]);
    g.stroke();
    g.restore();
  }
  arrow(c, t, color, alpha, size = 5) {
    const g = this.ctx;
    const [x, y] = MapView.at(c, t), [dx, dy] = MapView.tangent(c, t);
    g.save();
    g.globalAlpha = alpha;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(x + dx * size, y + dy * size);
    g.lineTo(x - dx * size - dy * size * 0.8, y - dy * size + dx * size * 0.8);
    g.lineTo(x - dx * size + dy * size * 0.8, y - dy * size - dx * size * 0.8);
    g.closePath();
    g.fill();
    g.restore();
  }
  sparkle(x, y, r, color, alpha = 1, under = false, glow = true) {
    const g = under ? this.ctx : this.tctx;
    g.save();
    g.globalAlpha = alpha;
    g.shadowColor = color;
    g.shadowBlur = glow ? r * 2.5 : 0;
    g.fillStyle = color;
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4 - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.26;
      const px = x + Math.cos(angle) * radius, py = y + Math.sin(angle) * radius;
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.closePath();
    g.fill();
    if (glow && r >= 4) {
      g.shadowBlur = 0;
      g.fillStyle = '#fffdf8';
      g.beginPath();
      g.arc(x, y, r * 0.17, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
  starTrail(c, color, time, alpha = 0.5, size = 2.8, sparse = false) {
    const distance = Math.hypot(c[3][0] - c[0][0], c[3][1] - c[0][1]);
    const count = sparse ? 3 : clamp(Math.ceil(distance / 26), 4, 24);
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const [x, y] = MapView.at(c, t);
      // Slow, gentle shimmer; reduced-motion mode keeps a steady constellation.
      const shimmer = this.motionQuery.matches ? 1 : 0.78 + 0.22 * Math.sin(time * 1.7 + i * 1.6);
      this.sparkle(x, y, size * shimmer, color, alpha * shimmer, true, !sparse);
    }
  }
  pill(x, y, text, color) {
    const g = this.tctx;
    const small = this.W < 640;
    g.save();
    g.font = `500 ${small ? 10 : 11.5}px "DM Mono", "Noto Sans SC", monospace`;
    const w = g.measureText(text).width + (small ? 10 : 14), h = small ? 17 : 21;
    x = clamp(x - w / 2, 4, this.W - w - 4);
    y = clamp(y - h - 8, 2, this.H - h - 2);
    g.fillStyle = 'rgba(255, 253, 248, 0.97)';
    g.strokeStyle = color;
    g.lineWidth = 1;
    g.beginPath();
    g.roundRect(x, y, w, h, 5);
    g.fill();
    g.stroke();
    g.fillStyle = color;
    g.textBaseline = 'middle';
    g.fillText(text, x + (small ? 5 : 7), y + h / 2 + 0.5);
    g.restore();
  }
  ring(id, color, time) {
    const P = this.pos[id];
    if (!P) return;
    const g = this.tctx;
    for (let k = 0; k < 2; k++) {
      const f = (time * 0.7 + k * 0.5) % 1;
      g.save();
      g.globalAlpha = (1 - f) * 0.7;
      g.strokeStyle = color;
      g.lineWidth = 1.5;
      g.beginPath();
      g.roundRect(P.left - f * 14, P.top - f * 10, P.w + f * 28, P.h + f * 20, 8 + f * 6);
      g.stroke();
      g.restore();
    }
  }

  frame(dt, time) {
    if (!this.W) return;
    const g = this.ctx, v = this.view;
    g.clearRect(0, 0, this.W, this.H);
    this.tctx.clearRect(0, 0, this.W, this.H);

    const visualTime = this.motionQuery.matches ? 0 : time;
    if (v.ambient) this.drawAmbient(this.motionQuery.matches ? 0 : dt, visualTime);

    for (const [a, b, color, alpha] of v.links || []) {
      const c = this.curve(a, b);
      if (c) {
        this.starTrail(c, color || '#42744e', visualTime, alpha ?? 0.5, 3.2);
        const f = (visualTime * 0.25 + (a.length + b.length) * 0.13) % 1;
        const [x, y] = MapView.at(c, f);
        this.sparkle(x, y, 5, color || '#42744e', 0.9, true);
      }
    }

    if (v.flow) this.drawFlow(v.flow, visualTime);
  }

  drawAmbient(dt, time) {
    for (const [a, b] of LINKS) {
      const c = this.curve(a, b);
      if (c) this.starTrail(c, LAYER[NODE[a].layer].color, time, 0.24, 2, true);
    }
    this.spawnT -= dt;
    if (this.spawnT <= 0 && this.amb.length < 14) {
      this.spawnT = 0.28 + Math.random() * 0.3;
      let [a, b] = LINKS[(Math.random() * LINKS.length) | 0];
      if (Math.random() < 0.5) [a, b] = [b, a];
      this.amb.push({ a, b, t: 0, s: 0.25 + Math.random() * 0.25, k: ambientKind(a, b) });
    }
    for (const p of this.amb) {
      p.t += dt * p.s;
      const c = this.curve(p.a, p.b);
      if (!c) continue;
      const col = KINDS[p.k].color;
      const fade = Math.min(1, p.t * 5, (1 - p.t) * 5);
      this.starTrail(c, col, time, 0.3 * fade, 2.4);
      for (let k = 0; k < 4; k++) {
        const t = p.t - k * 0.03;
        if (t < 0) break;
        const [x, y] = MapView.at(c, t);
        this.sparkle(x, y, 5 - k * 0.9, col, fade * (1 - k * 0.22), true);
      }
    }
    this.amb = this.amb.filter((p) => p.t < 1);
  }

  drawFlow(flow, time) {
    const { steps, cur, t } = flow;
    // the trail so far
    for (let i = 0; i < cur; i++) {
      const s = steps[i];
      const col = KINDS[s.kind].color;
      if (s.from === s.to) continue;
      const c = this.curve(s.from, s.to);
      if (!c) continue;
      this.starTrail(c, col, time, 0.38, 2.8);
      this.arrow(c, 0.55, col, 0.45, 4);
    }
    const s = steps[cur];
    if (!s) return;
    const col = KINDS[s.kind].color;
    if (s.from === s.to) {
      this.ring(s.to, col, time);
      const P = this.pos[s.to];
      if (P) this.pill(P.x, P.top, s.amt, col);
      return;
    }
    const c = this.curve(s.from, s.to);
    if (!c) return;
    const travel = this.motionQuery.matches ? 1 : ease(clamp(t / 0.5, 0, 1));
    this.stroke(c, col, 0.12, 1);
    this.starTrail(c, col, time, 0.85, 4.2);
    if (travel < 1) {
      for (let k = 0; k < 6; k++) {
        const tt = travel - k * 0.035;
        if (tt < 0) break;
        const [x, y] = MapView.at(c, tt);
        this.sparkle(x, y, 7.5 - k * 1.1, col, 1 - k * 0.15);
      }
      const [x, y] = MapView.at(c, travel);
      this.pill(x, y, s.amt, col);
    } else {
      // arrived: keep a gentle stream going and park the label mid-way
      for (let k = 0; k < 4; k++) {
        const f = (time * 0.45 + k / 4) % 1;
        const [x, y] = MapView.at(c, f);
        this.sparkle(x, y, 5.8, col, 0.85 * Math.sin(Math.PI * f));
      }
      this.arrow(c, 0.55, col, 0.9, 5.5);
      this.ring(s.to, col, time);
      const [x, y] = MapView.at(c, 0.5);
      this.pill(x, y, s.amt, col);
    }
  }
}
