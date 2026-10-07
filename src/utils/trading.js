import { getStockBySymbol } from '../data/stocks';
import { getBalance, setBalance, getPortfolio, setPortfolio, addOrder, addTransaction } from './storage';

export function formatINR(a) { return a == null || isNaN(a) ? '₹0' : (a<0?'-':'')+'₹'+Math.abs(a).toLocaleString('en-IN', {minimumFractionDigits:2,maximumFractionDigits:2}); }
export function formatNumber(n) { return n == null || isNaN(n) ? '0' : Number(n).toLocaleString('en-IN'); }
export function formatPercent(p) { return p == null || isNaN(p) ? '0.00%' : (p>=0?'+':'')+p.toFixed(2)+'%'; }

export function buyStock(userId, symbol, quantity) {
  const stock = getStockBySymbol(symbol);
  if (!stock) return { success: false, message: 'Invalid stock.' };
  const qty = parseInt(quantity);
  if (!qty || qty <= 0) return { success: false, message: 'Invalid quantity.' };
  const total = stock.price * qty;
  const balance = getBalance(userId);
  if (total > balance) return { success: false, message: 'Insufficient balance.' };
  setBalance(userId, balance - total);
  
  const portfolio = getPortfolio(userId);
  const existing = portfolio.find(p => p.symbol === symbol);
  if (existing) {
    const newQty = existing.quantity + qty;
    existing.avgPrice = ((existing.avgPrice * existing.quantity) + total) / newQty;
    existing.quantity = newQty;
    existing.investedValue = existing.avgPrice * newQty;
  } else {
    portfolio.push({ symbol: stock.symbol, name: stock.name, quantity: qty, avgPrice: stock.price, investedValue: total });
  }
  setPortfolio(userId, portfolio);
  
  const d = new Date().toISOString();
  addOrder(userId, { id: 'ORD'+Date.now(), symbol: stock.symbol, name: stock.name, type: 'BUY', quantity: qty, price: stock.price, total, date: d, status: 'Completed' });
  addTransaction(userId, { id: 'TXN'+Date.now(), type: 'BUY', symbol: stock.symbol, name: stock.name, quantity: qty, price: stock.price, amount: total, date: d, balanceAfter: balance - total });
  return { success: true, message: `Bought ${qty} ${stock.symbol}` };
}

export function sellStock(userId, symbol, quantity) {
  const stock = getStockBySymbol(symbol);
  if (!stock) return { success: false, message: 'Invalid stock.' };
  const qty = parseInt(quantity);
  if (!qty || qty <= 0) return { success: false, message: 'Invalid quantity.' };
  const portfolio = getPortfolio(userId);
  const existingIdx = portfolio.findIndex(p => p.symbol === symbol);
  if (existingIdx === -1) return { success: false, message: 'Not owned.' };
  const existing = portfolio[existingIdx];
  if (qty > existing.quantity) return { success: false, message: 'Not enough shares.' };
  
  const total = stock.price * qty;
  const balance = getBalance(userId);
  setBalance(userId, balance + total);
  
  if (qty === existing.quantity) {
    portfolio.splice(existingIdx, 1);
  } else {
    existing.quantity -= qty;
    existing.investedValue = existing.avgPrice * existing.quantity;
  }
  setPortfolio(userId, portfolio);
  
  const d = new Date().toISOString();
  addOrder(userId, { id: 'ORD'+Date.now(), symbol: stock.symbol, name: stock.name, type: 'SELL', quantity: qty, price: stock.price, total, date: d, status: 'Completed' });
  addTransaction(userId, { id: 'TXN'+Date.now(), type: 'SELL', symbol: stock.symbol, name: stock.name, quantity: qty, price: stock.price, amount: total, date: d, balanceAfter: balance + total });
  return { success: true, message: `Sold ${qty} ${stock.symbol}` };
}

export function getPortfolioSummary(userId) {
  const portfolio = getPortfolio(userId);
  const balance = getBalance(userId);
  let totalInvested = 0, totalCurrent = 0, todayPL = 0;
  const holdings = portfolio.map(h => {
    const stock = getStockBySymbol(h.symbol);
    const cp = stock ? stock.price : h.avgPrice;
    const cv = cp * h.quantity;
    const iv = h.avgPrice * h.quantity;
    totalInvested += iv; totalCurrent += cv;
    if(stock) todayPL += stock.change * h.quantity;
    return { ...h, currentPrice: cp, currentValue: cv, investedValue: iv, pl: cv - iv, plPercent: iv>0 ? (cv-iv)/iv*100 : 0 };
  });
  return { totalPortfolioValue: balance + totalCurrent, totalInvested, totalCurrent, availableCash: balance, overallPL: totalCurrent - totalInvested, overallPLPercent: totalInvested>0 ? (totalCurrent-totalInvested)/totalInvested*100 : 0, todayPL, holdings };
}