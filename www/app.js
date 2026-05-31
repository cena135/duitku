// ============================================================
// DuitKu v2.0 — Apple HIG, fully featured personal finance
// Vanilla JS, localStorage, offline, customizable
// Features: accounts, tags, recurring, debts, split bill,
//           calendar view, receipt photo, voice input,
//           notifications, CSV export, period comparison,
//           web share, transfer between accounts
// ============================================================

const STORAGE_KEY = 'duitku.v1';
const VERSION = '2.0.0';

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'food',          name: 'Makanan',     icon: '🍔' },
    { id: 'transport',     name: 'Transport',   icon: '🚗' },
    { id: 'shopping',      name: 'Belanja',     icon: '🛍️' },
    { id: 'bills',         name: 'Tagihan',     icon: '🧾' },
    { id: 'entertainment', name: 'Hiburan',     icon: '🎮' },
    { id: 'health',        name: 'Kesehatan',   icon: '💊' },
    { id: 'education',     name: 'Pendidikan',  icon: '📚' },
    { id: 'family',        name: 'Keluarga',    icon: '👨‍👩‍👧' },
    { id: 'gift',          name: 'Hadiah',      icon: '🎁' },
    { id: 'travel',        name: 'Liburan',     icon: '✈️' },
    { id: 'subscription',  name: 'Langganan',   icon: '🔁' },
    { id: 'other',         name: 'Lainnya',     icon: '📦' },
  ],
  income: [
    { id: 'salary',     name: 'Gaji',      icon: '💼' },
    { id: 'freelance',  name: 'Freelance', icon: '💻' },
    { id: 'business',   name: 'Usaha',     icon: '🏪' },
    { id: 'investment', name: 'Investasi', icon: '📈' },
    { id: 'gift_in',    name: 'Hadiah',    icon: '🎁' },
    { id: 'other_in',   name: 'Lainnya',   icon: '➕' },
  ],
  subscription: [
    { id: 'streaming',    name: 'Streaming',     icon: '🎬' },
    { id: 'music',        name: 'Musik',         icon: '🎵' },
    { id: 'internet',     name: 'Internet',      icon: '🌐' },
    { id: 'telco',        name: 'Pulsa/Paket',   icon: '📱' },
    { id: 'cloud',        name: 'Cloud',         icon: '☁️' },
    { id: 'productivity', name: 'Produktivitas', icon: '⚡' },
    { id: 'fitness',      name: 'Fitness',       icon: '🏋️' },
    { id: 'gaming',       name: 'Game',          icon: '🎮' },
    { id: 'news',         name: 'Berita',        icon: '📰' },
    { id: 'other',        name: 'Lainnya',       icon: '📦' },
  ],
};

const ACCOUNT_TYPES = {
  cash:       { label: 'Tunai',      icon: '💵', color: '#34c759' },
  bank:       { label: 'Bank',       icon: '🏦', color: '#007aff' },
  ewallet:    { label: 'E-Wallet',   icon: '📱', color: '#af52de' },
  credit:     { label: 'Kartu Kredit', icon: '💳', color: '#ff3b30' },
  savings:    { label: 'Tabungan',   icon: '🐷', color: '#ff9500' },
  investment: { label: 'Investasi',  icon: '📈', color: '#5856d6' },
};

const DEFAULT_ACCOUNTS = [
  { id: 'acc_cash',    name: 'Tunai',    type: 'cash',    initialBalance: 0, includeInTotal: true, archived: false },
  { id: 'acc_bank',    name: 'Bank',     type: 'bank',    initialBalance: 0, includeInTotal: true, archived: false },
  { id: 'acc_ewallet', name: 'E-Wallet', type: 'ewallet', initialBalance: 0, includeInTotal: true, archived: false },
];

const CYCLES = {
  weekly:    { label: 'Mingguan',     months: 12/52 },
  monthly:   { label: 'Bulanan',      months: 1 },
  quarterly: { label: 'Per 3 Bulan',  months: 3 },
  yearly:    { label: 'Tahunan',      months: 12 },
};

const ACCENTS = {
  blue:   { light: '#007aff', dark: '#0a84ff', name: 'Biru' },
  green:  { light: '#34c759', dark: '#30d158', name: 'Hijau' },
  indigo: { light: '#5856d6', dark: '#5e5ce6', name: 'Indigo' },
  orange: { light: '#ff9500', dark: '#ff9f0a', name: 'Oranye' },
  pink:   { light: '#ff2d55', dark: '#ff375f', name: 'Pink' },
  purple: { light: '#af52de', dark: '#bf5af2', name: 'Ungu' },
  red:    { light: '#ff3b30', dark: '#ff453a', name: 'Merah' },
  teal:   { light: '#5ac8fa', dark: '#64d2ff', name: 'Tosca' },
  yellow: { light: '#ffcc00', dark: '#ffd60a', name: 'Kuning' },
};

const CURRENCIES = {
  IDR: { symbol: 'Rp',  position: 'before', decimals: 0, locale: 'id-ID', name: 'Rupiah (Rp)' },
  USD: { symbol: '$',   position: 'before', decimals: 2, locale: 'en-US', name: 'US Dollar ($)' },
  EUR: { symbol: '€',   position: 'before', decimals: 2, locale: 'de-DE', name: 'Euro (€)' },
  GBP: { symbol: '£',   position: 'before', decimals: 2, locale: 'en-GB', name: 'Pound (£)' },
  JPY: { symbol: '¥',   position: 'before', decimals: 0, locale: 'ja-JP', name: 'Yen (¥)' },
  SGD: { symbol: 'S$',  position: 'before', decimals: 2, locale: 'en-SG', name: 'Singapore (S$)' },
  MYR: { symbol: 'RM',  position: 'before', decimals: 2, locale: 'ms-MY', name: 'Ringgit (RM)' },
  AUD: { symbol: 'A$',  position: 'before', decimals: 2, locale: 'en-AU', name: 'Australia (A$)' },
  CNY: { symbol: '¥',   position: 'before', decimals: 2, locale: 'zh-CN', name: 'Yuan (¥)' },
};

const CHART_COLORS = ['#34c759','#007aff','#ff9500','#ff3b30','#af52de','#5ac8fa','#ff2d55','#5856d6','#ffcc00','#30d158','#ff9f0a','#0a84ff'];

const TITLES = {
  dashboard:    'Beranda',
  expense:      'Transaksi',
  subscription: 'Langganan',
  budget:       'Budget',
  reports:      'Laporan',
  settings:     'Pengaturan',
  accounts:     'Akun & Dompet',
  debts:        'Hutang & Piutang',
  tags:         'Tag',
};

const MAIN_TABS = ['dashboard','expense','subscription','budget','reports'];

const EMOJI_PALETTE = [
  '🍔','🍕','🍣','🍰','🍜','🍱','☕','🍺',
  '🚗','🚌','🚲','✈️','🛵','⛽','🚇','🚖',
  '🛍️','👕','👟','💍','💼','👜','🎒','👓',
  '🧾','💡','💧','📡','🏠','🔥','📺','📞',
  '🎮','🎬','🎵','🎤','🎨','📚','🎭','🎯',
  '💊','🏥','💉','🩺','🦷','👁️','💪','🧘',
  '🎁','🎂','🌹','🎉','💐','🍫','🥂','🎊',
  '📱','💻','⌚','🖥️','📷','🎧','🔋','🖨️',
  '👨‍👩‍👧','👶','🐶','🐱','👫','👼','💑','🧑',
  '📈','💰','💵','💳','🏦','💎','📊','🪙',
  '🏋️','⚽','🏀','🎾','🏊','🚴','⛳','🏃',
  '☁️','🌍','🌐','⚡','🔁','🔄','📦','🌟',
];

const TAG_COLORS = ['#007aff','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa','#ff2d55','#5856d6'];

// Timing constants — single source of truth for animation/interaction durations (ms)
const TIMING = {
  LONG_PRESS_ROW:   480,   // tx/sub/debt row long-press to open context menu
  LONG_PRESS_FAB:   500,   // FAB long-press to open quick-add sheet
  COUNT_UP:         600,   // hero number count-up animation
  TOAST_NORMAL:    2200,
  TOAST_UNDO:      5000,
  SUCCESS_OVERLAY:  700,
  GOAL_OVERLAY:     900,
  CONFETTI_TOTAL:  3500,   // confetti cleanup delay
  NOTIF_THROTTLE:  3600000, // 1 hour between notification checks
  NOTIF_FIRE_DELAY: 1500,  // wait after app load before firing notifications
  TOAST_AUTOREC:    800,
};

// Recurring auto-execute safety cap (max backfills per sub per load)
const AUTO_RENEW_SAFETY_MAX = 36;

// Confetti count
const CONFETTI_PIECES = 80;

// Recent-suggestion lookback in days
const SUGGEST_LOOKBACK_DAYS = 60;

// Dashboard "upcoming subs" window
const UPCOMING_SUB_DAYS = 14;

// ============================================================
// STATE & STORAGE
// ============================================================

// Balance cache (declared early — referenced by save() which is called during migrate())
let _balanceCache = null;

let state = load() || defaultState();
migrate();

let ui = {
  view: 'dashboard',
  navStack: [],          // for back navigation through sub-views
  vmode: 'list',         // list | calendar (for expense view)
  filter: 'all',
  accountFilter: 'all',  // 'all' | accountId
  tagFilter: 'all',      // 'all' | tagId
  quickFilter: 'all',    // all | today | week | month | year
  searchQuery: '',
  monthOffset: 0,
  reportOffset: 0,
  budgetTab: 'budget-tab',
  debtFilter: 'all',
  selectedCalDay: null,
  currentModalSave: null,
};
let pieChart = null;
let lineChart = null;
let netWorthChart = null;
let dowChart = null;
let systemDarkMQ = null;
let voiceRecognition = null;

function defaultState() {
  return {
    accounts: JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS)),
    expenses: [],
    subscriptions: [],
    budgets: {},
    goals: [],
    debts: [],
    tags: [],
    settings: {
      theme: 'auto',
      accent: 'green',
      currency: 'IDR',
      density: 'comfortable',
      monthStartDay: 1,
      showDecimals: false,
      haptic: true,
      autoExecRecurring: true,
      notifications: false,
      lastNotifCheck: 0,
      customCategories: {},
      defaultAccountId: 'acc_cash',
      budgetRollover: false,  // when true, unused prev-month budget carries forward
    },
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

// Balance cache: invalidated on every state mutation via save().
// Converts accountBalance from O(N expenses) per call to O(1) lookup
// after a single O(N) build per save() cycle. Critical when render
// loops call accountBalance on every account row.
// (declared at top of file due to TDZ — referenced by save() during migrate())

function save() {
  _balanceCache = null;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { toast.error('Gagal simpan: ' + e.message); }
}

function _buildBalanceCache() {
  _balanceCache = new Map();
  state.accounts.forEach(a => _balanceCache.set(a.id, a.initialBalance || 0));
  state.expenses.forEach(t => {
    if (t.type === 'transfer') {
      if (_balanceCache.has(t.fromAccountId)) _balanceCache.set(t.fromAccountId, _balanceCache.get(t.fromAccountId) - t.amount);
      if (_balanceCache.has(t.toAccountId))   _balanceCache.set(t.toAccountId,   _balanceCache.get(t.toAccountId)   + t.amount);
    } else if (_balanceCache.has(t.accountId)) {
      const sign = t.type === 'income' ? 1 : t.type === 'expense' ? -1 : 0;
      if (sign) _balanceCache.set(t.accountId, _balanceCache.get(t.accountId) + sign * t.amount);
    }
  });
}

function migrate() {
  if (!state) return;
  const d = defaultState();
  // Ensure all top-level keys exist
  state.accounts      = state.accounts      || d.accounts;
  state.expenses      = state.expenses      || [];
  state.subscriptions = state.subscriptions || [];
  state.budgets       = state.budgets       || {};
  state.goals         = state.goals         || [];
  state.debts         = state.debts         || [];
  state.tags          = state.tags          || [];
  state.settings      = { ...d.settings, ...(state.settings || {}) };
  state.settings.customCategories = state.settings.customCategories || {};

  // Ensure default account exists if no accounts at all
  if (state.accounts.length === 0) {
    state.accounts = JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
  }
  // Default account id
  if (!state.accounts.find(a => a.id === state.settings.defaultAccountId)) {
    state.settings.defaultAccountId = state.accounts[0].id;
  }

  // Migrate transactions: ensure each has accountId, tags array
  state.expenses.forEach(t => {
    if (!t.accountId) t.accountId = state.settings.defaultAccountId;
    if (!Array.isArray(t.tags)) t.tags = [];
  });

  // Migrate subscriptions: ensure type, accountId, autoExecute fields
  state.subscriptions.forEach(s => {
    if (!s.type) s.type = 'expense';
    if (!s.accountId) s.accountId = state.settings.defaultAccountId;
    if (s.autoExecute === undefined) s.autoExecute = false;
    if (!Array.isArray(s.tags)) s.tags = [];
    if (s.endDate === undefined) s.endDate = null;
  });

  // Debts: ensure payments array
  state.debts.forEach(d => {
    if (!Array.isArray(d.payments)) d.payments = [];
  });

  save();
}

// ============================================================
// HELPERS — Categories / Accounts / Tags
// ============================================================

function getCategories(type) {
  const custom = state.settings.customCategories?.[type];
  return (custom && custom.length > 0) ? custom : DEFAULT_CATEGORIES[type];
}
function getCategory(type, id) {
  return getCategories(type).find(c => c.id === id) || { name: 'Lainnya', icon: '📦', id: 'other' };
}

function getAccounts(includeArchived = false) {
  return state.accounts.filter(a => includeArchived || !a.archived);
}
function getAccount(id) {
  return state.accounts.find(a => a.id === id) || null;
}
function accountTypeInfo(t) { return ACCOUNT_TYPES[t] || ACCOUNT_TYPES.cash; }
function accountBalance(account) {
  if (!account) return 0;
  if (_balanceCache === null) _buildBalanceCache();
  return _balanceCache.get(account.id) ?? (account.initialBalance || 0);
}
function totalBalance() {
  return getAccounts().filter(a => a.includeInTotal !== false).reduce((s, a) => s + accountBalance(a), 0);
}

function getTags() { return state.tags || []; }
function getTag(id) { return state.tags.find(t => t.id === id) || null; }

// Recent suggestions: top N most-frequent tx by name+amount in last 60 days.
// Falls back to last N recent unique tx (regardless of frequency) when no repeats exist.
function getRecentSuggestions(type, limit = 5) {
  const cutoff = isoDate(new Date(Date.now() - SUGGEST_LOOKBACK_DAYS * 86400000));
  const map = new Map();
  state.expenses
    .filter(t => t.type === type && t.date >= cutoff && t.name)
    .forEach(t => {
      const key = `${t.name.toLowerCase()}|${t.amount}`;
      const ex = map.get(key);
      if (ex) { ex.count++; if (t.date > ex.date) ex.date = t.date; }
      else map.set(key, { name: t.name, amount: t.amount, category: t.category, accountId: t.accountId, count: 1, date: t.date });
    });
  const sorted = Array.from(map.values()).sort((a,b) =>
    (b.count - a.count) || b.date.localeCompare(a.date)
  );
  // If we have repeated tx, use those. Otherwise fall back to most recent uniques.
  const hasRepeats = sorted.some(s => s.count > 1);
  if (hasRepeats) return sorted.slice(0, limit);
  // Fallback: most-recent uniques (still capped to last 60 days)
  return sorted.slice(0, limit);
}

// Suggest category from past tx with similar name. Uses two sources:
// 1) Explicit user-taught mappings in state.settings.categoryLearning (most authoritative)
// 2) Inference from most-recent past tx with name containing the query
function suggestCategory(name, type) {
  if (!name || name.length < 2) return null;
  const needle = name.toLowerCase().trim();
  // 1) User-taught: exact or prefix match
  const learned = state.settings.categoryLearning?.[type] || {};
  for (const [pattern, catId] of Object.entries(learned)) {
    if (needle.includes(pattern.toLowerCase())) return catId;
  }
  // 2) Recent similar-name tx (existing inference)
  const matches = state.expenses
    .filter(t => t.type === type && t.name && t.name.toLowerCase().includes(needle))
    .sort((a,b) => b.date.localeCompare(a.date));
  if (matches.length === 0) return null;
  return matches[0].category;
}

// Record a learned name→category mapping. Called when user saves a tx
// and the name+category combo is consistent (3+ times) — auto-strengthens.
function learnCategoryFromTx(t) {
  if (!t || !t.name || !t.category || t.type !== 'expense' && t.type !== 'income') return;
  const name = t.name.toLowerCase().trim();
  if (name.length < 3) return;
  // Count how many times this name has been categorized the same way
  const sameNameTxs = state.expenses.filter(x => x.type === t.type && x.name && x.name.toLowerCase().trim() === name);
  const sameCat = sameNameTxs.filter(x => x.category === t.category);
  // If 3+ matches with same cat, learn it
  if (sameCat.length >= 3) {
    state.settings.categoryLearning = state.settings.categoryLearning || {};
    state.settings.categoryLearning[t.type] = state.settings.categoryLearning[t.type] || {};
    state.settings.categoryLearning[t.type][name] = t.category;
  }
}

// ============================================================
// FORMAT HELPERS
// ============================================================

function money(n) {
  const cur = CURRENCIES[state.settings.currency] || CURRENCIES.IDR;
  const decimals = state.settings.showDecimals ? cur.decimals : 0;
  const formatted = new Intl.NumberFormat(cur.locale, {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(Number(n) || 0);
  return cur.symbol + ' ' + formatted;
}
function moneyShort(n) {
  const cur = CURRENCIES[state.settings.currency] || CURRENCIES.IDR;
  const v = Number(n) || 0;
  if (state.settings.currency === 'IDR') {
    if (Math.abs(v) >= 1_000_000_000) return cur.symbol + ' ' + (v / 1_000_000_000).toFixed(1).replace('.0','') + ' M';
    if (Math.abs(v) >= 1_000_000)     return cur.symbol + ' ' + (v / 1_000_000).toFixed(1).replace('.0','') + ' jt';
    if (Math.abs(v) >= 1_000)         return cur.symbol + ' ' + Math.round(v / 1_000) + 'rb';
    return money(v);
  }
  if (Math.abs(v) >= 1_000_000_000) return cur.symbol + (v / 1_000_000_000).toFixed(1).replace('.0','') + 'B';
  if (Math.abs(v) >= 1_000_000)     return cur.symbol + (v / 1_000_000).toFixed(1).replace('.0','') + 'M';
  if (Math.abs(v) >= 1_000)         return cur.symbol + (v / 1_000).toFixed(1).replace('.0','') + 'k';
  return money(v);
}
function moneyTiny(n) {
  // For very narrow contexts (calendar day)
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.0','') + 'jt';
  if (Math.abs(v) >= 1_000)     return Math.round(v / 1_000) + 'rb';
  return String(Math.round(v));
}
const shortDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
const fullDate  = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const monthYear = (d) => new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
const isoDate = (d = new Date()) => {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};

// ============================================================
// UTILS
// ============================================================

function uid() { return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.from(document.querySelectorAll(sel)); }
function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v == null) {}
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}

// ============================================================
// PICKER HELPERS (deduped from ~230 lines of modal duplication)
// ============================================================

// Build the iOS-style category emoji grid. `getState` lets the
// caller refresh the active selection on rebuild.
function buildCategoryPicker(type, getCurrent, onChange) {
  const cats = getCategories(type);
  const grid = el('div', { class: 'cat-grid', role: 'radiogroup', 'aria-label': 'Pilih kategori' });
  const refresh = () => {
    grid.querySelectorAll('.cat-tile').forEach((tl, i) =>
      tl.classList.toggle('active', cats[i].id === getCurrent()));
  };
  cats.forEach(c => {
    grid.appendChild(el('div', {
      class: 'cat-tile' + (getCurrent() === c.id ? ' active' : ''),
      tabindex: '0', role: 'radio',
      'aria-checked': getCurrent() === c.id ? 'true' : 'false',
      'aria-label': c.name,
      onclick: () => { onChange(c.id); haptic(5); refresh(); }
    }, el('div', { class: 'ic' }, c.icon), c.name));
  });
  grid.refresh = refresh;
  return grid;
}

// Build account selection tile grid. `validateChange` allows callers
// (transfer) to reject invalid choices. Returns the grid element.
function buildAccountPicker(getCurrent, onChange, opts = {}) {
  const accs = opts.accounts || getAccounts();
  const grid = el('div', { class: 'account-picker-grid', role: 'radiogroup', 'aria-label': 'Pilih akun' });
  accs.forEach(a => {
    const info = accountTypeInfo(a.type);
    grid.appendChild(el('div', {
      class: 'account-picker-tile' + (getCurrent() === a.id ? ' active' : ''),
      tabindex: '0', role: 'radio',
      'aria-checked': getCurrent() === a.id ? 'true' : 'false',
      'aria-label': a.name + ' (' + info.label + ')',
      onclick: () => {
        if (opts.validate && !opts.validate(a.id)) return;
        onChange(a.id);
        haptic(5);
        grid.querySelectorAll('.account-picker-tile').forEach((tl, i) =>
          tl.classList.toggle('active', accs[i].id === getCurrent()));
      }
    },
      el('div', { class: 'acct-emoji', style: `background:${info.color}` }, info.icon),
      a.name
    ));
  });
  return grid;
}

// Build account TYPE picker (for new-account modal). Same shape but
// iterates ACCOUNT_TYPES not accounts.
function buildAccountTypePicker(getCurrent, onChange) {
  const types = Object.entries(ACCOUNT_TYPES);
  const grid = el('div', { class: 'account-picker-grid' });
  types.forEach(([key, info]) => {
    grid.appendChild(el('div', {
      class: 'account-picker-tile' + (getCurrent() === key ? ' active' : ''),
      onclick: () => {
        onChange(key);
        haptic(5);
        grid.querySelectorAll('.account-picker-tile').forEach((tl, i) =>
          tl.classList.toggle('active', types[i][0] === getCurrent()));
      }
    },
      el('div', { class: 'acct-emoji', style: `background:${info.color}` }, info.icon),
      info.label
    ));
  });
  return grid;
}

// iOS-style switch toggle. Returns an element whose .on class reflects state.
function buildSwitch(initial, onChange) {
  const sw = el('div', { class: 'switch' + (initial ? ' on' : '') });
  sw.addEventListener('click', () => {
    const newVal = !sw.classList.contains('on');
    sw.classList.toggle('on', newVal);
    onChange(newVal);
  });
  return sw;
}

// iOS-style segmented type switch with 2 options. Each option has
// { key, label, classExtra } where classExtra is e.g. 'expense' or 'income'.
function buildTypeSwitch(getCurrent, options, onChange) {
  const wrap = el('div', { class: 'type-switch' });
  options.forEach(o => {
    const btn = el('button', {
      class: o.classExtra + ' ' + (getCurrent() === o.key ? 'active ' + o.classExtra : ''),
      onclick: () => { onChange(o.key); rebuildModalBody(); }
    }, o.label);
    wrap.appendChild(btn);
  });
  return wrap;
}
function getMonthDate(offset = 0) {
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + offset); return d;
}
function getMonthBounds(refDate) {
  const startDay = state.settings.monthStartDay || 1;
  const y = refDate.getFullYear(), m = refDate.getMonth();
  const start = new Date(y, m, startDay);
  const end = new Date(y, m + 1, startDay);
  end.setDate(end.getDate() - 1);
  return { start, end };
}
function isInMonth(dateStr, refDate) {
  const d = new Date(dateStr);
  const { start, end } = getMonthBounds(refDate);
  return d >= start && d <= end;
}
function isToday(dateStr) { return dateStr === isoDate(); }
function daysUntil(dateStr) {
  const today = new Date(isoDate());
  const target = new Date(dateStr);
  return Math.round((target - today) / 86400000);
}
function subMonthlyCost(sub) {
  const cycle = CYCLES[sub.cycle] || CYCLES.monthly;
  return sub.amount / cycle.months;
}
function expenseSign(t) {
  if (t.type === 'income') return 1;
  if (t.type === 'expense') return -1;
  return 0; // transfer is net-neutral
}
function haptic(ms = 8) { if (state.settings.haptic && navigator.vibrate) navigator.vibrate(ms); }

// Semantic haptic patterns — each action gets its own tactile signature.
// Real Android phones translate these into distinct buzz "fingerprints".
const HAPTIC = {
  tap:      [5],
  select:   [8],
  toggle:   [10],
  save:     [15],
  delete:   [25, 30, 25],          // double-buzz alert
  error:    [40, 80, 40],          // longer warning
  goal:     [30, 50, 30, 50, 30],  // celebratory
  streak:   [20, 30, 20],          // gentle 3-beat
  navigate: [3],
  longPress:[20],
  refresh:  [12, 8, 12],
};
function hap(kind) {
  const pattern = HAPTIC[kind];
  if (pattern && state.settings.haptic && navigator.vibrate) navigator.vibrate(pattern);
}
function avatarInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0,2).map(w => w[0] || '').join('').toUpperCase();
}
function avatarColorClass(name) {
  if (!name) return 'av-1';
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xfffffff;
  return 'av-' + (Math.abs(hash) % 8 + 1);
}

// ============================================================
// TOAST
// ============================================================

// Toast variants — accept opts.kind in {success, error, warning, info}
// Auto-icon prefix based on kind. Backwards-compatible.
const TOAST_ICONS = { success: '✓', error: '⚠️', warning: '⚠️', info: 'ℹ️' };
let toastTimer = null;
function toast(msg, opts = {}) {
  const t = $('#toast');
  t.innerHTML = '';
  t.className = 'toast' + (opts.kind ? ' ' + opts.kind : '');
  // Icon
  const ic = TOAST_ICONS[opts.kind];
  if (ic) {
    const ie = document.createElement('span');
    ie.className = 'toast-icon';
    ie.textContent = ic;
    t.appendChild(ie);
  }
  t.appendChild(document.createTextNode(msg));
  if (opts.action) {
    const btn = document.createElement('button');
    btn.className = 'toast-action';
    btn.textContent = opts.action.label || 'Urungkan';
    btn.onclick = () => {
      try { opts.action.onClick(); } catch {}
      t.classList.add('hidden');
    };
    t.appendChild(btn);
  }
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  const ms = opts.ms || (opts.action ? TIMING.TOAST_UNDO : TIMING.TOAST_NORMAL);
  toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
  // Tactile feedback if kind is supplied
  if (opts.kind === 'error' || opts.kind === 'warning') hap('error');
}
// Convenience wrappers
toast.success = (msg, opts={}) => toast(msg, { ...opts, kind:'success' });
toast.error   = (msg, opts={}) => toast(msg, { ...opts, kind:'error' });
toast.warning = (msg, opts={}) => toast(msg, { ...opts, kind:'warning' });
toast.info    = (msg, opts={}) => toast(msg, { ...opts, kind:'info' });

// ============================================================
// SUCCESS OVERLAY + CONFETTI
// ============================================================

function showSuccess(ms = TIMING.SUCCESS_OVERLAY) {
  const o = $('#successOverlay');
  if (!o) return;
  // Re-trigger animation by removing/adding
  o.classList.add('hidden');
  // Force reflow
  void o.offsetWidth;
  o.classList.remove('hidden');
  setTimeout(() => o.classList.add('hidden'), ms);
}

function fireConfetti(count = CONFETTI_PIECES) {
  const wrap = $('#confettiWrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  wrap.classList.remove('hidden');
  const colors = ['#34c759','#007aff','#ff9500','#ff3b30','#af52de','#5ac8fa','#ffcc00','#ff2d55'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = Math.random() * 0.5 + 's';
    p.style.animationDuration = 1.8 + Math.random() * 1.2 + 's';
    p.style.transform = `rotateZ(${Math.random() * 360}deg)`;
    wrap.appendChild(p);
  }
  setTimeout(() => { wrap.classList.add('hidden'); wrap.innerHTML = ''; }, TIMING.CONFETTI_TOTAL);
}

// ============================================================
// COUNT-UP NUMBER ANIMATION
// ============================================================

const _countupStates = new WeakMap();
function countUp(elemOrSel, target, opts = {}) {
  const el = typeof elemOrSel === 'string' ? $(elemOrSel) : elemOrSel;
  if (!el) return;
  const duration = opts.duration ?? TIMING.COUNT_UP;
  const format = opts.format || ((v) => Math.round(v).toString());
  const prev = _countupStates.get(el) ?? 0;
  if (Math.abs(target - prev) < 0.5) { el.textContent = format(target); return; }
  const start = performance.now();
  // Cancel previous animation
  if (el._countupRaf) cancelAnimationFrame(el._countupRaf);
  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    const v = prev + (target - prev) * eased;
    el.textContent = format(v);
    if (t < 1) el._countupRaf = requestAnimationFrame(tick);
    else { el.textContent = format(target); el._countupRaf = null; }
  }
  el._countupRaf = requestAnimationFrame(tick);
  _countupStates.set(el, target);
}

// ============================================================
// THEME
// ============================================================

function applyTheme() {
  let theme = state.settings.theme || 'auto';
  if (theme === 'auto') theme = (systemDarkMQ?.matches) ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-density', state.settings.density || 'comfortable');

  const accentKey = state.settings.accent || 'green';
  const accent = ACCENTS[accentKey] || ACCENTS.green;
  const color = accent[theme];
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-tint', hexToRgba(color, 0.18));
  document.documentElement.style.setProperty('--accent-ink', '#ffffff');

  const iconColor = encodeURIComponent(color);
  const iconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='${iconColor}'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='white' font-family='-apple-system,system-ui' font-weight='800'%3ERp%3C/text%3E%3C/svg%3E`;
  $('#favicon')?.setAttribute('href', iconSvg);
  $('#appleicon')?.setAttribute('href', iconSvg);

  // Only re-render charts if reports view is currently visible (avoid wasted work + hidden canvas glitches)
  if (ui.view === 'reports' && !$('.view[data-view="reports"]')?.classList.contains('hidden')) {
    renderReports();
  }
}
function hexToRgba(hex, alpha) {
  const v = hex.replace('#','');
  const r = parseInt(v.slice(0,2), 16);
  const g = parseInt(v.slice(2,4), 16);
  const b = parseInt(v.slice(4,6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ============================================================
// NAVIGATION
// ============================================================

function navigate(view, opts = {}) {
  const prev = ui.view;
  if (opts.push) ui.navStack.push(ui.view);
  else if (!opts.skipStack) ui.navStack = [];
  ui.view = view;

  // Compute transition direction based on main-tab index (slide animation feels iOS-native)
  const prevIdx = MAIN_TABS.indexOf(prev);
  const nextIdx = MAIN_TABS.indexOf(view);
  let transitionClass = 'fade-soft';
  if (prevIdx >= 0 && nextIdx >= 0 && prevIdx !== nextIdx) {
    transitionClass = nextIdx > prevIdx ? 'slide-from-right' : 'slide-from-left';
  }

  $$('.view').forEach(v => {
    v.classList.remove('slide-from-right', 'slide-from-left', 'fade-soft');
    v.classList.toggle('hidden', v.dataset.view !== view);
    if (v.dataset.view === view) {
      // Force reflow so the animation re-fires on the visible view
      void v.offsetWidth;
      v.classList.add(transitionClass);
    }
  });

  $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.nav === view));
  // Update sliding pill indicator on tab-bar
  if (nextIdx >= 0) $('.tab-bar')?.setAttribute('data-active', String(nextIdx));

  $('#navTitle').textContent = TITLES[view] || 'DuitKu';
  $('#topbar').classList.remove('scrolled');
  $('#navBackBtn').style.display = ui.navStack.length > 0 ? '' : 'none';

  try { history.replaceState(null, '', '#' + view); } catch {}

  window.scrollTo({ top: 0, behavior: 'auto' });
  render();
}
function goBack() {
  if (ui.navStack.length === 0) return navigate('dashboard');
  const prev = ui.navStack.pop();
  navigate(prev, { skipStack: true });
}
function render() {
  switch (ui.view) {
    case 'dashboard':    renderDashboard(); break;
    case 'expense':      renderExpense(); break;
    case 'subscription': renderSubscription(); break;
    case 'budget':       renderBudget(); break;
    case 'reports':      renderReports(); break;
    case 'settings':     renderSettings(); break;
    case 'accounts':     renderAccounts(); break;
    case 'debts':        renderDebts(); break;
    case 'tags':         renderTags(); break;
  }
}

function setupScrollObserver() {
  const topbar = $('#topbar');
  const handler = () => {
    const scrolled = (window.scrollY || document.documentElement.scrollTop) > 28;
    topbar.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

// ============================================================
// ILLUSTRATED EMPTY STATE
// ============================================================
function illustratedEmpty(icon, title, desc) {
  return el('div', { class: 'list-empty-illustrated' },
    el('div', { class: 'empty-icon' }, icon),
    el('div', { class: 'empty-title' }, title),
    desc ? el('div', { class: 'empty-desc' }, desc) : null
  );
}

// ============================================================
// TAP RIPPLE — Material-style touch feedback on cells/rows
// ============================================================
function setupTapRipple() {
  const RIPPLE_SEL = '.cell, .tx-row, .account-row, .budget-card, .goal-card, .debt-row, .menu-item, .accent-swatch';
  const handler = (e) => {
    const t = e.target.closest(RIPPLE_SEL);
    if (!t) return;
    if (!t.classList.contains('ripple')) t.classList.add('ripple');
    const rect = t.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const x = (point.clientX || rect.left + rect.width/2) - rect.left;
    const y = (point.clientY || rect.top  + rect.height/2) - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.2;
    const r = document.createElement('span');
    r.className = 'ripple-effect';
    r.style.width = r.style.height = size + 'px';
    r.style.left = (x - size/2) + 'px';
    r.style.top  = (y - size/2) + 'px';
    t.appendChild(r);
    setTimeout(() => r.remove(), 560);
  };
  document.addEventListener('mousedown', handler, { passive: true });
  document.addEventListener('touchstart', handler, { passive: true });
}

// ============================================================
// SPARKLINE — 7-day account spending mini-chart
// ============================================================
function buildSparkline(accountId, days = 7) {
  const today = new Date();
  const points = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const iso = isoDate(d);
    const spend = state.expenses
      .filter(t => t.date === iso && t.type === 'expense' && t.accountId === accountId)
      .reduce((s, t) => s + t.amount, 0);
    points.push(spend);
  }
  const max = Math.max(1, ...points);
  const W = 60, H = 18;
  const stepX = W / (days - 1);
  const path = points.map((v, i) => {
    const x = i * stepX;
    const y = H - (v / max) * (H - 2) - 1;
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ');
  const area = path + ` L ${W} ${H} L 0 ${H} Z`;
  // SVG must use createElementNS to render; el() uses createElement which puts it in HTML namespace.
  // Wrap in a span and inject SVG via innerHTML so the browser parses it correctly.
  const wrap = document.createElement('span');
  wrap.style.cssText = 'display:inline-flex;align-items:center';
  wrap.innerHTML = `<svg class="sparkline" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<path class="area" d="${area}"/><path d="${path}"/></svg>`;
  return wrap.firstChild;
}

// ============================================================
// STATISTICS WIDGET — 7-day spending heatmap on dashboard
// ============================================================
function renderStatsWidget() {
  const wrap = $('#statsWidget');
  if (!wrap) return;
  // Hide for very-new users with little data
  const totalTx = state.expenses.filter(t => t.type === 'expense').length;
  if (totalTx < 3) { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  wrap.className = 'stats-widget';

  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const iso = isoDate(d);
    const spend = state.expenses
      .filter(t => t.date === iso && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    days.push({ date: d, iso, spend });
  }
  const totalWeek = days.reduce((s, d) => s + d.spend, 0);
  const maxDay = Math.max(1, ...days.map(d => d.spend));

  const dowShort = ['M','S','S','R','K','J','S']; // Sunday-first like calendar
  const _id_dows = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

  wrap.innerHTML = '';
  wrap.appendChild(el('div', { class: 'stats-header' },
    el('strong', {}, '📊 Minggu Ini'),
    el('span', {}, totalWeek > 0 ? 'Total ' + moneyShort(totalWeek) : 'Belum ada')
  ));

  const grid = el('div', { class: 'stats-week' });
  days.forEach(d => {
    const intensity = d.spend > 0 ? Math.min(4, Math.ceil((d.spend / maxDay) * 4)) : 0;
    const cls = ['stats-day'];
    if (intensity > 0) cls.push(intensity === 1 ? 'has-spend' : 'has-spend-' + intensity);
    if (d.iso === isoDate(today)) cls.push('today');
    grid.appendChild(el('div', { class: cls.join(' '), title: fullDate(d.iso) + ' — ' + moneyShort(d.spend) },
      el('div', { class: 'dow' }, _id_dows[d.date.getDay()][0]),
      el('div', { class: 'num' }, String(d.date.getDate()))
    ));
  });
  wrap.appendChild(grid);

  // Footer: start-end range + top category this week
  const first = days[0].date;
  const weekTx = state.expenses.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d >= first && d <= today;
  });
  const weekByCat = groupSpendingByCategory(weekTx);
  const sortedCats = Object.entries(weekByCat).sort((a,b) => b[1]-a[1]);
  const topCatEl = el('span', {}, 'Sekarang');
  if (sortedCats.length > 0 && totalWeek > 0) {
    const [topCatId, topAmt] = sortedCats[0];
    const cat = getCategory('expense', topCatId);
    const pct = Math.round((topAmt / totalWeek) * 100);
    topCatEl.textContent = '';
    topCatEl.appendChild(document.createTextNode('Top: ' + cat.icon + ' ' + cat.name + ' ' + pct + '%'));
  }
  wrap.appendChild(el('div', { class: 'stats-week-labels' },
    el('span', {}, shortDate(first.toISOString())),
    topCatEl
  ));
}

// ============================================================
// MODAL DRAG-TO-DISMISS — handle swipe-down to close
// ============================================================
function setupModalDrag() {
  const modal = $('#modal');
  const handle = modal?.querySelector('.modal-handle');
  if (!handle) return;
  let startY = 0, currentY = 0, dragging = false;

  const start = (e) => {
    if (modal.classList.contains('hidden')) return;
    startY = (e.touches?.[0] || e).clientY;
    currentY = startY;
    dragging = true;
    modal.classList.add('dragging');
  };
  const move = (e) => {
    if (!dragging) return;
    currentY = (e.touches?.[0] || e).clientY;
    const dy = Math.max(0, currentY - startY);
    modal.style.transform = `translate(-50%, ${dy}px)`;
    modal.style.opacity = String(1 - Math.min(0.5, dy / 600));
  };
  const end = () => {
    if (!dragging) return;
    dragging = false;
    modal.classList.remove('dragging');
    const dy = currentY - startY;
    if (dy > 120) {
      hideModal();
    }
    modal.style.transform = '';
    modal.style.opacity = '';
  };

  handle.addEventListener('mousedown', start);
  handle.addEventListener('touchstart', start, { passive: true });
  document.addEventListener('mousemove', move);
  document.addEventListener('touchmove', move, { passive: true });
  document.addEventListener('mouseup', end);
  document.addEventListener('touchend', end);
}

// ============================================================
// AUTO-EXECUTE RECURRING + NOTIFICATIONS
// ============================================================

function runAutoRecurring() {
  if (!state.settings.autoExecRecurring) return 0;
  let created = 0;
  state.subscriptions.forEach(s => {
    if (!s.autoExecute || s.active === false) return;
    let safety = 0;
    while (daysUntil(s.nextRenewal) < 0 && safety < AUTO_RENEW_SAFETY_MAX) {
      if (s.endDate && s.nextRenewal > s.endDate) { s.active = false; break; }
      state.expenses.push({
        id: uid(),
        type: s.type || 'expense',
        date: s.nextRenewal,
        category: s.category,
        name: s.name,
        amount: s.amount,
        note: `Auto: ${CYCLES[s.cycle].label}`,
        accountId: s.accountId || state.settings.defaultAccountId,
        tags: [],
        createdAt: Date.now(),
      });
      const d = new Date(s.nextRenewal);
      const months = CYCLES[s.cycle].months;
      if (months === 12/52) d.setDate(d.getDate() + 7);
      else d.setMonth(d.getMonth() + Math.round(months));
      s.nextRenewal = isoDate(d);
      created++;
      safety++;
    }
  });
  if (created > 0) save();
  return created;
}

function fireUpcomingNotifications() {
  if (!state.settings.notifications) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = Date.now();
  if (now - (state.settings.lastNotifCheck || 0) < TIMING.NOTIF_THROTTLE) return;
  state.settings.lastNotifCheck = now;
  save();
  state.subscriptions.filter(s => s.active !== false).forEach(s => {
    const d = daysUntil(s.nextRenewal);
    if (d >= 0 && d <= (s.reminderDays ?? 3)) {
      try {
        new Notification('DuitKu — Langganan akan jatuh tempo', {
          body: `${s.name} (${money(s.amount)}) — ${d === 0 ? 'hari ini' : d + ' hari lagi'}`,
          icon: $('#favicon')?.href,
          tag: 'sub-' + s.id + '-' + s.nextRenewal,
        });
      } catch {}
    }
  });
}

async function setupNotifications(enable) {
  if (!('Notification' in window)) { toast('Browser ini tidak dukung notifikasi'); return false; }
  if (enable) {
    const result = await Notification.requestPermission();
    state.settings.notifications = result === 'granted';
    if (!state.settings.notifications) toast('Izin notifikasi ditolak');
    else toast('Notifikasi aktif');
  } else {
    state.settings.notifications = false;
    toast('Notifikasi dimatikan');
  }
  save();
  renderSettings();
  return state.settings.notifications;
}

// ============================================================
// DASHBOARD
// ============================================================

function isStateEmpty() {
  // "Truly empty" = no user-added data anywhere
  return state.expenses.length === 0
      && state.subscriptions.length === 0
      && state.goals.length === 0
      && state.debts.length === 0
      && Object.keys(state.budgets).length === 0
      && state.accounts.every(a => (a.initialBalance || 0) === 0);
}

function renderDashboard() {
  // Onboarding visibility
  $('#onboardingCard').classList.toggle('hidden', !isStateEmpty());

  const ref = new Date();
  const monthTx = state.expenses.filter(t => isInMonth(t.date, ref));
  const income  = monthTx.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const expense = monthTx.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);

  countUp('#heroBalance', totalBalance(), { format: money });
  countUp('#heroIncome',  income,         { format: moneyShort });
  countUp('#heroExpense', expense,        { format: moneyShort });

  const h = new Date().getHours();
  const greet = h < 11 ? 'Selamat pagi 👋' : h < 15 ? 'Selamat siang 👋' : h < 18 ? 'Selamat sore 👋' : 'Selamat malam 👋';
  $('#greeting').textContent = greet;

  const todayTx = state.expenses.filter(t => isToday(t.date));
  const todayExp = todayTx.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  countUp('#todayExpense', todayExp, { format: moneyShort });
  countUp('#todayCount', todayTx.length, { format: (v) => String(Math.round(v)) });

  // Insight card (1-line trend)
  const insightCard = $('#insightCard');
  const insight = computeMonthInsight();
  if (insight && !isStateEmpty()) {
    insightCard.classList.remove('hidden');
    insightCard.className = 'insight-card';
    insightCard.setAttribute('data-kind', insight.kind);
    insightCard.innerHTML = '';
    insightCard.appendChild(el('div', { class: 'insight-icon' }, insight.icon));
    const txt = el('div', { class: 'insight-text ' + insight.tone });
    txt.innerHTML = insight.text;
    insightCard.appendChild(txt);
  } else {
    insightCard.classList.add('hidden');
  }

  // Streak badge
  const streak = computeStreak();
  const sb = $('#streakBadge');
  if (sb) {
    if (streak >= 2) {
      sb.innerHTML = '<span class="streak-pill">🔥 ' + streak + ' hari</span>';
    } else { sb.innerHTML = ''; }
  }

  // Stats widget (7-day heatmap)
  renderStatsWidget();

  // Accounts mini
  const accWrap = $('#dashAccounts');
  accWrap.innerHTML = '';
  const accs = getAccounts().slice(0, 4);
  if (accs.length > 0) {
    accWrap.appendChild(el('div', { class: 'group-body', style: 'margin:0 16px' },
      ...accs.map(a => renderAccountRow(a))
    ));
  }

  // Upcoming subs
  const upWrap = $('#upcomingSubs');
  upWrap.innerHTML = '';
  const upcoming = state.subscriptions
    .filter(s => s.active !== false)
    .map(s => ({ ...s, dleft: daysUntil(s.nextRenewal) }))
    .filter(s => s.dleft <= UPCOMING_SUB_DAYS)
    .sort((a,b) => a.dleft - b.dleft)
    .slice(0, 4);
  if (upcoming.length === 0) {
    upWrap.appendChild(el('div', { class: 'list-empty' }, 'Tidak ada langganan dalam ' + UPCOMING_SUB_DAYS + ' hari ke depan'));
  } else {
    upWrap.appendChild(el('div', { class: 'list-group' }, el('div', { class: 'list-group-rows' },
      ...upcoming.map(s => renderSubRow(s))
    )));
  }

  // Budget status
  const bsWrap = $('#budgetStatus');
  bsWrap.innerHTML = '';
  const budgetEntries = Object.entries(state.budgets).filter(([,v]) => v > 0);
  if (budgetEntries.length === 0) {
    bsWrap.appendChild(el('div', { class: 'list-empty' }, 'Belum ada budget — atur di tab Budget'));
  } else {
    const usedByCat = groupSpendingByCategory(monthTx);
    const list = el('div', { class: 'list' });
    budgetEntries
      .map(([cat, limit]) => ({ cat, limit, used: usedByCat[cat] || 0 }))
      .sort((a,b) => (b.used/b.limit) - (a.used/a.limit))
      .slice(0, 3)
      .forEach(b => list.appendChild(renderBudgetRow(b)));
    bsWrap.appendChild(list);
  }

  // Recent transactions
  const rtWrap = $('#recentTx');
  rtWrap.innerHTML = '';
  const recent = [...state.expenses].sort((a,b) => b.date.localeCompare(a.date) || (b.createdAt||0)-(a.createdAt||0)).slice(0,5);
  if (recent.length === 0) {
    rtWrap.appendChild(el('div', { class: 'list-empty' }, 'Belum ada transaksi. Tekan + untuk mulai.'));
  } else {
    rtWrap.appendChild(el('div', { class: 'list-group' }, el('div', { class: 'list-group-rows' },
      ...recent.map(t => renderTxRow(t))
    )));
  }
}

function groupSpendingByCategory(txs) {
  return txs.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount; return acc;
  }, {});
}

// Budget rollover: if enabled, surplus from previous month adds to current limit.
// Returns { effectiveLimit, rollover, baseLimit }.
function effectiveBudget(categoryId) {
  const base = state.budgets[categoryId] || 0;
  if (!state.settings.budgetRollover || base <= 0) {
    return { effectiveLimit: base, rollover: 0, baseLimit: base };
  }
  const prevRef = getMonthDate(-1);
  const prevTx = state.expenses.filter(t => isInMonth(t.date, prevRef) && t.type === 'expense' && t.category === categoryId);
  const prevUsed = prevTx.reduce((s, t) => s + t.amount, 0);
  const surplus = Math.max(0, base - prevUsed);
  return { effectiveLimit: base + surplus, rollover: surplus, baseLimit: base };
}

// ============================================================
// INSIGHTS + STREAK
// ============================================================

// Streak: consecutive days (counting back from today) with at least one transaction
function computeStreak() {
  if (state.expenses.length === 0) return 0;
  const datesSet = new Set();
  state.expenses.forEach(t => {
    if (t.type !== 'transfer') datesSet.add(t.date);
  });
  let streak = 0;
  const d = new Date();
  while (true) {
    if (datesSet.has(isoDate(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
    if (streak > 365) break; // safety
  }
  return streak;
}

// Compute current-month vs previous-month change. Returns null if no comparable data.
// Multi-variant: trend, category-trend, budget-warning, pace-projection, first-month,
// weekend-spike, savings-streak. Picks the most useful one for current state.
function computeMonthInsight() {
  const refThis = new Date();
  const refPrev = getMonthDate(-1);
  const thisExpenses = state.expenses.filter(t => isInMonth(t.date, refThis) && t.type === 'expense');
  const prevExpenses = state.expenses.filter(t => isInMonth(t.date, refPrev) && t.type === 'expense');
  const thisExp = thisExpenses.reduce((s,t) => s + t.amount, 0);
  const prevExp = prevExpenses.reduce((s,t) => s + t.amount, 0);
  if (prevExp === 0 && thisExp === 0) return null;
  if (prevExp === 0) {
    return { kind:'first-month', icon:'🚀', tone:'positive',
      text:`Bulan pertama nyatat — sudah <strong>${moneyShort(thisExp)}</strong>. Keep going!` };
  }

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
  const daysSoFar = today.getDate();
  const projection = (thisExp / Math.max(1, daysSoFar)) * daysInMonth;

  // Budget warning takes priority — if any budget is >90% spent
  const usedByCat = groupSpendingByCategory(thisExpenses);
  for (const [cat, limit] of Object.entries(state.budgets)) {
    if (limit <= 0) continue;
    const used = usedByCat[cat] || 0;
    if (used / limit >= 0.9 && daysSoFar < daysInMonth - 2) {
      const catName = getCategory('expense', cat).name;
      return { kind:'budget-warn', icon:'⚠️', tone:'warning',
        text:`Budget <strong>${catName}</strong> sudah ${((used/limit)*100).toFixed(0)}% terpakai. Sisa ${daysInMonth - daysSoFar} hari di bulan ini.` };
    }
  }

  // Category-trend: top category this month grew >50% vs prev
  const thisByCat = groupSpendingByCategory(thisExpenses);
  const prevByCat = groupSpendingByCategory(prevExpenses);
  let bigChangeCat = null, bigChangePct = 0;
  Object.entries(thisByCat).forEach(([cat, v]) => {
    const prev = prevByCat[cat] || 0;
    if (prev > 0 && v > 50000) {
      const pct = ((v - prev) / prev) * 100;
      if (Math.abs(pct) > Math.abs(bigChangePct)) {
        bigChangeCat = cat; bigChangePct = pct;
      }
    }
  });
  if (bigChangeCat && Math.abs(bigChangePct) > 50) {
    const catName = getCategory('expense', bigChangeCat).name;
    if (bigChangePct > 0) {
      return { kind:'cat-up', icon:'📈', tone:'negative',
        text:`Kategori <strong>${catName}</strong> naik ${bigChangePct.toFixed(0)}% dari bulan lalu.` };
    } else {
      return { kind:'cat-down', icon:'📉', tone:'positive',
        text:`Kategori <strong>${catName}</strong> turun ${Math.abs(bigChangePct).toFixed(0)}% dari bulan lalu. 👌` };
    }
  }

  // Weekend spike: weekend days >50% of weekday avg
  const weekendSpend = thisExpenses.filter(t => {
    const d = new Date(t.date).getDay(); return d === 0 || d === 6;
  }).reduce((s,t) => s+t.amount, 0);
  const weekdaySpend = thisExp - weekendSpend;
  const weekdayCount = Math.max(1, Math.floor(daysSoFar * 5/7));
  const weekendCount = Math.max(1, Math.floor(daysSoFar * 2/7));
  if (weekdaySpend > 0 && weekendSpend / weekendCount > 2 * (weekdaySpend / weekdayCount) && weekendSpend > 100000) {
    return { kind:'weekend', icon:'🎉', tone:'warning',
      text:`Weekend lebih boros — <strong>${moneyShort(weekendSpend/weekendCount)}/hari</strong> vs ${moneyShort(weekdaySpend/weekdayCount)}/hari weekday.` };
  }

  const diff = thisExp - prevExp;
  const pct = Math.abs(diff / prevExp * 100);
  if (diff < 0) {
    return { kind:'down', icon:'📉', tone:'positive',
      text:`Pengeluaran turun <strong>${pct.toFixed(0)}%</strong> dari bulan lalu (hemat ${moneyShort(Math.abs(diff))}). 🎉` };
  }
  if (diff > 0 && daysSoFar < daysInMonth) {
    return { kind:'projection', icon:'⚠️', tone: pct > 30 ? 'warning' : 'negative',
      text:`Pace bulan ini <strong>${pct.toFixed(0)}% lebih tinggi</strong>. Proyeksi akhir bulan: ${moneyShort(projection)}.` };
  }
  return { kind:'up', icon:'📈', tone:'negative',
    text:`Pengeluaran naik <strong>${pct.toFixed(0)}%</strong> dari bulan lalu (+${moneyShort(diff)}).` };
}

// ============================================================
// ACCOUNT ROW (shared)
// ============================================================

function renderAccountRow(a, opts = {}) {
  const info = accountTypeInfo(a.type);
  return el('div', { class: 'account-row', 'data-acc-id': a.id, onclick: () => openAccountModal(a) },
    el('div', { class: 'account-icon', style: `background:${info.color}` }, info.icon),
    el('div', { class: 'account-main' },
      el('div', { class: 'account-name' }, a.name),
      el('div', { class: 'account-type' }, info.label + (a.archived ? ' • Diarsipkan' : ''))
    ),
    opts.sparkline !== false && state.expenses.filter(t => t.accountId === a.id).length >= 2
      ? buildSparkline(a.id) : null,
    el('div', { class: 'account-balance' }, money(accountBalance(a)))
  );
}

// ============================================================
// EXPENSE / TRANSACTION VIEW
// ============================================================

function renderExpense() {
  const isList = ui.vmode === 'list';
  $('#listView').classList.toggle('hidden', !isList);
  $('#calendarView').classList.toggle('hidden', isList);
  $$('.view-toggle button').forEach(b => b.classList.toggle('active', b.dataset.vmode === ui.vmode));

  if (!isList) {
    renderCalendar();
    return;
  }

  const ref = getMonthDate(ui.monthOffset);
  $('#monthLabel').textContent = monthYear(ref);

  // Render filter chip rows
  renderAccountFilterRow();
  renderTagFilterRow();
  renderQuickFilterRow();

  // Quick filter takes precedence over monthOffset (overrides month nav)
  const qf = ui.quickFilter || 'all';
  let txs;
  if (qf !== 'all') {
    txs = state.expenses.filter(t => matchesQuickFilter(t.date));
  } else {
    txs = state.expenses.filter(t => isInMonth(t.date, ref));
  }
  if (ui.filter !== 'all') txs = txs.filter(t => t.type === ui.filter);
  if (ui.accountFilter !== 'all') {
    txs = txs.filter(t => t.accountId === ui.accountFilter
      || t.fromAccountId === ui.accountFilter
      || t.toAccountId === ui.accountFilter);
  }
  if (ui.tagFilter !== 'all') {
    txs = txs.filter(t => Array.isArray(t.tags) && t.tags.includes(ui.tagFilter));
  }

  const q = ui.searchQuery.trim().toLowerCase();
  if (q) {
    if (q.startsWith('#')) {
      const tagQuery = q.slice(1);
      txs = txs.filter(t => (t.tags || []).some(id => getTag(id)?.name.toLowerCase().includes(tagQuery)));
    } else {
      txs = txs.filter(t => {
        if ((t.name || '').toLowerCase().includes(q)) return true;
        if ((t.note || '').toLowerCase().includes(q)) return true;
        // Only search category if non-transfer (transfer has no category)
        if (t.type !== 'transfer' && getCategory(t.type, t.category).name.toLowerCase().includes(q)) return true;
        return false;
      });
    }
  }

  const income  = txs.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
  $('#monthIncome').textContent = moneyShort(income);
  $('#monthExpense').textContent = moneyShort(expense);
  $('#monthDiff').textContent = moneyShort(income - expense);
  $('#monthDiff').className = 'mini-val ' + (income - expense >= 0 ? 'income-txt' : 'expense-txt');

  const list = $('#expenseList');
  list.innerHTML = '';
  if (txs.length === 0) {
    list.appendChild(el('div', { class: 'list-empty' }, q ? 'Tidak ada hasil pencarian' : 'Belum ada transaksi di bulan ini'));
    return;
  }

  const grouped = {};
  txs.sort((a,b) => b.date.localeCompare(a.date) || (b.createdAt||0)-(a.createdAt||0))
     .forEach(t => { (grouped[t.date] = grouped[t.date] || []).push(t); });

  Object.entries(grouped).forEach(([date, items]) => {
    const total = items.reduce((s,t) => s + t.amount * expenseSign(t), 0);
    const totalLabel = (total >= 0 ? '+' : '') + moneyShort(total);
    const group = el('div', { class: 'list-group' });
    group.appendChild(el('div', { class: 'list-group-label' },
      el('span', {}, fullDate(date)),
      el('span', { class: total > 0 ? 'income-txt' : total < 0 ? 'muted-txt' : 'muted-txt' }, totalLabel)
    ));
    const rows = el('div', { class: 'list-group-rows' });
    items.forEach(t => rows.appendChild(renderTxRow(t)));
    group.appendChild(rows);
    list.appendChild(group);
  });
}

// Quick date-range filter presets (Hari Ini / Minggu Ini / Bulan Ini / Tahun Ini / Custom)
function renderQuickFilterRow() {
  const wrap = $('#quickFilterRow');
  if (!wrap) return;
  wrap.innerHTML = '';
  const presets = [
    { id: 'all',   label: 'Semua' },
    { id: 'today', label: 'Hari Ini' },
    { id: 'week',  label: 'Minggu Ini' },
    { id: 'month', label: 'Bulan Ini' },
    { id: 'year',  label: 'Tahun Ini' },
  ];
  presets.forEach(p => {
    const chip = el('button', {
      class: 'quick-filter-chip' + (ui.quickFilter === p.id ? ' active' : ''),
      type: 'button',
      onclick: () => {
        ui.quickFilter = p.id;
        hap('select');
        renderExpense();
      }
    }, p.label);
    wrap.appendChild(chip);
  });
}

// Test whether a tx date matches the active quick-filter preset
function matchesQuickFilter(dateStr) {
  const qf = ui.quickFilter || 'all';
  if (qf === 'all') return true;
  const d = new Date(dateStr);
  const now = new Date();
  if (qf === 'today') return dateStr === isoDate();
  if (qf === 'week') {
    const wkAgo = new Date(now); wkAgo.setDate(now.getDate() - 7);
    return d >= wkAgo && d <= now;
  }
  if (qf === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  if (qf === 'year') {
    return d.getFullYear() === now.getFullYear();
  }
  return true;
}

function renderAccountFilterRow() {
  const wrap = $('#accountFilterRow');
  if (!wrap) return;
  wrap.innerHTML = '';
  const accs = getAccounts();
  if (accs.length <= 1) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';

  const mkChip = (id, label, icon) => el('button', {
    class: 'account-filter-chip' + (ui.accountFilter === id ? ' active' : ''),
    type: 'button',
    onclick: () => { ui.accountFilter = id; haptic(5); renderExpense(); }
  }, icon ? el('span', {}, icon) : null, label);

  wrap.appendChild(mkChip('all', 'Semua Akun', '📋'));
  accs.forEach(a => {
    const info = accountTypeInfo(a.type);
    wrap.appendChild(mkChip(a.id, a.name, info.icon));
  });
}

// Tag filter chips — shown only when user has tags
function renderTagFilterRow() {
  const wrap = $('#tagFilterRow');
  if (!wrap) return;
  wrap.innerHTML = '';
  const tags = getTags();
  if (tags.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const mkChip = (id, label, color) => el('button', {
    class: 'account-filter-chip' + (ui.tagFilter === id ? ' active' : ''),
    type: 'button',
    onclick: () => { ui.tagFilter = id; haptic(5); renderExpense(); }
  },
    color ? el('span', { style: `width:8px;height:8px;border-radius:50%;background:${color};display:inline-block` }) : null,
    label
  );
  wrap.appendChild(mkChip('all', 'Semua Tag'));
  tags.forEach(t => wrap.appendChild(mkChip(t.id, '#' + t.name, t.color)));
}

function renderTxRow(t) {
  if (t.type === 'transfer') {
    const from = getAccount(t.fromAccountId);
    const to = getAccount(t.toAccountId);
    return el('div', { class: 'tx-row', onclick: () => openTransferModal(t) },
      el('div', { class: 'tx-icon' }, '↔️'),
      el('div', { class: 'tx-main' },
        el('div', { class: 'tx-title' }, t.name || `Transfer`),
        el('div', { class: 'tx-sub' }, `${from?.name || '—'} → ${to?.name || '—'}`)
      ),
      el('div', { class: 'tx-amount muted-txt' }, money(t.amount))
    );
  }
  const cat = getCategory(t.type, t.category);
  const amountClass = t.type === 'income' ? 'tx-amount income-txt' : 'tx-amount expense-txt';
  const sign = t.type === 'income' ? '+' : '−';
  const acc = getAccount(t.accountId);
  const tagList = (t.tags || []).map(id => getTag(id)?.name).filter(Boolean);

  const subParts = [cat.name];
  if (acc && getAccounts().length > 1) subParts.push(acc.name);
  if (tagList.length > 0) subParts.push('#' + tagList.join(' #'));
  if (t.note) subParts.push(t.note);

  return el('div', { class: 'tx-row', 'data-tx-id': t.id, onclick: () => openExpenseModal(t) },
    el('div', { class: 'tx-icon' }, cat.icon),
    el('div', { class: 'tx-main' },
      el('div', { class: 'tx-title' }, t.name || cat.name),
      el('div', { class: 'tx-sub' }, subParts.join(' • '))
    ),
    t.receipt ? el('div', { class: 'tx-icon', style: 'width:24px;height:24px;background:transparent;font-size:14px',
      onclick: (e) => { e.stopPropagation(); openPhotoViewer(t.receipt); }
    }, '📷') : null,
    el('div', { class: amountClass }, sign + ' ' + money(t.amount))
  );
}

// ============================================================
// LONG-PRESS CONTEXT MENU + DUPLICATE
// ============================================================

let _longPressTimer = null;
let _longPressFired = false;

function setupLongPress() {
  // Selectors that support long-press context menu
  const LP_SELECTOR = '.tx-row, .sub-row, .debt-row, .account-row';

  const handleStart = (e) => {
    const row = e.target.closest(LP_SELECTOR);
    if (!row) return;
    _longPressFired = false;
    if (_longPressTimer) clearTimeout(_longPressTimer);
    _longPressTimer = setTimeout(() => {
      _longPressTimer = null;
      _longPressFired = true;
      hap('longPress');
      // Route based on data attributes (using TIMING.LONG_PRESS_ROW below)
      if (row.classList.contains('tx-row')) {
        const tx = state.expenses.find(t => t.id === row.dataset.txId);
        if (tx) openTxContextMenu(tx);
      } else if (row.classList.contains('sub-row')) {
        const sub = state.subscriptions.find(s => s.id === row.dataset.subId);
        if (sub) openSubContextMenu(sub);
      } else if (row.classList.contains('debt-row')) {
        const d = state.debts.find(x => x.id === row.dataset.debtId);
        if (d) openDebtContextMenu(d);
      } else if (row.classList.contains('account-row')) {
        const a = state.accounts.find(x => x.id === row.dataset.accId);
        if (a) openAccountContextMenu(a);
      }
    }, TIMING.LONG_PRESS_ROW);
  };
  const cancel = () => { if (_longPressTimer) { clearTimeout(_longPressTimer); _longPressTimer = null; } };

  document.addEventListener('mousedown', handleStart, { passive: true });
  document.addEventListener('touchstart', handleStart, { passive: true });
  document.addEventListener('mouseup', cancel);
  document.addEventListener('touchend', cancel);
  document.addEventListener('touchcancel', cancel);
  document.addEventListener('mouseleave', cancel);
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest(LP_SELECTOR)) e.preventDefault();
  });
  document.addEventListener('click', (e) => {
    if (_longPressFired) {
      e.stopPropagation(); e.preventDefault();
      _longPressFired = false;
    }
  }, true);
}

function openSubContextMenu(s) {
  openActionSheet(s.name + ' — ' + money(s.amount), [
    { label: 'Edit',  icon: '✏️', onClick: () => openSubModal(s) },
    { label: s.active === false ? 'Aktifkan' : 'Jeda', icon: s.active === false ? '▶️' : '⏸️',
      onClick: () => { s.active = !(s.active !== false); save(); render(); toast(s.active ? 'Diaktifkan' : 'Dijeda'); } },
    { label: 'Tandai Sudah Bayar', icon: '✅', onClick: () => advanceSub(s) },
    { label: 'Hapus', icon: '🗑️', destructive: true, onClick: () => deleteSub(s.id) },
  ]);
}

function openDebtContextMenu(d) {
  const isPaid = debtIsPaid(d);
  openActionSheet(d.person + ' — ' + money(debtRemaining(d)), [
    { label: 'Edit', icon: '✏️', onClick: () => openDebtModal(d) },
    !isPaid && { label: 'Catat Pembayaran', icon: '💰',
      onClick: () => { openDebtModal(d); /* user can tap Catat Pembayaran inside */ } },
    { label: 'Hapus', icon: '🗑️', destructive: true, onClick: () => deleteDebt(d.id) },
  ].filter(Boolean));
}

function openAccountContextMenu(a) {
  openActionSheet(a.name + ' — ' + money(accountBalance(a)), [
    { label: 'Edit', icon: '✏️', onClick: () => openAccountModal(a) },
    { label: a.archived ? 'Unarchive' : 'Arsipkan', icon: a.archived ? '📂' : '🗄️',
      onClick: () => { a.archived = !a.archived; save(); render(); toast(a.archived ? 'Diarsipkan' : 'Diaktifkan'); } },
  ]);
}

function openTxContextMenu(tx) {
  const title = tx.name || (tx.type === 'transfer' ? 'Transfer' : getCategory(tx.type, tx.category).name);
  openActionSheet(title + ' — ' + money(tx.amount), [
    { label: 'Edit', icon: '✏️',
      onClick: () => tx.type === 'transfer' ? openTransferModal(tx) : openExpenseModal(tx) },
    { label: 'Duplikat ke hari ini', icon: '📋',
      onClick: () => duplicateTx(tx) },
    { label: 'Pilih beberapa…', icon: '☑️',
      onClick: () => enterBulkMode(tx.id) },
    { label: 'Hapus', icon: '🗑️', destructive: true,
      onClick: () => deleteTx(tx.id) },
  ]);
}

// Bulk select mode — multi-select tx rows for batch operations
const bulkSelected = new Set();
function enterBulkMode(initialId) {
  document.body.classList.add('bulk-mode');
  bulkSelected.clear();
  if (initialId) bulkSelected.add(initialId);
  renderBulkSelection();
  // Intercept tx-row clicks: toggle selection instead of opening modal
  document.addEventListener('click', bulkRowToggle, { capture: true });
  hap('toggle');
}
function exitBulkMode() {
  document.body.classList.remove('bulk-mode');
  bulkSelected.clear();
  $('#bulkActionBar')?.classList.remove('visible');
  document.removeEventListener('click', bulkRowToggle, { capture: true });
  render();
}
function bulkRowToggle(e) {
  const row = e.target.closest('.tx-row');
  if (!row || !document.body.classList.contains('bulk-mode')) return;
  e.preventDefault(); e.stopPropagation();
  const id = row.dataset.txId;
  if (!id) return;
  if (bulkSelected.has(id)) bulkSelected.delete(id);
  else bulkSelected.add(id);
  renderBulkSelection();
  hap('select');
}
function renderBulkSelection() {
  document.querySelectorAll('.tx-row').forEach(r => {
    r.classList.toggle('selected', bulkSelected.has(r.dataset.txId));
  });
  const bar = $('#bulkActionBar');
  const cnt = $('#bulkCount');
  if (bulkSelected.size > 0) {
    cnt.textContent = bulkSelected.size + ' dipilih';
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }
}
function bulkDelete() {
  if (bulkSelected.size === 0) return;
  if (!confirm(`Hapus ${bulkSelected.size} transaksi?`)) return;
  const deleted = state.expenses.filter(t => bulkSelected.has(t.id));
  state.expenses = state.expenses.filter(t => !bulkSelected.has(t.id));
  const count = deleted.length;
  save(); hap('delete');
  exitBulkMode();
  toast(`${count} transaksi dihapus`, {
    action: { label: 'Urungkan', onClick: () => { deleted.forEach(t => state.expenses.push(t)); save(); render(); } }
  });
}

function duplicateTx(tx) {
  const copy = { ...tx, id: uid(), date: isoDate(), createdAt: Date.now() };
  if (tx.tags) copy.tags = [...tx.tags];
  state.expenses.push(copy);
  save(); hap('save'); render();
  toast('Disalin ke hari ini');
}

// ============================================================
// CALENDAR VIEW
// ============================================================

function renderCalendar() {
  const refDate = getMonthDate(ui.monthOffset);
  const wrap = $('#calendarView');
  wrap.innerHTML = '';

  // Month nav
  wrap.appendChild(el('div', { class: 'month-nav' },
    el('button', { class: 'icon-btn muted', onclick: () => { ui.monthOffset--; ui.selectedCalDay = null; renderCalendar(); }, html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' }),
    el('div', {}, monthYear(refDate)),
    el('button', { class: 'icon-btn muted', onclick: () => { ui.monthOffset++; ui.selectedCalDay = null; renderCalendar(); }, html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' }),
  ));

  const year = refDate.getFullYear(), month = refDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = first.getDay();

  const grid = [];
  for (let i = 0; i < startDow; i++) grid.push(null);
  for (let d = 1; d <= last.getDate(); d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);

  const spendByDay = {};
  state.expenses.filter(t => t.type === 'expense' && isInMonth(t.date, refDate))
    .forEach(t => { spendByDay[t.date] = (spendByDay[t.date] || 0) + t.amount; });
  const maxSpend = Math.max(1, ...Object.values(spendByDay));

  const calWrap = el('div', { class: 'calendar-wrap' });
  const calGrid = el('div', { class: 'calendar-grid' });

  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach((d) => {
    calGrid.appendChild(el('div', { class: 'calendar-dow' }, d));
  });

  grid.forEach(day => {
    if (!day) {
      calGrid.appendChild(el('div', { class: 'calendar-day empty' }));
      return;
    }
    const iso = isoDate(day);
    const spend = spendByDay[iso] || 0;
    const intensity = spend > 0 ? Math.min(5, Math.ceil((spend / maxSpend) * 5)) : 0;
    const classes = ['calendar-day'];
    if (isToday(iso)) classes.push('today');
    else if (intensity > 0) classes.push('has-spend-' + intensity);
    if (ui.selectedCalDay === iso) classes.push('selected');

    const cell = el('div', { class: classes.join(' '), onclick: () => {
      ui.selectedCalDay = ui.selectedCalDay === iso ? null : iso;
      haptic(5);
      renderCalendar();
    }},
      el('div', { class: 'd-num' }, String(day.getDate())),
      spend > 0 ? el('div', { class: 'd-amt' }, moneyTiny(spend)) : null
    );
    calGrid.appendChild(cell);
  });

  calWrap.appendChild(calGrid);
  wrap.appendChild(calWrap);

  // Selected day detail
  if (ui.selectedCalDay) {
    const dayTxs = state.expenses
      .filter(t => t.date === ui.selectedCalDay)
      .sort((a,b) => (b.createdAt||0)-(a.createdAt||0));
    const income = dayTxs.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
    const expense = dayTxs.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);

    wrap.appendChild(el('div', { class: 'section-title' },
      el('span', {}, fullDate(ui.selectedCalDay)),
      el('span', { class: 'muted-txt', style: 'text-transform:none;font-weight:400' },
        (income > 0 ? '+' + moneyShort(income) + '  ' : '') + (expense > 0 ? '−' + moneyShort(expense) : '')
      )
    ));
    if (dayTxs.length === 0) {
      wrap.appendChild(el('div', { class: 'list-empty' }, 'Tidak ada transaksi hari ini'));
    } else {
      wrap.appendChild(el('div', { class: 'list-group' },
        el('div', { class: 'list-group-rows' }, ...dayTxs.map(renderTxRow))
      ));
    }
  }
}

// ============================================================
// SUBSCRIPTION VIEW
// ============================================================

function renderSubscription() {
  const active = state.subscriptions.filter(s => s.active !== false);
  // Outflow-only for the headline. Income subs are tracked separately.
  const monthlyOut = active.filter(s => s.type !== 'income').reduce((s,sub) => s + subMonthlyCost(sub), 0);
  const monthlyIn  = active.filter(s => s.type === 'income').reduce((s,sub) => s + subMonthlyCost(sub), 0);
  $('#subMonthly').textContent = money(monthlyOut);
  // If income subs exist, show inline note in yearly slot. Otherwise yearly = 12× outflow.
  if (monthlyIn > 0) {
    $('#subYearly').textContent = moneyShort(monthlyIn) + ' masuk/bln';
  } else {
    $('#subYearly').textContent = moneyShort(monthlyOut * 12);
  }
  $('#subActive').textContent  = active.length;

  renderSubCalendar();

  const list = $('#subList');
  list.innerHTML = '';
  if (state.subscriptions.length === 0) {
    list.appendChild(illustratedEmpty('🔁',
      'Belum ada langganan',
      'Tap + untuk tambah Netflix, Spotify, ChatGPT, gaji bulanan, dll. Auto-renew tersedia di setting.'));
    return;
  }
  const sorted = [...state.subscriptions].sort((a,b) => {
    if ((a.active !== false) !== (b.active !== false)) return (a.active === false) ? 1 : -1;
    return new Date(a.nextRenewal) - new Date(b.nextRenewal);
  });
  list.appendChild(el('div', { class: 'list-group' }, el('div', { class: 'list-group-rows' },
    ...sorted.map(s => renderSubRow(s))
  )));
}

// 30-day strip showing dots for upcoming subscription renewals
function renderSubCalendar() {
  const wrap = $('#subCalendar');
  if (!wrap) return;
  const active = state.subscriptions.filter(s => s.active !== false);
  if (active.length === 0) { wrap.innerHTML = ''; return; }
  wrap.className = 'sub-calendar';
  wrap.innerHTML = '';
  wrap.appendChild(el('div', { class: 'sc-title' }, '📅 30 Hari Ke Depan'));
  const strip = el('div', { class: 'sub-calendar-strip' });
  const today = new Date();
  // Count renewals per day
  const byDay = new Map();
  active.forEach(s => {
    const d = daysUntil(s.nextRenewal);
    if (d >= 0 && d <= 29) {
      byDay.set(d, (byDay.get(d) || 0) + 1);
    }
  });
  for (let i = 0; i < 30; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const renewals = byDay.get(i) || 0;
    const cls = ['sc-day'];
    if (i === 0) cls.push('today');
    else if (renewals > 0) { cls.push('has-renewal'); if (renewals >= 2) cls.push('many'); }
    const cell = el('div', { class: cls.join(' '),
      title: fullDate(isoDate(d)) + (renewals > 0 ? ' — ' + renewals + ' renewal' : '') },
      String(d.getDate()));
    strip.appendChild(cell);
  }
  wrap.appendChild(strip);
  const total = Array.from(byDay.values()).reduce((s, v) => s + v, 0);
  const upcoming = active.filter(s => daysUntil(s.nextRenewal) >= 0 && daysUntil(s.nextRenewal) <= 30);
  const totalCost = upcoming.reduce((s, sub) => s + sub.amount, 0);
  wrap.appendChild(el('div', { class: 'sub-calendar-legend' },
    el('strong', {}, total + ' renewal'), ' total — ', el('strong', {}, money(totalCost))));
}

function renderSubRow(s) {
  const cat = getCategory('subscription', s.category);
  const dleft = daysUntil(s.nextRenewal);
  const paused = s.active === false;
  const isIncome = s.type === 'income';

  let tagClass = 'renewal-tag', tagText = '';
  if (paused) { tagClass += ' paused'; tagText = 'Dijeda'; }
  else if (dleft < 0) { tagClass += ' due'; tagText = `Telat ${Math.abs(dleft)} hari`; }
  else if (dleft === 0) { tagClass += ' due'; tagText = 'Hari ini'; }
  else if (dleft <= (s.reminderDays ?? 3)) { tagClass += ' soon'; tagText = `${dleft} hari lagi`; }
  else { tagText = shortDate(s.nextRenewal); }

  const subParts = [
    el('span', { class: tagClass }, tagText),
    el('span', {}, CYCLES[s.cycle]?.label || 'Bulanan'),
  ];
  if (s.autoExecute) subParts.push(el('span', { class: 'badge', style: 'background:var(--accent-tint);color:var(--accent)' }, 'AUTO'));

  return el('div', { class: 'tx-row sub-row', 'data-sub-id': s.id, onclick: () => openSubModal(s) },
    el('div', { class: 'tx-icon' }, cat.icon),
    el('div', { class: 'tx-main' },
      el('div', { class: 'tx-title' }, s.name),
      el('div', { class: 'tx-sub' }, ...subParts)
    ),
    el('div', { class: 'tx-amount' + (paused ? ' muted-txt' : isIncome ? ' income-txt' : '') },
      (isIncome ? '+ ' : '') + money(s.amount)
    )
  );
}

// ============================================================
// BUDGET / GOAL
// ============================================================

function renderBudget() {
  $$('[data-tab-pane]').forEach(p => p.classList.toggle('hidden', p.dataset.tabPane !== ui.budgetTab));
  $$('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === ui.budgetTab));
  if (ui.budgetTab === 'budget-tab') renderBudgetTab();
  else renderGoalTab();
}

function renderBudgetTab() {
  const ref = new Date();
  const monthTx = state.expenses.filter(t => isInMonth(t.date, ref));
  const used = groupSpendingByCategory(monthTx);
  const totalBudget = Object.values(state.budgets).reduce((s,v) => s + (v||0), 0);
  const totalRealUsed = Object.entries(state.budgets).reduce((s, [cat]) => s + (used[cat] || 0), 0);

  $('#budgetTotal').textContent     = money(totalBudget);
  $('#budgetUsed').textContent      = moneyShort(totalRealUsed);
  $('#budgetRemaining').textContent = moneyShort(totalBudget - totalRealUsed);

  const list = $('#budgetList');
  list.innerHTML = '';
  const entries = Object.entries(state.budgets).filter(([,v]) => v > 0);
  if (entries.length === 0) {
    list.appendChild(illustratedEmpty('🎯',
      'Belum ada budget',
      'Atur limit per kategori untuk lacak pengeluaran. Tekan "Atur" di atas.'));
    return;
  }
  const wrap = el('div', { class: 'list' });
  entries
    .map(([cat, limit]) => ({ cat, limit, used: used[cat] || 0 }))
    .sort((a,b) => (b.used/b.limit) - (a.used/a.limit))
    .forEach(b => wrap.appendChild(renderBudgetRow(b)));
  list.appendChild(wrap);
}

function renderBudgetRow(b) {
  const cat = getCategory('expense', b.cat);
  const eff = effectiveBudget(b.cat);
  const limit = eff.effectiveLimit;
  const pct = limit > 0 ? Math.min(100, (b.used / limit) * 100) : 0;
  const over = b.used > limit;
  let progCls = 'progress';
  if (pct >= 100) progCls += ' danger';
  else if (pct >= 75) progCls += ' warning';

  // Show rollover badge if user has carry-forward enabled and there's surplus
  const limitText = eff.rollover > 0
    ? moneyShort(eff.baseLimit) + ' + ' + moneyShort(eff.rollover) + ' carry'
    : moneyShort(limit);

  return el('div', { class: 'budget-card', onclick: () => openBudgetModal(b.cat) },
    el('div', { class: 'bc-head' },
      el('div', { class: 'bc-name' }, el('span', {}, cat.icon), el('span', {}, cat.name)),
      el('div', { class: 'bc-amounts' },
        el('strong', { class: over ? 'expense-txt' : '' }, moneyShort(b.used)),
        ' / ' + limitText
      )
    ),
    el('div', { class: progCls }, el('span', { style: `width:${pct}%` })),
    el('div', { class: 'bc-foot' },
      el('span', {}, `${pct.toFixed(0)}% terpakai`),
      el('span', { class: over ? 'expense-txt' : 'muted-txt' },
        over ? 'Over ' + moneyShort(b.used - limit) : 'Sisa ' + moneyShort(limit - b.used)
      )
    )
  );
}

function renderGoalTab() {
  const list = $('#goalList');
  list.innerHTML = '';
  if (state.goals.length === 0) {
    list.appendChild(illustratedEmpty('💰',
      'Belum ada goal tabungan',
      'Bikin target — DP rumah, HP baru, liburan. Hit 100% dapat confetti! 🎊'));
    return;
  }
  const wrap = el('div', { class: 'list' });
  state.goals.forEach(g => wrap.appendChild(renderGoalRow(g)));
  list.appendChild(wrap);
}

function renderGoalRow(g) {
  const pct = g.target > 0 ? Math.min(100, (g.current / g.target) * 100) : 0;
  const dleft = g.deadline ? daysUntil(g.deadline) : null;
  let cls = 'goal-card';
  if (pct >= 100) cls += ' complete';
  else if (pct >= 80) cls += ' near-complete';
  return el('div', { class: cls, onclick: () => openGoalModal(g) },
    el('div', { class: 'bc-head' },
      el('div', { class: 'bc-name' }, el('span', {}, '🎯'), el('span', {}, g.name)),
      el('div', { class: 'bc-amounts' },
        el('strong', {}, moneyShort(g.current)), ' / ' + moneyShort(g.target)
      )
    ),
    el('div', { class: 'progress' }, el('span', { style: `width:${pct}%` })),
    el('div', { class: 'bc-foot' },
      el('span', {}, `${pct.toFixed(0)}%`),
      dleft !== null
        ? el('span', { class: dleft < 0 ? 'expense-txt' : 'muted-txt' },
            dleft < 0 ? `Telat ${Math.abs(dleft)} hari` : `${dleft} hari lagi`)
        : el('span', { class: 'muted-txt' }, 'Tanpa deadline')
    )
  );
}

// ============================================================
// REPORTS
// ============================================================

// Lazy-loads Chart.js from CDN on first Reports view entry. Cached after first call.
let _chartLoadPromise = null;
function ensureChartLoaded() {
  if (typeof window.Chart === 'function') return Promise.resolve();
  if (_chartLoadPromise) return _chartLoadPromise;
  _chartLoadPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => { _chartLoadPromise = null; reject(e); };
    document.head.appendChild(s);
  });
  return _chartLoadPromise;
}

function renderReports() {
  const ref = getMonthDate(ui.reportOffset);
  $('#reportMonthLabel').textContent = monthYear(ref);

  // Lazy-load Chart.js before rendering pie/line charts
  if (typeof window.Chart !== 'function') {
    ensureChartLoaded().then(() => renderReports()).catch(() =>
      toast.error('Gagal load chart library — perlu internet sekali'));
    // Render text-only parts now; charts will appear after Chart.js loads
  }

  const monthTx = state.expenses.filter(t => isInMonth(t.date, ref));
  const income  = monthTx.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const expense = monthTx.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
  const saving = income - expense;
  const today = new Date();
  const daysInMonth = new Date(ref.getFullYear(), ref.getMonth()+1, 0).getDate();
  const daysSoFar = (ref.getMonth() === today.getMonth() && ref.getFullYear() === today.getFullYear())
    ? today.getDate() : daysInMonth;
  const avgDaily = expense / Math.max(1, daysSoFar);

  $('#rpIncome').textContent  = moneyShort(income);
  $('#rpExpense').textContent = moneyShort(expense);
  $('#rpSaving').textContent  = moneyShort(saving);
  $('#rpSaving').className    = 'rs-val ' + (saving >= 0 ? 'income-txt' : 'expense-txt');
  $('#rpDaily').textContent   = moneyShort(avgDaily);

  // Period comparison
  const prevRef = getMonthDate(ui.reportOffset - 1);
  const prevTx = state.expenses.filter(t => isInMonth(t.date, prevRef));
  const prevExpense = prevTx.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
  $('#cmpPrev').textContent = moneyShort(prevExpense);
  $('#cmpThis').textContent = moneyShort(expense);
  if (prevExpense > 0) {
    const diff = expense - prevExpense;
    const pct = (diff / prevExpense) * 100;
    const up = diff > 0;
    const cmpEl = $('#cmpDiff');
    cmpEl.textContent = (up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(0) + '% (' + (up ? '+' : '−') + moneyShort(Math.abs(diff)) + ')';
    cmpEl.className = 'compare-diff ' + (up ? 'up' : 'down');
  } else {
    $('#cmpDiff').textContent = expense > 0 ? '— Bulan lalu tidak ada data' : '—';
    $('#cmpDiff').className = 'compare-diff';
  }

  // Year-over-year comparison (12 months ago, same month)
  const yoyRef = new Date(ref.getFullYear() - 1, ref.getMonth(), 1);
  const yoyTx = state.expenses.filter(t => isInMonth(t.date, yoyRef) && t.type === 'expense');
  const yoyExp = yoyTx.reduce((s,t) => s + t.amount, 0);
  const yoyCard = $('#yoyCard');
  if (yoyExp > 0) {
    yoyCard.classList.remove('hidden');
    $('#yoyPrev').textContent = moneyShort(yoyExp);
    $('#yoyThis').textContent = moneyShort(expense);
    const diff = expense - yoyExp;
    const pct = Math.abs(diff / yoyExp * 100);
    const up = diff > 0;
    const el = $('#yoyDiff');
    el.textContent = (up ? '↑ ' : '↓ ') + pct.toFixed(0) + '% (' + (up ? '+' : '−') + moneyShort(Math.abs(diff)) + ' vs ' + yoyRef.getFullYear() + ')';
    el.className = 'compare-diff ' + (up ? 'up' : 'down');
  } else {
    yoyCard.classList.add('hidden');
  }

  // Charts: only render if Chart.js loaded (lazy-load triggers re-render when ready)
  if (typeof window.Chart === 'function') {
    renderPieChart(monthTx);
    renderLineChart(ref);
    renderNetWorthChart();
    renderDayOfWeekChart(monthTx);
  }

  // Top payees (this month) — non-empty names sorted by total spend
  renderTopPayees(monthTx);

  // Income vs Expense ratio
  renderIncomeExpenseRatio(income, expense);

  // Subscription cost forecast (next 3 months)
  renderSubForecast();

  const top = monthTx.filter(t => t.type === 'expense')
    .sort((a,b) => b.amount - a.amount).slice(0, 5);
  const tw = $('#topExpenses');
  tw.innerHTML = '';
  if (top.length === 0) {
    tw.appendChild(el('div', { class: 'list-empty', style: 'margin:0;box-shadow:none;background:transparent' }, 'Belum ada pengeluaran.'));
  } else {
    const list = el('div', { class: 'list-group-rows' });
    top.forEach(t => list.appendChild(renderTxRow(t)));
    tw.appendChild(list);
  }
}

function chartTextColor() { return getComputedStyle(document.documentElement).getPropertyValue('--label').trim() || '#000'; }
function chartGridColor() { return getComputedStyle(document.documentElement).getPropertyValue('--sep').trim() || '#ccc'; }

function renderPieChart(monthTx) {
  const byCat = groupSpendingByCategory(monthTx);
  let entries = Object.entries(byCat).sort((a,b) => b[1]-a[1]);
  let labels, data, colors, isFallback = false;

  if (entries.length === 1) {
    // Only one category: fall back to top transactions within that category
    const onlyCat = entries[0][0];
    const txInCat = monthTx.filter(t => t.type === 'expense' && t.category === onlyCat)
      .sort((a,b) => b.amount - a.amount).slice(0, 8);
    labels = txInCat.map(t => t.name || getCategory('expense', t.category).name);
    data = txInCat.map(t => t.amount);
    colors = txInCat.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
    isFallback = true;
  } else {
    labels = entries.map(([id]) => getCategory('expense', id).name);
    data = entries.map(([,v]) => v);
    colors = entries.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  }

  if (pieChart) pieChart.destroy();
  const ctx = $('#chartPie').getContext('2d');
  if (data.length === 0) {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    $('#chartPieLegend').innerHTML = '<div class="muted-txt" style="font-size:13px">Belum ada data</div>';
    return;
  }
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: 'transparent', hoverOffset: 6 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '64%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.label + ': ' + money(ctx.raw) } } }
    }
  });

  const total = data.reduce((s,v) => s+v, 0);
  const legend = $('#chartPieLegend');
  legend.innerHTML = '';
  if (isFallback) {
    legend.appendChild(el('div', { class: 'muted-txt', style: 'font-size:12px;width:100%;margin-bottom:6px' },
      'Hanya 1 kategori — pecah per transaksi:'));
    labels.forEach((label, i) => {
      legend.appendChild(el('div', { class: 'legend-item' },
        el('span', { style: `background:${colors[i]}` }),
        `${label} ${((data[i]/total)*100).toFixed(0)}%`
      ));
    });
  } else {
    entries.forEach(([id, v], i) => {
      const cat = getCategory('expense', id);
      legend.appendChild(el('div', { class: 'legend-item' },
        el('span', { style: `background:${colors[i]}` }),
        `${cat.name} ${((v/total)*100).toFixed(0)}%`
      ));
    });
  }
}

// Net worth = totalBalance computed at end of each of last 6 months.
// Replays expenses chronologically and snapshots the running balance.
function renderNetWorthChart() {
  if (typeof window.Chart !== 'function') return;
  const today = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const m = new Date(today.getFullYear(), today.getMonth() - i + 1, 0); // last day of that month
    months.push(m);
  }
  // For each month-end, compute net worth: sum of (initialBalance + net of tx <= that date)
  const accs = getAccounts().filter(a => a.includeInTotal !== false);
  const data = months.map(monthEnd => {
    return accs.reduce((sum, a) => {
      let bal = a.initialBalance || 0;
      state.expenses.forEach(t => {
        if (new Date(t.date) > monthEnd) return;
        if (t.type === 'transfer') {
          if (t.fromAccountId === a.id) bal -= t.amount;
          if (t.toAccountId === a.id)   bal += t.amount;
        } else if (t.accountId === a.id) {
          if (t.type === 'income')  bal += t.amount;
          if (t.type === 'expense') bal -= t.amount;
        }
      });
      return sum + bal;
    }, 0);
  });
  const labels = months.map(m => m.toLocaleDateString('id-ID', { month: 'short' }));

  if (netWorthChart) netWorthChart.destroy();
  const ctx = $('#chartNetWorth')?.getContext('2d');
  if (!ctx) return;
  const txt = chartTextColor();
  const grid = chartGridColor();
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#34c759';
  netWorthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Net Worth',
        data, borderColor: accent,
        backgroundColor: accent + '22',
        fill: true, tension: 0.35, borderWidth: 2,
        pointBackgroundColor: accent, pointBorderColor: accent, pointRadius: 3, pointHoverRadius: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => money(ctx.raw) } }
      },
      scales: {
        x: { ticks: { color: txt, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: txt, font: { size: 10 }, callback: (v) => moneyShort(v).replace(/^.+\s/, '') }, grid: { color: grid } }
      }
    }
  });

  // Summary: change vs 6 months ago
  const first = data[0], last = data[data.length - 1];
  const diff = last - first;
  const pct = first > 0 ? (diff / Math.abs(first)) * 100 : 0;
  $('#netWorthSummary').innerHTML = diff >= 0
    ? `<span style="color:var(--income)">↑ +${moneyShort(diff)} (${pct.toFixed(0)}%)</span> dari 6 bulan lalu`
    : `<span style="color:var(--expense)">↓ ${moneyShort(diff)} (${pct.toFixed(0)}%)</span> dari 6 bulan lalu`;
}

// Day-of-week bar chart — reveals spending patterns (e.g. weekend boros)
function renderDayOfWeekChart(monthTx) {
  if (typeof window.Chart !== 'function') return;
  const dowNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const totals = [0,0,0,0,0,0,0];
  monthTx.filter(t => t.type === 'expense').forEach(t => {
    const d = new Date(t.date).getDay();
    totals[d] += t.amount;
  });
  const max = Math.max(...totals);
  const maxIdx = totals.indexOf(max);
  if (dowChart) dowChart.destroy();
  const ctx = $('#chartDayOfWeek')?.getContext('2d');
  if (!ctx) return;
  const txt = chartTextColor();
  const grid = chartGridColor();
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#34c759';
  dowChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: dowNames, datasets: [{ data: totals,
      backgroundColor: totals.map((_, i) => i === maxIdx ? accent : accent + '55'),
      borderRadius: 6 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => money(ctx.raw) } } },
      scales: {
        x: { ticks: { color: txt, font: { size: 11 } }, grid: { display: false } },
        y: { ticks: { color: txt, font: { size: 10 }, callback: (v) => moneyShort(v).replace(/^.+\s/, '') }, grid: { color: grid } }
      }
    }
  });
  $('#dayOfWeekSummary').textContent = max > 0
    ? `Hari paling boros: ${dowNames[maxIdx]} (${moneyShort(max)})`
    : 'Belum ada data';
}

// Top payees — group by name (lowercased), sum amounts, top 5
function renderTopPayees(monthTx) {
  const wrap = $('#topPayees');
  if (!wrap) return;
  wrap.innerHTML = '';
  const byName = new Map();
  monthTx.filter(t => t.type === 'expense' && t.name).forEach(t => {
    const key = t.name.toLowerCase().trim();
    const cur = byName.get(key) || { name: t.name, amount: 0, count: 0 };
    cur.amount += t.amount; cur.count++;
    byName.set(key, cur);
  });
  const top = Array.from(byName.values()).sort((a,b) => b.amount - a.amount).slice(0, 5);
  if (top.length === 0) {
    wrap.appendChild(el('div', { class: 'muted-txt', style: 'font-size:13px;padding:8px 0' }, 'Belum ada data.'));
    return;
  }
  const total = top.reduce((s,p) => s + p.amount, 0);
  const list = el('div', { class: 'list-group-rows' });
  top.forEach((p, i) => {
    const pct = ((p.amount / total) * 100).toFixed(0);
    list.appendChild(el('div', { class: 'tx-row', style: 'cursor:default' },
      el('div', { class: 'tx-icon', style: 'background:var(--fill-3);color:var(--label);font-weight:700' }, '#' + (i + 1)),
      el('div', { class: 'tx-main' },
        el('div', { class: 'tx-title' }, p.name),
        el('div', { class: 'tx-sub' }, p.count + 'x • ' + pct + '%')
      ),
      el('div', { class: 'tx-amount expense-txt' }, money(p.amount))
    ));
  });
  wrap.appendChild(list);
}

// Income vs Expense ratio bar
function renderIncomeExpenseRatio(income, expense) {
  const card = $('#incomeExpenseRatioCard');
  if (!card) return;
  if (income === 0 && expense === 0) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  const total = income + expense;
  const inPct = total > 0 ? (income / total) * 100 : 0;
  const outPct = total > 0 ? (expense / total) * 100 : 0;
  $('#ratioBarIn').style.width = inPct + '%';
  $('#ratioBarOut').style.width = outPct + '%';
  $('#ratioLabel').innerHTML =
    `<span class="income-txt">+${moneyShort(income)} (${inPct.toFixed(0)}%)</span>` +
    `<span class="expense-txt">−${moneyShort(expense)} (${outPct.toFixed(0)}%)</span>`;
  const saving = income - expense;
  const savingRate = income > 0 ? (saving / income) * 100 : 0;
  let verdict;
  if (saving >= 0 && savingRate >= 20) verdict = `🎯 Saving rate ${savingRate.toFixed(0)}% — great!`;
  else if (saving >= 0) verdict = `💪 Saving ${moneyShort(saving)} (${savingRate.toFixed(0)}% dari income)`;
  else verdict = `⚠️ Defisit ${moneyShort(-saving)} bulan ini`;
  $('#ratioVerdict').textContent = verdict;
}

// Forecast next 3 months of subscription spend (with growth projection)
function renderSubForecast() {
  const wrap = $('#subForecast');
  if (!wrap) return;
  wrap.innerHTML = '';
  const active = state.subscriptions.filter(s => s.active !== false && s.type !== 'income');
  if (active.length === 0) {
    wrap.appendChild(el('div', { class: 'muted-txt', style: 'font-size:13px;padding:8px 0;text-align:center' }, 'Belum ada langganan aktif.'));
    return;
  }
  const monthlyOut = active.reduce((s, sub) => s + subMonthlyCost(sub), 0);
  const today = new Date();
  const months = [];
  for (let i = 0; i < 3; i++) {
    const m = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({ label: m.toLocaleDateString('id-ID', { month: 'long' }), amount: monthlyOut });
  }
  const grid = el('div', { class: 'compare-grid', style: 'grid-template-columns:1fr 1fr 1fr' });
  months.forEach((m, i) => {
    grid.appendChild(el('div', { class: 'compare-col' },
      el('div', { class: 'cc-label' }, m.label),
      el('div', { class: 'cc-val expense-txt', style: 'font-size:18px' }, moneyShort(m.amount))
    ));
  });
  wrap.appendChild(grid);
  const total = months.reduce((s, m) => s + m.amount, 0);
  wrap.appendChild(el('div', { style: 'text-align:center;margin-top:10px;font-size:13px;color:var(--label-2)' },
    `Total 3 bulan: ${money(total)}`));
}

function renderLineChart(refDate) {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    months.push(new Date(refDate.getFullYear(), refDate.getMonth() - i, 1));
  }
  const incomes  = months.map(m => state.expenses.filter(t => isInMonth(t.date, m) && t.type === 'income').reduce((s,t) => s+t.amount, 0));
  const expenses = months.map(m => state.expenses.filter(t => isInMonth(t.date, m) && t.type === 'expense').reduce((s,t) => s+t.amount, 0));
  const labels = months.map(m => m.toLocaleDateString('id-ID', { month: 'short' }));

  if (lineChart) lineChart.destroy();
  const ctx = $('#chartLine').getContext('2d');
  const txt = chartTextColor();
  const grid = chartGridColor();
  lineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Masuk',  data: incomes,  backgroundColor: '#34c759', borderRadius: 4 },
        { label: 'Keluar', data: expenses, backgroundColor: '#ff3b30', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: txt, font: { size: 11 }, boxWidth: 10, boxHeight: 10, padding: 12 } },
        tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ': ' + money(ctx.raw) } }
      },
      scales: {
        x: { ticks: { color: txt, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: txt, font: { size: 10 }, callback: (v) => moneyShort(v).replace(/^.+\s/, '') }, grid: { color: grid } }
      }
    }
  });
}

// ============================================================
// SETTINGS
// ============================================================

function renderSettings() {
  const s = state.settings;
  const themeLabels = { auto: 'Otomatis', light: 'Terang', dark: 'Gelap' };
  $('#themeValue').textContent = themeLabels[s.theme] || 'Otomatis';
  $('#densityValue').textContent = s.density === 'compact' ? 'Padat' : 'Nyaman';
  $('#currencyValue').textContent = CURRENCIES[s.currency]?.name || 'IDR (Rp)';
  $('#monthStartValue').textContent = `Tgl ${s.monthStartDay || 1}`;
  $('#switchDecimals').classList.toggle('on', !!s.showDecimals);
  $('#switchHaptic').classList.toggle('on', !!s.haptic);
  $('#switchAutoRec').classList.toggle('on', !!s.autoExecRecurring);
  $('#switchNotif').classList.toggle('on', !!s.notifications);
  $('#switchBudgetRollover')?.classList.toggle('on', !!s.budgetRollover);
  $$('.accent-swatch').forEach(sw => sw.classList.toggle('active', sw.dataset.c === s.accent));
  try {
    const size = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
    $('#storageSize').textContent = size < 1024 ? `${size} B` : `${(size/1024).toFixed(1)} KB`;
  } catch { $('#storageSize').textContent = '—'; }

  // Notification permission hint
  if ('Notification' in window) {
    const p = Notification.permission;
    $('#notifSub').textContent = p === 'denied' ? 'Diblokir di pengaturan browser' :
                                  p === 'granted' ? 'Izin aktif' : 'Untuk reminder langganan';
  } else {
    $('#notifSub').textContent = 'Tidak didukung browser ini';
  }

  // Backup reminder hint on Export cell — if never backed up or >30 days
  const days = daysSinceLastBackup();
  const expCell = $('#cellExport');
  if (expCell) {
    const existingHint = expCell.querySelector('.backup-hint');
    if (existingHint) existingHint.remove();
    if (days < 0 || days > 30) {
      const hint = el('span', { class: 'backup-hint', style: 'background:rgba(255,149,0,.2);color:var(--warning);padding:3px 8px;border-radius:999px;font-size:11px;font-weight:600;margin-right:6px' },
        days < 0 ? 'Belum pernah backup' : `${days}h yang lalu`);
      expCell.querySelector('.cell-chevron').before(hint);
    }
  }
}

// ============================================================
// ACCOUNTS VIEW
// ============================================================

function renderAccounts() {
  const all = getAccounts(true);
  const active = all.filter(a => !a.archived);
  $('#acctTotal').textContent = money(totalBalance());
  $('#acctCount').textContent = all.length;
  $('#acctActive').textContent = active.length;

  const list = $('#accountsList');
  list.innerHTML = '';
  if (all.length === 0) {
    list.appendChild(el('div', { class: 'list-empty' }, 'Belum ada akun. Tekan + Tambah.'));
    return;
  }
  list.appendChild(el('div', { class: 'list-group' }, el('div', { class: 'list-group-rows' },
    ...all.map(a => renderAccountRow(a))
  )));
}

// ============================================================
// DEBTS VIEW
// ============================================================

function debtPaidAmount(d) { return (d.payments || []).reduce((s,p) => s + p.amount, 0); }
function debtRemaining(d) { return Math.max(0, d.originalAmount - debtPaidAmount(d)); }
function debtIsPaid(d) { return debtRemaining(d) <= 0; }

function renderDebts() {
  let debts = state.debts.slice();
  if (ui.debtFilter !== 'all') debts = debts.filter(d => d.type === ui.debtFilter);

  const active = state.debts.filter(d => !debtIsPaid(d));
  const owed = active.filter(d => d.type === 'owed_to_me').reduce((s,d) => s + debtRemaining(d), 0);
  const iowe = active.filter(d => d.type === 'i_owe').reduce((s,d) => s + debtRemaining(d), 0);
  const net = owed - iowe;
  $('#debtNet').textContent = (net >= 0 ? '+ ' : '− ') + money(Math.abs(net));
  $('#debtOwed').textContent = moneyShort(owed);
  $('#debtIOwe').textContent = moneyShort(iowe);

  $$('[data-debt-filter]').forEach(b => b.classList.toggle('active', b.dataset.debtFilter === ui.debtFilter));

  const list = $('#debtsList');
  list.innerHTML = '';
  if (debts.length === 0) {
    list.appendChild(illustratedEmpty('🤝',
      'Belum ada hutang / piutang',
      'Track siapa hutang apa ke siapa. Bisa cicil + auto-convert ke transaksi saat lunas.'));
    return;
  }
  // Sort: unpaid first, by date desc
  debts.sort((a,b) => {
    const pa = debtIsPaid(a), pb = debtIsPaid(b);
    if (pa !== pb) return pa ? 1 : -1;
    return (b.date || '').localeCompare(a.date || '');
  });
  list.appendChild(el('div', { class: 'list-group' }, el('div', { class: 'list-group-rows' },
    ...debts.map(d => renderDebtRow(d))
  )));
}

function renderDebtRow(d) {
  const paid = debtIsPaid(d);
  const partial = debtPaidAmount(d) > 0 && !paid;
  const rem = debtRemaining(d);
  const cls = d.type === 'owed_to_me' ? 'owed' : 'iowe';
  const sign = d.type === 'owed_to_me' ? '+' : '−';

  const badge = paid ? el('span', { class: 'badge paid' }, 'LUNAS') :
                partial ? el('span', { class: 'badge partial' }, 'CICIL') :
                          el('span', { class: 'badge unpaid' }, 'BELUM');
  const infoParts = [d.type === 'owed_to_me' ? 'Piutang' : 'Hutang', shortDate(d.date)];
  if (d.dueDate) {
    const dl = daysUntil(d.dueDate);
    if (!paid && dl < 0) infoParts.push(`Telat ${Math.abs(dl)} hari`);
    else if (!paid) infoParts.push(`${dl}h lagi`);
  }

  return el('div', { class: 'debt-row', 'data-debt-id': d.id, onclick: () => openDebtModal(d) },
    el('div', { class: 'debt-avatar ' + avatarColorClass(d.person) }, avatarInitials(d.person)),
    el('div', { class: 'debt-main' },
      el('div', { class: 'debt-person' }, d.person, ' ', badge),
      el('div', { class: 'debt-info' }, infoParts.join(' • ') + (d.note ? ' • ' + d.note : ''))
    ),
    el('div', { class: 'debt-amount ' + cls }, sign + ' ' + money(rem))
  );
}

// ============================================================
// TAGS VIEW
// ============================================================

function renderTags() {
  const list = $('#tagsList');
  list.innerHTML = '';
  if (state.tags.length === 0) {
    list.appendChild(el('div', { class: 'list-empty' },
      'Belum ada tag. Tap "Baru" untuk tambah. Tag bisa dipakai di form transaksi.'
    ));
    return;
  }
  const usage = {};
  state.expenses.forEach(t => (t.tags || []).forEach(id => usage[id] = (usage[id]||0) + 1));

  const chevron = '<svg class="cell-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
  const group = el('div', { class: 'list-group' }, el('div', { class: 'list-group-rows' },
    ...state.tags.map(t => {
      const row = el('div', { class: 'cell', onclick: () => openTagModal(t) },
        el('div', { class: 'tag-color-dot', style: `background:${t.color}` }),
        el('div', { class: 'cell-main' },
          el('div', { class: 'cell-title' }, '#' + t.name),
          el('div', { class: 'cell-sub' }, (usage[t.id] || 0) + ' transaksi')
        )
      );
      row.insertAdjacentHTML('beforeend', chevron);
      return row;
    })
  ));
  list.appendChild(group);
}

// ============================================================
// MODALS — Expense / Income
// ============================================================

function openExpenseModal(tx = null) {
  const isEdit = !!tx;
  const t = tx
    ? { ...tx, tags: [...(tx.tags||[])] }
    : { id: uid(), type: 'expense', date: isoDate(),
        category: getCategories('expense')[0].id, name: '', amount: 0, note: '',
        accountId: state.settings.defaultAccountId,
        tags: [], receipt: null };

  showModal({
    title: isEdit ? 'Edit Transaksi' : 'Transaksi Baru',
    save: () => saveTx(t, isEdit),
    body: () => {
      const body = el('div');

      const typeSwitch = el('div', { class: 'type-switch' },
        el('button', {
          class: 'expense ' + (t.type === 'expense' ? 'active expense' : ''),
          onclick: () => { t.type = 'expense'; t.category = getCategories('expense')[0].id; rebuildModalBody(); }
        }, 'Pengeluaran'),
        el('button', {
          class: 'income ' + (t.type === 'income' ? 'active income' : ''),
          onclick: () => { t.type = 'income'; t.category = getCategories('income')[0].id; rebuildModalBody(); }
        }, 'Pemasukan')
      );
      body.appendChild(typeSwitch);

      // Quick suggestions (only when creating new)
      if (!isEdit) {
        const suggestions = getRecentSuggestions(t.type, 5);
        if (suggestions.length > 0) {
          body.appendChild(el('div', { class: 'quick-suggest-label' }, '💡 Pilihan Cepat'));
          const row = el('div', { class: 'quick-suggest' });
          suggestions.forEach(s => {
            row.appendChild(el('button', { class: 'quick-suggest-chip', type: 'button',
              onclick: () => {
                t.name = s.name;
                t.amount = s.amount;
                t.category = s.category;
                if (s.accountId) t.accountId = s.accountId;
                haptic(8);
                rebuildModalBody();
              }
            },
              el('span', {}, getCategory(t.type, s.category).icon),
              el('span', {}, s.name),
              el('span', { class: 'qs-amt' }, moneyShort(s.amount))
            ));
          });
          body.appendChild(row);
        }
      }

      // Amount + voice
      const amtWrap = formField('Jumlah', amountInput(v => t.amount = v, t.amount, 'amount-input'));
      const voiceBtn = el('button', { class: 'voice-btn', type: 'button',
        html: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> Suara'
      });
      voiceBtn.onclick = (e) => {
        e.preventDefault();
        startVoice(voiceBtn, (transcript) => {
          const parsed = parseVoiceTx(transcript);
          if (parsed.amount > 0) {
            t.amount = parsed.amount;
            const ai = body.querySelector('.amount-input');
            if (ai) ai.value = formatAmount(parsed.amount);
          }
          if (parsed.name) {
            t.name = parsed.name;
            const ni = body.querySelector('input[data-field="name"]');
            if (ni) ni.value = parsed.name;
          }
          toast('"' + transcript + '"');
        });
      };
      amtWrap.querySelector('label').appendChild(el('span', { style: 'float:right;text-transform:none' }, voiceBtn));
      body.appendChild(amtWrap);

      // Categories — track manual pick to prevent smart-suggest from clobbering
      const catGrid = buildCategoryPicker('expense', () => t.category, id => {
        t.category = id; t._userPickedCategory = true;
      });
      // Re-bind onChange to current type for the income/expense type switch case
      // (actually rebuildModalBody will create a fresh picker — this just covers the current view)
      body.appendChild(formField('Kategori', catGrid));

      // Account picker
      if (getAccounts().length > 1) {
        body.appendChild(formField('Akun',
          buildAccountPicker(() => t.accountId, id => t.accountId = id)));
      }

      // Name + date — name has smart category suggestion + tag autocomplete
      const nameWrap = el('div', { class: 'tag-autocomplete' });
      const nameInput = el('input', { type: 'text', placeholder: 'Misal: Indomie goreng',
        value: t.name || '', 'data-field': 'name', autocomplete: 'off',
        oninput: (e) => {
          t.name = e.target.value;
          // Smart suggest only when user hasn't manually picked + creating new
          if (!isEdit && !t._userPickedCategory && e.target.value.length >= 3) {
            const suggested = suggestCategory(e.target.value, t.type);
            if (suggested && suggested !== t.category) {
              t.category = suggested;
              catGrid.refresh();
            }
          }
          // Tag autocomplete — show matching tags
          renderTagAutocomplete(e.target.value, t);
        } });
      const acList = el('div', { class: 'tag-autocomplete-list', id: 'tagAutocompleteList' });
      nameWrap.appendChild(nameInput);
      nameWrap.appendChild(acList);

      body.appendChild(el('div', { class: 'field-row' },
        formField('Nama', nameWrap),
        formField('Tanggal', el('input', { type: 'date', value: t.date,
          oninput: (e) => t.date = e.target.value }))
      ));

      // Hide AC when clicking outside
      setTimeout(() => {
        document.addEventListener('click', closeTagAutocomplete, { once: false });
      }, 100);

      // Tags
      body.appendChild(el('div', { class: 'field' },
        el('label', {}, 'Tag'),
        el('div', { class: 'tag-chips', onclick: () => openTagPicker(t.tags, (selected) => {
          t.tags = selected;
          rebuildModalBody();
        }) },
          ...(t.tags || []).map(id => {
            const tag = getTag(id);
            if (!tag) return null;
            return el('span', { class: 'tag-chip selected' }, '#' + tag.name);
          }),
          (t.tags || []).length === 0 ? el('span', { class: 'tag-add-hint' }, 'Tap untuk pilih tag...') : null
        )
      ));

      // Receipt — with Lihat / Ganti / Hapus action sheet when photo exists
      body.appendChild(el('div', { class: 'field' },
        el('label', {}, 'Foto Nota'),
        el('div', { class: 'receipt-picker', onclick: () => {
          if (t.receipt) {
            openActionSheet('Foto Nota', [
              { label: 'Lihat foto',  icon: '👁', onClick: () => openPhotoViewer(t.receipt) },
              { label: 'Ganti foto',  icon: '🔄', onClick: () => captureReceipt((dataUrl) => { t.receipt = dataUrl; rebuildModalBody(); }) },
              { label: 'Hapus foto',  icon: '🗑️', destructive: true,
                onClick: () => { t.receipt = null; rebuildModalBody(); toast('Foto dihapus'); } },
            ]);
          } else {
            captureReceipt((dataUrl) => { t.receipt = dataUrl; rebuildModalBody(); });
          }
        }},
          el('div', { class: 'receipt-thumb' + (t.receipt ? ' has-photo' : ''),
            style: t.receipt ? `background-image:url(${t.receipt})` : '' }, t.receipt ? '' : '📷'),
          el('div', { class: 'receipt-main' },
            t.receipt ? 'Foto terpasang' : 'Tambah foto nota',
            el('div', { class: 'receipt-sub' }, t.receipt ? 'Tap untuk lihat / ganti / hapus' : 'Optional')
          ),
          el('span', { class: 'receipt-action' }, t.receipt ? 'Opsi' : 'Pilih')
        )
      ));

      body.appendChild(formField('Catatan (opsional)', el('textarea', {
        placeholder: 'Tambah catatan…',
        oninput: (e) => t.note = e.target.value
      }, t.note || '')));

      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteTx(t.id) }, 'Hapus Transaksi'));
      }

      return body;
    }
  });
}
function rebuildModalBody() {
  const cur = ui.currentModalSave;
  if (cur && cur.bodyFn) {
    $('#modalBody').innerHTML = '';
    $('#modalBody').appendChild(cur.bodyFn());
  }
}
function saveTx(t, isEdit) {
  if (!t.amount || t.amount <= 0) { toast.warning('Jumlah harus diisi'); return; }
  if (isEdit) {
    const idx = state.expenses.findIndex(x => x.id === t.id);
    if (idx >= 0) state.expenses[idx] = t;
  } else {
    t.createdAt = Date.now();
    state.expenses.push(t);
  }
  // Record name→category mapping when user has consistently used same category
  learnCategoryFromTx(t);
  save(); hap('save'); hideModal(); render();
  if (!isEdit) showSuccess();
  if (isEdit) toast('Tersimpan');
}
function deleteTx(id) {
  const tx = state.expenses.find(t => t.id === id);
  if (!tx) return;
  state.expenses = state.expenses.filter(t => t.id !== id);
  save(); hideModal(); render(); hap('delete');
  toast('Transaksi dihapus', {
    action: { label: 'Urungkan', onClick: () => { state.expenses.push(tx); save(); render(); } }
  });
}

// ============================================================
// MODAL — Transfer between accounts
// ============================================================

function openTransferModal(existing = null) {
  const isEdit = !!existing;
  const accs = getAccounts();
  if (accs.length < 2) {
    toast('Butuh minimal 2 akun untuk transfer');
    return;
  }
  const t = existing
    ? { ...existing }
    : {
        id: uid(),
        type: 'transfer',
        date: isoDate(),
        amount: 0,
        fromAccountId: accs[0].id,
        toAccountId: accs[1].id,
        name: '',
        note: '',
      };

  showModal({
    title: isEdit ? 'Edit Transfer' : 'Transfer Antar Akun',
    save: () => saveTransfer(t, isEdit),
    body: () => {
      const body = el('div');

      body.appendChild(formField('Jumlah', amountInput(v => t.amount = v, t.amount, 'amount-input')));

      const validate = (otherField) => (id) => {
        if (t[otherField] === id) { toast('Pilih akun berbeda'); return false; }
        return true;
      };
      body.appendChild(formField('Dari Akun', buildAccountPicker(
        () => t.fromAccountId, id => t.fromAccountId = id,
        { accounts: accs, validate: validate('toAccountId') })));
      body.appendChild(formField('Ke Akun', buildAccountPicker(
        () => t.toAccountId, id => t.toAccountId = id,
        { accounts: accs, validate: validate('fromAccountId') })));

      body.appendChild(el('div', { class: 'field-row' },
        formField('Tanggal', el('input', { type: 'date', value: t.date,
          oninput: (e) => t.date = e.target.value })),
        formField('Nama (opsional)', el('input', { type: 'text', value: t.name || '',
          placeholder: 'Misal: Top up GoPay',
          oninput: (e) => t.name = e.target.value }))
      ));

      body.appendChild(formField('Catatan (opsional)', el('textarea', {
        oninput: (e) => t.note = e.target.value
      }, t.note || '')));

      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteTx(t.id) }, 'Hapus Transfer'));
      }
      return body;
    }
  });
}
function saveTransfer(t, isEdit) {
  if (!t.amount || t.amount <= 0) { toast.warning('Jumlah harus diisi'); return; }
  if (t.fromAccountId === t.toAccountId) { toast('Akun harus berbeda'); return; }
  if (!t.name) {
    const from = getAccount(t.fromAccountId), to = getAccount(t.toAccountId);
    t.name = `${from?.name || ''} → ${to?.name || ''}`;
  }
  if (isEdit) {
    const idx = state.expenses.findIndex(x => x.id === t.id);
    if (idx >= 0) state.expenses[idx] = t;
  } else {
    t.createdAt = Date.now();
    state.expenses.push(t);
  }
  save(); hap('save'); hideModal(); render();
  toast(isEdit ? 'Transfer tersimpan' : 'Transfer dicatat');
}

// ============================================================
// MODAL — Subscription / Recurring
// ============================================================

function openSubModal(sub = null) {
  const isEdit = !!sub;
  const s = sub
    ? { ...sub, tags: [...(sub.tags || [])] }
    : {
        id: uid(), name: '', amount: 0, type: 'expense',
        category: getCategories('subscription')[0].id,
        cycle: 'monthly', nextRenewal: isoDate(),
        reminderDays: 3, active: true, note: '',
        accountId: state.settings.defaultAccountId,
        tags: [], autoExecute: false, endDate: null,
      };

  showModal({
    title: isEdit ? 'Edit Langganan' : 'Langganan Baru',
    save: () => saveSub(s, isEdit),
    body: () => {
      const body = el('div');

      const typeSwitch = el('div', { class: 'type-switch' },
        el('button', {
          class: 'expense ' + (s.type === 'expense' ? 'active expense' : ''),
          onclick: () => { s.type = 'expense'; rebuildModalBody(); }
        }, 'Pengeluaran'),
        el('button', {
          class: 'income ' + (s.type === 'income' ? 'active income' : ''),
          onclick: () => { s.type = 'income'; rebuildModalBody(); }
        }, 'Pemasukan')
      );
      body.appendChild(typeSwitch);

      body.appendChild(formField('Nama', el('input', { type: 'text',
        placeholder: 'Misal: Netflix, Spotify, Gaji',
        value: s.name, oninput: (e) => s.name = e.target.value })));

      body.appendChild(formField('Biaya', amountInput(v => s.amount = v, s.amount, 'amount-input')));

      const cycleSel = el('select', { onchange: (e) => s.cycle = e.target.value });
      Object.entries(CYCLES).forEach(([k, v]) =>
        cycleSel.appendChild(el('option', { value: k, selected: s.cycle === k ? '' : false }, v.label))
      );

      body.appendChild(el('div', { class: 'field-row' },
        formField('Siklus', cycleSel),
        formField('Tanggal Berikutnya', el('input', { type: 'date', value: s.nextRenewal,
          oninput: (e) => s.nextRenewal = e.target.value }))
      ));

      body.appendChild(formField('Kategori',
        buildCategoryPicker('subscription', () => s.category, id => s.category = id)));

      // Account picker
      if (getAccounts().length > 1) {
        body.appendChild(formField('Dari Akun',
          buildAccountPicker(() => s.accountId, id => s.accountId = id)));
      }

      body.appendChild(formField('Ingatkan berapa hari sebelum', el('input', {
        type: 'number', min: '0', max: '30', value: s.reminderDays ?? 3,
        oninput: (e) => s.reminderDays = parseInt(e.target.value || '0', 10)
      })));

      // Toggles: active + autoExecute
      const activeSwitch  = buildSwitch(s.active !== false, on => s.active = on);
      const autoSwitch    = buildSwitch(!!s.autoExecute,    on => s.autoExecute = on);

      body.appendChild(el('div', { class: 'field-group' },
        el('div', { class: 'field-row-inline' },
          el('label', {}, 'Aktif'),
          el('div', { style: 'flex:1' }),
          activeSwitch
        ),
        el('div', { class: 'field-row-inline' },
          el('label', {}, 'Auto-eksekusi'),
          el('div', { style: 'flex:1' }),
          autoSwitch
        )
      ));

      body.appendChild(formField('Catatan (opsional)', el('textarea', {
        oninput: (e) => s.note = e.target.value
      }, s.note || '')));

      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-secondary', onclick: () => advanceSub(s) },
          'Tandai Sudah Bayar'
        ));
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteSub(s.id) }, 'Hapus Langganan'));
      }

      return body;
    }
  });
}
function saveSub(s, isEdit) {
  if (!s.name) { toast.warning('Nama harus diisi'); return; }
  if (!s.amount || s.amount <= 0) { toast.warning('Biaya harus diisi'); return; }
  if (isEdit) {
    const idx = state.subscriptions.findIndex(x => x.id === s.id);
    if (idx >= 0) state.subscriptions[idx] = s;
  } else {
    state.subscriptions.push(s);
  }
  save(); hap('save'); hideModal(); render();
  toast(isEdit ? 'Tersimpan' : 'Berhasil ditambah');
}
function advanceSub(s) {
  state.expenses.push({
    id: uid(), type: s.type || 'expense', date: s.nextRenewal,
    category: s.category, name: s.name,
    amount: s.amount, note: `Auto: ${CYCLES[s.cycle].label}`,
    accountId: s.accountId || state.settings.defaultAccountId,
    tags: [], createdAt: Date.now()
  });
  const d = new Date(s.nextRenewal);
  const months = CYCLES[s.cycle].months;
  if (months === 12/52) d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + Math.round(months));
  s.nextRenewal = isoDate(d);
  const idx = state.subscriptions.findIndex(x => x.id === s.id);
  if (idx >= 0) state.subscriptions[idx] = s;
  save(); hap('longPress'); hideModal(); render();
  toast('Dicatat & renewal dimajukan');
}
function deleteSub(id) {
  const sub = state.subscriptions.find(s => s.id === id);
  if (!sub) return;
  state.subscriptions = state.subscriptions.filter(s => s.id !== id);
  save(); hideModal(); render();
  toast('Langganan dihapus', {
    action: { label: 'Urungkan', onClick: () => { state.subscriptions.push(sub); save(); render(); } }
  });
}

// ============================================================
// MODAL — Budget
// ============================================================

function openBudgetModal(catId = null) {
  const isEdit = !!catId;
  const data = { cat: catId || getCategories('expense')[0].id, amount: state.budgets[catId] || 0 };

  showModal({
    title: isEdit ? 'Edit Budget' : 'Budget Baru',
    save: () => saveBudget(data),
    body: () => {
      const body = el('div');
      if (!isEdit) {
        body.appendChild(formField('Kategori',
          buildCategoryPicker('expense', () => data.cat, id => {
            data.cat = id;
            if (state.budgets[data.cat]) {
              data.amount = state.budgets[data.cat];
              const ai = body.querySelector('.amount-input');
              if (ai) ai.value = formatAmount(data.amount);
            }
          })));
      } else {
        const cat = getCategory('expense', catId);
        body.appendChild(el('div', { class: 'field-group' },
          el('div', { class: 'field-row-inline' },
            el('label', {}, 'Kategori'),
            el('div', { style: 'flex:1' }),
            el('div', { class: 'cell-value' }, cat.icon + '  ' + cat.name)
          )
        ));
      }

      body.appendChild(formField('Limit per Bulan', amountInput(v => data.amount = v, data.amount, 'amount-input')));

      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteBudget(catId) }, 'Hapus Budget'));
      }
      return body;
    }
  });
}
function saveBudget(data) {
  if (data.amount <= 0) { toast.warning('Limit harus lebih dari 0'); return; }
  state.budgets[data.cat] = data.amount;
  save(); hap('save'); hideModal(); render();
  toast('Budget tersimpan');
}
function deleteBudget(catId) {
  const v = state.budgets[catId];
  if (v == null) return;
  delete state.budgets[catId];
  save(); hideModal(); render();
  toast('Budget dihapus', {
    action: { label: 'Urungkan', onClick: () => { state.budgets[catId] = v; save(); render(); } }
  });
}

// ============================================================
// MODAL — Goal
// ============================================================

function openGoalModal(goal = null) {
  const isEdit = !!goal;
  const g = goal ? { ...goal } : { id: uid(), name: '', target: 0, current: 0, deadline: '' };

  showModal({
    title: isEdit ? 'Edit Goal' : 'Goal Tabungan Baru',
    save: () => saveGoal(g, isEdit),
    body: () => {
      const body = el('div');
      body.appendChild(formField('Nama Goal', el('input', { type: 'text',
        placeholder: 'Misal: DP rumah, iPhone, Liburan',
        value: g.name, oninput: (e) => g.name = e.target.value })));
      body.appendChild(formField('Target', amountInput(v => g.target = v, g.target, 'amount-input')));
      body.appendChild(formField('Sudah Terkumpul', amountInput(v => g.current = v, g.current, '')));
      body.appendChild(formField('Deadline (opsional)', el('input', { type: 'date', value: g.deadline || '',
        oninput: (e) => g.deadline = e.target.value })));
      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteGoal(g.id) }, 'Hapus Goal'));
      }
      return body;
    }
  });
}
function saveGoal(g, isEdit) {
  if (!g.name) { toast.warning('Nama harus diisi'); return; }
  if (g.target <= 0) { toast('Target harus diisi'); return; }
  const wasComplete = isEdit
    ? ((state.goals.find(x => x.id === g.id)?.current || 0) >= (state.goals.find(x => x.id === g.id)?.target || Infinity))
    : false;
  const nowComplete = g.current >= g.target;
  if (isEdit) {
    const idx = state.goals.findIndex(x => x.id === g.id);
    if (idx >= 0) state.goals[idx] = g;
  } else {
    state.goals.push(g);
  }
  save(); hap('save'); hideModal(); render();
  if (!wasComplete && nowComplete) {
    fireConfetti();
    showSuccess(900);
    hap('goal');
    toast('🎉 Goal tercapai! ' + g.name);
  } else {
    toast(isEdit ? 'Tersimpan' : 'Berhasil ditambah');
  }
}
function deleteGoal(id) {
  const g = state.goals.find(x => x.id === id);
  if (!g) return;
  state.goals = state.goals.filter(x => x.id !== id);
  save(); hideModal(); render();
  toast('Goal dihapus', {
    action: { label: 'Urungkan', onClick: () => { state.goals.push(g); save(); render(); } }
  });
}

// ============================================================
// MODAL — Account (create/edit/archive/delete)
// ============================================================

function openAccountModal(acc = null) {
  const isEdit = !!acc;
  const a = acc ? { ...acc } : {
    id: 'acc_' + uid().slice(0, 8), name: '', type: 'cash',
    initialBalance: 0, includeInTotal: true, archived: false,
  };

  showModal({
    title: isEdit ? 'Edit Akun' : 'Akun Baru',
    save: () => saveAccount(a, isEdit),
    body: () => {
      const body = el('div');

      body.appendChild(formField('Nama Akun', el('input', { type: 'text',
        placeholder: 'Misal: BCA, GoPay, Tunai',
        value: a.name, oninput: (e) => a.name = e.target.value })));

      body.appendChild(formField('Tipe',
        buildAccountTypePicker(() => a.type, key => a.type = key)));

      body.appendChild(formField('Saldo Awal', amountInput(v => a.initialBalance = v, a.initialBalance, 'amount-input')));

      if (isEdit) {
        const balance = accountBalance(a);
        body.appendChild(el('div', { class: 'field-group' },
          el('div', { class: 'field-row-inline' },
            el('label', {}, 'Saldo Saat Ini'),
            el('div', { style: 'flex:1' }),
            el('div', { class: 'cell-value', style: 'font-weight:600;color:var(--label)' }, money(balance))
          )
        ));
      }

      const inclSwitch     = buildSwitch(a.includeInTotal !== false, on => a.includeInTotal = on);
      const archivedSwitch = buildSwitch(!!a.archived,                on => a.archived = on);

      body.appendChild(el('div', { class: 'field-group' },
        el('div', { class: 'field-row-inline' },
          el('label', {}, 'Masuk total saldo'),
          el('div', { style: 'flex:1' }),
          inclSwitch
        ),
        isEdit ? el('div', { class: 'field-row-inline' },
          el('label', {}, 'Arsipkan'),
          el('div', { style: 'flex:1' }),
          archivedSwitch
        ) : null
      ));

      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteAccount(a) }, 'Hapus Akun'));
      }
      return body;
    }
  });
}
function saveAccount(a, isEdit) {
  if (!a.name) { toast('Nama akun harus diisi'); return; }
  if (isEdit) {
    const idx = state.accounts.findIndex(x => x.id === a.id);
    if (idx >= 0) state.accounts[idx] = a;
  } else {
    state.accounts.push(a);
  }
  save(); hap('save'); hideModal(); render();
  toast(isEdit ? 'Akun diupdate' : 'Akun ditambah');
}
function deleteAccount(a) {
  const txCount = state.expenses.filter(t =>
    t.accountId === a.id || t.fromAccountId === a.id || t.toAccountId === a.id
  ).length;
  if (txCount > 0) {
    if (!confirm(`Akun ini punya ${txCount} transaksi. Hapus akun? Transaksi tidak ikut terhapus, tapi akan kehilangan link akun.`)) return;
  } else {
    if (!confirm('Hapus akun ini?')) return;
  }
  state.accounts = state.accounts.filter(x => x.id !== a.id);
  // Reassign default if it was deleted
  if (state.settings.defaultAccountId === a.id) {
    state.settings.defaultAccountId = state.accounts[0]?.id || null;
  }
  save(); hideModal(); render();
  toast('Akun dihapus');
}

// ============================================================
// MODAL — Debt
// ============================================================

function openDebtModal(debt = null) {
  const isEdit = !!debt;
  const d = debt
    ? { ...debt, payments: [...(debt.payments || [])] }
    : {
        id: uid(), person: '', type: 'i_owe',
        originalAmount: 0, payments: [],
        date: isoDate(), dueDate: '', note: '',
      };

  showModal({
    title: isEdit ? 'Edit Hutang/Piutang' : 'Hutang/Piutang Baru',
    save: () => saveDebt(d, isEdit),
    body: () => {
      const body = el('div');

      const typeSwitch = el('div', { class: 'type-switch' },
        el('button', {
          class: 'expense ' + (d.type === 'i_owe' ? 'active expense' : ''),
          onclick: () => { d.type = 'i_owe'; rebuildModalBody(); }
        }, 'Saya Hutang'),
        el('button', {
          class: 'income ' + (d.type === 'owed_to_me' ? 'active income' : ''),
          onclick: () => { d.type = 'owed_to_me'; rebuildModalBody(); }
        }, 'Mereka Hutang')
      );
      body.appendChild(typeSwitch);

      body.appendChild(formField('Nama Orang', el('input', { type: 'text',
        placeholder: 'Misal: Budi, Mama, Bos',
        value: d.person, oninput: (e) => d.person = e.target.value })));

      body.appendChild(formField('Jumlah Total', amountInput(v => d.originalAmount = v, d.originalAmount, 'amount-input')));

      body.appendChild(el('div', { class: 'field-row' },
        formField('Tanggal', el('input', { type: 'date', value: d.date,
          oninput: (e) => d.date = e.target.value })),
        formField('Deadline (opsional)', el('input', { type: 'date', value: d.dueDate || '',
          oninput: (e) => d.dueDate = e.target.value }))
      ));

      body.appendChild(formField('Catatan (opsional)', el('textarea', {
        oninput: (e) => d.note = e.target.value
      }, d.note || '')));

      // Payments
      if (isEdit) {
        const paid = debtPaidAmount(d);
        const rem = debtRemaining(d);
        body.appendChild(el('div', { class: 'field-group' },
          el('div', { class: 'field-row-inline' },
            el('label', {}, 'Sudah dibayar'),
            el('div', { style: 'flex:1' }),
            el('div', { class: 'cell-value income-txt' }, money(paid))
          ),
          el('div', { class: 'field-row-inline' },
            el('label', {}, 'Sisa'),
            el('div', { style: 'flex:1' }),
            el('div', { class: 'cell-value ' + (rem === 0 ? 'income-txt' : 'expense-txt') }, money(rem))
          )
        ));

        body.appendChild(el('button', { class: 'btn-secondary',
          onclick: () => openPayDebtModal(d) }, '+ Catat Pembayaran'));

        if (d.payments.length > 0) {
          body.appendChild(el('div', { class: 'section-title' }, 'Riwayat Pembayaran'));
          const grp = el('div', { class: 'group-body', style: 'margin:0 16px' });
          d.payments.forEach((p, i) => {
            grp.appendChild(el('div', { class: 'cell' },
              el('div', { class: 'cell-main' },
                el('div', { class: 'cell-title' }, money(p.amount)),
                el('div', { class: 'cell-sub' }, shortDate(p.date) + (p.accountId ? ' • ' + (getAccount(p.accountId)?.name || '') : ''))
              ),
              el('button', { class: 'modal-action', style: 'color:var(--expense)', onclick: (e) => {
                e.stopPropagation();
                if (!confirm('Hapus pembayaran ini?')) return;
                d.payments.splice(i, 1);
                rebuildModalBody();
              }}, 'Hapus')
            ));
          });
          body.appendChild(grp);
        }

        body.appendChild(el('button', { class: 'btn-danger', onclick: () => deleteDebt(d.id) }, 'Hapus'));
      }

      return body;
    }
  });
}

function openPayDebtModal(d) {
  const data = {
    amount: debtRemaining(d),
    date: isoDate(),
    accountId: state.settings.defaultAccountId,
    createTx: true,
  };

  // Save parent modal state so we can return to it
  const parentSave = ui.currentModalSave;

  showModal({
    title: 'Catat Pembayaran',
    save: () => {
      if (!data.amount || data.amount <= 0) { toast.warning('Jumlah harus diisi'); return; }
      d.payments.push({ amount: data.amount, date: data.date, accountId: data.accountId });
      // Create corresponding transaction
      if (data.createTx) {
        const isExpenseForMe = d.type === 'i_owe'; // I pay → outflow for me
        state.expenses.push({
          id: uid(),
          type: isExpenseForMe ? 'expense' : 'income',
          date: data.date,
          category: 'other',
          name: (isExpenseForMe ? 'Bayar hutang ke ' : 'Diterima dari ') + d.person,
          amount: data.amount,
          note: 'Pembayaran hutang',
          accountId: data.accountId,
          tags: [],
          createdAt: Date.now(),
        });
      }
      // Update debt
      const idx = state.debts.findIndex(x => x.id === d.id);
      if (idx >= 0) state.debts[idx] = d;
      save(); hap('save');
      // Return to parent modal
      ui.currentModalSave = parentSave;
      $('#modalTitle').textContent = parentSave.title;
      $('#modalBody').innerHTML = '';
      $('#modalBody').appendChild(parentSave.bodyFn());
      $('#modalSave').style.visibility = parentSave.save ? '' : 'hidden';
      toast('Pembayaran tercatat');
    },
    body: () => {
      const body = el('div');
      body.appendChild(formField('Jumlah Pembayaran', amountInput(v => data.amount = v, data.amount, 'amount-input')));
      body.appendChild(formField('Tanggal', el('input', { type: 'date', value: data.date,
        oninput: (e) => data.date = e.target.value })));
      if (getAccounts().length > 0) {
        body.appendChild(formField(d.type === 'i_owe' ? 'Bayar dari Akun' : 'Diterima di Akun',
          buildAccountPicker(() => data.accountId, id => data.accountId = id)));
      }

      const txSwitch = buildSwitch(!!data.createTx, on => data.createTx = on);
      body.appendChild(el('div', { class: 'field-group' },
        el('div', { class: 'field-row-inline' },
          el('label', {}, 'Catat sebagai transaksi'),
          el('div', { style: 'flex:1' }),
          txSwitch
        )
      ));

      return body;
    }
  });
}

function saveDebt(d, isEdit) {
  if (!d.person) { toast.warning('Nama harus diisi'); return; }
  if (!d.originalAmount || d.originalAmount <= 0) { toast.warning('Jumlah harus diisi'); return; }
  if (isEdit) {
    const idx = state.debts.findIndex(x => x.id === d.id);
    if (idx >= 0) state.debts[idx] = d;
  } else {
    state.debts.push(d);
  }
  save(); hap('save'); hideModal(); render();
  toast(isEdit ? 'Tersimpan' : 'Berhasil ditambah');
}
function deleteDebt(id) {
  const d = state.debts.find(x => x.id === id);
  if (!d) return;
  state.debts = state.debts.filter(x => x.id !== id);
  save(); hideModal(); render();
  toast('Hutang dihapus', {
    action: { label: 'Urungkan', onClick: () => { state.debts.push(d); save(); render(); } }
  });
}

// ============================================================
// MODAL — Split Bill
// ============================================================

function openSplitBillModal() {
  const data = {
    total: 0,
    note: '',
    participants: [
      { name: 'Aku', share: 1, isMe: true },
      { name: '', share: 1, isMe: false },
    ],
    createDebts: true,
  };

  showModal({
    title: 'Split Bill',
    save: () => commitSplitBill(data),
    body: () => {
      const body = el('div');

      body.appendChild(formField('Total Tagihan', amountInput(v => { data.total = v; refreshSummary(); }, data.total, 'amount-input')));
      body.appendChild(formField('Deskripsi (opsional)', el('input', { type: 'text',
        placeholder: 'Misal: Makan bareng di Sushi Tei',
        value: data.note, oninput: (e) => data.note = e.target.value })));

      // Participants
      body.appendChild(el('div', { class: 'section-title' }, 'Yang Patungan'));
      const partGroup = el('div', { class: 'field-group split-participants' });
      const renderParts = () => {
        partGroup.innerHTML = '';
        data.participants.forEach((p, i) => {
          const row = el('div', { class: 'split-row' });
          if (p.isMe) row.appendChild(el('span', { class: 'you-tag' }, 'KAMU'));
          row.appendChild(el('input', { class: 'split-name', type: 'text', placeholder: 'Nama', value: p.name,
            oninput: e => { p.name = e.target.value; refreshSummary(); },
            disabled: p.isMe ? '' : false }));
          row.appendChild(el('input', { class: 'split-share', type: 'number', value: p.share, min: 0, step: 0.5,
            oninput: e => { p.share = parseFloat(e.target.value) || 0; refreshSummary(); } }));
          if (!p.isMe) {
            row.appendChild(el('button', { class: 'split-remove', onclick: () => {
              data.participants.splice(i, 1); renderParts(); refreshSummary();
            }}, '−'));
          }
          partGroup.appendChild(row);
        });
        partGroup.appendChild(el('div', { class: 'cell', onclick: () => {
          data.participants.push({ name: '', share: 1, isMe: false });
          renderParts(); refreshSummary();
        }},
          el('div', { class: 'cell-main' }, el('div', { class: 'cell-title accent-txt' }, '+ Tambah Orang'))
        ));
      };
      body.appendChild(partGroup);
      renderParts();

      body.appendChild(el('div', { class: 'section-title' }, 'Pembagian'));
      const summaryWrap = el('div', { class: 'split-summary' });
      body.appendChild(summaryWrap);
      const refreshSummary = () => {
        const total = data.total || 0;
        const totalShares = data.participants.reduce((s, p) => s + (p.share || 0), 0);
        const perUnit = totalShares > 0 ? total / totalShares : 0;
        summaryWrap.innerHTML = '';
        data.participants.forEach(p => {
          const owed = (p.share || 0) * perUnit;
          summaryWrap.appendChild(el('div', { class: 'row' },
            el('span', {}, (p.name || '(nama)') + (p.isMe ? ' (kamu)' : '')),
            el('strong', {}, money(owed))
          ));
        });
        if (totalShares > 0) {
          summaryWrap.appendChild(el('div', { class: 'row', style: 'border-top:.5px solid var(--sep);padding-top:6px;margin-top:6px' },
            el('span', {}, 'Total'), el('strong', {}, money(total))
          ));
        }
      };
      refreshSummary();

      // Output mode
      const debtSwitch = buildSwitch(!!data.createDebts, on => data.createDebts = on);
      body.appendChild(el('div', { class: 'field-group' },
        el('div', { class: 'field-row-inline' },
          el('label', {}, 'Buat sebagai piutang'),
          el('div', { style: 'flex:1' }),
          debtSwitch
        )
      ));
      body.appendChild(el('div', { class: 'group-footer', style: 'padding:0 28px 8px' },
        'ON: kamu yang bayar dulu, setiap orang lain dicatat sebagai piutang.<br>OFF: hanya tambah expense untuk porsimu sendiri.'
      ));

      return body;
    }
  });
}

function commitSplitBill(data) {
  if (data.total <= 0) { toast('Total harus diisi'); return; }
  const totalShares = data.participants.reduce((s, p) => s + (p.share || 0), 0);
  if (totalShares <= 0) { toast('Bagian harus > 0'); return; }
  const perUnit = data.total / totalShares;
  const today = isoDate();
  const noteBase = data.note || 'Split bill';

  if (data.createDebts) {
    // Add expense for full amount (you paid)
    state.expenses.push({
      id: uid(), type: 'expense', date: today, category: 'food',
      name: noteBase + ' (kamu bayar)', amount: data.total, note: 'Split bill',
      accountId: state.settings.defaultAccountId, tags: [], createdAt: Date.now(),
    });
    // For each non-me, create owed_to_me debt
    let added = 0;
    data.participants.filter(p => !p.isMe).forEach(p => {
      const owed = (p.share || 0) * perUnit;
      if (owed <= 0 || !p.name) return;
      state.debts.push({
        id: uid(), person: p.name, type: 'owed_to_me',
        originalAmount: owed, payments: [],
        date: today, dueDate: '', note: noteBase,
      });
      added++;
    });
    save(); hideModal(); render();
    toast(`Bill dibagi: ${added} piutang dibuat`);
  } else {
    // Only add expense for your own share
    const me = data.participants.find(p => p.isMe);
    const mine = (me?.share || 0) * perUnit;
    state.expenses.push({
      id: uid(), type: 'expense', date: today, category: 'food',
      name: noteBase + ' (porsi kamu)', amount: mine, note: 'Split bill — sudah dibagi',
      accountId: state.settings.defaultAccountId, tags: [], createdAt: Date.now(),
    });
    save(); hideModal(); render();
    toast(`Porsi kamu (${money(mine)}) tercatat`);
  }
}

// ============================================================
// MODAL — Tag picker + tag editor
// ============================================================

function openTagPicker(currentIds, onChange) {
  const selected = new Set(currentIds || []);

  showModal({
    title: 'Pilih Tag',
    save: () => { onChange(Array.from(selected)); hideModal(); },
    body: () => {
      const body = el('div');

      // Selected chips at top
      const chips = el('div', { class: 'tag-pick-list', style: 'padding: 0 16px 16px' });
      const refresh = () => {
        chips.innerHTML = '';
        state.tags.forEach(t => {
          const isSel = selected.has(t.id);
          chips.appendChild(el('span', {
            class: 'tag-chip' + (isSel ? ' selected' : ''),
            style: isSel ? `background:${t.color}22;color:${t.color}` : '',
            onclick: () => {
              if (isSel) selected.delete(t.id); else selected.add(t.id);
              refresh();
            }
          }, '#' + t.name));
        });
        if (state.tags.length === 0) {
          chips.appendChild(el('span', { class: 'muted-txt', style: 'font-size:14px' },
            'Belum ada tag. Buat di bawah.'));
        }
      };
      refresh();
      body.appendChild(chips);

      // Quick add
      const newTag = { name: '', color: TAG_COLORS[0] };
      const addBody = el('div', { class: 'field-group' });
      const nameInput = el('input', { class: 'cat-edit-name', type: 'text', placeholder: 'Buat tag baru…',
        oninput: (e) => newTag.name = e.target.value });
      addBody.appendChild(el('div', { class: 'tag-edit-row' },
        el('div', { class: 'tag-color-dot', style: `background:${newTag.color}` }),
        nameInput,
        el('button', { class: 'modal-action', style: 'color:var(--accent)', onclick: () => {
          if (!newTag.name) { toast('Nama tag harus diisi'); return; }
          const t = { id: 'tag_' + uid().slice(0,6), name: newTag.name, color: newTag.color };
          state.tags.push(t);
          selected.add(t.id);
          save();
          newTag.name = '';
          nameInput.value = '';
          refresh();
        }}, '+ Buat')
      ));
      body.appendChild(addBody);

      return body;
    }
  });
}

function openTagModal(tag = null) {
  const isEdit = !!tag;
  const t = tag ? { ...tag } : { id: 'tag_' + uid().slice(0,6), name: '', color: TAG_COLORS[0] };

  showModal({
    title: isEdit ? 'Edit Tag' : 'Tag Baru',
    save: () => {
      if (!t.name) { toast.warning('Nama harus diisi'); return; }
      if (isEdit) {
        const idx = state.tags.findIndex(x => x.id === t.id);
        if (idx >= 0) state.tags[idx] = t;
      } else {
        state.tags.push(t);
      }
      save(); hap('save'); hideModal(); render();
      toast(isEdit ? 'Tersimpan' : 'Tag ditambah');
    },
    body: () => {
      const body = el('div');
      body.appendChild(formField('Nama Tag', el('input', { type: 'text',
        placeholder: 'Misal: kantor, hangout, urgent',
        value: t.name, oninput: (e) => t.name = e.target.value.replace(/[#\s]/g,'').slice(0, 24) })));

      const colorWrap = el('div', { class: 'accent-grid', style: 'grid-template-columns: repeat(8, 1fr); padding: 14px 16px' });
      TAG_COLORS.forEach(c => {
        const sw = el('div', { class: 'accent-swatch' + (t.color === c ? ' active' : ''),
          style: `background:${c};color:${c}`,
          onclick: () => {
            t.color = c;
            colorWrap.querySelectorAll('.accent-swatch').forEach((s, i) =>
              s.classList.toggle('active', TAG_COLORS[i] === t.color));
          } });
        colorWrap.appendChild(sw);
      });
      body.appendChild(formField('Warna', colorWrap));

      if (isEdit) {
        body.appendChild(el('button', { class: 'btn-danger', onclick: () => {
          if (!confirm('Hapus tag ini? Tag akan dilepas dari semua transaksi.')) return;
          state.tags = state.tags.filter(x => x.id !== t.id);
          state.expenses.forEach(tx => {
            if (Array.isArray(tx.tags)) tx.tags = tx.tags.filter(id => id !== t.id);
          });
          save(); hideModal(); render();
          toast('Tag terhapus');
        }}, 'Hapus Tag'));
      }

      return body;
    }
  });
}

// ============================================================
// MODAL — Settings pickers
// ============================================================

function openThemePicker() {
  openOptionPicker('Tema', [
    { v: 'auto',  label: 'Otomatis', sub: 'Ikut sistem' },
    { v: 'light', label: 'Terang' },
    { v: 'dark',  label: 'Gelap' },
  ], state.settings.theme, (v) => {
    state.settings.theme = v; save(); applyTheme(); render();
  });
}
function openDensityPicker() {
  openOptionPicker('Kerapatan', [
    { v: 'comfortable', label: 'Nyaman', sub: 'Lebih luas' },
    { v: 'compact',     label: 'Padat',  sub: 'Lebih banyak muat' },
  ], state.settings.density, (v) => {
    state.settings.density = v; save(); applyTheme(); render();
  });
}
function openCurrencyPicker() {
  const opts = Object.entries(CURRENCIES).map(([k, v]) => ({ v: k, label: v.name }));
  openOptionPicker('Mata Uang', opts, state.settings.currency, (v) => {
    const prev = state.settings.currency;
    // Warn user that values are NOT converted, only symbol display changes
    if (v !== prev && state.expenses.length > 0) {
      if (!confirm(`Ganti mata uang dari ${CURRENCIES[prev].name} ke ${CURRENCIES[v].name}?\n\n⚠️ Catatan: Nilai angka transaksi yang sudah ada TIDAK akan dikonversi. Hanya simbol mata uangnya yang berubah. Contoh: "Rp 22.000" akan jadi "$ 22.000" (bukan ~$1.40).`)) return;
    }
    state.settings.currency = v; save(); render();
  });
}
function openMonthStartPicker() {
  const opts = [1, 5, 10, 15, 20, 25, 28].map(d => ({ v: d, label: `Tanggal ${d}` }));
  openOptionPicker('Awal Bulan', opts, state.settings.monthStartDay || 1, (v) => {
    state.settings.monthStartDay = v; save(); render();
  });
}

function openOptionPicker(title, options, currentValue, onSelect) {
  showModal({
    title, save: null,
    body: () => el('div', { class: 'group' },
      el('div', { class: 'group-body' },
        ...options.map(o => el('div', { class: 'cell no-icon', onclick: () => {
          onSelect(o.v); haptic(8); hideModal();
        }},
          el('div', { class: 'cell-main' },
            el('div', { class: 'cell-title' }, o.label),
            o.sub ? el('div', { class: 'cell-sub' }, o.sub) : null
          ),
          currentValue === o.v
            ? el('span', { html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>', style: 'color:var(--accent)' })
            : null
        ))
      )
    )
  });
}

// ============================================================
// MODAL — Category editor
// ============================================================

function openCategoryEditor(type) {
  const titleMap = { expense: 'Kategori Pengeluaran', income: 'Kategori Pemasukan', subscription: 'Kategori Langganan' };
  const cats = [...getCategories(type).map(c => ({ ...c }))];

  showModal({
    title: titleMap[type],
    save: () => {
      state.settings.customCategories[type] = cats;
      save(); render(); hideModal();
      toast('Kategori tersimpan');
    },
    body: () => {
      const body = el('div');
      const groupBody = el('div', { class: 'group-body' });

      const buildRows = () => {
        groupBody.innerHTML = '';
        cats.forEach((c, i) => {
          groupBody.appendChild(el('div', { class: 'cat-edit-row' },
            el('div', { class: 'cat-emoji-btn', onclick: () => openEmojiPicker((emoji) => {
              cats[i].icon = emoji; buildRows();
            }) }, c.icon),
            el('input', {
              class: 'cat-edit-name', type: 'text', value: c.name,
              oninput: (e) => cats[i].name = e.target.value
            }),
            el('button', { class: 'cat-delete-btn', onclick: () => {
              if (!confirm('Hapus kategori ini? Transaksi lama tetap tersimpan.')) return;
              cats.splice(i, 1); buildRows();
            }}, '−')
          ));
        });
        groupBody.appendChild(el('div', { class: 'cell', onclick: () => {
          cats.push({ id: 'custom_' + uid().slice(0,6), name: 'Baru', icon: '⭐' });
          buildRows();
        }},
          el('div', { class: 'cell-icon', style: 'background:var(--accent)' },
            el('span', { html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' })
          ),
          el('div', { class: 'cell-main' }, el('div', { class: 'cell-title accent-txt' }, 'Tambah Kategori'))
        ));
      };
      buildRows();

      body.appendChild(el('div', { class: 'group' },
        el('div', { class: 'group-header' }, 'Tap emoji untuk ganti, tap "−" untuk hapus'),
        groupBody
      ));

      body.appendChild(el('button', { class: 'btn-secondary', onclick: () => {
        if (!confirm('Reset ke kategori default?')) return;
        delete state.settings.customCategories[type];
        save(); hideModal(); render(); toast('Direset');
      }}, 'Kembalikan ke Default'));

      return body;
    }
  });
}

function openEmojiPicker(onPick) {
  const prevSave = ui.currentModalSave;
  showModal({
    title: 'Pilih Emoji', save: null,
    body: () => {
      const grid = el('div', { class: 'emoji-grid' });
      EMOJI_PALETTE.forEach(em => {
        grid.appendChild(el('div', { class: 'emoji-tile', onclick: () => {
          onPick(em); haptic(8);
          ui.currentModalSave = prevSave;
          if (prevSave && prevSave.bodyFn) {
            $('#modalTitle').textContent = prevSave.title;
            $('#modalBody').innerHTML = '';
            $('#modalBody').appendChild(prevSave.bodyFn());
            $('#modalSave').style.visibility = prevSave.save ? '' : 'hidden';
          }
        }}, em));
      });
      return el('div', { style: 'padding:0 16px' }, grid);
    }
  });
}

// ============================================================
// MODAL CORE + INPUT HELPERS
// ============================================================

function formField(label, input) {
  const wrap = el('div', { class: 'field' });
  if (label) wrap.appendChild(el('label', {}, label));
  wrap.appendChild(input);
  return wrap;
}
function textInput(onChange, value, placeholder = '') {
  return el('input', { type: 'text', value: value || '', placeholder, oninput: (e) => onChange(e.target.value) });
}
function dateInput(onChange, value) {
  return el('input', { type: 'date', value: value || isoDate(), oninput: (e) => onChange(e.target.value) });
}
function formatAmount(n) {
  const cur = CURRENCIES[state.settings.currency] || CURRENCIES.IDR;
  return new Intl.NumberFormat(cur.locale).format(Number(n) || 0);
}
function amountInput(onChange, value, cls = '') {
  return el('input', {
    type: 'tel', inputmode: 'numeric', class: cls,
    value: value > 0 ? formatAmount(value) : '', placeholder: '0',
    oninput: (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      const n = parseInt(raw || '0', 10);
      onChange(n);
      e.target.value = raw ? formatAmount(n) : '';
    }
  });
}

// A11y: cache element that had focus before modal opened so we can restore on close
let _modalReturnFocus = null;

function showModal({ title, body, save }) {
  ui.currentModalSave = { title, bodyFn: body, save };
  _modalReturnFocus = document.activeElement;
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = '';
  $('#modalBody').appendChild(body());
  $('#modalSave').style.visibility = save ? '' : 'hidden';
  const modal = $('#modal');
  modal.classList.remove('hidden');
  $('#modalBackdrop').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  // Focus first interactive element inside modal for keyboard users
  setTimeout(() => {
    const first = modal.querySelector('input:not([type=hidden]), select, textarea, button:not([style*="visibility:hidden"])');
    if (first && typeof first.focus === 'function') first.focus({ preventScroll: true });
  }, 50);
}
function hideModal() {
  $('#modal').classList.add('hidden');
  $('#modalBackdrop').classList.add('hidden');
  document.body.style.overflow = '';
  ui.currentModalSave = null;
  // Cleanup: abort any in-flight voice recognition tied to a hidden modal
  if (voiceRecognition) {
    try { voiceRecognition.abort(); } catch {}
    voiceRecognition = null;
  }
  // Restore focus to whatever triggered the modal
  if (_modalReturnFocus && typeof _modalReturnFocus.focus === 'function') {
    try { _modalReturnFocus.focus({ preventScroll: true }); } catch {}
  }
  _modalReturnFocus = null;
}

// A11y: focus trap — when modal is open, Tab cycles within it
function setupFocusTrap() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const modal = $('#modal');
    if (!modal || modal.classList.contains('hidden')) return;
    const focusables = modal.querySelectorAll(
      'a[href], button:not([disabled]):not([style*="visibility:hidden"]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
}

// Onboarding tour — overlay tooltips pointing to key UI elements.
// Triggered: first time user lands with data (after seed or first tx).
const TOUR_STEPS = [
  { target: '#fabAdd', title: 'Tombol +', body: 'Tap untuk tambah transaksi. Tahan untuk menu cepat: transfer, hutang, split bill.', placement: 'top-left' },
  { target: '[data-nav="reports"]', title: 'Laporan', body: 'Lihat trend, top kategori, net worth, dan perbandingan bulan/tahun.', placement: 'top' },
  { target: '#settingsBtn', title: 'Pengaturan', body: 'Ganti tema, warna aksen, mata uang, kategori, dll. Export backup juga di sini.', placement: 'bottom-right' },
  { target: '#statsWidget', title: 'Insight Harian', body: 'Heatmap minggu, top kategori, trend. Update real-time saat kamu catat.', placement: 'bottom' },
];
function maybeShowOnboardingTour() {
  if (state.settings.tourSeen) return;
  if (isStateEmpty()) return; // wait until they have data
  // Defer one tick so layout settles
  setTimeout(() => startOnboardingTour(), 600);
}
function startOnboardingTour() {
  let step = 0;
  const backdrop = el('div', { class: 'tour-backdrop' });
  const spotlight = el('div', { class: 'tour-spotlight' });
  const tooltip = el('div', { class: 'tour-tooltip' });
  document.body.appendChild(backdrop);
  document.body.appendChild(spotlight);
  document.body.appendChild(tooltip);
  const finish = () => {
    state.settings.tourSeen = true; save();
    [backdrop, spotlight, tooltip].forEach(e => e.remove());
  };
  backdrop.onclick = finish;
  const showStep = () => {
    const s = TOUR_STEPS[step];
    const target = document.querySelector(s.target);
    if (!target) { step++; if (step >= TOUR_STEPS.length) return finish(); return showStep(); }
    const r = target.getBoundingClientRect();
    spotlight.style.cssText = `left:${r.left - 8}px;top:${r.top - 8}px;width:${r.width + 16}px;height:${r.height + 16}px;`;
    tooltip.innerHTML = '';
    tooltip.appendChild(el('span', { class: 'tour-step' }, `Langkah ${step+1} dari ${TOUR_STEPS.length}`));
    tooltip.appendChild(el('strong', {}, s.title));
    tooltip.appendChild(el('div', {}, s.body));
    const actions = el('div', { class: 'tour-actions' });
    actions.appendChild(el('button', { class: 'tour-skip', onclick: finish }, 'Lewati'));
    actions.appendChild(el('button', { onclick: () => { step++; if (step >= TOUR_STEPS.length) finish(); else showStep(); } },
      step === TOUR_STEPS.length - 1 ? 'Selesai' : 'Lanjut'));
    tooltip.appendChild(actions);
    // Position tooltip near target
    const placement = s.placement;
    const ttRect = tooltip.getBoundingClientRect();
    let top, left;
    if (placement.includes('top')) top = r.top - ttRect.height - 16;
    else top = r.bottom + 16;
    if (placement.includes('left')) left = Math.max(10, r.left + r.width/2 - ttRect.width);
    else if (placement.includes('right')) left = Math.min(window.innerWidth - ttRect.width - 10, r.right - ttRect.width);
    else left = Math.max(10, Math.min(window.innerWidth - ttRect.width - 10, r.left + r.width/2 - ttRect.width/2));
    if (top < 10) top = r.bottom + 16;
    tooltip.style.cssText = `left:${left}px;top:${top}px;`;
  };
  showStep();
}

// Pull-to-refresh visual hint — adds .scrolled-top class to body
function setupPullToRefreshHint() {
  const update = () => {
    document.body.classList.toggle('scrolled-top', (window.scrollY || 0) < 5);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Tag autocomplete — show matching tags as user types in tx name
function renderTagAutocomplete(query, tx) {
  const list = $('#tagAutocompleteList');
  if (!list) return;
  list.innerHTML = '';
  const q = (query || '').toLowerCase().trim();
  if (q.length < 2) return;
  // Match tags whose name contains the query
  const matches = state.tags
    .filter(t => t.name.toLowerCase().includes(q) && !(tx.tags || []).includes(t.id))
    .slice(0, 5);
  if (matches.length === 0) return;
  matches.forEach(tag => {
    const item = el('div', { class: 'tag-autocomplete-item', tabindex: '0', onclick: (e) => {
      e.stopPropagation();
      tx.tags = [...(tx.tags || []), tag.id];
      hap('select');
      list.innerHTML = '';
      rebuildModalBody();
    }},
      el('div', { class: 'ac-dot', style: `background:${tag.color}` }),
      el('span', {}, '#' + tag.name),
      el('span', { class: 'muted-txt', style: 'font-size:11px;margin-left:auto' },
        state.expenses.filter(t => (t.tags||[]).includes(tag.id)).length + ' tx')
    );
    list.appendChild(item);
  });
}
function closeTagAutocomplete(e) {
  const list = $('#tagAutocompleteList');
  if (!list) return;
  if (e && e.target && e.target.closest('.tag-autocomplete')) return;
  list.innerHTML = '';
}

// Keyboard shortcut help modal
function openShortcutHelp() {
  showModal({
    title: 'Keyboard Shortcuts',
    save: null,
    body: () => {
      const body = el('div');
      const shortcuts = [
        { key: '?',         desc: 'Tampilkan bantuan ini' },
        { key: 'g d',       desc: 'Buka Beranda (Dashboard)' },
        { key: 'g t',       desc: 'Buka Transaksi' },
        { key: 'g s',       desc: 'Buka Langganan (Subscription)' },
        { key: 'g b',       desc: 'Buka Budget' },
        { key: 'g r',       desc: 'Buka Laporan (Reports)' },
        { key: 'g p',       desc: 'Buka Pengaturan' },
        { key: 'n',         desc: 'Transaksi baru (FAB)' },
        { key: 'Esc',       desc: 'Tutup modal / overlay' },
        { key: 'Tab',       desc: 'Navigate (di modal: focus trap aktif)' },
        { key: '↑ ↓ ← →',   desc: 'Navigasi grid kategori/akun/aksen' },
        { key: 'Enter / Space', desc: 'Aktivasi item yang difokus' },
      ];
      const group = el('div', { class: 'field-group' });
      shortcuts.forEach(s => {
        group.appendChild(el('div', { class: 'field-row-inline' },
          el('kbd', { style: 'background:var(--fill-3);padding:3px 8px;border-radius:6px;font-family:ui-monospace,monospace;font-size:13px;color:var(--label)' }, s.key),
          el('div', { style: 'flex:1;color:var(--label-2);font-size:14px;margin-left:12px' }, s.desc)
        ));
      });
      body.appendChild(group);
      body.appendChild(el('div', { class: 'group-footer', style: 'padding:0 28px 8px' },
        'Shortcuts cuma jalan di laptop/desktop. Di HP, semua interaksi via tap/swipe.'
      ));
      return body;
    }
  });
}

// Gmail-style sequence shortcuts: press "g" then a letter within 1 sec
let _gPressedAt = 0;
function handleGlobalShortcut(e) {
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
  if (!$('#modal').classList.contains('hidden')) return; // skip while modal open
  const now = Date.now();
  if (e.key === 'g') { _gPressedAt = now; return; }
  if (now - _gPressedAt < 1200) {
    const targets = { d:'dashboard', t:'expense', s:'subscription', b:'budget', r:'reports', p:'settings' };
    if (targets[e.key]) {
      e.preventDefault();
      _gPressedAt = 0;
      navigate(targets[e.key]);
      hap('navigate');
    }
  }
  // Single-key shortcuts
  if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    fabAction();
  }
}

// A11y: keyboard nav for picker grids — arrow keys move focus among siblings
function setupGridKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)) return;
    const focused = document.activeElement;
    if (!focused) return;
    const grid = focused.closest('.cat-grid, .account-picker-grid, .accent-grid, .emoji-grid');
    if (!grid) return;
    const items = Array.from(grid.children).filter(c => c.tagName !== 'BR');
    const idx = items.indexOf(focused);
    if (idx < 0) return;
    // Activate on Enter/Space (treat as click)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); focused.click(); return;
    }
    // Estimate columns from grid template
    const cols = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    let next = idx;
    if (e.key === 'ArrowLeft')  next = Math.max(0, idx - 1);
    if (e.key === 'ArrowRight') next = Math.min(items.length - 1, idx + 1);
    if (e.key === 'ArrowUp')    next = Math.max(0, idx - cols);
    if (e.key === 'ArrowDown')  next = Math.min(items.length - 1, idx + cols);
    if (next !== idx) {
      e.preventDefault();
      items[next].focus();
    }
  });
}

// ============================================================
// ACTION SHEET (iOS bottom sheet)
// ============================================================

function openActionSheet(title, items) {
  const content = $('#actionSheetContent');
  content.innerHTML = '';
  if (title) content.appendChild(el('div', { class: 'action-sheet-title' }, title));
  items.forEach(it => {
    content.appendChild(el('button', {
      class: 'action-item' + (it.destructive ? ' destructive' : ''),
      onclick: () => { hideActionSheet(); haptic(5); it.onClick(); }
    },
      it.icon ? el('span', { class: 'action-icon', html: it.icon }) : null,
      it.label
    ));
  });
  $('#actionSheet').classList.remove('hidden');
  $('#actionSheetBackdrop').classList.remove('hidden');
}
function hideActionSheet() {
  $('#actionSheet').classList.add('hidden');
  $('#actionSheetBackdrop').classList.add('hidden');
}

// ============================================================
// PHOTO VIEWER + CAPTURE
// ============================================================

function openPhotoViewer(src) {
  $('#photoViewerImg').src = src;
  $('#photoViewer').classList.remove('hidden');
}
function closePhotoViewer() {
  $('#photoViewer').classList.add('hidden');
  $('#photoViewerImg').src = '';
}

function captureReceipt(onResult) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.style.display = 'none';
  document.body.appendChild(input);
  input.onchange = async (e) => {
    const file = e.target.files[0];
    document.body.removeChild(input);
    if (!file) return;
    try {
      const compressed = await compressImage(file, 1024, 0.82);
      onResult(compressed);
    } catch (err) {
      toast('Gagal proses foto: ' + err.message);
    }
  };
  input.click();
}

// Read EXIF orientation tag (1-8) from JPEG buffer. Returns 1 (default) if not found.
function readJpegOrientation(buffer) {
  const view = new DataView(buffer);
  if (view.getUint16(0, false) !== 0xFFD8) return 1; // not JPEG
  const len = view.byteLength;
  let off = 2;
  while (off < len) {
    if (view.getUint16(off, false) === 0xFFE1) {
      const exifLen = view.getUint16(off + 2, false);
      if (view.getUint32(off + 4, false) !== 0x45786966) return 1;
      const little = view.getUint16(off + 10, false) === 0x4949;
      const ifdOff = view.getUint32(off + 14, little);
      const tags = view.getUint16(off + 10 + ifdOff, little);
      for (let i = 0; i < tags; i++) {
        const entry = off + 10 + ifdOff + 2 + i * 12;
        if (view.getUint16(entry, little) === 0x0112) {
          return view.getUint16(entry + 8, little);
        }
      }
      return 1;
    }
    if ((view.getUint16(off, false) & 0xFF00) !== 0xFF00) return 1;
    off += 2 + view.getUint16(off + 2, false);
  }
  return 1;
}

function compressImage(file, maxWidth = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuf = e.target.result;
      let orientation = 1;
      try { orientation = readJpegOrientation(arrayBuf); } catch {}
      // Convert ArrayBuffer to data URL via Blob
      const blob = new Blob([arrayBuf], { type: file.type || 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        // Account for orientation 5-8 (90deg / 270deg rotated → swap w/h source)
        const swap = orientation >= 5 && orientation <= 8;
        const srcW = img.width, srcH = img.height;
        const ratio = Math.min(1, maxWidth / (swap ? srcH : srcW));
        const outW = Math.round((swap ? srcH : srcW) * ratio);
        const outH = Math.round((swap ? srcW : srcH) * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = outW; canvas.height = outH;
        const ctx = canvas.getContext('2d');
        // Apply EXIF transform
        switch (orientation) {
          case 2: ctx.translate(outW, 0); ctx.scale(-1, 1); break;
          case 3: ctx.translate(outW, outH); ctx.rotate(Math.PI); break;
          case 4: ctx.translate(0, outH); ctx.scale(1, -1); break;
          case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
          case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -outW); break;
          case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(outH, -outW); ctx.scale(-1, 1); break;
          case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-outH, 0); break;
        }
        // Draw with appropriate output dimensions
        const drawW = swap ? outH : outW;
        const drawH = swap ? outW : outH;
        ctx.drawImage(img, 0, 0, drawW, drawH);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => { URL.revokeObjectURL(url); reject(err); };
      img.src = url;
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================
// VOICE INPUT
// ============================================================

function startVoice(btnEl, onResult) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { toast('Browser ini tidak dukung suara'); return; }

  if (voiceRecognition) {
    try { voiceRecognition.abort(); } catch {}
    voiceRecognition = null;
    btnEl.classList.remove('listening');
    return;
  }

  voiceRecognition = new SR();
  voiceRecognition.lang = 'id-ID';
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = false;
  btnEl.classList.add('listening');

  voiceRecognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    onResult(transcript);
  };
  voiceRecognition.onerror = (e) => {
    if (e.error === 'no-speech') toast('Tidak terdeteksi suara');
    else toast('Voice: ' + e.error);
  };
  voiceRecognition.onend = () => {
    btnEl.classList.remove('listening');
    voiceRecognition = null;
  };
  try {
    voiceRecognition.start();
  } catch (err) {
    btnEl.classList.remove('listening');
    voiceRecognition = null;
    toast('Tidak bisa mulai: ' + err.message);
  }
}

function parseVoiceTx(text) {
  let amount = 0;
  let name = text.trim();
  // Pattern: digits + optional unit (ribu/juta/rb/jt/k/m)
  const re = /(\d+(?:[.,]\d+)?)\s*(ribu|rb|juta|jt|k|m\b)?/i;
  const m = text.match(re);
  if (m) {
    let n = parseFloat(m[1].replace(',', '.'));
    const unit = (m[2] || '').toLowerCase();
    if (unit === 'ribu' || unit === 'rb' || unit === 'k') n *= 1000;
    else if (unit === 'juta' || unit === 'jt' || unit === 'm') n *= 1000000;
    if (n > 0) {
      amount = n;
      name = (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim().replace(/[,.]+$/, '');
    }
  }
  return { name, amount };
}

// ============================================================
// FAB
// ============================================================

function fabAction() {
  haptic(8);
  if (ui.view === 'subscription') return openSubModal();
  if (ui.view === 'budget') {
    if (ui.budgetTab === 'budget-tab') return openBudgetModal();
    return openGoalModal();
  }
  if (ui.view === 'accounts') return openAccountModal();
  if (ui.view === 'debts')    return openDebtModal();
  if (ui.view === 'tags')     return openTagModal();
  openExpenseModal();
}

function fabLongPress() {
  hap('save');
  openActionSheet('Tambah Cepat', [
    { label: 'Transaksi',         icon: '💸', onClick: () => openExpenseModal() },
    { label: 'Transfer antar Akun', icon: '↔️', onClick: () => openTransferModal() },
    { label: 'Hutang / Piutang',  icon: '🤝', onClick: () => openDebtModal() },
    { label: 'Split Bill',        icon: '🧮', onClick: () => openSplitBillModal() },
    { label: 'Langganan Baru',    icon: '🔁', onClick: () => openSubModal() },
  ]);
}

// ============================================================
// DATA — Export / Import / CSV / Share / Seed / Reset
// ============================================================

function exportJson() {
  const data = JSON.stringify(state, null, 2);
  downloadFile(data, `duitku-backup-${isoDate()}.json`, 'application/json');
  state.settings.lastBackupAt = Date.now();
  save();
  toast.success('Backup di-download');
}

// Days since last backup. -1 if never backed up.
function daysSinceLastBackup() {
  const t = state.settings.lastBackupAt || 0;
  if (t === 0) return -1;
  return Math.floor((Date.now() - t) / 86400000);
}

function exportCsv() {
  const rows = [['Tanggal','Tipe','Kategori','Nama','Jumlah','Akun','Tag','Catatan']];
  state.expenses.forEach(t => {
    if (t.type === 'transfer') return;
    const cat = getCategory(t.type, t.category).name;
    const acc = getAccount(t.accountId)?.name || '';
    const tags = (t.tags || []).map(id => getTag(id)?.name).filter(Boolean).join(';');
    rows.push([t.date, t.type, cat, t.name || '', t.amount, acc, tags, t.note || '']);
  });
  const csv = rows.map(r => r.map(c => {
    const s = String(c);
    return /[,\n";]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(',')).join('\n');
  downloadFile('﻿' + csv, `duitku-transaksi-${isoDate()}.csv`, 'text/csv;charset=utf-8');
  toast('CSV di-download');
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function shareBackup() {
  const data = JSON.stringify(state, null, 2);
  const file = new File([data], `duitku-${isoDate()}.json`, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'DuitKu Backup', text: 'DuitKu data backup' });
      state.settings.lastBackupAt = Date.now();
      save();
    } catch (e) { /* user cancelled */ }
  } else {
    exportJson();
    toast.info('Web Share tidak didukung — di-download');
  }
}

// CSV import — parse user CSV (forgiving), preview, then commit
function importCsv(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const rows = parseCsv(text);
      if (rows.length < 2) throw new Error('CSV kosong atau tidak valid');
      const header = rows[0].map(h => h.toLowerCase().trim());
      // Detect column indexes (forgiving — tolerate various column names)
      const idx = {
        date: header.findIndex(h => /tanggal|date/.test(h)),
        type: header.findIndex(h => /tipe|type/.test(h)),
        category: header.findIndex(h => /kategori|category/.test(h)),
        name: header.findIndex(h => /nama|name|deskripsi|description/.test(h)),
        amount: header.findIndex(h => /jumlah|amount/.test(h)),
        account: header.findIndex(h => /akun|account/.test(h)),
        tag: header.findIndex(h => /tag/.test(h)),
        note: header.findIndex(h => /catatan|note/.test(h)),
      };
      if (idx.date < 0 || idx.amount < 0) {
        throw new Error('CSV harus punya kolom Tanggal & Jumlah');
      }
      const newTx = [];
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        if (!r[idx.date] || !r[idx.amount]) continue;
        const amount = parseFloat(String(r[idx.amount]).replace(/[^\d.-]/g, ''));
        if (!(amount > 0)) continue;
        const typeRaw = (idx.type >= 0 ? r[idx.type] : 'expense').toLowerCase();
        const type = typeRaw.includes('income') || typeRaw.includes('masuk') || typeRaw.includes('pemasukan') ? 'income' : 'expense';
        // Match category by name (case-insensitive)
        const catName = idx.category >= 0 ? (r[idx.category] || '').toLowerCase().trim() : '';
        const cat = getCategories(type).find(c => c.name.toLowerCase() === catName)?.id || getCategories(type)[0].id;
        // Match account by name
        const accName = idx.account >= 0 ? (r[idx.account] || '').toLowerCase().trim() : '';
        const acc = state.accounts.find(a => a.name.toLowerCase() === accName)?.id || state.settings.defaultAccountId;
        newTx.push({
          id: uid(),
          type, date: r[idx.date].trim(),
          category: cat, name: (idx.name >= 0 ? r[idx.name] : '') || '',
          amount, accountId: acc,
          tags: [],
          note: idx.note >= 0 ? (r[idx.note] || '') : '',
          createdAt: Date.now(),
        });
      }
      if (newTx.length === 0) { toast.error('Tidak ada baris valid'); return; }
      if (!confirm(`Import ${newTx.length} transaksi? (Append, gak replace)`)) return;
      newTx.forEach(t => state.expenses.push(t));
      save(); render();
      toast.success(`${newTx.length} transaksi diimport`);
    } catch (err) { toast.error('Gagal: ' + err.message); }
  };
  reader.readAsText(file);
}

// Simple CSV parser — handles quoted fields and embedded commas
function parseCsv(text) {
  const rows = [];
  let cur = '', row = [], inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i+1];
    if (inQuote) {
      if (c === '"' && n === '"') { cur += '"'; i++; }
      else if (c === '"') inQuote = false;
      else cur += c;
    } else {
      if (c === '"') inQuote = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (c === '\r') { /* skip */ }
      else cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim().length > 0));
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported.expenses) throw new Error('Format tidak valid');
      if (!confirm('Import akan MENGGANTI semua data saat ini. Lanjut?')) return;
      state = { ...defaultState(), ...imported };
      state.settings = { ...defaultState().settings, ...(imported.settings || {}) };
      migrate();
      applyTheme(); render();
      toast('Berhasil import');
    } catch (err) { toast('Gagal: ' + err.message); }
  };
  reader.readAsText(file);
}

function seedData() {
  if (state.expenses.length > 0 || state.subscriptions.length > 0) {
    if (!confirm('Data sudah ada. Tambah data contoh juga?')) return;
  }
  const today = new Date();
  const isoOffset = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return isoDate(d); };
  const accIds = state.accounts.map(a => a.id);

  // Sample tags
  if (state.tags.length === 0) {
    state.tags.push(
      { id: 'tag_kantor', name: 'kantor', color: '#007aff' },
      { id: 'tag_keluarga', name: 'keluarga', color: '#34c759' },
      { id: 'tag_hangout', name: 'hangout', color: '#ff9500' },
    );
  }

  // Set initial balances on accounts
  if (state.accounts[0]) state.accounts[0].initialBalance = 500000;
  if (state.accounts[1]) state.accounts[1].initialBalance = 12500000;
  if (state.accounts[2]) state.accounts[2].initialBalance = 850000;

  const samples = [
    { type: 'income', category: 'salary', name: 'Gaji bulanan', amount: 8000000, daysAgo: -25, accIdx: 1, tags: ['tag_kantor'] },
    { type: 'income', category: 'freelance', name: 'Project web client', amount: 2500000, daysAgo: -10, accIdx: 1 },
    { type: 'expense', category: 'food', name: 'Indomie goreng', amount: 8000, daysAgo: 0, accIdx: 0 },
    { type: 'expense', category: 'food', name: 'Kopi susu Kenangan', amount: 22000, daysAgo: 0, accIdx: 2, tags: ['tag_hangout'] },
    { type: 'expense', category: 'transport', name: 'Gojek ke kantor', amount: 18000, daysAgo: 0, accIdx: 2, tags: ['tag_kantor'] },
    { type: 'expense', category: 'food', name: 'Nasi padang', amount: 28000, daysAgo: -1, accIdx: 0 },
    { type: 'expense', category: 'transport', name: 'Bensin Pertamax', amount: 100000, daysAgo: -1, accIdx: 1 },
    { type: 'expense', category: 'shopping', name: 'Baju polos lokal', amount: 145000, daysAgo: -2, accIdx: 1 },
    { type: 'expense', category: 'food', name: 'Sushi tei', amount: 185000, daysAgo: -3, accIdx: 1, tags: ['tag_hangout'] },
    { type: 'expense', category: 'entertainment', name: 'Tiket bioskop', amount: 80000, daysAgo: -3, accIdx: 2 },
    { type: 'expense', category: 'food', name: 'Brunch kafe', amount: 95000, daysAgo: -4, accIdx: 2, tags: ['tag_hangout','tag_keluarga'] },
    { type: 'expense', category: 'bills', name: 'PLN listrik', amount: 380000, daysAgo: -5, accIdx: 1 },
    { type: 'expense', category: 'bills', name: 'Air PDAM', amount: 95000, daysAgo: -5, accIdx: 1 },
    { type: 'expense', category: 'food', name: 'Groceries supermarket', amount: 350000, daysAgo: -7, accIdx: 1, tags: ['tag_keluarga'] },
    { type: 'expense', category: 'health', name: 'Vitamin & obat', amount: 125000, daysAgo: -8, accIdx: 1 },
    { type: 'expense', category: 'transport', name: 'Grab', amount: 25000, daysAgo: -8, accIdx: 2 },
    { type: 'expense', category: 'food', name: 'Bakso', amount: 25000, daysAgo: -10, accIdx: 0 },
    { type: 'expense', category: 'shopping', name: 'Sepatu sneakers', amount: 650000, daysAgo: -12, accIdx: 1 },
    { type: 'expense', category: 'entertainment', name: 'Konser musik', amount: 450000, daysAgo: -15, accIdx: 1, tags: ['tag_hangout'] },
    { type: 'expense', category: 'family', name: 'Hadiah ulang tahun adik', amount: 200000, daysAgo: -18, accIdx: 1, tags: ['tag_keluarga'] },
    { type: 'expense', category: 'food', name: 'Warung tegal', amount: 18000, daysAgo: -20, accIdx: 0 },
    { type: 'expense', category: 'transport', name: 'Service motor', amount: 250000, daysAgo: -22, accIdx: 1 },
  ];
  samples.forEach(s => {
    state.expenses.push({
      id: uid(), type: s.type, date: isoOffset(s.daysAgo),
      category: s.category, name: s.name, amount: s.amount,
      note: '',
      accountId: accIds[s.accIdx] || accIds[0],
      tags: s.tags || [],
      createdAt: Date.now() - Math.abs(s.daysAgo) * 86400000,
    });
  });

  // Sample transfer
  state.expenses.push({
    id: uid(), type: 'transfer', date: isoOffset(-6),
    amount: 500000,
    fromAccountId: accIds[1], toAccountId: accIds[2],
    name: 'Top up GoPay', note: '',
    createdAt: Date.now() - 6 * 86400000,
  });

  // Sample subscriptions
  const subs = [
    { name: 'Netflix', amount: 65000, category: 'streaming', cycle: 'monthly', daysToRenew: 5, autoExecute: false },
    { name: 'Spotify Premium', amount: 54990, category: 'music', cycle: 'monthly', daysToRenew: 12, autoExecute: true },
    { name: 'ChatGPT Plus', amount: 320000, category: 'productivity', cycle: 'monthly', daysToRenew: 18, autoExecute: false },
    { name: 'YouTube Premium', amount: 59000, category: 'streaming', cycle: 'monthly', daysToRenew: 22, autoExecute: false },
    { name: 'iCloud 200GB', amount: 45000, category: 'cloud', cycle: 'monthly', daysToRenew: 8, autoExecute: true },
    { name: 'Indihome 100Mbps', amount: 415000, category: 'internet', cycle: 'monthly', daysToRenew: 3, autoExecute: false },
    { name: 'Domain .com', amount: 165000, category: 'other', cycle: 'yearly', daysToRenew: 90, autoExecute: false },
  ];
  subs.forEach(s => {
    const d = new Date(today); d.setDate(d.getDate() + s.daysToRenew);
    state.subscriptions.push({
      id: uid(), name: s.name, amount: s.amount, category: s.category,
      cycle: s.cycle, nextRenewal: isoDate(d), reminderDays: 3, active: true, note: '',
      type: 'expense', accountId: accIds[1] || accIds[0], tags: [],
      autoExecute: s.autoExecute, endDate: null,
    });
  });

  // Sample budgets
  state.budgets = {
    food: 2000000, transport: 700000, entertainment: 500000, shopping: 800000, bills: 600000,
  };

  // Sample goals
  state.goals.push({ id: uid(), name: 'DP rumah pertama', target: 50000000, current: 8500000, deadline: isoOffset(720) });
  state.goals.push({ id: uid(), name: 'iPhone baru',      target: 18000000, current: 4200000, deadline: isoOffset(180) });

  // Sample debts
  state.debts.push({
    id: uid(), person: 'Budi', type: 'owed_to_me',
    originalAmount: 350000, payments: [{ amount: 100000, date: isoOffset(-3), accountId: accIds[2] }],
    date: isoOffset(-10), dueDate: isoOffset(7), note: 'Tiket konser',
  });
  state.debts.push({
    id: uid(), person: 'Mama', type: 'i_owe',
    originalAmount: 1500000, payments: [],
    date: isoOffset(-15), dueDate: isoOffset(15), note: '',
  });
  state.debts.push({
    id: uid(), person: 'Andi', type: 'owed_to_me',
    originalAmount: 75000, payments: [{ amount: 75000, date: isoOffset(-1), accountId: accIds[0] }],
    date: isoOffset(-5), note: 'Patungan makan',
  });

  save(); render();
  toast('Data contoh ditambahkan');
}

function resetAll() {
  if (!confirm('Hapus SEMUA data? Tidak bisa di-undo. Pastikan sudah export backup.')) return;
  if (!confirm('Yakin banget?')) return;
  const keepSettings = state.settings;
  state = defaultState();
  state.settings = keepSettings;
  save(); applyTheme(); navigate('dashboard');
  toast('Semua data dihapus');
}

// ============================================================
// FAB LONG-PRESS DETECTION
// ============================================================

function setupFab() {
  const fab = $('#fabAdd');
  let pressTimer = null;
  let longPressFired = false;

  const start = (e) => {
    longPressFired = false;
    pressTimer = setTimeout(() => {
      longPressFired = true;
      fabLongPress();
    }, TIMING.LONG_PRESS_FAB);
  };
  const cancel = () => {
    if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
  };
  const end = (e) => {
    cancel();
    if (longPressFired) { e.preventDefault(); e.stopPropagation(); return; }
  };

  fab.addEventListener('mousedown', start);
  fab.addEventListener('touchstart', start, { passive: true });
  fab.addEventListener('mouseup', end);
  fab.addEventListener('touchend', end);
  fab.addEventListener('mouseleave', cancel);
  fab.addEventListener('touchcancel', cancel);
  fab.addEventListener('click', (e) => {
    if (longPressFired) { e.preventDefault(); longPressFired = false; return; }
    fabAction();
  });
}

// ============================================================
// INIT
// ============================================================

function init() {
  systemDarkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  systemDarkMQ.addEventListener('change', () => {
    if (state.settings.theme === 'auto') applyTheme();
  });

  applyTheme();
  setupScrollObserver();
  setupLongPress();
  setupTapRipple();
  setupModalDrag();
  setupFocusTrap();
  setupGridKeyboardNav();
  setupPullToRefreshHint();

  // Onboarding CTAs
  $('#ctaAddFirst')?.addEventListener('click', () => openExpenseModal());
  $('#ctaSeedSample')?.addEventListener('click', () => seedData());

  // Auto-execute recurring on load
  const created = runAutoRecurring();
  if (created > 0) setTimeout(() => toast(`${created} transaksi otomatis dibuat dari langganan`), TIMING.TOAST_AUTOREC);

  // Fire notifications
  setTimeout(fireUpcomingNotifications, TIMING.NOTIF_FIRE_DELAY);

  // Tab bar + nav links
  $$('[data-nav]').forEach(b => b.addEventListener('click', () => { haptic(5); navigate(b.dataset.nav); }));
  $('#settingsBtn').addEventListener('click', () => navigate('settings'));
  $('#navBackBtn').addEventListener('click', goBack);
  $('#dashAccountsLink').addEventListener('click', () => navigate('accounts', { push: true }));

  // Modal
  $('#modalCancel').addEventListener('click', hideModal);
  $('#modalBackdrop').addEventListener('click', hideModal);
  $('#modalSave').addEventListener('click', () => { if (ui.currentModalSave?.save) ui.currentModalSave.save(); });

  // Action sheet
  $('#actionSheetBackdrop').addEventListener('click', hideActionSheet);
  $('#actionSheetCancel').addEventListener('click', hideActionSheet);

  // Photo viewer
  $('#photoClose').addEventListener('click', closePhotoViewer);
  $('#photoViewer').addEventListener('click', (e) => { if (e.target.id === 'photoViewer') closePhotoViewer(); });

  // FAB
  setupFab();

  // Expense view filter / search
  $$('.segmented [data-filter]').forEach(c => c.addEventListener('click', () => {
    ui.filter = c.dataset.filter;
    $$('.segmented [data-filter]').forEach(x => x.classList.toggle('active', x === c));
    renderExpense();
  }));
  $('#expenseSearch').addEventListener('input', (e) => { ui.searchQuery = e.target.value; renderExpense(); });

  // View toggle
  $$('[data-vmode]').forEach(b => b.addEventListener('click', () => {
    ui.vmode = b.dataset.vmode; renderExpense();
  }));

  // Month nav
  $('#prevMonth').addEventListener('click', () => { ui.monthOffset--; renderExpense(); });
  $('#nextMonth').addEventListener('click', () => { ui.monthOffset++; renderExpense(); });
  $('#prevReport').addEventListener('click', () => { ui.reportOffset--; renderReports(); });
  $('#nextReport').addEventListener('click', () => { ui.reportOffset++; renderReports(); });

  // Budget tabs
  $$('[data-tab]').forEach(b => b.addEventListener('click', () => {
    ui.budgetTab = b.dataset.tab; renderBudget();
  }));
  $('#addBudgetBtn').addEventListener('click', () => openBudgetModal());
  $('#addGoalBtn').addEventListener('click', () => openGoalModal());

  // Debt filter
  $$('[data-debt-filter]').forEach(b => b.addEventListener('click', () => {
    ui.debtFilter = b.dataset.debtFilter; renderDebts();
  }));
  $('#addDebtBtn').addEventListener('click', () => openDebtModal());
  $('#addAccountBtn').addEventListener('click', () => openAccountModal());
  $('#addTagBtn').addEventListener('click', () => openTagModal());

  // Settings cells
  $('#cellTheme').addEventListener('click', openThemePicker);
  $('#cellDensity').addEventListener('click', openDensityPicker);
  $('#cellCurrency').addEventListener('click', openCurrencyPicker);
  $('#cellMonthStart').addEventListener('click', openMonthStartPicker);
  $('#cellDecimals').addEventListener('click', () => {
    state.settings.showDecimals = !state.settings.showDecimals;
    save(); render();
  });
  $('#cellHaptic').addEventListener('click', () => {
    state.settings.haptic = !state.settings.haptic;
    save(); haptic(10); renderSettings();
  });
  $('#cellAutoRecurring').addEventListener('click', () => {
    state.settings.autoExecRecurring = !state.settings.autoExecRecurring;
    save(); renderSettings();
  });
  $('#cellBudgetRollover')?.addEventListener('click', () => {
    state.settings.budgetRollover = !state.settings.budgetRollover;
    save(); renderSettings();
    if (ui.view === 'budget') render(); // refresh limits live
  });
  $('#cellNotif').addEventListener('click', async () => {
    await setupNotifications(!state.settings.notifications);
  });
  $('#cellAccounts').addEventListener('click', () => navigate('accounts', { push: true }));
  $('#cellDebts').addEventListener('click', () => navigate('debts', { push: true }));
  $('#cellTags').addEventListener('click', () => navigate('tags', { push: true }));
  $('#cellEditExpense').addEventListener('click', () => openCategoryEditor('expense'));
  $('#cellEditIncome').addEventListener('click', () => openCategoryEditor('income'));
  $('#cellEditSub').addEventListener('click', () => openCategoryEditor('subscription'));
  $('#cellShare').addEventListener('click', shareBackup);
  $('#cellExport').addEventListener('click', exportJson);
  $('#cellExportCsv').addEventListener('click', exportCsv);
  $('#cellImport').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', (e) => { if (e.target.files[0]) importJson(e.target.files[0]); e.target.value = ''; });
  $('#cellImportCsv')?.addEventListener('click', () => $('#importCsvFile').click());
  $('#importCsvFile')?.addEventListener('change', (e) => { if (e.target.files[0]) importCsv(e.target.files[0]); e.target.value = ''; });
  $('#cellSeed').addEventListener('click', seedData);
  $('#cellReset').addEventListener('click', resetAll);

  // Accent swatches
  $$('.accent-swatch').forEach(sw => sw.addEventListener('click', () => {
    state.settings.accent = sw.dataset.c;
    save(); applyTheme(); renderSettings(); haptic(8);
  }));

  // Escape closes overlays
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('#photoViewer').classList.contains('hidden')) closePhotoViewer();
      else if (!$('#actionSheet').classList.contains('hidden')) hideActionSheet();
      else hideModal();
    }
    // "?" shows keyboard shortcut help (only when no input is focused)
    if (e.key === '?' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      openShortcutHelp();
    }
    // Global shortcuts: g+letter for navigation (Gmail-style)
    handleGlobalShortcut(e);
  });

  // Initial nav
  const hash = location.hash.replace('#','');
  const valid = Object.keys(TITLES);
  navigate(valid.includes(hash) ? hash : 'dashboard');

  // Show onboarding tour after first paint (skip if already seen or empty)
  maybeShowOnboardingTour();

  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // PWA install prompt — capture and offer inline button
  setupInstallPrompt();

  // Bulk action bar buttons
  $('#bulkDeleteBtn')?.addEventListener('click', bulkDelete);
  $('#bulkCancelBtn')?.addEventListener('click', exitBulkMode);
}

// PWA install prompt — show banner when browser allows install
let _deferredInstallPrompt = null;
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _deferredInstallPrompt = e;
    // Show banner only if user hasn't dismissed recently
    const dismissedAt = parseInt(localStorage.getItem('duitku.installDismissed') || '0', 10);
    if (Date.now() - dismissedAt < 7 * 86400000) return; // 1 week cooldown
    renderInstallBanner();
  });
  window.addEventListener('appinstalled', () => {
    _deferredInstallPrompt = null;
    const banner = $('#installBanner');
    if (banner) banner.classList.add('hidden');
    toast.success('🎉 DuitKu terpasang di Home Screen');
  });
}

function renderInstallBanner() {
  const banner = $('#installBanner');
  if (!banner || !_deferredInstallPrompt) return;
  banner.className = 'install-banner';
  banner.innerHTML = '';
  banner.appendChild(el('span', { class: 'ib-emoji' }, '📲'));
  banner.appendChild(el('div', { class: 'ib-text' },
    el('strong', {}, 'Install DuitKu'),
    el('span', {}, 'Akses cepat dari home screen, jalan offline')
  ));
  const actions = el('div', { class: 'ib-actions' });
  actions.appendChild(el('button', { class: 'ib-primary',
    onclick: async () => {
      if (!_deferredInstallPrompt) return;
      _deferredInstallPrompt.prompt();
      const choice = await _deferredInstallPrompt.userChoice;
      _deferredInstallPrompt = null;
      banner.classList.add('hidden');
      if (choice.outcome === 'accepted') toast.success('Installing...');
    }
  }, 'Install'));
  actions.appendChild(el('button', { class: 'ib-dismiss',
    onclick: () => {
      banner.classList.add('hidden');
      localStorage.setItem('duitku.installDismissed', String(Date.now()));
    }
  }, 'Nanti'));
  banner.appendChild(actions);
}

document.addEventListener('DOMContentLoaded', init);
