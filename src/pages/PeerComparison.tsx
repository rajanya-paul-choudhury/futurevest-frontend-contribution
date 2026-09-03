import React, { useState } from "react";
import styled from "styled-components";
import InfoTooltip from '../components/InfoTooltip';

const PageContainer = styled.div`
  padding: 30px;
  min-height: calc(100vh - 130px);
  background-color: var(--background-light);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 10px;
`;

const PageDescription = styled.p`
  font-size: 16px;
  color: var(--text-medium);
  max-width: 800px;
  line-height: 1.5;
`;

const CompanySelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SelectorTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
  width: 100%;
`;

const CompanyButton = styled.button<{ selected: boolean }>`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.selected ? 'var(--purple-primary)' : 'var(--gray-light)'};
  background-color: ${props => props.selected ? 'var(--purple-ultralight)' : 'white'};
  color: ${props => props.selected ? 'var(--purple-primary)' : 'var(--text-medium)'};
  font-weight: ${props => props.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--purple-ultralight)' : 'var(--gray-50)'};
    border-color: ${props => props.selected ? 'var(--purple-primary)' : 'var(--gray-400)'};
  }
`;

const AddCompanyButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px dashed var(--gray-400);
  background-color: white;
  color: var(--text-medium);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    border-color: var(--purple-primary);
    color: var(--purple-primary);
  }
`;

const ComparisonCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const CardHeader = styled.div`
  padding: 16px 24px;
  background-color: var(--purple-ultralight);
  border-bottom: 1px solid var(--gray-light);
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--purple-primary);
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 24px;
  font-weight: 600;
  color: var(--text-dark);
  border-bottom: 1px solid var(--gray-light);
  background-color: var(--white);
`;

const Td = styled.td<{ highlight?: boolean }>`
  padding: 16px 24px;
  border-bottom: 1px solid var(--gray-light);
  font-size: 15px;
  color: ${props => props.highlight ? 'var(--purple-primary)' : 'var(--text-medium)'};
  font-weight: ${props => props.highlight ? '600' : '400'};
  background-color: ${props => props.highlight ? 'rgba(109, 40, 217, 0.05)' : 'transparent'};
`;

const ValueChip = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: ${props => props.color};
  color: white;
  font-size: 12px;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  margin-top: 40px;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ChartPlaceholder = styled.div`
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--gray-300);
  border-radius: 8px;
  color: var(--text-light);
`;

const MetricSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const MetricButton = styled.button<{ selected: boolean }>`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.selected ? 'var(--purple-primary)' : 'var(--gray-light)'};
  background-color: ${props => props.selected ? 'var(--purple-ultralight)' : 'white'};
  color: ${props => props.selected ? 'var(--purple-primary)' : 'var(--text-medium)'};
  font-size: 13px;
  font-weight: ${props => props.selected ? '600' : '400'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--purple-ultralight)' : 'var(--gray-50)'};
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--purple-primary)' : 'var(--text-medium)'};
  border-bottom: ${props => props.active ? '2px solid var(--purple-primary)' : 'none'};
  cursor: pointer;
  
  &:hover {
    color: var(--purple-primary);
  }
`;

const allCompanies = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Cyclical"
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    sector: "Technology"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive"
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology"
  }
];

interface MetricsData {
  [key: string]: {
    [metric: string]: string | number;
  };
}

const metricsData: MetricsData = {
  "AAPL": {
    "P/E Ratio": 28.5,
    "EPS": 6.25,
    "Market Cap": "$2.8T",
    "Dividend Yield": "0.6%",
    "Revenue Growth": "8.1%",
    "Profit Margin": "25.3%",
    "Debt-to-Equity": 1.52,
    "FutureVest Score": 82
  },
  "MSFT": {
    "P/E Ratio": 35.2,
    "EPS": 8.12,
    "Market Cap": "$2.4T",
    "Dividend Yield": "0.8%",
    "Revenue Growth": "14.2%",
    "Profit Margin": "37.0%",
    "Debt-to-Equity": 0.38,
    "FutureVest Score": 85
  },
  "GOOGL": {
    "P/E Ratio": 25.4,
    "EPS": 5.80,
    "Market Cap": "$1.9T",
    "Dividend Yield": "0%",
    "Revenue Growth": "12.8%",
    "Profit Margin": "29.5%",
    "Debt-to-Equity": 0.06,
    "FutureVest Score": 87
  },
  "AMZN": {
    "P/E Ratio": 42.3,
    "EPS": 3.75,
    "Market Cap": "$1.8T",
    "Dividend Yield": "0%",
    "Revenue Growth": "10.9%",
    "Profit Margin": "5.1%",
    "Debt-to-Equity": 0.45,
    "FutureVest Score": 80
  },
  "META": {
    "P/E Ratio": 30.7,
    "EPS": 14.38,
    "Market Cap": "$1.2T",
    "Dividend Yield": "0%",
    "Revenue Growth": "16.1%",
    "Profit Margin": "33.9%",
    "Debt-to-Equity": 0.09,
    "FutureVest Score": 81
  },
  "TSLA": {
    "P/E Ratio": 72.1,
    "EPS": 2.45,
    "Market Cap": "$900B",
    "Dividend Yield": "0%",
    "Revenue Growth": "22.4%",
    "Profit Margin": "11.8%",
    "Debt-to-Equity": 0.11,
    "FutureVest Score": 76
  },
  "NVDA": {
    "P/E Ratio": 68.9,
    "EPS": 7.53,
    "Market Cap": "$2.2T",
    "Dividend Yield": "0.04%",
    "Revenue Growth": "206.8%",
    "Profit Margin": "41.4%",
    "Debt-to-Equity": 0.18,
    "FutureVest Score": 90
  }
};

const getValueColor = (value: string | number, metric: string): string => {
  if (metric === "FutureVest Score") {
    const score = typeof value === 'number' ? value : parseFloat(value);
    if (score >= 85) return '#36B37E'; // Green
    if (score >= 75) return '#00B8D9'; // Blue
    return '#FFAB00'; // Yellow
  }
  return 'var(--purple-primary)';
};

const PeerComparison: React.FC = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(["AAPL", "MSFT", "GOOGL"]);
  const [activeTab, setActiveTab] = useState("fundamentals");
  const [selectedMetric, setSelectedMetric] = useState("P/E Ratio");
  
  const toggleCompany = (symbol: string) => {
    if (selectedCompanies.includes(symbol)) {
      setSelectedCompanies(selectedCompanies.filter(s => s !== symbol));
    } else {
      if (selectedCompanies.length < 5) {
        setSelectedCompanies([...selectedCompanies, symbol]);
      } else {
        alert("You can compare up to 5 companies at a time.");
      }
    }
  };
  
  const allMetrics = Object.keys(metricsData["AAPL"]);
  const fundamentalMetrics = ["P/E Ratio", "EPS", "Market Cap", "Dividend Yield"];
  const growthMetrics = ["Revenue Growth", "Profit Margin"];
  const valueMetrics = ["FutureVest Score", "Debt-to-Equity"];
  
  const currentTabMetrics = activeTab === "fundamentals" 
    ? fundamentalMetrics 
    : activeTab === "growth" 
      ? growthMetrics 
      : valueMetrics;

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Peer Comparison</PageTitle>
          <PageDescription>
            Compare key metrics across multiple companies to identify relative strengths, weaknesses, and investment opportunities.
          </PageDescription>
        </PageHeader>
        
        <CompanySelector>
          <SelectorTitle>Select Companies to Compare (up to 5)</SelectorTitle>
          {allCompanies.map(company => (
            <CompanyButton 
              key={company.symbol}
              selected={selectedCompanies.includes(company.symbol)}
              onClick={() => toggleCompany(company.symbol)}
            >
              {company.symbol} - {company.name}
            </CompanyButton>
          ))}
          {selectedCompanies.length < 5 && (
            <AddCompanyButton>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Company
            </AddCompanyButton>
          )}
        </CompanySelector>
        
        <TabContainer>
          <Tab 
            active={activeTab === "fundamentals"}
            onClick={() => setActiveTab("fundamentals")}
          >
            Fundamental Metrics
          </Tab>
          <Tab 
            active={activeTab === "growth"}
            onClick={() => setActiveTab("growth")}
          >
            Growth Metrics
          </Tab>
          <Tab 
            active={activeTab === "value"}
            onClick={() => setActiveTab("value")}
          >
            Value Metrics
          </Tab>
        </TabContainer>
        
        <ComparisonCard>
          <CardHeader>
            <CardTitle>{activeTab === "fundamentals" ? "Fundamental" : activeTab === "growth" ? "Growth" : "Value"} Comparison</CardTitle>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <Th>Metric</Th>
                {selectedCompanies.map(symbol => (
                  <Th key={symbol}>{symbol}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTabMetrics.map(metric => (
                <tr key={metric}>
                  <Td highlight>
                    {metric}
                    {metric === 'P/E Ratio' && <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." />}
                    {metric === 'EPS' && <InfoTooltip text="Earnings Per Share (Trailing Twelve Months)." />}
                    {metric === 'Market Cap' && <InfoTooltip text="Total market value of a company's outstanding shares." />}
                    {metric === 'Dividend Yield' && <InfoTooltip text="Annual dividend per share as a percentage of share price." />}
                    {metric === 'Revenue Growth' && <InfoTooltip text="Year-over-year growth in company revenue." />}
                    {metric === 'Profit Margin' && <InfoTooltip text="Net income as a percentage of revenue." />}
                    {metric === 'Debt-to-Equity' && <InfoTooltip text="A measure of a company's financial leverage." />}
                    {metric === 'FutureVest Score' && <InfoTooltip text="Proprietary score based on multiple financial and growth factors." />}
                  </Td>
                  {selectedCompanies.map(symbol => (
                    <Td key={`${symbol}-${metric}`}>
                      {metric === "FutureVest Score" ? (
                        <ValueChip color={getValueColor(metricsData[symbol][metric], metric)}>
                          {metricsData[symbol][metric]}
                        </ValueChip>
                      ) : (
                        metricsData[symbol][metric]
                      )}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </ComparisonCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PeerComparison;
