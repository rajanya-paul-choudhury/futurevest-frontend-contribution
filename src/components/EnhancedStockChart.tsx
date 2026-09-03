import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { 
  ChartDataPoint,
  ChartTimeframe, 
  ChartType,
  TechnicalIndicator, 
  formatAPIChartData,
  getAPIIntervalFromTimeframe, 
  generateChartConfig,
  calculateChartStats, 
  formatPriceChange,
  getAPIPeriodFromTimeframe
} from './StockChartDataModel';
import { ApexOptions } from 'apexcharts';
import { API_HOSTS } from '../config';

// Styled components
const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100% - 40px);
  min-height: 400px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
`;

const TimeframeBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  padding: 4px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const IndicatorBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  padding: 4px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ChartTypeBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  padding: 4px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ControlChip = styled.button<{ $active: boolean }>`
  height: 22px;
  padding: 0 8px;
  border-radius: 11px;
  background: ${props => props.$active ? 'var(--purple-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-medium)'};
  border: 1px solid ${props => props.$active ? 'var(--purple-primary)' : 'rgba(0, 0, 0, 0.1)'};
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    background: ${props => props.$active ? 'var(--purple-primary)' : 'rgba(0, 0, 0, 0.03)'};
  }
`;

const StatsOverlay = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
  display: flex;
  gap: 12px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  padding: 6px 10px;
  min-width: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 11px;
`;

const StatLabel = styled.div`
  color: var(--text-medium);
  margin-bottom: 2px;
`;

const StatValue = styled.div`
  font-weight: 600;
  color: var(--text-dark);
  font-size: 13px;
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-medium);
  font-size: 14px;
  
  svg {
    width: 32px;
    height: 32px;
    color: var(--text-light);
    margin-bottom: 12px;
  }
`;

interface EnhancedStockChartProps {
  symbol: string;
  timeframe: ChartTimeframe;
  chartType: ChartType;
  activeIndicators: TechnicalIndicator[];
}

const EnhancedStockChart: React.FC<EnhancedStockChartProps> = ({ symbol, timeframe, chartType, activeIndicators }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chartConfig, setChartConfig] = useState<{ 
    options: ApexOptions, 
    series: any[] 
  }>({ options: {}, series: [] });

  useEffect(() => {
    console.log('[LOG] useEffect triggered: timeframe =', timeframe, 'symbol =', symbol);
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        // Update the URL with the timeframe parameter without refreshing the page
        const url = new URL(window.location.href);
        url.searchParams.set('timeframe', timeframe);
        window.history.replaceState({}, '', url.toString());

        // Get API interval parameter from timeframe
        const interval = getAPIIntervalFromTimeframe(timeframe);
        const period = getAPIPeriodFromTimeframe(timeframe);
        // Only request real API
        console.log(`[LOG] Fetching chart data for ${symbol} with interval=${interval}, period=${period}, timeframe=${timeframe}`);
        const response = await fetch(`${API_HOSTS.stocks}/api/stocks/stock/${symbol}/chart?interval=${interval}&period=${period}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const apiData = await response.json();
        console.log("[LOG] API data received:", apiData);

        if (Array.isArray(apiData) && apiData.length > 0) {
          const formattedData = formatAPIChartData(apiData);
          setChartData(formattedData);
          console.log("[LOG] SUCCESS: Using real API data for chart with", formattedData.length, "data points");
        } else {
          // Set empty when no data
          setChartData([]);
          console.warn("[LOG] Empty data from API");
        }
      } catch (error) {
        console.error("[LOG] Error fetching chart data:", error);
        // Set empty when error occurs
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [timeframe, symbol]);

  useEffect(() => {
    // Update chart type in the URL
    const url = new URL(window.location.href);
    url.searchParams.set('chart', chartType);
    window.history.replaceState({}, '', url.toString());
  }, [chartType]);

  // Calculate stats for display
  const stats = calculateChartStats(chartData);

  useEffect(() => {
    if (chartData.length > 0) {
      console.log(`Regenerating chart config for chart type: ${chartType}`);
      const config = generateChartConfig(
        chartData,
        chartType,
        symbol,
        timeframe,
        activeIndicators
      );
      setChartConfig(config);
    }
  }, [chartType, chartData, symbol, timeframe, activeIndicators]);

  // Loading state
  if (isLoading) {
    return (
      <NoDataMessage>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Loading chart data...
      </NoDataMessage>
    );
  }

  // No data state
  if (!chartData.length) {
    return (
      <NoDataMessage>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        No data available for {symbol}
      </NoDataMessage>
    );
  }

  return (
    <ChartWrapper>
      <ChartContainer>
        <ReactApexChart 
          options={chartConfig.options}
          series={chartConfig.series}
          type={chartType === 'candlestick' ? 'candlestick' : (chartType === 'volume' ? 'bar' : 'line')}
          height="100%"
          width="100%"
        />
      </ChartContainer>
    </ChartWrapper>
  );
};

export default EnhancedStockChart; 