// Chapters: what each scene highlights on the map, its controls, its numbers and its story.
import { LAYERS, NODES, NODE, FLOWS, FLOW, KINDS, LEDGERS, LINKS } from './data.js';

const LAYER = Object.fromEntries(LAYERS.map((l) => [l.id, l]));
const color = (id) => LAYER[NODE[id].layer].color;
const chip = (id) => `<button class="chip" data-node="${id}" style="--c:${color(id)}"><i></i>${NODE[id].name}</button>`;
const kindsLegend = (ids = Object.keys(KINDS)) =>
  `<div class="kinds">${ids.map((k) => `<span><i style="background:${KINDS[k].color}"></i>${KINDS[k].name}</span>`).join('')}</div>`;
const side = (n) => n.side || (n.x < 0.36 ? '链下' : n.x > 0.62 ? '链上' : '交界');
const flowsWith = (id) => FLOWS.filter((f) => f.steps.some((s) => s.from === id || s.to === id));
const neighbours = (id) => LINKS.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a));

// --------------------------------------------------------------- per-layer text
const LAYER_TEXT = {
  users: `<p>整个产业的钱最终来自这里。<b>散户</b>贡献了大部分手续费；<b>机构</b>在 2024 年现货 ETF 获批后大举进场；<b>风投</b>和<b>项目方</b>在最上游创造新的代币；<b>币股公司</b>则把股市里的钱搬进比特币。</p>
    <p>注意他们的位置：越靠左，越习惯待在法币和证券的世界里；越靠右，越直接和链打交道。</p>`,
  access: `<p>你从哪扇门进来，决定了你“拥有”的究竟是什么。</p>
    <p>走<b>银行</b>和<b>券商</b>，你拿到的是法币存款或 ETF 份额；走<b>出入金服务</b>，你把法币换成币；走<b>自托管钱包</b>，你直接拿着私钥，链上认的就是你。</p>
    <p class="small">银行是整个行业的咽喉：没有银行愿意开户，交易所和稳定币发行方就收不了美元。</p>`,
  cefi: `<p>这一层是一群<b>公司</b>：交易所、托管、做市商、场外交易台、主经纪商、稳定币发行方。它们的共同点是替你<b>保管</b>和<b>记账</b>。</p>
    <p>你在交易所看到的余额，只是它数据库里的数字。这带来速度和便利，也带来了行业里几乎所有的大灾难：Mt. Gox、FTX、Celsius。</p>
    <p><b>稳定币发行方</b>站在正中间的交界线上：一只脚在银行里放着储备，一只脚在链上铸造代币。</p>`,
  defi: `<p>把中介换成<b>智能合约</b>：交易所变成资金池（DEX），银行贷款变成超额抵押的借贷协议，券商的衍生品变成链上永续合约。</p>
    <p>没有开户，没有营业时间，任何人都能用，也没有人能替你撤回一笔签错的交易。</p>
    <p class="small">这些协议背后通常还是有公司（Uniswap Labs、Aave Labs）在开发前端和维护代码，但资金放在合约里，不在公司账上。</p>`,
  assets: `<p>这是“流动的东西”本身。它们都只是区块链上的记录，但性质完全不同：</p>
    <ul><li><b>BTC</b> 没有发行方，没人能冻结它。</li><li><b>ETH、SOL</b> 是公链的燃料，也能质押生息。</li><li><b>稳定币</b>是发行方的负债，背后是银行里的美元和国债。</li><li><b>RWA</b> 是链下资产的“链上影子”，法律产权还在链下。</li><li><b>治理币和 Meme</b> 成千上万，大多数最终归零。</li></ul>`,
  chain: `<p>最底层的<b>账本</b>和维护它的人。比特币靠<b>矿工</b>拼算力记账，以太坊和 Solana 靠<b>验证者</b>押币记账。</p>
    <p>L1 是主账本；<b>L2</b> 在以太坊上面批量处理交易再提交回去；<b>预言机</b>把链外的价格送进来；<b>RPC 服务商</b>让钱包能读写区块链。</p>
    <p class="small">你的钱包里其实没有币。币一直在链上，钱包只保管能动它的私钥。</p>`,
  outer: `<p>不直接经手资金，却决定了资金能往哪里流：</p>
    <ul><li><b>监管</b>发牌照、定规则：美国 GENIUS 法案（2025）、香港稳定币条例（2025 年 8 月生效）和 VATP 交易所牌照、欧盟 MiCA。</li><li><b>链上分析</b>公司把匿名地址和真实身份对上号。</li><li><b>审计</b>核对储备和代码。</li><li><b>数据媒体</b>告诉大家价格和故事。</li><li>还有<b>黑客和灰产</b>，行业安全和合规的最大推手。</li></ul>`,
};

// --------------------------------------------------------------- risk cases
const CASES = [
  { id: 'mtgox', name: 'Mt. Gox', sub: '2014 · 交易所', nodes: ['cex', 'retail'], text: '当时全球最大的比特币交易所，约 85 万枚 BTC 被盗后破产。用户等了十年才拿回部分资产。<b>教训：交易所里的币不是你的币。</b>' },
  { id: 'terra', name: 'Terra / UST', sub: '2022.5 · 算法稳定币', nodes: ['stable', 'lending', 'retail'], text: 'UST 没有美元储备，靠和 LUNA 的兑换机制维持 1 美元。挤兑时机制反向螺旋，几天内数百亿美元蒸发，并直接引爆了下面的连锁倒闭。<b>教训：稳定币“稳”在储备，不在算法。</b>' },
  { id: '3ac', name: '3AC · Celsius', sub: '2022.6 · 借贷连环爆', nodes: ['prime', 'inst', 'lending', 'retail'], text: '对冲基金三箭资本（3AC）高杠杆押注，在 Terra 崩盘后爆仓，向它放贷的 Celsius、Voyager、BlockFi、Genesis 等接连破产，冻结了大批散户的存款。<b>教训：CeFi 借贷是没有存款保险的影子银行。</b>' },
  { id: 'ftx', name: 'FTX', sub: '2022.11 · 挪用客户资产', nodes: ['cex', 'mm', 'bank', 'retail'], text: '当时第二大交易所。客户的钱（有一部分甚至直接汇进了 Alameda 的银行账户）被秘密转给关联做市商 Alameda 去投资和还债，挤兑时约 80 亿美元的窟窿暴露。创始人 SBF 被判 25 年。<b>教训：内部数据库上的余额，要有真实资产对应。</b>之后“储备证明”成了标配。' },
  { id: 'ronin', name: 'Ronin 桥', sub: '2022.3 · 跨链桥', nodes: ['bridge', 'illicit'], text: '游戏链 Ronin 的跨链桥只有 9 个验证者签名，攻击者拿到其中 5 个私钥，盗走约 6 亿美元。<b>跨链桥是链上被盗最多的环节。</b>' },
  { id: 'svb', name: 'USDC × SVB', sub: '2023.3 · 银行挤兑', nodes: ['bank', 'issuer', 'stable'], text: '硅谷银行倒闭，Circle 有 33 亿美元储备困在里面，USDC 一度跌到 0.88 美元，直到美国政府宣布保护全部存款才恢复。<b>链上的稳定，最终取决于链下的银行。</b>' },
  { id: 'bybit', name: 'Bybit 被盗', sub: '2025.2 · 回放全过程', nodes: [], flow: 'hack' },
];

// --------------------------------------------------------------- shared bits
// come back to a flow where you left it; start (and play) a fresh one otherwise
function enterFlow(app, list, arg) {
  if (arg && FLOW[arg]) return app.setFlow(arg, true);
  if (app.state.touched && list.includes(app.state.flow)) return;
  app.setFlow(list[0], true);
}
function flowControls(app, ids) {
  const f = FLOW[app.state.flow];
  const n = f.steps.length, cur = app.state.step;
  return [
    {
      type: 'seg', label: ids.length > 2 ? '选一条资金流' : '选一条流程', value: app.state.flow, presets: true, compact: ids.length > 4, two: ids.length <= 4,
      options: ids.map((id) => ({ v: id, text: FLOW[id].name, sub: FLOW[id].sub })),
      onChange: (v) => app.setFlow(v, true),
    },
    { type: 'player', value: cur, n, kind: f.steps[cur].kind },
  ];
}
function flowStats(app) {
  const f = FLOW[app.state.flow], cur = app.state.step;
  const done = f.steps.slice(0, cur + 1);
  const onChain = done.filter((s) => s.ledger === 'chain').length;
  const parties = new Set(done.flatMap((s) => [s.from, s.to])).size;
  return [
    { k: '进度', v: `${cur + 1}<small>/ ${f.steps.length} 步</small>` },
    { k: '其中上链', v: `${onChain}<small>笔</small>`, style: `color:${KINDS.crypto.color}` },
    { k: '经手方', v: `${parties}<small>个</small>` },
  ];
}
function stepHtml(app) {
  const f = FLOW[app.state.flow], s = f.steps[app.state.step];
  const k = KINDS[s.kind], lg = LEDGERS[s.ledger];
  const route = s.from === s.to ? `<b>${NODE[s.from].name}</b>` : `<b>${NODE[s.from].name}</b> → <b>${NODE[s.to].name}</b>`;
  return `<div class="step-now" style="--k:${k.color}">
      <div class="who">${route}<span class="amt">${s.amt}</span><span>· ${k.name} · 记在${lg.name}</span></div>
      <p>${s.text}</p></div>`;
}
function flowStory(app, head = '') {
  const f = FLOW[app.state.flow];
  return `${head}<h2>${f.name} · ${f.sub}</h2>
    ${app.state.step === 0 ? `<p class="lead">${f.intro}</p>` : ''}
    ${stepHtml(app)}
    ${kindsLegend([...new Set(f.steps.map((s) => s.kind))])}`;
}
function flowView(app) {
  const f = FLOW[app.state.flow];
  const focus = new Set(f.steps.flatMap((s) => [s.from, s.to]));
  return { focus, flow: { steps: f.steps, cur: app.state.step, t: app.state.t } };
}
const flowHint = (app) => (app.state.playing ? '播放中 · <b>点任意参与者</b>看它是谁' : '<b>下一步</b>继续 · 点下方账本可跳到任意一步');

// ================================================================ chapters
export const CHAPTERS = [
  // ---------------------------------------------------------------- home
  {
    id: 'home', title: '首页', sub: '',
    view: () => ({ ambient: true, focus: null }),
    stats: () => [
      { k: '层级', v: '7 <small>层</small>' },
      { k: '参与者', v: `${NODES.length} <small>类</small>` },
      { k: '账本', v: '3 <small>本</small>' },
    ],
    story: () => `<h1>一张图看懂加密资产产业</h1>
      <p>从银行里的一美元，到链上的一枚代币，中间隔着<b>七层</b>、<b>三十多类参与者</b>。左边是法币的世界，右边是链上的世界，中间是在两边之间收费摆渡的公司。</p>
      <p>地图上流动的小点，就是正在移动的东西：<span class="k-fiat">法币</span>、<span class="k-crypto">加密资产</span>、<span class="k-stable">稳定币</span>，还有常被误以为是“币”的<span class="k-claim">凭证</span>（交易所余额、ETF 份额）。</p>
      <p>看懂这个产业只需要问三个问题：<b>谁</b>在参与？他们在<b>哪一层</b>？钱和币<b>记在谁的账上</b>？</p>
      <div class="cta-row"><button class="cta" data-go="layers">从七层结构开始 →</button><button class="cta ghost" data-go="flows">直接看钱怎么流</button></div>`,
    hint: () => '<b>点任意参与者</b>看它是谁',
  },

  // ---------------------------------------------------------------- layers
  {
    id: 'layers', title: '分层', sub: '七层结构',
    enter(app) { app.state.layer = app.state.layer || 'cefi'; },
    view: (app) => {
      const L = app.state.layer;
      const ids = NODES.filter((n) => n.layer === L).map((n) => n.id);
      const set = new Set(ids);
      const links = LINKS.filter(([a, b]) => set.has(a) || set.has(b)).map(([a, b]) => [a, b, LAYER[L].color, 0.28]);
      return { layer: L, focus: new Set([...ids, ...links.flatMap(([a, b]) => [a, b])]), links, dimOthers: true };
    },
    controls: (app) => [{
      type: 'seg', label: '选一层', value: app.state.layer,
      options: LAYERS.map((l) => ({ v: l.id, text: `${l.n} ${l.name}`, color: l.color })),
      onChange: (v) => { app.state.layer = v; app.refresh(); },
    }],
    stats: (app) => {
      const L = LAYER[app.state.layer];
      const ns = NODES.filter((n) => n.layer === L.id);
      const avg = ns.reduce((s, n) => s + n.x, 0) / ns.length;
      return [
        { k: '这一层', v: L.name, cls: 'cj', style: `color:${L.color}` },
        { k: '参与者', v: `${ns.length}<small>类</small>` },
        { k: '偏向', v: avg < 0.4 ? '链下' : avg > 0.6 ? '链上' : '横跨两边', cls: 'cj' },
      ];
    },
    story: (app) => {
      const L = LAYER[app.state.layer];
      const ns = NODES.filter((n) => n.layer === L.id).sort((a, b) => a.x - b.x);
      const i = LAYERS.indexOf(L);
      const next = LAYERS[(i + 1) % LAYERS.length];
      return `<h2>第 ${L.n} 层 · ${L.en}</h2><h3 style="color:${L.color}">${L.title}</h3><p class="en">${L.one}</p>
        ${LAYER_TEXT[L.id]}
        <h4>这一层的参与者（点开看代表机构）</h4><div class="chips">${ns.map((n) => chip(n.id)).join('')}</div>
        <div class="cta-row"><button class="cta ghost" data-layer="${next.id}">下一层：${next.name} →</button></div>`;
    },
    hint: () => '<b>点一个参与者</b>看它是谁 · 右上角换层',
  },

  // ---------------------------------------------------------------- players
  {
    id: 'players', title: '参与者', sub: '谁是谁',
    enter(app, arg) { if (arg && NODE[arg]) app.state.sel = arg; app.state.sel = app.state.sel || 'cex'; },
    view: (app) => {
      const id = app.state.sel;
      const nb = neighbours(id);
      return { sel: id, layer: NODE[id].layer, focus: new Set([id, ...nb]), links: nb.map((b) => [id, b, color(id), 0.4]) };
    },
    controls: (app) => {
      const L = NODE[app.state.sel].layer;
      return [
        {
          type: 'seg', label: '按层浏览', value: L,
          options: LAYERS.map((l) => ({ v: l.id, text: l.name, color: l.color })),
          onChange: (v) => { app.select(NODES.find((n) => n.layer === v).id); },
        },
        {
          type: 'seg', label: LAYER[L].title, value: app.state.sel,
          options: NODES.filter((n) => n.layer === L).sort((a, b) => a.x - b.x).map((n) => ({ v: n.id, text: n.name })),
          onChange: (v) => app.select(v),
        },
      ];
    },
    stats: (app) => {
      const n = NODE[app.state.sel];
      return [
        { k: '所在层', v: `${LAYER[n.layer].n} ${LAYER[n.layer].name}`, cls: 'cj', style: `color:${LAYER[n.layer].color}` },
        { k: '位置', v: side(n), cls: 'cj' },
        { k: '直接往来', v: `${neighbours(n.id).length}<small>类</small>` },
      ];
    },
    story: (app) => {
      const n = NODE[app.state.sel];
      const fl = flowsWith(n.id);
      return `<h2>${LAYER[n.layer].title}</h2><h3>${n.name}</h3><p class="en">${n.full}</p>
        <p>${n.role}</p>
        <h4>典型代表</h4><ul>${n.who.map((w) => `<li>${w}</li>`).join('')}</ul>
        <div class="facts">
          <div class="fact"><b class="t">怎么赚钱</b>${n.earn}</div>
          <div class="fact bad"><b class="t">风险在哪</b>${n.risk}</div>
        </div>
        ${fl.length ? `<h4>它出现在这些资金流里</h4><div class="chips">${fl.map((f) => `<button class="chip" data-flow="${f.id}"><i style="--c:${KINDS[f.steps[0].kind].color}"></i>${f.name}</button>`).join('')}</div>` : ''}
        <h4>和它直接打交道的</h4><div class="chips">${neighbours(n.id).map(chip).join('')}</div>`;
    },
    hint: () => '<b>点地图上任意参与者</b>切换',
  },

  // ---------------------------------------------------------------- flows
  {
    id: 'flows', title: '资金流', sub: '钱怎么流',
    flows: ['buy', 'defi', 'etf', 'stable', 'launch', 'mine', 'remit', 'hack'],
    enter(app, arg) { enterFlow(app, this.flows, arg); },
    view: flowView, ledger: true,
    controls: (app) => flowControls(app, CHAPTERS[3].flows),
    stats: flowStats,
    story: (app) => flowStory(app) + (app.state.step === 0 ? `<h4>三本账</h4><div class="ledgers3">
        <div style="--c:${LEDGERS.bank.color}"><b>银行账本</b>法币只能在这里移动。慢，有营业时间，但有存款保险。</div>
        <div style="--c:${LEDGERS.cex.color}"><b>公司数据库</b>交易所、托管机构的内部记账。快，但你看不到，只能信它。</div>
        <div style="--c:${LEDGERS.chain.color}"><b>区块链</b>公开，任何人可查，改不了；签错了也撤不回。</div></div>
        <p class="small">每一步都会记在下面“账本”卡片里。你会发现，在交易所里买卖根本不上链，只有“提币”那一刻才上链。</p>` : ''),
    hint: flowHint,
  },

  // ---------------------------------------------------------------- stablecoins
  {
    id: 'stable', title: '稳定币', sub: '链上的美元',
    flows: ['stable', 'remit'],
    enter(app, arg) { enterFlow(app, this.flows, arg); },
    view: flowView, ledger: true,
    controls: (app) => flowControls(app, CHAPTERS[4].flows),
    stats: flowStats,
    story: (app) => flowStory(app, app.state.step === 0 ? `<p>稳定币是整个产业的<b>血液</b>：交易所里大多数币用它计价，DeFi 用它借贷，新兴市场用它汇款和存“美元”。</p>
        <p>它的生意模式很简单：<b>你给发行方 1 美元，它给你 1 个代币，然后拿你的美元去买国债吃利息。</b>利率 4% 的时候，这是全世界最赚钱的生意之一。</p>
        <div class="facts"><div class="fact"><b class="t">监管正在落地</b>美国 GENIUS 法案（2025 年 7 月签署）要求 1:1 储备、定期披露、不得向持有人付息；香港《稳定币条例》2025 年 8 月生效，由金管局发牌；欧盟 MiCA 下多家交易所已对欧洲用户下架不合规的 USDT。</div></div>` : ''),
    hint: flowHint,
  },

  // ---------------------------------------------------------------- tokens
  {
    id: 'tokens', title: '发币', sub: '新币从哪来',
    flows: ['launch', 'mine'],
    enter(app, arg) { enterFlow(app, this.flows, arg); },
    view: flowView, ledger: true,
    controls: (app) => flowControls(app, CHAPTERS[5].flows),
    stats: flowStats,
    story: (app) => flowStory(app, app.state.step === 0 ? `<p>新的加密资产只有两种来源：<b>挖出来</b>（比特币这类工作量证明链，按固定规则发给矿工），或者<b>发出来</b>（项目方部署合约，一次性铸出全部代币，再慢慢释放）。</p>
        <p>后者决定了大多数代币的价格走势：上线时流通很少、估值很高，之后几年不断有低成本筹码解锁。看一个币，先看<b>谁拿着、什么时候解锁</b>。</p>` : ''),
    hint: flowHint,
  },

  // ---------------------------------------------------------------- risk
  {
    id: 'risk', title: '风险', sub: '出事的地方',
    enter(app) {
      app.state.case = app.state.case || 'ftx';
      if (app.state.case === 'bybit') enterFlow(app, ['hack']);
    },
    view: (app) => {
      const c = CASES.find((x) => x.id === app.state.case);
      if (c.flow) return flowView(app);
      const bad = new Set(c.nodes);
      const links = [];
      for (let i = 0; i < c.nodes.length; i++) for (let j = i + 1; j < c.nodes.length; j++) links.push([c.nodes[i], c.nodes[j], '#ff5d5d', 0.45]);
      return { bad, focus: new Set([...c.nodes, 'reg', 'audit', 'analytics']), links };
    },
    ledger: (app) => !!CASES.find((x) => x.id === app.state.case).flow,
    controls: (app) => {
      const c = CASES.find((x) => x.id === app.state.case);
      const ctl = [{
        type: 'seg', label: '历史上的大事故', value: app.state.case, presets: true,
        options: CASES.map((x) => ({ v: x.id, text: x.name, sub: x.sub })),
        onChange: (v) => {
          app.state.case = v;
          const cc = CASES.find((x) => x.id === v);
          if (cc.flow) app.setFlow(cc.flow, true); else app.stop();
          app.refresh(true);
        },
      }];
      if (c.flow) ctl.push(flowControls(app, [c.flow])[1]);
      return ctl;
    },
    stats: (app) => {
      const c = CASES.find((x) => x.id === app.state.case);
      if (c.flow) return flowStats(app);
      return [
        { k: '出事的层', v: [...new Set(c.nodes.map((id) => LAYER[NODE[id].layer].name))].join(' · '), cls: 'cj' },
        { k: '事故', v: c.name, cls: 'cj', style: 'color:#ff9a9a' },
        { k: '时间', v: c.sub.split(' · ')[0] },
      ];
    },
    story: (app) => {
      const c = CASES.find((x) => x.id === app.state.case);
      if (c.flow) return flowStory(app);
      return `<h2>风险 · ${c.sub}</h2><h3>${c.name}</h3>
        <p>${c.text}</p>
        <h4>涉及的参与者</h4><div class="chips">${c.nodes.map(chip).join('')}</div>
        <div class="fact" style="margin-top:12px"><b class="t">规律</b>几乎每一次大灾难都发生在<b>有人替你保管、替你记账</b>的地方（交易所、借贷平台、跨链桥、银行），或者在<b>承诺稳定但储备不足</b>的地方。区块链本身很少出错，出错的是它周围的人和代码。</div>
        <p class="small" style="margin-top:12px">本站仅用于学习产业结构，不构成任何投资建议。</p>`;
    },
    hint: (app) => (CASES.find((x) => x.id === app.state.case).flow ? flowHint(app) : '<b>红框</b>是出事的环节 · 右上角换案例'),
  },
];
