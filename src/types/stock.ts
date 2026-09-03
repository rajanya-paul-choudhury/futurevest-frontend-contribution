export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  name?: string; // Adding name as an alias for companyName
  currentPrice: number;
  peRatio: number;
  dividendYield: number;
  marketCap: number;
  earningsGrowth: number;
  priceChange?: number; // Adding priceChange property
  sector: string;
  futureVestScore: number; // Proprietary valuation score
  alertSet?: boolean; // Adding alertSet property
  symbol?: string; // Add symbol as an alias for ticker
  // --- Added for StockDetail.tsx compatibility ---
  change?: number;
  changePercent?: number;
  exchange?: string;
  price?: number;
  eps?: number;
  week52High?: number;
  week52Low?: number;
  volume?: number;
  avgVolume?: number;
  description?: string;
}

export interface StockChartData {
  labels: string[]; // Time periods
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export type TimeRange = '1d' | '1w' | '1m' | '1y';

export interface ScanFilters {
  marketCapRange?: [number, number];
  peRatioRange?: [number, number];
  hasDividend?: boolean;
  minEarningsGrowth?: number;
  sector?: string;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  sectors?: string[];
  limit?: number;
} 