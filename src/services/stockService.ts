import { Stock, StockChartData, TimeRange, ScanFilters } from '../types/stock';
import { API_HOSTS } from '../config';

const API_BASE_URL = API_HOSTS.stocks;

// API functions
export const searchStocks = async (query: string): Promise<Stock[]> => {
  try {
    console.log(`[INFO] Searching stocks with query: ${query}`);
    const response = await fetch(`${API_HOSTS.stocks}/api/stocks/search?query=${query}`);
    
    if (!response.ok) {
      console.error(`[ERROR] Search failed with status: ${response.status}`);
      throw new Error(`Search failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[INFO] Received ${data.length} results from backend`);
    
    // Map backend fields to Stock type, fallback to 0 or '-' if missing
    const stocks = data.map((item: any, index: number) => {
      console.log(`[DEBUG] Processing stock ${index + 1}/${data.length}: ${item.symbol}`);
      const current = Number(item.currentPrice) || 0;
      const prev = Number(item.previousClose) || 0;
      const changePercent = prev !== 0 ? ((current - prev) / prev) * 100 : 0;
      return {
        id: index.toString(),
        ticker: item.symbol,
        companyName: item.name || '-',
        currentPrice: current,
        peRatio: Number(item.peRatio) || 0,
        dividendYield: Number(item.dividendYield) || 0,
        marketCap: Number(item.marketCap) || 0,
        earningsGrowth: Number(item.earningsGrowth) || 0,
        sector: item.sector || item.region || '-',
        futureVestScore: Number(item.futureVestScore) || 0,
        changePercent,
      };
    });
    
    console.log(`[INFO] Successfully processed ${stocks.length} stocks`);
    return stocks;
  } catch (error) {
    console.error('[ERROR] Error searching stocks:', error);
    throw error;
  }
};

export const getStockDetails = async (ticker: string): Promise<Stock | null> => {
  try {
    const response = await fetch(`${API_HOSTS.stocks}/api/stocks/stock/${ticker}`);
    if (!response.ok) throw new Error('Failed to get stock details');
    const data = await response.json();
    return {
      id: ticker,
      ticker: data.symbol,
      companyName: data.companyName || data.name || data.symbol || 'Unknown Company',
      currentPrice: data.price.price,
      peRatio: data.pe_ratio,
      dividendYield: data.dividend_yield,
      marketCap: data.market_cap,
      earningsGrowth: data.earnings_growth,
      sector: data.sector,
      futureVestScore: data.fv_score,
      change: data.price.change,
      changePercent: data.price.change_percent
    };
  } catch (error) {
    console.error('Error getting stock details:', error);
    throw error;
  }
};

export const getStockChartData = async (ticker: string, timeRange: TimeRange): Promise<StockChartData> => {
  try {
    const response = await fetch(`${API_HOSTS.stocks}/stock/${ticker}/chart?interval=${timeRange}`);
    if (!response.ok) throw new Error('Failed to get chart data');
    const data = await response.json();
    
    return {
      labels: data.map((item: any) => item.Date),
      datasets: [{
        label: ticker,
        data: data.map((item: any) => item.Close),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
      }]
    };
  } catch (error) {
    console.error('Error getting chart data:', error);
    throw error;
  }
};

export const scanStocks = async (filters: ScanFilters): Promise<Stock[]> => {
  try {
    const response = await fetch(`${API_HOSTS.stocks}/api/stocks/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters)
    });
    if (!response.ok) throw new Error('Scan failed');
    const data = await response.json();
    return data.map((item: any, index: number) => {
      const current = Number(item.currentPrice) || 0;
      const prev = Number(item.previousClose) || 0;
      const changePercent = prev !== 0 ? ((current - prev) / prev) * 100 : 0;
      return {
        id: index.toString(),
        ticker: item.ticker || item.symbol,
        companyName: item.companyName || item.name || item.ticker || item.symbol || '-',
        currentPrice: current,
        peRatio: item.peRatio,
        dividendYield: item.dividendYield,
        marketCap: item.marketCap,
        earningsGrowth: item.earningsGrowth,
        sector: item.sector,
        futureVestScore: item.futureVestScore,
        changePercent,
      };
    });
  } catch (error) {
    console.error('Error scanning stocks:', error);
    throw error;
  }
};

// Fetch tooltips for stock metrics from backend
export const getTooltips = async (): Promise<Record<string, string>> => {
  // Call the backend tooltips API
  const response = await fetch('/api/tooltips');
  if (!response.ok) throw new Error('Failed to fetch tooltips');
  return await response.json();
};

export {} 