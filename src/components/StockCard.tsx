import React from 'react';
import styled from 'styled-components';
import { Stock } from '../types/stock';
import InfoTooltip from './InfoTooltip';

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
  onAddToWatchlist?: (symbol: string) => void;
}

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  padding: 32px 28px 40px 28px;
  margin: 24px 0;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StockTicker = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: bold;
`;

const StockCompany = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
  font-weight: 500;
`;

const StockPrice = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StockMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricLabel = styled.span`
  font-size: 0.75rem;
  color: #7f8c8d;
`;

const MetricValue = styled.span`
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
`;

const StockScore = styled.div<{ score: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  padding: 8px;
  background-color: ${({ score }) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  }};
  color: white;
  border-radius: 4px;
  font-weight: bold;
`;

const FavoriteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px auto 0 auto;
  padding: 8px 28px;
  border-radius: 22px;
  border: none;
  background: #ede9fe;
  color: #6d28d9;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(109,40,217,0.06);
  margin-bottom: 18px;
  &:hover {
    background: #e0d7fa;
  }
`;

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000000000) return `$${(marketCap / 1000000000000).toFixed(2)}T`;
  if (marketCap >= 1000000000) return `$${(marketCap / 1000000000).toFixed(2)}B`;
  if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(2)}M`;
  return `$${(marketCap / 1000).toFixed(2)}K`;
};

const StockCard: React.FC<StockCardProps> = ({ stock, onClick, onAddToWatchlist }) => {
  // For debugging, can be removed in production
  // console.log('StockCard stock:', stock);
  return (
    <Card onClick={onClick}>
      <StockHeader>
        <div>
          <StockTicker>{stock.ticker}</StockTicker>
          <StockCompany>{stock.companyName || stock.name || stock.symbol || '-'}</StockCompany>
        </div>
        <StockPrice>${stock.currentPrice.toFixed(2)}</StockPrice>
      </StockHeader>
      <StockMetrics>
        <MetricItem>
          <MetricLabel>P/E Ratio <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." /></MetricLabel>
          <MetricValue>{stock.peRatio.toFixed(2)}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Dividend Yield <InfoTooltip text="Annual dividend per share as a percentage of share price." /></MetricLabel>
                      <MetricValue>{stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Market Cap <InfoTooltip text="Total market value of a company's outstanding shares." /></MetricLabel>
          <MetricValue>{formatMarketCap(stock.marketCap)}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Earnings Growth <InfoTooltip text="Year-over-year growth in company earnings." /></MetricLabel>
          <MetricValue>{stock.earningsGrowth.toFixed(2)}%</MetricValue>
        </MetricItem>
      </StockMetrics>
      <StockScore score={stock.futureVestScore}>
        FutureVest Score: {stock.futureVestScore}
      </StockScore>
      {onAddToWatchlist && (
        <FavoriteButton
          type="button"
          onClick={e => {
            e.stopPropagation();
            onAddToWatchlist(stock.ticker);
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27"></polygon></svg>
          Favorite
        </FavoriteButton>
      )}
    </Card>
  );
};

export default StockCard; 