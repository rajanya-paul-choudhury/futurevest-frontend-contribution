import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Stock } from '../types/stock';
import { getStockDetails } from '../services/stockService';
import AlertModal from '../components/AlertModal';
import EnhancedStockChart from '../components/EnhancedStockChart';
import { useAlerts } from '../context/AlertsContext';
import InfoTooltip from '../components/InfoTooltip';
import { API_HOSTS } from '../config';
import AddToWatchlistButton from '../components/AddToWatchlistButton';

const Container = styled.div`
  padding: 30px;
  background-color: var(--gray-50);
  min-height: calc(100vh - 130px);
  overflow: hidden;
`;

const StockHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const LogoAndInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: var(--purple-ultralight);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--purple-primary);
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
`;

const StockMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-medium);
`;

const Badge = styled.span`
  background-color: rgba(0, 0, 0, 0.04);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const PriceInfo = styled.div`
  text-align: right;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
`;

const PriceChange = styled.div<{ positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.positive ? '#0CAF82' : '#E03131'};
  background-color: ${props => props.positive ? 'rgba(12, 175, 130, 0.08)' : 'rgba(224, 49, 49, 0.08)'};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  
  background-color: ${props => props.primary ? 'var(--purple-primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--purple-primary)'};
  border: 1px solid ${props => props.primary ? 'var(--purple-primary)' : 'var(--purple-primary)'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--purple-dark)' : 'var(--purple-ultralight)'};
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  height: calc(100vh - 240px);
  margin-top: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled(Card)`
  height: 100%;
  overflow: hidden;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`;

const MetricsCard = styled(Card)`
  flex: 1;
`;

const OverviewCard = styled(Card)`
  flex: 1;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeControls = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  padding: 3px;
`;

const TimeButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'white' : 'transparent'};
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.active ? 'var(--text-dark)' : 'var(--text-medium)'};
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.15s ease;
  
  &:hover {
    color: var(--text-dark);
  }
`;

const TypeControls = styled.div`
  display: flex;
  gap: 2px;
`;

const TypeButton = styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.active ? 'var(--purple-primary)' : 'var(--text-medium)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--purple-primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;
  
  &:hover {
    color: var(--purple-primary);
  }
`;

const ChartContent = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  overflow: auto;
`;

const Metric = styled.div`
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  
  &:nth-child(even) {
    border-right: none;
  }
`;

const MetricLabel = styled.div`
  font-size: 13px;
  color: var(--text-medium);
  margin-bottom: 6px;
`;

const MetricValue = styled.div<{ highlight?: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${props => props.highlight ? 'var(--purple-primary)' : 'var(--text-dark)'};
`;

const OverviewContent = styled.div`
  padding: 16px 20px;
  overflow: auto;
  height: 100%;
`;

const OverviewSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 8px 0;
`;

const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-medium);
  margin: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  color: var(--text-medium);
`;

const StockDetail: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [timeframe, setTimeframe] = useState('1d');
  const [chartType, setChartType] = useState('candlestick');
  const [activeIndicators, setActiveIndicators] = useState(['SMA']);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addAlert } = useAlerts();
  const [userChangedInterval, setUserChangedInterval] = useState(false);
  
  useEffect(() => {
    const fetchStock = async () => {
      if (!ticker) return;
      setLoading(true);
      try {
        const data = await getStockDetails(ticker);
        setStock(data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [ticker]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setTimeframe('1y');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    setUserChangedInterval(true);
  };

  useEffect(() => {
    if (timeframe === '1y' && !userChangedInterval) {
      setTimeframe('1h');
    }
    // eslint-disable-next-line
  }, [timeframe]);

  const formatMarketCap = (val: number): string =>
    val >= 1e12 ? `$${(val / 1e12).toFixed(2)}T` :
    val >= 1e9 ? `$${(val / 1e9).toFixed(2)}B` :
    val >= 1e6 ? `$${(val / 1e6).toFixed(2)}M` :
    `$${val}`;

  const formatVolume = (volume?: number): string => {
    if (!volume) return 'N/A';
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume}`;
  };

  if (loading) return <LoadingContainer>Loading stock data...</LoadingContainer>;
  if (!stock) return <LoadingContainer>Stock not found</LoadingContainer>;
  
  const isPositiveChange = !!stock.change && stock.change > 0;

  return (
    <Container>
      <StockHeader>
        <LogoAndInfo>
          <Logo>{stock.ticker?.charAt(0) || 'S'}</Logo>
          <CompanyInfo>
            <StockName>{stock.companyName || 'Unknown Company'}</StockName>
            <StockMeta>
              {stock.ticker} <Badge>{stock.exchange || 'NASDAQ'}</Badge>
            </StockMeta>
          </CompanyInfo>
        </LogoAndInfo>
        
        <PriceInfo>
          <Price>${stock.currentPrice?.toFixed(2) || '0.00'}</Price>
          <PriceChange positive={isPositiveChange}>
            {isPositiveChange ? '▲' : '▼'} 
            {stock.change?.toFixed(2) || '0.00'} ({stock.changePercent?.toFixed(2) || '0.00'}%)
          </PriceChange>
        </PriceInfo>
        
        <Actions>
          <AddToWatchlistButton stock={stock} />
          <Button onClick={() => setShowAlertModal(true)}>Set Alert</Button>
        </Actions>
      </StockHeader>
      
      <MainLayout>
        <ChartContainer>
          <CardHeader>
            <TypeControls>
              <TypeButton 
                active={chartType === 'candlestick'} 
                onClick={() => setChartType('candlestick')}
              >
                Candlestick
              </TypeButton>
              <TypeButton 
                active={chartType === 'line'} 
                onClick={() => setChartType('line')}
              >
                Line
              </TypeButton>
              <TypeButton 
                active={chartType === 'volume'} 
                onClick={() => setChartType('volume')}
              >
                Volume
              </TypeButton>
            </TypeControls>
            
            <TimeControls>
              <TimeButton 
                active={timeframe === '1h'} 
                onClick={() => handleTimeframeChange('1h')}
              >
                1H
              </TimeButton>
              <TimeButton 
                active={timeframe === '1d'} 
                onClick={() => handleTimeframeChange('1d')}
              >
                1D
              </TimeButton>
              <TimeButton 
                active={timeframe === '1mo'} 
                onClick={() => handleTimeframeChange('1mo')}
              >
                1M
              </TimeButton>
              <TimeButton 
                active={timeframe === '1y'} 
                onClick={() => handleTimeframeChange('1y')}
              >
                1Y
              </TimeButton>
            </TimeControls>
            <TypeControls>
              <TypeButton 
                active={activeIndicators.includes('SMA')}
                onClick={() => setActiveIndicators(prev => prev.includes('SMA') ? prev.filter(i => i !== 'SMA') : [...prev, 'SMA'])}
              >
                SMA
              </TypeButton>
              <TypeButton 
                active={activeIndicators.includes('EMA')}
                onClick={() => setActiveIndicators(prev => prev.includes('EMA') ? prev.filter(i => i !== 'EMA') : [...prev, 'EMA'])}
              >
                EMA
              </TypeButton>
              <TypeButton 
                active={activeIndicators.includes('Bollinger')}
                onClick={() => setActiveIndicators(prev => prev.includes('Bollinger') ? prev.filter(i => i !== 'Bollinger') : [...prev, 'Bollinger'])}
              >
                BB
              </TypeButton>
            </TypeControls>
          </CardHeader>
          
          <ChartContent>
            <EnhancedStockChart 
              symbol={stock.ticker || ''}
              timeframe={timeframe as any}
              chartType={chartType as any}
              activeIndicators={activeIndicators as any}
            />
          </ChartContent>
        </ChartContainer>
        
        <SideColumn>
          <MetricsCard>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <MetricsGrid>
              <Metric>
                <MetricLabel>Current Price <InfoTooltip text="Latest trading price." /></MetricLabel>
                <MetricValue highlight>{stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}` : 'N/A'}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>P/E Ratio <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." /></MetricLabel>
                <MetricValue>{stock.peRatio?.toFixed(2) || 'N/A'}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Dividend Yield <InfoTooltip text="Annual dividend per share as a percentage of share price." /></MetricLabel>
                <MetricValue>{stock.dividendYield !== undefined && stock.dividendYield !== null ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Market Cap <InfoTooltip text="Total market value of a company's outstanding shares." /></MetricLabel>
                <MetricValue highlight>{formatMarketCap(stock.marketCap || 0)}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>Earnings Growth <InfoTooltip text="Year-over-year growth in company earnings." /></MetricLabel>
                <MetricValue>{stock.earningsGrowth !== undefined && stock.earningsGrowth !== null ? `${(stock.earningsGrowth * 100).toFixed(2)}%` : 'N/A'}</MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>FutureVest Score <InfoTooltip text="Simple valuation score based on PE and earnings growth." /></MetricLabel>
                <MetricValue highlight>{stock.futureVestScore !== undefined && stock.futureVestScore !== null ? stock.futureVestScore : 'N/A'}</MetricValue>
              </Metric>
            </MetricsGrid>
          </MetricsCard>
          
          <OverviewCard>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            
            <OverviewContent>
              <OverviewSection>
                <SectionTitle>FV Analysis</SectionTitle>
                <Paragraph>
                  AI-powered analysis suggests {stock.companyName} has strong potential for growth based on current market conditions.
                </Paragraph>
              </OverviewSection>
              
              <OverviewSection>
                <SectionTitle>About</SectionTitle>
                <Paragraph>
                  {stock.description || `${stock.companyName} is a leading company in the ${stock.sector || 'Technology'} sector with strong fundamentals and growth potential.`}
                </Paragraph>
              </OverviewSection>
            </OverviewContent>
          </OverviewCard>
        </SideColumn>
      </MainLayout>
      
      {showAlertModal && (
        <AlertModal
          isOpen={showAlertModal}
          stock={{
            symbol: stock?.ticker || '',
            name: stock?.companyName || ''
          }}
          onClose={() => setShowAlertModal(false)}
          onSave={(alertData: any) => {
            const newAlert = {
              id: Date.now().toString(),
              stockSymbol: alertData.stockSymbol,
              stockName: alertData.stockName,
              type: alertData.type as import('./Alerts').AlertType,
              condition: alertData.condition,
              value: Number(alertData.value),
              notificationMethod: alertData.notificationMethod as import('./Alerts').NotificationMethod[],
              duration: alertData.duration as import('./Alerts').AlertDuration,
              createdAt: new Date().toISOString(),
              isActive: true
            };
            addAlert(newAlert);
            setShowAlertModal(false);
          }}
        />
      )}
    </Container>
  );
};

export default StockDetail;
