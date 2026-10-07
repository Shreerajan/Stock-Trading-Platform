const KEYS = { USER: 't_user', IS_LOGGED_IN: 't_auth', BALANCE: 't_bal', PORTFOLIO: 't_port', WATCHLIST: 't_watch', ORDERS: 't_ord', TRANSACTIONS: 't_txn', SETTINGS: 't_set', USERS_DB: 't_db' };
const DEFAULT_BALANCE = 1000000;
const DEFAULT_WATCHLIST = ['AAPL', 'MSFT'];
const DEFAULT_SETTINGS = { darkMode: true, currency: 'INR', notifications: true };

export function getItem(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
export function setItem(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
export function removeItem(key) { localStorage.removeItem(key); }
export function getUser() { return getItem(KEYS.USER); }
export function setUser(user) { setItem(KEYS.USER, user); }
export function isLoggedIn() { return getItem(KEYS.IS_LOGGED_IN) === true; }
export function setLoggedIn(value) { setItem(KEYS.IS_LOGGED_IN, value); }
export function getUsersDB() { return getItem(KEYS.USERS_DB) || []; }
export function setUsersDB(users) { setItem(KEYS.USERS_DB, users); }
export function registerUser(name, email, password) {
  const users = getUsersDB();
  if (users.find(u => u.email === email)) return { success: false, message: 'Email exists.' };
  const user = { id: Date.now().toString(), name, email, password, accountType: 'Demo', createdAt: new Date().toISOString() };
  users.push(user); setUsersDB(users); return { success: true, user };
}
export function loginUser(email, password) {
  const users = getUsersDB();
  const user = users.find(u => u.email === email && u.password === password);
  return user ? { success: true, user } : { success: false, message: 'Invalid credentials.' };
}
export function loginDemoUser() { return { id: 'demo_'+Date.now(), name: 'Demo User', email: 'demo@tradex.com', accountType: 'Demo', createdAt: new Date().toISOString() }; }
export function initializeUserData(userId) {
  if (!getItem(KEYS.BALANCE+'_'+userId)) setItem(KEYS.BALANCE+'_'+userId, DEFAULT_BALANCE);
  if (!getItem(KEYS.PORTFOLIO+'_'+userId)) setItem(KEYS.PORTFOLIO+'_'+userId, []);
  if (!getItem(KEYS.WATCHLIST+'_'+userId)) setItem(KEYS.WATCHLIST+'_'+userId, DEFAULT_WATCHLIST);
  if (!getItem(KEYS.ORDERS+'_'+userId)) setItem(KEYS.ORDERS+'_'+userId, []);
  if (!getItem(KEYS.TRANSACTIONS+'_'+userId)) setItem(KEYS.TRANSACTIONS+'_'+userId, []);
  if (!getItem(KEYS.SETTINGS+'_'+userId)) setItem(KEYS.SETTINGS+'_'+userId, DEFAULT_SETTINGS);
}
export function getBalance(userId) { return getItem(KEYS.BALANCE+'_'+userId) ?? DEFAULT_BALANCE; }
export function setBalance(userId, b) { setItem(KEYS.BALANCE+'_'+userId, b); }
export function getPortfolio(userId) { return getItem(KEYS.PORTFOLIO+'_'+userId) || []; }
export function setPortfolio(userId, p) { setItem(KEYS.PORTFOLIO+'_'+userId, p); }
export function getWatchlist(userId) { return getItem(KEYS.WATCHLIST+'_'+userId) || DEFAULT_WATCHLIST; }
export function setWatchlist(userId, w) { setItem(KEYS.WATCHLIST+'_'+userId, w); }
export function addToWatchlist(userId, symbol) { const w = getWatchlist(userId); if(!w.includes(symbol)){ w.push(symbol); setWatchlist(userId, w); return true;} return false;}
export function removeFromWatchlist(userId, symbol) { const w = getWatchlist(userId); setWatchlist(userId, w.filter(s=>s!==symbol)); return true; }
export function isInWatchlist(userId, symbol) { return getWatchlist(userId).includes(symbol); }
export function getOrders(userId) { return getItem(KEYS.ORDERS+'_'+userId) || []; }
export function setOrders(userId, o) { setItem(KEYS.ORDERS+'_'+userId, o); }
export function addOrder(userId, o) { const ords = getOrders(userId); ords.unshift(o); setOrders(userId, ords); }
export function getTransactions(userId) { return getItem(KEYS.TRANSACTIONS+'_'+userId) || []; }
export function setTransactions(userId, t) { setItem(KEYS.TRANSACTIONS+'_'+userId, t); }
export function addTransaction(userId, t) { const txns = getTransactions(userId); txns.unshift(t); setTransactions(userId, txns); }
export function getSettings(userId) { return getItem(KEYS.SETTINGS+'_'+userId) || DEFAULT_SETTINGS; }
export function setSettings(userId, s) { setItem(KEYS.SETTINGS+'_'+userId, s); }
export function resetAccount(userId) {
  setItem(KEYS.BALANCE+'_'+userId, DEFAULT_BALANCE);
  setItem(KEYS.PORTFOLIO+'_'+userId, []);
  setItem(KEYS.WATCHLIST+'_'+userId, DEFAULT_WATCHLIST);
  setItem(KEYS.ORDERS+'_'+userId, []);
  setItem(KEYS.TRANSACTIONS+'_'+userId, []);
}
export function logoutUser() { setLoggedIn(false); removeItem(KEYS.USER); }