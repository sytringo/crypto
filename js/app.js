import { NODE, FLOW, KINDS, LEDGERS, LAYERS } from './data.js?v=20261002-clean-links';
import { MapView } from './map.js?v=20261002-clean-links';
import { CHAPTERS } from './chapters.js?v=20261002-clean-links';

const $ = (s) => document.querySelector(s);
const STEP_SECONDS = 3.8;
const LAYER = Object.fromEntries(LAYERS.map((l) => [l.id, l]));
const ICON = {
  prev: '<svg viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 16 16"><path d="M4 2.5v11l9.5-5.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 16 16"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>',
  again: '<svg viewBox="0 0 16 16"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v3h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

class App {
  constructor() {
    this.state = { flow: 'buy', step: 0, t: 0, playing: false, layer: null, sel: null, case: null };
    this.chapter = null;
    this.view = {};
    this.lastStep = -1;
  }

  init() {
    this.map = new MapView($('#stage'), {
      onPick: (id) => this.select(id),
      onHover: (id, el) => this.hover(id, el),
      onLayer: (id) => this.selectLayer(id),
    });
    this.buildDock();
    window.addEventListener('hashchange', () => this.route());
    this.route();
    this.map.layout();
    setTimeout(() => $('#app').classList.remove('loading'), 450);
    this.last = performance.now();
    this.clock = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.frame(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    window.__app = this;
  }

  // ------------------------------------------------------------ routing
  buildDock() {
    const dock = $('#dock');
    for (const ch of CHAPTERS) {
      const b = document.createElement('button');
      b.dataset.id = ch.id;
      if (ch.id === 'home') {
        b.className = 'home';
        b.setAttribute('aria-label', '首页');
        b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5V20h-5v-5.5H9V20H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
      } else {
        b.innerHTML = `<i></i><b>${ch.title}</b><small>${ch.sub}</small>`;
      }
      b.addEventListener('click', () => { location.hash = ch.id; });
      dock.appendChild(b);
    }
  }
  route() {
    const [id, arg] = location.hash.slice(1).split('/');
    const ch = CHAPTERS.find((c) => c.id === id) || CHAPTERS[0];
    this.chapter = ch;
    if (!ch.ledger) this.stop();
    if (ch.enter) ch.enter(this, arg);
    this.hover(null);
    for (const b of $('#dock').children) b.classList.toggle('on', b.dataset.id === ch.id);
    const on = $('#dock').querySelector('.on');
    if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    this.refresh(true);
    $('#story').scrollTop = 0;
  }

  // ------------------------------------------------------------ actions
  select(id) {
    this.state.sel = id;
    if (this.chapter.id !== 'players') { location.hash = `players/${id}`; return; }
    this.refresh(true);
    $('#story').scrollTop = 0;
  }
  selectLayer(id) {
    if (this.chapter.id !== 'layers' || !LAYER[id]) return;
    this.state.layer = id;
    this.hover(null);
    this.refresh(true);
    $('#story').scrollTop = 0;
  }
  setFlow(id, play = true) {
    Object.assign(this.state, { flow: id, step: 0, t: 0, playing: play, touched: true });
    this.lastStep = -1;
  }
  stop() { this.state.playing = false; }
  goStep(i) {
    const n = FLOW[this.state.flow].steps.length;
    this.state.step = Math.max(0, Math.min(n - 1, i));
    this.state.t = 0;
    this.refresh();
  }
  togglePlay() {
    const n = FLOW[this.state.flow].steps.length;
    if (!this.state.playing && this.state.step === n - 1 && this.state.t >= 1) { this.state.step = 0; this.state.t = 0; this.lastStep = -1; }
    this.state.playing = !this.state.playing;
    this.refresh();
  }

  // ------------------------------------------------------------ frame
  frame(dt) {
    this.clock += dt;
    const s = this.state;
    if (this.view.flow) {
      const n = FLOW[s.flow].steps.length, was = s.t;
      s.t = Math.min(1, s.t + dt / STEP_SECONDS);
      if (!s.playing && was < 1 && s.t >= 1 && s.step === n - 1) this.refresh(); // offer "replay"
      if (s.playing && s.t >= 1) {
        if (s.step < n - 1) { s.step++; s.t = 0; } else s.playing = false;
        this.refresh();
      }
      this.view.flow.t = s.t;
    }
    this.map.frame(dt, this.clock);
  }

  // ------------------------------------------------------------ panels
  refresh(full = false) {
    const ch = this.chapter;
    this.view = ch.view ? ch.view(this) : {};
    this.map.setView(this.view);
    this.renderControls(ch.controls ? ch.controls(this) : []);
    this.renderStats(ch.stats ? ch.stats(this) : []);
    const story = $('#story');
    story.innerHTML = ch.story ? ch.story(this) : '';
    story.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { location.hash = b.dataset.go; }));
    story.querySelectorAll('[data-node]').forEach((b) => b.addEventListener('click', () => this.select(b.dataset.node)));
    story.querySelectorAll('[data-flow]').forEach((b) => b.addEventListener('click', () => { location.hash = `flows/${b.dataset.flow}`; }));
    story.querySelectorAll('[data-layer]').forEach((b) => b.addEventListener('click', () => { this.state.layer = b.dataset.layer; this.refresh(true); story.scrollTop = 0; }));
    if (!full && this.view.flow) story.scrollTop = 0;
    const showLedger = typeof ch.ledger === 'function' ? ch.ledger(this) : !!ch.ledger;
    $('#ledgerCard').hidden = !showLedger;
    if (showLedger) this.renderLedger();
    $('#hint').innerHTML = ch.hint ? ch.hint(this) : '';
  }

  renderControls(specs) {
    const root = $('#controls');
    root.innerHTML = '';
    for (const c of specs) {
      const wrap = document.createElement('div');
      wrap.className = 'ctl';
      if (c.label) wrap.innerHTML = `<div class="ctl-label"><span>${c.label}</span></div>`;
      if (c.type === 'seg') {
        const seg = document.createElement('div');
        seg.className = 'seg' + (c.presets ? ' presets' : '') + (c.two ? ' two' : '') + (c.compact ? ' compact' : '');
        for (const o of c.options) {
          const b = document.createElement('button');
          b.type = 'button';
          if (o.v === c.value) b.className = 'on';
          if (o.color) {
            b.classList.add('layer-option');
            b.style.setProperty('--c', o.color);
          }
          if (o.sub) b.title = o.sub;
          b.innerHTML = c.presets ? `<span>${o.text}</span><small>${o.sub}</small>` : `${o.color ? `<i style="--c:${o.color}"></i>` : ''}${o.text}`;
          b.setAttribute('aria-pressed', o.v === c.value);
          b.addEventListener('click', () => c.onChange(o.v));
          seg.appendChild(b);
        }
        wrap.appendChild(seg);
      } else if (c.type === 'player') {
        const s = this.state, n = c.n;
        const atEnd = s.step === n - 1 && !s.playing && s.t >= 1;
        const row = document.createElement('div');
        row.className = 'player';
        row.innerHTML = `<button type="button" data-a="prev" aria-label="上一步" ${s.step === 0 ? 'disabled' : ''}>${ICON.prev}</button>
          <button type="button" class="main" data-a="play">${s.playing ? `${ICON.pause}暂停` : atEnd ? `${ICON.again}重播` : `${ICON.play}播放`}</button>
          <button type="button" data-a="next" ${s.step === n - 1 ? 'disabled' : ''}>下一步${ICON.next}</button>`;
        row.querySelector('[data-a=prev]').addEventListener('click', () => { s.playing = false; this.goStep(s.step - 1); });
        row.querySelector('[data-a=next]').addEventListener('click', () => { s.playing = false; this.goStep(s.step + 1); });
        row.querySelector('[data-a=play]').addEventListener('click', () => this.togglePlay());
        wrap.appendChild(row);
        const bar = document.createElement('div');
        bar.className = 'steps';
        bar.style.setProperty('--k', KINDS[c.kind].color);
        for (let i = 0; i < n; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = i < s.step ? 'done' : i === s.step ? 'cur' : '';
          b.setAttribute('aria-label', `第 ${i + 1} 步`);
          b.addEventListener('click', () => { s.playing = false; this.goStep(i); });
          bar.appendChild(b);
        }
        wrap.appendChild(bar);
      }
      root.appendChild(wrap);
    }
  }

  renderStats(stats) {
    $('#stats').innerHTML = stats.map((s) => `<div class="stat"><div class="k">${s.k}</div><div class="v ${s.cls || ''}" ${s.style ? `style="${s.style}"` : ''}>${s.v}</div></div>`).join('');
  }

  renderLedger() {
    const f = FLOW[this.state.flow], cur = this.state.step;
    $('#ledgerMeta').textContent = `${f.name} · 第 ${cur + 1} / ${f.steps.length} 笔记录 · 示意`;
    const list = $('#ledgerList');
    list.innerHTML = f.steps.slice(0, cur + 1).map((s, i) => {
      const lg = LEDGERS[s.ledger];
      return `<div class="entry ${i === cur ? 'cur' : ''} ${i === cur && cur !== this.lastStep ? 'new' : ''}" data-i="${i}" title="${lg.desc}">
        <span class="n">${String(i + 1).padStart(2, '0')}</span><span class="lg" style="--c:${lg.color}">${lg.short}</span><span class="rec">${s.rec}</span></div>`;
    }).join('');
    list.querySelectorAll('.entry').forEach((e) => e.addEventListener('click', () => { this.state.playing = false; this.goStep(+e.dataset.i); }));
    list.scrollTop = list.scrollHeight;
    this.lastStep = cur;
    const used = [...new Set(f.steps.map((s) => s.ledger))];
    $('#ledgerLegend').innerHTML = used.map((k) => `<span><i style="background:${LEDGERS[k].color}"></i>${LEDGERS[k].name}</span>`).join('');
  }

  hover(id, el) {
    const pop = $('#pop');
    this.map.previewNode(id);
    if (this.chapter?.id === 'layers') {
      pop.hidden = true;
      $('#hint').textContent = id ? `${NODE[id].name} · 连线表示直接往来 · 点击看详情` : '';
      if (!id) $('#hint').innerHTML = this.chapter.hint(this);
      return;
    }
    if (!id) { pop.hidden = true; return; }
    const n = NODE[id];
    pop.innerHTML = `<h3 style="color:${LAYER[n.layer].color}">${n.name}</h3><div class="en">${n.full}</div><p>${n.role}</p>
      <p class="who"><b>代表：</b>${n.who.slice(0, 3).map((w) => w.replace(/（.*?）/g, '')).join('、')}</p>`;
    pop.hidden = false;
    const st = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect();
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    let x = r.left - st.left + r.width / 2 - pw / 2;
    x = Math.max(8, Math.min(st.width - pw - 8, x));
    let y = r.bottom - st.top + 10;
    if (y + ph > st.height - 8) y = r.top - st.top - ph - 10;
    pop.style.left = x + 'px';
    pop.style.top = Math.max(8, y) + 'px';
  }
}

new App().init();
