// The industry, as data: layers (rows of the map), participants (chips) and
// flows (step-by-step journeys of money and tokens between them).
// x runs from 0 (off-chain, the fiat world) to 1 (on-chain).

export const LAYERS = [
  { id: 'users', n: '01', name: '用户', en: 'Demand', color: '#42744e', title: '用户与资金来源', one: '谁把钱带进来' },
  { id: 'access', n: '02', name: '入口', en: 'Access', color: '#5d67b4', title: '入口与通道', one: '从哪里进出这个世界' },
  { id: 'cefi', n: '03', name: '中介', en: 'CeFi', color: '#926619', title: '中心化中介 CeFi', one: '替你保管、撮合、兑换的公司' },
  { id: 'defi', n: '04', name: '协议', en: 'DeFi', color: '#ad527c', title: '链上协议 DeFi', one: '用代码代替中介' },
  { id: 'assets', n: '05', name: '资产', en: 'Assets', color: '#b25c36', title: '资产本身', one: '在账本上流动的东西' },
  { id: 'chain', n: '06', name: '公链', en: 'Chains', color: '#1e7d83', title: '公链与基础设施', one: '账本本身，以及维护它的人' },
  { id: 'outer', n: '07', name: '治理', en: 'Oversight', color: '#4b729c', title: '监管、合规与信息服务', one: '为行业提供规则、核验与信息支持' },
];

// what moves along an arrow
export const KINDS = {
  fiat: { name: '法币', color: '#326ea5', desc: '银行里的钱：美元、港币、人民币' },
  crypto: { name: '加密资产', color: '#b25c36', desc: 'BTC、ETH 等链上原生资产和代币' },
  stable: { name: '稳定币', color: '#1e7d83', desc: '锚定 1 美元的链上代币' },
  claim: { name: '凭证 / 账面余额', color: '#8052a2', desc: '别人欠你的记录：交易所余额、ETF 份额' },
  info: { name: '指令 / 数据', color: '#64776b', desc: '价格、签名、打包、上币，不是钱本身' },
};

// which ledger a step is written into
export const LEDGERS = {
  bank: { name: '银行账本', short: '银行', color: '#326ea5', desc: '银行和清算系统（SWIFT、FPS、ACH）里的记录' },
  broker: { name: '证券账本', short: '证券', color: '#5d67b4', desc: '券商、交易所和中央登记结算机构的记录' },
  cex: { name: '交易所内部数据库', short: '内部', color: '#8052a2', desc: '中心化公司自己的数据库，链上看不到' },
  chain: { name: '区块链', short: '链上', color: '#b25c36', desc: '公开账本，任何人都能查' },
  none: { name: '链下协议 / 合同', short: '合同', color: '#4b729c', desc: '合同、承诺、KYC 记录，不算转账' },
};

export const NODES = [
  // ---------------------------------------------------------------- 01 users
  {
    id: 'treasury', layer: 'users', x: 0.1, name: '币股公司', full: '加密金库公司 · Crypto treasury companies',
    role: '上市公司发债、增发股票，用募来的钱买 BTC 或 ETH 放在资产负债表上。投资者买它的股票，等于间接持币，还带杠杆。',
    who: ['Strategy（前 MicroStrategy，持有超过 60 万枚 BTC）', 'Metaplanet（日本）', 'BitMine、SharpLink（ETH 金库）'],
    earn: '赚币价上涨和股价相对持币价值的溢价（mNAV）。溢价越高，发股买币越划算。',
    risk: '溢价消失时，靠增发买币的循环会反转；债务到期可能被迫卖币。',
  },
  {
    id: 'inst', layer: 'users', x: 0.3, name: '机构 · 基金', full: '机构投资者 · Institutions',
    role: '对冲基金、家族办公室、资管、养老金、企业财资。大多数通过 ETF、券商或主经纪商进入，而不是自己保管私钥。',
    who: ['现货 BTC/ETH ETF 的持有人（对冲基金、投顾、养老金）', '加密原生基金：Pantera、Multicoin', '量化基金：套利、基差交易'],
    earn: '方向性投资、期现基差、资金费率套利、质押收益。',
    risk: '对手方风险：2022 年很多机构的钱就放在后来倒闭的借贷平台和交易所里。',
  },
  {
    id: 'retail', layer: 'users', x: 0.5, name: '个人投资者', full: '个人投资者 · Retail',
    role: '全球数以亿计的持币人。大多数人通过交易所 App 买币，一部分人把币提到自己的钱包，参与 DeFi、空投和 Meme 币。',
    who: ['交易所用户（Binance、Coinbase、OKX、Upbit 等）', '链上用户（MetaMask、Phantom 钱包）', '通过券商买 ETF 的个人投资者'],
    earn: '他们是付费方：交易手续费、点差、资金费率、Gas 费，最终大多由个人投资者支付。',
    risk: '私钥丢失、诈骗、交易所倒闭、高杠杆爆仓。',
  },
  {
    id: 'vc', layer: 'users', x: 0.68, name: '风投 VC', full: '风险投资 · Venture capital',
    role: '在项目很早期用美元或稳定币换股权和代币（通常是锁仓的代币认购权），项目上线后分批解锁卖出。',
    who: ['a16z crypto', 'Paradigm', 'Polychain', 'YZi Labs（前 Binance Labs）', 'Sequoia、红杉中国等也参与过'],
    earn: '早期低价拿币，上所后按解锁计划卖出。',
    risk: '解锁抛压、项目失败、监管把代币认定为证券。',
  },
  {
    id: 'project', layer: 'users', x: 0.88, name: '项目方', full: '项目方与基金会 · Builders & foundations',
    role: '写协议、发代币、维护公链的团队。常见结构是一家开发公司（Labs）加一个持有代币金库的基金会。',
    who: ['以太坊基金会（Ethereum Foundation）', 'Solana Foundation', 'Uniswap Labs', 'Hyperliquid 团队'],
    earn: '代币金库升值、协议手续费、融资。',
    risk: '代币价格决定团队生存；治理与监管定性不确定。',
  },

  // ---------------------------------------------------------------- 02 access
  {
    id: 'bank', layer: 'access', x: 0.02, name: '银行', full: '银行 · 法币通道 · Banks',
    role: '一切法币进出的起点和终点。交易所的客户资金、稳定币的储备金都存放在银行里。愿意服务加密公司的银行不多，所以它们是整个行业的咽喉。',
    who: ['众安银行 ZA Bank（服务香港持牌交易所）', 'Cross River、Customers Bank（美国）', 'JPMorgan Kinexys（链上存款代币）', '渣打（投资了托管机构 Zodia）'],
    earn: '存款利差、跨境汇款费、托管费。',
    risk: '2023 年 Silvergate、Signature 倒闭，USDC 因 33 亿美元储备被困在硅谷银行（SVB）而短暂脱锚。',
  },
  {
    id: 'broker', layer: 'access', x: 0.18, name: '券商 · ETF', full: 'ETF 发行商与券商 · ETFs & brokers',
    role: '把比特币包装成股票账户里就能买的证券。投资者买的是 ETF 份额，背后的比特币由托管机构冷存储。',
    who: ['BlackRock IBIT（规模最大的现货 BTC ETF）', 'Fidelity FBTC', 'Grayscale GBTC', '券商：Robinhood、嘉信、富途、老虎'],
    earn: '管理费（通常每年 0.2%–0.25%，Grayscale 更高）、佣金。',
    risk: '份额价格偏离净值；托管集中在少数机构。',
  },
  {
    id: 'pay', layer: 'access', x: 0.3, name: '支付网络', full: '支付网络 · Payments',
    role: '把稳定币接进日常支付：卡组织用 USDC 做结算，支付公司发行自己的稳定币、帮商户收款。',
    who: ['Visa、Mastercard（稳定币结算、加密卡）', 'PayPal（PYUSD）', 'Stripe（收购了稳定币基础设施 Bridge）'],
    earn: '支付手续费、结算效率带来的资金成本节省。',
    risk: '合规与反洗钱要求高；稳定币监管正在各地落地。',
  },
  {
    id: 'ramp', layer: 'access', x: 0.42, name: '出入金', full: '出入金服务 · On/off ramps',
    role: '在网页或钱包里直接用银行卡、Apple Pay 买币，或者把币卖成法币打回银行卡。是交易所之外的“兑换窗口”。',
    who: ['MoonPay', 'Transak', 'Banxa', 'Stripe / Bridge', '场外 P2P 商户（很多新兴市场的主要渠道）'],
    earn: '兑换手续费（常见 1%–4%）和汇率点差。',
    risk: '卡组织拒付、欺诈、各国外汇管制。',
  },
  {
    id: 'agg', layer: 'access', x: 0.78, name: '聚合前端', full: '交易前端 · 聚合器 · Front-ends',
    role: '你在浏览器里看到的 DeFi 网页。它本身不保管钱，只帮你找最优价格、组装交易，最后由你的钱包签名发到链上。',
    who: ['1inch、0x、CoW Swap（以太坊）', 'Jupiter（Solana）', 'Telegram 交易机器人'],
    earn: '前端手续费、订单流收入。',
    risk: '前端被劫持（DNS、恶意脚本）会诱导你签错交易。',
  },
  {
    id: 'wallet', layer: 'access', x: 0.92, name: '自托管钱包', full: '自托管钱包 · Self-custody wallets',
    role: '保管你私钥的软件或硬件。链上的“你”就是一个地址，谁有私钥谁就能动这个地址里的资产。',
    who: ['MetaMask', 'Phantom', 'Trust Wallet', 'OKX Wallet', '硬件钱包：Ledger、Trezor'],
    earn: '内置兑换手续费、质押分成。',
    risk: '私钥丢了就找不回；钓鱼签名、恶意授权是最常见的被盗方式。',
  },

  // ---------------------------------------------------------------- 03 CeFi
  {
    id: 'custody', layer: 'cefi', x: 0.08, name: '托管机构', full: '合格托管 · Custodians',
    role: '替机构和 ETF 保管私钥，用冷存储、多方计算（MPC）和保险做到“机构能用”。ETF 背后的比特币就锁在这里。',
    who: ['Coinbase Custody（大多数美国现货 ETF 的托管方）', 'BitGo', 'Anchorage Digital（持有美国联邦信托牌照）', 'Fidelity Digital Assets', 'Hex Trust（香港）', '技术服务商：Fireblocks'],
    earn: '按托管规模收费（每年零点几个百分点）。',
    risk: '集中风险：少数几家托管着数百亿美元的资产。',
  },
  {
    id: 'prime', layer: 'cefi', x: 0.2, name: '主经纪', full: '主经纪商 · Prime brokers',
    role: '给机构一站式服务：在多个交易所统一下单、借钱借币、结算、托管。相当于华尔街的 Goldman 主经纪业务。',
    who: ['Coinbase Prime（为多数 ETF 买币）', 'FalconX', 'Hidden Road（已被 Ripple 收购）', '前车之鉴：Genesis 在 2022–23 年破产'],
    earn: '融资利息、借币费、交易佣金。',
    risk: '期限错配和对手方违约：2022 年 3AC 爆仓拖垮了多家借贷机构。',
  },
  {
    id: 'otc', layer: 'cefi', x: 0.32, name: 'OTC 场外', full: '场外交易台 · OTC desks',
    role: '大额买卖不在交易所盘口上砸，而是找场外交易台一口价成交，避免冲击价格。矿工卖币、机构建仓、跨境换汇都常走这里。',
    who: ['Cumberland（DRW 旗下）', 'Galaxy', 'B2C2', 'Kraken OTC、OKX OTC 等交易所场外部'],
    earn: '买卖点差。',
    risk: '部分灰色 OTC 被用于洗钱出金，是监管重点。',
  },
  {
    id: 'cex', layer: 'cefi', x: 0.46, name: '交易所 CEX', full: '中心化交易所 · Exchanges',
    role: '行业的心脏。集开户（KYC）、托管、撮合、借贷、衍生品于一身。你在交易所里的“币”，大多数时候只是它数据库里的一个数字。',
    who: ['Binance（交易量最大）', 'Coinbase（美国上市）', 'OKX', 'Bybit', 'Kraken', 'Upbit（韩国）', '香港持牌：HashKey Exchange、OSL'],
    earn: '现货和合约手续费、上币、借贷利息、质押分成、稳定币利息分成。',
    risk: '挪用客户资产（FTX）、被黑（Bybit，2025 年约 15 亿美元）、挤兑。',
  },
  {
    id: 'mm', layer: 'cefi', x: 0.6, name: '做市商', full: '做市商 · Market makers',
    role: '同时挂买单和卖单，保证你随时买得到、卖得掉。交易所和新项目都需要他们提供流动性；ETF 的申购赎回也由做市商（授权参与商）完成。',
    who: ['Wintermute', 'Jump Crypto', 'GSR', 'Amber Group', 'Flow Traders', 'Jane Street、Virtu（ETF 授权参与商）'],
    earn: '买卖价差、项目方给的代币借贷和期权、交易所返佣。',
    risk: '极端行情撤单导致流动性瞬间消失；与项目方的协议不透明。',
  },
  {
    id: 'issuer', layer: 'cefi', x: 0.76, side: '交界', name: '稳定币发行方', full: '稳定币发行方 · Stablecoin issuers',
    role: '收你 1 美元，在链上给你铸 1 个稳定币；你还回来，它销毁代币、把美元还你。坐在链上和链下的交界线上，是整个行业的“中央银行”。',
    who: ['Tether（USDT，规模最大）', 'Circle（USDC，2025 年在纽交所上市）', 'Paxos（PYUSD 等）', 'First Digital（FDUSD，香港）', 'Ethena（USDe，合成美元）'],
    earn: '储备金买美国短期国债吃利息，持币人不分利息。Tether 2024 年利润超过 100 亿美元。',
    risk: '储备不透明或不足、银行挤兑、被冻结。',
  },

  // ---------------------------------------------------------------- 04 DeFi
  {
    id: 'perps', layer: 'defi', x: 0.54, name: '衍生品', full: '链上衍生品 · 预测市场 · Perps',
    role: '在链上开永续合约（perpetual）和加杠杆，或者押注现实事件的结果。',
    who: ['Hyperliquid（链上永续合约龙头）', 'dYdX', 'GMX', 'Polymarket（预测市场）'],
    earn: '交易手续费、清算费，部分返还给代币持有人或流动性提供者。',
    risk: '杠杆清算连锁、预言机被操纵。',
  },
  {
    id: 'dex', layer: 'defi', x: 0.64, name: 'DEX', full: '去中心化交易所 · DEXs',
    role: '没有公司撮合，只有智能合约里的资金池（AMM）：池子里放两种币，按公式自动报价。谁往池子里放币谁就是“做市商”（LP）。',
    who: ['Uniswap', 'Curve（稳定币兑换）', 'PancakeSwap（BNB Chain）', 'Raydium、Orca（Solana）', 'Aerodrome（Base）'],
    earn: '每笔交换收 0.01%–1% 的手续费，主要分给 LP。',
    risk: '智能合约漏洞、无常损失、夹子机器人（MEV）。',
  },
  {
    id: 'lending', layer: 'defi', x: 0.74, name: '借贷', full: '借贷协议 · Lending',
    role: '存币吃利息，或者抵押一种币借出另一种。没有信用审核，全靠超额抵押：抵押品价值跌破线，合约自动拍卖（清算）。',
    who: ['Aave（最大）', 'Morpho', 'Compound', 'Sky（前 Maker，发行 DAI/USDS）', 'Kamino（Solana）'],
    earn: '借款利率与存款利率之差，归协议金库。',
    risk: '价格闪崩时清算不及时产生坏账；预言机出错。',
  },
  {
    id: 'staking', layer: 'defi', x: 0.84, name: '质押', full: '质押与流动性质押 · Staking',
    role: '把 ETH、SOL 交给验证者去维护网络、赚奖励；流动性质押协议再给你一张“收据代币”（如 stETH），可以继续拿去 DeFi 里用。',
    who: ['Lido（stETH）', 'Rocket Pool', 'Jito（Solana）', 'EigenLayer（再质押）', '交易所质押：Coinbase、Binance'],
    earn: '从质押奖励里抽成（Lido 约 10%）。',
    risk: '罚没（slashing）、收据代币脱锚、层层嵌套的杠杆。',
  },
  {
    id: 'bridge', layer: 'defi', x: 0.95, name: '跨链桥', full: '跨链桥 · Bridges',
    role: '链与链之间不互通。跨链桥在 A 链锁住你的币，在 B 链给你铸一个对应的币（或者烧掉再铸造）。',
    who: ['Wormhole', 'LayerZero', 'Across', 'Circle CCTP（USDC 原生跨链）', 'THORChain（跨链兑换）'],
    earn: '跨链手续费。',
    risk: '历史上被盗最多的环节：Ronin 桥 2022 年被盗约 6 亿美元。',
  },

  // ---------------------------------------------------------------- 05 assets
  {
    id: 'rwa', layer: 'assets', x: 0.3, name: 'RWA', full: '代币化现实资产 · Tokenized RWAs',
    role: '把国债、货币基金、股票、存款搬上链，变成可以 24 小时转账、可以当抵押品的代币。法律上的所有权仍在链下。',
    who: ['BlackRock BUIDL（通过 Securitize 发行）', 'Ondo（OUSG、USDY）', 'Franklin Templeton BENJI', '代币化股票', 'JPMorgan JPMD 存款代币'],
    earn: '发行方赚管理费；持有人拿到底层资产收益（这点和稳定币不同）。',
    risk: '链上转账和链下产权登记必须一致；多数只对合格投资者开放。',
  },
  {
    id: 'btc', layer: 'assets', x: 0.5, name: '比特币 BTC', full: '比特币 · Bitcoin',
    role: '第一个也是市值最大的加密资产。总量上限 2100 万枚，每 10 分钟左右出一个区块，新币只来自矿工的出块奖励。',
    who: ['主要持有人：ETF、Strategy 等上市公司、交易所、早期矿工', '中本聪地址里约 100 万枚从未动过'],
    earn: '本身不产生现金流，价值来自共识与稀缺性。',
    risk: '价格波动大；量子计算等长期技术风险。',
  },
  {
    id: 'eth', layer: 'assets', x: 0.64, name: '公链币 ETH', full: '公链原生币 · ETH、SOL、BNB…',
    role: '每条公链的“燃料”：付 Gas 费、质押保障网络安全、在 DeFi 里当抵押品。ETH 最大，其次是 SOL、BNB、TRX 等。',
    who: ['ETH（以太坊）', 'SOL（Solana）', 'BNB（BNB Chain）', 'TRX（Tron，USDT 转账主要跑在这条链上）'],
    earn: '质押收益（ETH 约每年 3%）；网络用得越多，燃料需求越大。',
    risk: '公链之间竞争激烈，用户可以迁走。',
  },
  {
    id: 'stable', layer: 'assets', x: 0.77, name: '稳定币', full: '稳定币 · Stablecoins',
    role: '链上的美元。交易所里的“现金”、跨境汇款的工具、DeFi 的计价单位。总量在两三千亿美元的量级，其中 USDT 占大头。',
    who: ['USDT（Tether）', 'USDC（Circle）', 'USDe（Ethena）', 'DAI / USDS（Sky）', 'FDUSD、PYUSD、USD1'],
    earn: '持有人没有利息，利息归发行方；这是发行方的商业模式。',
    risk: '脱锚：UST 在 2022 年崩盘蒸发数百亿美元；USDC 在 2023 年 SVB 事件中短暂跌到 0.88。',
  },
  {
    id: 'alt', layer: 'assets', x: 0.9, name: '代币 · Meme', full: '其他代币 · 治理币 · Meme 币',
    role: '项目发行的治理代币、应用代币，以及没有任何功能、纯靠社区和叙事的 Meme 币。数量成千上万，绝大多数最终归零。',
    who: ['治理币：UNI、AAVE、LINK、HYPE', 'Meme：DOGE、PEPE、BONK', '发射平台：pump.fun'],
    earn: '依赖协议收入分配、回购，或者纯粹的注意力。',
    risk: '低流通高估值（低 float 高 FDV）、解锁抛压、Rug pull（跑路）。',
  },

  // ---------------------------------------------------------------- 06 chains
  {
    id: 'oracle', layer: 'chain', x: 0.3, name: '预言机', full: '预言机 · Oracles',
    role: '区块链看不到外面的世界。预言机把链下的价格、利率、储备证明写到链上，借贷和衍生品协议靠它判断要不要清算。',
    who: ['Chainlink', 'Pyth', 'RedStone'],
    earn: '协议付费、代币激励。',
    risk: '喂价错误或被操纵，会在几秒内引发错误清算。',
  },
  {
    id: 'miners', layer: 'chain', x: 0.44, name: '矿工', full: '矿工与矿池 · Miners (PoW)',
    role: '比特币靠算力竞争记账权：谁先算出答案谁出块，拿到出块奖励（目前每块 3.125 BTC，约四年减半一次）和手续费。',
    who: ['矿池：Foundry USA、AntPool、ViaBTC、F2Pool', '上市矿企：MARA、Riot、CleanSpark', '矿机：比特大陆（Bitmain）'],
    earn: '出块奖励 + 交易手续费，扣掉电费和矿机成本。',
    risk: '减半让收入腰斩；算力集中在少数矿池。',
  },
  {
    id: 'validators', layer: 'chain', x: 0.56, name: '验证者', full: '验证者 · Validators (PoS)',
    role: '以太坊、Solana 等权益证明链的记账人。押上币当保证金，轮流出块和投票，作恶会被罚没。',
    who: ['专业节点运营商：Figment、Kiln、Chorus One', '交易所：Coinbase、Binance', 'Lido 旗下的节点运营商'],
    earn: '质押奖励 + 手续费 + MEV（排序交易带来的收益）。',
    risk: '罚没、宕机；质押集中在少数运营商。',
  },
  {
    id: 'l1', layer: 'chain', x: 0.7, name: 'L1 公链', full: '一层公链 · Layer 1',
    role: '最底层的账本：Bitcoin、Ethereum、Solana、BNB Chain、Tron……每条链自己出块、自己结算，彼此默认不通。',
    who: ['Bitcoin', 'Ethereum', 'Solana', 'BNB Chain', 'Tron', '新兴：Sui、Aptos、Hyperliquid L1'],
    earn: '链本身不“赚钱”，但 Gas 费被付给验证者，部分被销毁。',
    risk: '宕机（Solana 早年多次停机）、分叉、共识漏洞。',
  },
  {
    id: 'l2', layer: 'chain', x: 0.83, name: 'L2 二层', full: '二层网络 · Layer 2 rollups',
    role: '在以太坊之上再搭一层：先在二层批量处理交易，再把结果压缩提交回以太坊。更快更便宜，安全性借用以太坊。',
    who: ['Base（Coinbase 推出）', 'Arbitrum', 'Optimism', 'zkSync', 'Starknet'],
    earn: '用户付的 Gas 减去提交给以太坊的成本，就是运营方（排序器）的利润。',
    risk: '排序器目前大多是中心化的；跨层提款有等待期。',
  },
  {
    id: 'rpc', layer: 'chain', x: 0.95, name: '节点 RPC', full: '节点与 RPC 服务 · Node infra',
    role: '钱包和网页并不自己跑一个完整节点，而是通过 RPC 服务商读写区块链。它们是“链上世界的云服务”。',
    who: ['Infura（MetaMask 默认）', 'Alchemy', 'QuickNode', 'Helius（Solana）'],
    earn: '按调用量收 API 费。',
    risk: '服务商宕机或审查，会让大量钱包同时“看不见”链。',
  },

  // ---------------------------------------------------------------- 07 outer
  {
    id: 'reg', layer: 'outer', x: 0.08, name: '监管', full: '监管机构 · Regulators',
    role: '发牌照、定规则、执法。重点管三件事：谁能替别人保管资产、谁能发行稳定币、代币算不算证券。',
    who: ['美国：SEC、CFTC、OCC、FinCEN（2025 年通过稳定币法 GENIUS Act）', '香港：证监会 SFC（交易所牌照）、金管局 HKMA（稳定币条例 2025 年 8 月生效）', '欧盟：MiCA（2024 年底全面实施）', '新加坡 MAS、迪拜 VARA'],
    earn: '—',
    risk: '规则在各地不一致，业务会流向监管宽松的地方（监管套利）。',
  },
  {
    id: 'analytics', layer: 'outer', x: 0.38, name: '链上分析', full: '链上分析与合规 · Analytics',
    role: '区块链是公开的，但地址是匿名的。这些公司把地址和真实机构对上号，给交易所做反洗钱筛查，帮执法机构追踪被盗资金。',
    who: ['Chainalysis', 'Elliptic', 'TRM Labs', 'Arkham'],
    earn: '卖软件订阅给交易所、银行和政府。',
    risk: '误标地址可能冤枉普通用户。',
  },
  {
    id: 'audit', layer: 'outer', x: 0.56, name: '审计 · 鉴证', full: '审计与鉴证 · Audits & attestations',
    role: '两种“审”：会计师鉴证稳定币和交易所的储备够不够；安全公司审计智能合约有没有漏洞。',
    who: ['储备鉴证：Deloitte（Circle）、BDO（Tether）', '合约审计：OpenZeppelin、Trail of Bits、CertiK', '储备证明（Proof of Reserves）：多家交易所自行公布'],
    earn: '审计费。',
    risk: '鉴证只看某个时点，审计过的合约也会被黑。',
  },
  {
    id: 'data', layer: 'outer', x: 0.74, name: '数据 · 媒体', full: '数据与媒体 · Data & media',
    role: '行情、排名、研究和新闻。价格、市值、TVL 这些数字大多来自这里。',
    who: ['CoinGecko、CoinMarketCap', 'DefiLlama、Dune、Glassnode', 'CoinDesk、The Block'],
    earn: '广告、数据订阅、上榜推广。',
    risk: '刷量数据、付费软文。',
  },
  {
    id: 'illicit', layer: 'outer', x: 0.92, name: '安全威胁', full: '攻击者与非法活动 · Security threats',
    role: '需要识别和防范的安全风险：国家级攻击组织、诈骗团伙和洗钱网络。了解其活动方式，有助于认识资产保护、追踪与合规的重要性。',
    who: ['朝鲜 Lazarus 集团（2025 年 Bybit 约 15 亿美元被盗）', '“杀猪盘”诈骗团伙', '混币器、灰色 OTC'],
    earn: '盗窃、诈骗、洗钱服务费。',
    risk: '对整个行业：每一次大案都会带来更严的监管。',
  },
];

export const NODE = Object.fromEntries(NODES.map((n) => [n.id, n]));

// ---------------------------------------------------------------- flows
// step: { from, to, kind, amt, ledger, rec (the ledger line), text (why) }
// from === to means something happens inside that participant.
export const FLOWS = [
  {
    id: 'buy', name: '个人投资者买币', sub: '入金 → 撮合 → 提币',
    intro: '最常见的一条路：银行卡里的钱进交易所，换成 BTC，再提到自己的钱包。注意看每一步记在哪一本账上。',
    steps: [
      { from: 'retail', to: 'cex', kind: 'info', amt: 'KYC 资料', ledger: 'none', rec: '开户 · KYC 通过 · 绑定银行卡', text: '先在交易所开户、做实名认证（KYC）。持牌交易所必须知道你是谁，这是它和银行合作的前提。' },
      { from: 'bank', to: 'cex', kind: 'fiat', amt: 'US$1,000', ledger: 'bank', rec: '你的银行账户 −1,000 → 交易所客户资金账户 +1,000', text: '你从银行把 <b>1,000 美元</b>转给交易所。钱走的是银行系统（FPS、ACH、SWIFT），落在交易所在银行开的客户资金账户里。' },
      { from: 'cex', to: 'retail', kind: 'claim', amt: '余额 1,000', ledger: 'cex', rec: 'user#8812 USD 余额 +1,000', text: '交易所在自己的数据库里给你记上 <b>1,000 美元余额</b>。这只是一个数字，本质上是交易所欠你的钱。' },
      { from: 'mm', to: 'cex', kind: 'claim', amt: '0.01 BTC', ledger: 'cex', rec: '撮合：user#8812 −1,000 USD +0.01 BTC · 做市商 +1,000 USD −0.01 BTC', text: '你下单买 BTC，卖给你的通常是<b>做市商</b>。撮合只是在数据库里两边改数字：<b>链上什么都没有发生</b>。交易所每秒处理几十万笔这样的交易，所以才快。' },
      { from: 'cex', to: 'wallet', kind: 'crypto', amt: '0.01 BTC', ledger: 'chain', rec: 'Bitcoin · 交易所热钱包 bc1q…hot → 你的地址 bc1q…me · 0.01 BTC', text: '你点“提币”。交易所从自己的<b>热钱包</b>签名一笔比特币交易，广播到网络。直到这一步，你的 BTC 才第一次出现在区块链上。' },
      { from: 'miners', to: 'l1', kind: 'info', amt: '打包出块', ledger: 'chain', rec: '区块 #9xx,xxx · 含你的交易 · 手续费约 1 美元', text: '矿工把这笔交易打包进区块，平均约 10 分钟。等 6 个区块确认后，基本就不可能被改写了。' },
      { from: 'wallet', to: 'retail', kind: 'info', amt: '私钥', ledger: 'none', rec: '私钥 / 助记词 由你自己保管', text: '现在币在你私钥控制的地址里，交易所倒闭也拿不走。代价是：<b>私钥丢了，没有任何人能帮你找回</b>。' },
    ],
  },
  {
    id: 'stable', name: '稳定币的一生', sub: '铸造 → 流通 → 赎回',
    intro: '稳定币是法币世界和链上世界之间最重要的那座桥。跟着 1,000 万美元走一圈，看它怎么变成代币，又怎么变回美元。',
    steps: [
      { from: 'inst', to: 'bank', kind: 'fiat', amt: 'US$10m', ledger: 'bank', rec: '机构账户 −10,000,000 USD（电汇给 Circle）', text: '一家机构（比如做市商或交易所）想要 USDC，先把 <b>1,000 万美元</b>电汇给发行方 Circle。' },
      { from: 'bank', to: 'issuer', kind: 'fiat', amt: '储备 +US$10m', ledger: 'bank', rec: 'Circle 储备账户 +10,000,000 USD', text: '钱进入发行方的<b>储备账户</b>。按美国 2025 年通过的 GENIUS 法案，储备只能是现金、短期国债这类高流动性资产，并且要 1:1 足额。' },
      { from: 'issuer', to: 'inst', kind: 'stable', amt: '10,000,000 USDC', ledger: 'chain', rec: 'Ethereum · USDC.mint(0x机构, 10,000,000)', text: 'Circle 在链上调用合约<b>铸造</b> 1,000 万枚 USDC，直接打到机构的地址。链上多了 1,000 万个“美元”，银行里多了 1,000 万储备，两边对得上。' },
      { from: 'issuer', to: 'bank', kind: 'fiat', amt: '买短期国债', ledger: 'bank', rec: '储备 → 美国短期国债 / 回购 · 年化约 4%', text: '这是发行方的生意：储备拿去买<b>美国短期国债</b>，利息全归自己，持币人一分没有。所以 Tether 和 Circle 的利润跟美联储利率紧紧绑在一起。' },
      { from: 'inst', to: 'cex', kind: 'stable', amt: '10,000,000 USDC', ledger: 'chain', rec: 'Ethereum · 0x机构 → Binance 充值地址 · 10,000,000 USDC', text: '机构把 USDC 转进交易所当保证金。<b>稳定币是交易所里的“现金”</b>：大部分币都是用 USDT、USDC 计价交易的。链上转账 24 小时都能到账，周末也不例外。' },
      { from: 'cex', to: 'dex', kind: 'stable', amt: '流入 DeFi', ledger: 'chain', rec: 'USDC 在交易所、DEX、借贷协议之间流转 · 每天链上转账量以数百亿美元计', text: '接下来这些 USDC 会在交易所、DEX、借贷池和钱包之间来回流动，可能转手成千上万次，但<b>总量不变</b>，每一枚背后都还是那 1 美元储备。' },
      { from: 'inst', to: 'issuer', kind: 'stable', amt: '赎回 5,000,000', ledger: 'chain', rec: 'Ethereum · USDC.burn(5,000,000)', text: '某天有人要换回美元：把 USDC 还给 Circle，合约<b>销毁</b>对应的代币。注意，通常只有通过发行方 KYC 的大客户能直接赎回，普通人是在交易所里卖掉。' },
      { from: 'issuer', to: 'bank', kind: 'fiat', amt: 'US$5m 退回', ledger: 'bank', rec: 'Circle 储备 −5,000,000 → 客户银行账户', text: '发行方从储备里拿出美元打回客户的银行账户。一进一出，稳定币完成了一生。发行方还能<b>冻结</b>任意地址里的代币，这是它和比特币最大的不同。' },
    ],
  },
  {
    id: 'defi', name: 'DeFi 一圈', sub: '换币 → 质押 → 抵押借款',
    intro: '把钱提到自己钱包后，就能不经过任何公司直接用智能合约。每一步都是一笔你亲手签名的链上交易。',
    steps: [
      { from: 'wallet', to: 'agg', kind: 'info', amt: '签名请求', ledger: 'none', rec: '网页组装交易 → 钱包弹窗 → 你签名', text: '你打开一个 DeFi 网页。<b>网页只是前端</b>：它帮你找最好的价格、拼好交易，但动钱必须由你的钱包签名。' },
      { from: 'agg', to: 'dex', kind: 'stable', amt: '3,000 USDC', ledger: 'chain', rec: 'Base · Uniswap 池 USDC/ETH · swap 3,000 USDC', text: '交易发到 Uniswap 的<b>资金池</b>。对面没有人、没有公司，只有池子里别人存进来的 USDC 和 ETH，按公式自动算价格，收 0.05% 手续费给存币的人（LP）。' },
      { from: 'dex', to: 'wallet', kind: 'crypto', amt: '≈1 ETH', ledger: 'chain', rec: 'Base · 池子 → 你的地址 · 1.0 ETH', text: '同一笔交易里，ETH 就回到了你的钱包。原子性：要么全部成功，要么全部回滚，不存在“付了钱没拿到货”。' },
      { from: 'wallet', to: 'staking', kind: 'crypto', amt: '1 ETH → stETH', ledger: 'chain', rec: 'Ethereum · Lido.submit(1 ETH) → 1 stETH', text: '把 ETH 交给 Lido 质押，拿回一张“收据” <b>stETH</b>。你的 ETH 被分给专业验证者去维护网络，stETH 的数量每天随质押奖励（约年化 3%）增长。' },
      { from: 'staking', to: 'validators', kind: 'crypto', amt: '32 ETH / 验证者', ledger: 'chain', rec: '信标链 · 存入质押合约 · 验证者上线', text: '验证者押着这些 ETH 轮流出块、投票。作恶或长时间离线会被<b>罚没</b>一部分。' },
      { from: 'wallet', to: 'lending', kind: 'claim', amt: '抵押 stETH', ledger: 'chain', rec: 'Aave · supply(stETH) · borrow(1,500 USDC)', text: '你把 stETH 存进 Aave 当抵押品，借出 1,500 美元的 USDC。<b>不看信用，只看抵押</b>：必须超额抵押，比如押 3,000 借 1,500。' },
      { from: 'lending', to: 'wallet', kind: 'stable', amt: '1,500 USDC', ledger: 'chain', rec: 'Aave → 你的地址 · 1,500 USDC', text: '借来的 USDC 到账。很多人会拿去再买 ETH、再质押、再抵押，一圈圈加杠杆，这就是 2022 年连锁崩盘的燃料。' },
      { from: 'oracle', to: 'lending', kind: 'info', amt: 'ETH 价格', ledger: 'chain', rec: 'Chainlink · ETH/USD = 2,xxx · 健康系数 1.4', text: 'Aave 靠<b>预言机</b>知道 ETH 值多少钱。价格一旦跌破清算线，任何人都可以替你还债、以折扣拿走你的抵押品，全程不需要法院和催收。' },
    ],
  },
  {
    id: 'etf', name: '华尔街买币', sub: 'ETF 申购 → 托管',
    intro: '2024 年 1 月美国批准现货比特币 ETF 后，这成了传统资金进场最大的一条路。投资者自始至终没碰过一个私钥。',
    steps: [
      { from: 'inst', to: 'broker', kind: 'fiat', amt: 'US$50m', ledger: 'broker', rec: '纳斯达克 · 买入 IBIT 份额 · T+1 结算', text: '养老金或投顾在券商账户里买 <b>IBIT</b>，和买苹果股票没有区别。' },
      { from: 'broker', to: 'mm', kind: 'claim', amt: '申购需求', ledger: 'broker', rec: 'ETF 份额需求上升 → 授权参与商（AP）申购', text: '买的人多了，ETF 价格会略高于净值。<b>授权参与商</b>（Jane Street 这类做市商）就向 BlackRock 申购新的份额，赚这个差价，同时把价格拉回净值。' },
      { from: 'mm', to: 'broker', kind: 'fiat', amt: '现金申购', ledger: 'bank', rec: 'AP 交付现金 → ETF 基金账户', text: '授权参与商把现金交给 ETF。（2025 年起美国也允许直接用比特币实物申购。）' },
      { from: 'broker', to: 'prime', kind: 'fiat', amt: '买 BTC 指令', ledger: 'bank', rec: 'ETF → Coinbase Prime · 买入约 500 BTC', text: 'ETF 通过<b>主经纪商</b>（多数是 Coinbase Prime）在多个交易所和场外交易台里分批买入比特币，尽量不冲击价格。' },
      { from: 'otc', to: 'prime', kind: 'crypto', amt: '500 BTC', ledger: 'cex', rec: 'Prime 内部结算 · 场外对手方交付 BTC', text: '比特币可能来自交易所盘口，也可能来自场外交易台背后的矿工和早期持有人。' },
      { from: 'prime', to: 'custody', kind: 'crypto', amt: '500 BTC', ledger: 'chain', rec: 'Bitcoin · Prime 地址 → 托管冷钱包 · 500 BTC', text: '买到的 BTC 转进<b>托管机构的冷钱包</b>，私钥分片存放在离线设备里。所有 ETF 的持仓地址都可以在链上查到。' },
      { from: 'broker', to: 'inst', kind: 'claim', amt: 'IBIT 份额', ledger: 'broker', rec: 'DTC 登记 · 投资者持有 IBIT 份额', text: '投资者手里是 <b>ETF 份额</b>，一种对那堆比特币的间接所有权。好处是合规、方便放进养老金；代价是每年的管理费，而且不能拿去链上用。' },
      { from: 'inst', to: 'treasury', kind: 'fiat', amt: '可转债', ledger: 'broker', rec: '认购 Strategy 可转债 / 增发股票', text: '另一条相似的路：<b>币股公司</b>。Strategy 发可转债和新股，从股市募钱，再拿去买比特币。' },
      { from: 'treasury', to: 'custody', kind: 'crypto', amt: 'BTC 入库', ledger: 'chain', rec: 'Bitcoin · 公司冷钱包 · 累计超 60 万枚', text: '于是股市里的钱，经过一家上市公司的资产负债表，变成了链上的比特币。' },
    ],
  },
  {
    id: 'launch', name: '一个新币', sub: '融资 → 上所 → 解锁',
    intro: '一个代币从诞生到出现在你的交易 App 里，中间经过了风投、做市商和交易所。理解这条链，就理解了大部分币为什么会跌。',
    steps: [
      { from: 'vc', to: 'project', kind: 'stable', amt: 'US$20m', ledger: 'chain', rec: '种子轮 / A 轮 · 股权 + 代币认购权（锁仓 1 年，之后 3 年线性解锁）', text: '风投用美元或稳定币投资项目，换到股权和<b>未来代币的认购权</b>，价格往往只有日后上市价的零头。' },
      { from: 'project', to: 'alt', kind: 'crypto', amt: '10 亿枚', ledger: 'chain', rec: 'Ethereum · 部署 ERC-20 合约 · mint 1,000,000,000', text: '项目部署代币合约，一次性<b>铸出全部总量</b>，再按比例分配：团队、投资人、基金会金库、社区空投。刚上市时真正在流通的常常只有 10%–20%。' },
      { from: 'project', to: 'mm', kind: 'crypto', amt: '借出 2%', ledger: 'chain', rec: '做市协议 · 借出代币 + 看涨期权', text: '项目把一部分代币<b>借给做市商</b>，通常还附带期权。做市商负责在交易所挂单，保证上线后有人买得到、卖得掉。' },
      { from: 'project', to: 'cex', kind: 'info', amt: '上币申请', ledger: 'none', rec: '上币协议 · 可能包含营销预算、空投份额', text: '项目申请<b>上币</b>。大交易所的上币是稀缺资源：往往需要拿出代币做用户活动或空投，交易所自己也会审查项目。' },
      { from: 'project', to: 'retail', kind: 'crypto', amt: '空投', ledger: 'chain', rec: 'Airdrop · 50,000 个地址 · 各 xxx 枚', text: '早期用户收到<b>空投</b>。其中不少会立刻卖掉，这是第一波抛压。' },
      { from: 'retail', to: 'cex', kind: 'stable', amt: '买入', ledger: 'cex', rec: '现货 XYZ/USDT · 开盘', text: '代币开盘交易。个人投资者用稳定币买入，价格发现开始。因为流通量小，价格很容易被推高，账面“完全稀释估值”（FDV）可能高达几十亿美元。' },
      { from: 'vc', to: 'cex', kind: 'crypto', amt: '解锁卖出', ledger: 'chain', rec: '12 个月后 · 解锁 1.5 亿枚 → 充值交易所', text: '一年后锁仓期结束，投资人和团队的代币开始<b>解锁</b>。成本极低的筹码逐步流向交易所卖出，这就是为什么很多新币上线后长期阴跌。' },
    ],
  },
  {
    id: 'mine', name: '挖矿出币', sub: '出块 → 矿工卖币',
    intro: '世界上每一枚比特币，都是作为出块奖励“发”给矿工的。矿工要交电费，于是这些新币会通过场外交易台流进市场。',
    steps: [
      { from: 'miners', to: 'l1', kind: 'info', amt: '算力', ledger: 'chain', rec: '全网算力 · 平均 10 分钟一个区块', text: '矿工用专用矿机（ASIC，比特大陆最大）拼算力争夺记账权，大部分个体矿工加入<b>矿池</b>合并算力、平摊收益。' },
      { from: 'l1', to: 'miners', kind: 'crypto', amt: '3.125 BTC', ledger: 'chain', rec: 'Bitcoin · coinbase 交易 · 出块奖励 3.125 BTC + 手续费', text: '出块者获得<b>出块奖励</b>：2024 年 4 月减半后是每块 3.125 BTC，再加上块内交易的手续费。这是比特币唯一的“发行”方式，到 2140 年左右发完。' },
      { from: 'miners', to: 'otc', kind: 'crypto', amt: '卖出 BTC', ledger: 'chain', rec: 'Bitcoin · 矿池 → OTC 交易台 · 120 BTC', text: '矿工的电费和矿机贷款要用法币付，所以会持续卖币。大额通常走<b>场外交易台</b>，避免砸盘。' },
      { from: 'otc', to: 'bank', kind: 'fiat', amt: 'US$ 结算', ledger: 'bank', rec: 'OTC → 矿企银行账户', text: 'OTC 用美元付款。上市矿企还会发股票、发债来融资扩张。' },
      { from: 'otc', to: 'cex', kind: 'crypto', amt: '分销', ledger: 'chain', rec: 'OTC → 交易所 / 机构客户', text: '场外交易台再把币分给有买入需求的交易所、ETF 或机构。新币就这样一路流到最终持有人手里。' },
    ],
  },
  {
    id: 'remit', name: '跨境汇款', sub: '本币 → USDT → 本币',
    intro: '稳定币在新兴市场最大的用途不是投机，而是转钱。一个在迪拜打工的人给菲律宾的家人汇款，可能走的就是这条路。',
    steps: [
      { from: 'retail', to: 'ramp', kind: 'fiat', amt: 'AED 3,700', ledger: 'bank', rec: '本地银行转账 → P2P 商户 / 出入金服务', text: '汇款人在当地把本币付给出入金服务或交易所的 <b>P2P 商户</b>。' },
      { from: 'ramp', to: 'wallet', kind: 'stable', amt: '1,000 USDT', ledger: 'chain', rec: 'Tron · TRC-20 USDT · → 收款人地址 · 手续费约 1 美元', text: '对方收到 <b>USDT</b>，大多跑在 Tron 链上：几秒到账、手续费一两美元左右、7×24 小时，不经过 SWIFT 和代理行。' },
      { from: 'wallet', to: 'cex', kind: 'stable', amt: '1,000 USDT', ledger: 'chain', rec: 'Tron · 收款人 → 本地交易所', text: '收款人把 USDT 转进本地交易所或卖给 P2P 商户。也有人直接留着 USDT，当作对抗本币贬值的美元存款。' },
      { from: 'cex', to: 'bank', kind: 'fiat', amt: 'PHP 5.7 万', ledger: 'bank', rec: '交易所 → 收款人银行 / 电子钱包', text: '换成当地货币提现。整个过程可能比银行电汇便宜得多、快得多，但也正因如此，<b>反洗钱</b>是监管最关心的问题。' },
    ],
  },
  {
    id: 'hack', name: '安全事件与追踪', sub: '被盗 → 洗钱 → 冻结',
    intro: '2025 年 2 月，Bybit 被盗约 15 亿美元的 ETH，是史上最大的一次加密盗窃，FBI 认定是朝鲜 Lazarus 所为。公开账本让每一步都被看见。',
    steps: [
      { from: 'cex', to: 'illicit', kind: 'crypto', amt: '≈40 万 ETH', ledger: 'chain', rec: 'Ethereum · Bybit 冷钱包 → 攻击者地址 · ≈401,000 ETH', text: '攻击者入侵了多签钱包服务的开发环境，篡改了签名界面。Bybit 的签名人以为在做一笔例行转账，实际签下的是把<b>冷钱包</b>交出去。' },
      { from: 'analytics', to: 'illicit', kind: 'info', amt: '地址标记', ledger: 'none', rec: 'Chainalysis / Elliptic / Arkham · 标记攻击者地址', text: '几小时内，<b>链上分析公司</b>就标记了全部相关地址。交易所的风控系统会自动拒收来自这些地址的充值。' },
      { from: 'illicit', to: 'dex', kind: 'crypto', amt: '拆分兑换', ledger: 'chain', rec: '分散到数百个地址 · DEX 兑换', text: '黑客把资金拆散到大量地址，在 <b>DEX</b> 上换成其他币，因为 DEX 没有 KYC，不能拒绝交易。' },
      { from: 'illicit', to: 'bridge', kind: 'crypto', amt: '跨到 BTC', ledger: 'chain', rec: 'THORChain 等 · ETH → BTC', text: '再通过<b>跨链</b>协议把 ETH 换成比特币，增加追踪难度。' },
      { from: 'issuer', to: 'illicit', kind: 'info', amt: '冻结', ledger: 'chain', rec: 'USDT/USDC · 黑名单地址 · 冻结', text: '如果赃款经过稳定币，<b>发行方可以直接冻结</b>。部分交易所和协议也冻结了相关资金，但 ETH 和 BTC 本身无法被冻结。' },
      { from: 'illicit', to: 'otc', kind: 'crypto', amt: '出金', ledger: 'chain', rec: '灰色 OTC / 地下钱庄 → 法币', text: '最后一步最难：变回法币。这通常要依赖不做 KYC 的<b>灰色场外商</b>，这也是全球监管收紧场外交易的原因。' },
      { from: 'reg', to: 'cex', kind: 'info', amt: '合规要求', ledger: 'none', rec: '监管 · 冷钱包管理、签名流程、储备证明要求', text: '每一次大案之后，<b>监管</b>对托管、签名流程和储备证明的要求都会更严。Bybit 靠自有资金和同业借款在几天内补足了缺口，没有出现挤兑。' },
    ],
  },
];
export const FLOW = Object.fromEntries(FLOWS.map((f) => [f.id, f]));

// Connections shown around a participant (union of every flow's arrows, plus a few more)
const EXTRA = [
  ['retail', 'cex'], ['retail', 'broker'], ['retail', 'wallet'], ['inst', 'prime'], ['inst', 'custody'],
  ['cex', 'custody'], ['cex', 'issuer'], ['mm', 'dex'], ['wallet', 'dex'], ['wallet', 'bridge'],
  ['dex', 'l2'], ['lending', 'l1'], ['stable', 'issuer'], ['btc', 'l1'], ['eth', 'l1'], ['stable', 'l1'],
  ['alt', 'dex'], ['rwa', 'issuer'], ['rwa', 'bank'], ['rpc', 'wallet'], ['rpc', 'l1'], ['l2', 'l1'],
  ['validators', 'l1'], ['perps', 'wallet'], ['perps', 'oracle'], ['pay', 'issuer'], ['pay', 'bank'],
  ['reg', 'issuer'], ['reg', 'broker'], ['analytics', 'cex'], ['audit', 'issuer'], ['audit', 'dex'],
  ['data', 'cex'], ['eth', 'staking'], ['ramp', 'bank'], ['ramp', 'wallet'], ['vc', 'project'],
];
const seen = new Set();
export const LINKS = [];
for (const [a, b] of [...FLOWS.flatMap((f) => f.steps.map((s) => [s.from, s.to])), ...EXTRA]) {
  if (a === b) continue;
  const k = a < b ? `${a}|${b}` : `${b}|${a}`;
  if (!seen.has(k)) { seen.add(k); LINKS.push([a, b]); }
}
