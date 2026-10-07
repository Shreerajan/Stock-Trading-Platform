const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 17845.50, change: 234.75, changePercent: 1.33, high: 17920.00, low: 17580.25, open: 17610.75, previousClose: 17610.75, volume: 54230000, category: 'Technology', description: 'Apple Inc. description' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 34520.00, change: -187.50, changePercent: -0.54, high: 34780.00, low: 34410.50, open: 34707.50, previousClose: 34707.50, volume: 22150000, category: 'Technology', description: 'Microsoft description' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 21450.00, change: -532.50, changePercent: -2.42, high: 22050.00, low: 21320.00, open: 21982.50, previousClose: 21982.50, volume: 98700000, category: 'Automotive', description: 'Tesla description' }
];
export function generateChartData(symbol, days = 365) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) return [];
  const data = [];
  const basePrice = stock.price * 0.7;
  for (let i = 0; i < days; i++) {
    const trend = (i / days) * 0.3;
    const price = basePrice * (1 + trend);
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    data.push({ date: date.toISOString().split('T')[0], price: Math.round(price * 100) / 100, volume: stock.volume });
  }
  return data;
}
export function getChartDataByPeriod(symbol, period) { return generateChartData(symbol, period === '1W' ? 7 : period === '1M' ? 30 : 365); }
export function getStockBySymbol(symbol) { return stocks.find(s => s.symbol === symbol.toUpperCase()) || null; }
export function searchStocks(query) { return stocks.filter(s => s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase())); }
export function getStocksByCategory(category) { return category === 'All' ? stocks : stocks.filter(s => s.category === category); }
export function getCategories() { return ['All', ...new Set(stocks.map(s => s.category))]; }
export default stocks;