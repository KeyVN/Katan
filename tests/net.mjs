// Targeted network and WebRTC relay tests. Usage: node tests/net.mjs

globalThis.window = {
  addEventListener: () => {},
  localStorage: {
    data: {},
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = String(v); },
    removeItem(k) { delete this.data[k]; }
  }
};
globalThis.document = {
  documentElement: { lang: 'es' },
  createElement: () => ({ setAttribute: () => {}, append: () => {}, style: { setProperty: () => {} } }),
  addEventListener: () => {}
};
globalThis.localStorage = globalThis.window.localStorage;
if (!globalThis.crypto) {
  const nodeCrypto = await import('node:crypto');
  globalThis.crypto = nodeCrypto.webcrypto;
}

let pass = 0, failN = 0;
const tests = [];
const t = (name, fn) => {
  tests.push({ name, fn });
};
const eq = (a, b, m = '') => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} esperado ${JSON.stringify(b)}, obtenido ${JSON.stringify(a)}`);
};
const ok = (c, m) => {
  if (!c) throw new Error(m || 'falló');
};

const net = await import('../js/net.js');

t('DEFAULT_TURN: содержит серверы OpenRelay с поддержкой UDP, TCP и TLS (TURNS)', () => {
  ok(Array.isArray(net.DEFAULT_TURN), 'DEFAULT_TURN debe ser un arreglo');
  ok(net.DEFAULT_TURN.length >= 2, 'Al menos 2 servidores TURN para redundancia');
  for (const turn of net.DEFAULT_TURN) {
    ok(turn.username && turn.credential, 'Debe incluir credenciales de OpenRelay');
    ok(Array.isArray(turn.urls), 'urls debe ser un arreglo');
    const hasUdp = turn.urls.some(u => u.startsWith('turn:') && !u.includes('transport=tcp'));
    const hasTcp = turn.urls.some(u => u.includes('transport=tcp') && u.startsWith('turn:'));
    const hasTls = turn.urls.some(u => u.startsWith('turns:') && u.includes('transport=tcp'));
    ok(hasUdp, 'Debe soportar UDP');
    ok(hasTcp, 'Debe soportar TCP');
    ok(hasTls, 'Debe soportar TLS / TURNS sobre puerto 443');
  }
});

t('STUN: содержит глобальные серверы STUN на портах 80, 443, 3478, 19302', () => {
  ok(Array.isArray(net.STUN), 'STUN debe ser un arreglo');
  ok(net.STUN.length >= 5, 'Al menos 5 servidores STUN');
  const urls = net.STUN.map(s => s.urls);
  ok(urls.some(u => u.includes(':80')), 'STUN puerto 80 presente');
  ok(urls.some(u => u.includes(':443')), 'STUN puerto 443 presente');
  ok(urls.some(u => u.includes(':19302')), 'STUN Google presente');
});

t('peerOptions: без пользовательских настроек включает STUN и DEFAULT_TURN', async () => {
  net.resetIceCache();
  globalThis.window.localStorage.data = {};
  const opts = await net.peerOptions();
  ok(opts.config, 'opts.config existe');
  eq(opts.config.iceTransportPolicy, 'all');
  const servers = opts.config.iceServers;
  ok(servers.length >= net.STUN.length + net.DEFAULT_TURN.length, 'Incluye STUN y DEFAULT_TURN');
  const hasTurnRelay = servers.some(s => s.username === 'openrelayproject');
  ok(hasTurnRelay, 'DEFAULT_TURN presente en iceServers por defecto');
});

t('peerOptions: с пользовательским TURN объединяет его с DEFAULT_TURN', async () => {
  net.resetIceCache();
  const customTurn = { urls: 'turn:custom.relay.local:3478', username: 'u', credential: 'p' };
  globalThis.window.localStorage.data = {
    'katanittes.customTurn': JSON.stringify(customTurn)
  };
  const opts = await net.peerOptions();
  const servers = opts.config.iceServers;
  const hasCustom = servers.some(s => s.urls === 'turn:custom.relay.local:3478');
  ok(hasCustom, 'Servidor TURN personalizado presente');
  const hasDefaultTurn = servers.some(s => s.username === 'openrelayproject');
  ok(hasDefaultTurn, 'DEFAULT_TURN disponible como respaldo');
});

t('Net: инициализация состояния и защита от параллельных подключений', () => {
  const instance = new net.Net();
  eq(instance.connecting, false);
  eq(instance.reconnecting, undefined);
  eq(instance.active, false);
  eq(typeof instance.connect, 'function');
  eq(typeof instance.retry, 'function');
});

t('Net: onWakeup запускает retry при разрыве соединения клиента', () => {
  const instance = new net.Net();
  instance.role = 'client';
  instance.active = true;
  instance.reconnecting = false;
  instance.conn = { open: false };
  let retried = false;
  instance.retry = () => { retried = true; };
  instance.onWakeup();
  ok(retried, 'onWakeup должен вызвать retry() если conn закрыт');
});

for (const { name, fn } of tests) {
  try {
    await fn();
    pass++;
  } catch (e) {
    failN++;
    console.log('❌', name, '\n   ', e.message);
  }
}

console.log(`\n${pass} ok, ${failN} fallos`);
if (failN > 0) process.exit(1);
