import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import MiniChart from "../components/MiniChart";
import { scanStocks } from '../services/stockService';
import { Stock } from '../types/stock';
import { useNavigate } from 'react-router-dom';
import StockCard from '../components/StockCard';
import InfoTooltip from '../components/InfoTooltip';
import { API_HOSTS } from '../config';

// Define types for our scanner
interface Parameter {
  id: string;
  type: string;
  name: string;
  value: any;
  options?: any;
}

interface ScanTemplate {
  id: string;
  name: string;
  parameters: Parameter[];
}

interface Category {
  id: string;
  name: string;
  parameters: string[];
}

const PageContainer = styled.div`
  background-color: var(--gray-50);
  padding: 30px;
  min-height: calc(100vh - 130px);
`;

const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 8px 0;
`;

const Subheading = styled.p`
  font-size: 14px;
  color: var(--text-medium);
  margin: 0;
`;

const SearchBar = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--gray-300);
  margin-bottom: 24px;
  width: 100%;
  max-width: 400px;
  background-color: white;
  
  &::placeholder {
    color: var(--gray-400);
  }
`;

const TemplatesSection = styled.div`
  margin-bottom: 24px;
`;

const TemplatesHeader = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 16px 0;
`;

const TemplateButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const TemplateButton = styled.button`
  padding: 12px 20px;
  background-color: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  color: var(--primary-color);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-ultralight);
  }
`;

const ThreeColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 24px;
  margin-bottom: 24px;
`;

const Panel = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--gray-200);
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
`;

const PanelContent = styled.div`
  padding: 16px;
`;

// Parameter Categories Panel
const ParameterCategory = styled.div`
  margin-bottom: 16px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;
`;

const CategoryTitle = styled.h4`
  font-size: 15px;
  font-weight: 500;
  color: var(--text-dark);
  margin: 0;
`;

const ExpandIcon = styled.div<{ expanded: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-medium);
`;

const CategoryContent = styled.div<{ expanded: boolean }>`
  max-height: ${props => props.expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s;
`;

const ParameterItem = styled.div`
  padding: 8px 0;
  border-top: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-medium);
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const AddButton = styled.span`
  color: var(--primary-color);
  font-weight: 500;
`;

// Scanner Configuration Panel
const ConfigItem = styled.div`
  margin-bottom: 24px;
`;

const ConfigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ConfigTitle = styled.h4`
  font-size: 15px;
  font-weight: 500;
  color: var(--text-dark);
  margin: 0;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  
  &:hover {
    background-color: var(--gray-100);
  }
`;

const SliderContainer = styled.div`
  position: relative;
  padding: 10px 0;
`;

const Slider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: var(--primary-color);
  border-radius: 5px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
  }
`;

const SliderDot = styled.div`
  width: 16px;
  height: 16px;
  background: var(--primary-color);
  border-radius: 50%;
  position: absolute;
  transform: translateY(-50%);
`;

const Range = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-medium);
`;

const RangeLabel = styled.span``;

const CompareToIndustry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 8px 0;
  border-top: 1px solid var(--gray-100);
`;

const CompareLabel = styled.span`
  font-size: 14px;
  color: var(--text-medium);
`;

const Switch = styled.div`
  position: relative;
  width: 36px;
  height: 20px;
`;

const SwitchInput = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(16px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const LogicControls = styled.div`
  display: flex;
  gap: 8px;
  margin: 20px 0;
`;

const LogicButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--gray-200)'};
  color: ${props => props.active ? 'white' : 'var(--text-dark)'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const RunButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
`;

const ActionButton = styled.button`
  background-color: white;
  color: var(--text-dark);
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

// Results Preview Panel
const StockPreview = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockInfo = styled.div``;

const StockSymbol = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
`;

const CompanyName = styled.div`
  font-size: 13px;
  color: var(--text-medium);
`;

const ScoreBadge = styled.div<{ score: number }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.score >= 90) return '#10B981';
    if (props.score >= 80) return '#3B82F6';
    return '#6366F1';
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
`;

const MetricValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-medium);
`;

const MetricItem = styled.div``;

const ViewAllButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  color: var(--primary-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background-color: var(--primary-ultralight);
  }
`;

const ResultsFooter = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchCount = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const ViewResultsButton = styled.button`
  background-color: white;
  color: var(--primary-color);
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

// Custom styles for the active scanner parameter
const ActiveSlider = styled(Slider)`
  background: linear-gradient(to right, var(--primary-color), var(--primary-light));
  
  &::-webkit-slider-thumb {
    box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color);
  }
`;

// Custom dot for range sliders
const CurrentValue = styled.div<{ position: number }>`
  position: absolute;
  top: 10px;
  left: ${props => `calc(${props.position}% - 8px)`};
  width: 16px;
  height: 16px;
  background-color: white;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  z-index: 2;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
`;

// Styled component for a specific template button
const ActiveTemplateButton = styled(TemplateButton)`
  border-color: var(--primary-color);
  border-width: 2px;
  color: var(--primary-color);
  background-color: var(--primary-ultralight);
  font-weight: 600;
`;

// Modify the Return on Equity slider to look like a progress bar
const ROESlider = styled(Slider)<{ value: number }>`
  background: linear-gradient(
    to right, 
    var(--primary-color) ${props => (props.value / 30) * 100}%, 
    var(--gray-200) ${props => (props.value / 30) * 100}%
  );
  
  &::-webkit-slider-thumb {
    box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color);
  }
`;

// Parameter definitions for supported filters
const PARAM_DEFS: Record<string, Parameter> = {
  'market-cap-range': {
    id: 'market-cap-range',
    type: 'range',
    name: 'Market Cap Range',
    value: { min: 1, max: 2000 }, // in billions
    options: {}
  },
  'dividend-presence': {
    id: 'dividend-presence',
    type: 'toggle',
    name: 'Dividend Presence',
    value: false,
    options: {}
  },
  'pe-ratio-range': {
    id: 'pe-ratio-range',
    type: 'range',
    name: 'P/E Ratio Range',
    value: { min: 5, max: 30 },
    options: {}
  },
  'ttm-earnings-growth': {
    id: 'ttm-earnings-growth',
    type: 'min',
    name: 'TTM Earnings Growth',
    value: 0,
    options: {}
  }
};

// Reuse formatMarketCap from StockCard
const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1_000_000_000_000) return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
  if (marketCap >= 1_000_000_000) return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
  if (marketCap >= 1_000_000) return `$${(marketCap / 1_000_000).toFixed(2)}M`;
  return `$${(marketCap / 1_000).toFixed(2)}K`;
};

// Compact card style for right preview area
const PreviewCard = ({ stock, onClick }: { stock: Stock, onClick?: () => void }) => (
  <div
    style={{
      background: 'white',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: 16,
      marginBottom: 16,
      cursor: 'pointer',
      border: '1px solid #f3f4f6',
      minWidth: 0
    }}
    onClick={onClick}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)' }}>{stock.companyName}</div>
        <div style={{ fontSize: 13, color: 'var(--text-medium)' }}>P/E Ratio {stock.peRatio?.toFixed(2)}</div>
        <div style={{ fontSize: 13, color: 'var(--text-medium)' }}>Market Cap {formatMarketCap(stock.marketCap)}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-dark)' }}>${stock.currentPrice?.toFixed(2)}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-medium)' }}>Dividend Yield {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}</div>
        <div style={{ fontSize: 13, color: 'var(--text-medium)' }}>Earnings Growth {stock.earningsGrowth?.toFixed(2)}%</div>
      </div>
    </div>
    <div style={{
      marginTop: 12,
      background: '#F87171',
      color: 'white',
      borderRadius: 4,
      padding: '4px 0',
      textAlign: 'center',
      fontWeight: 600
    }}>
      FutureVest Score: {stock.futureVestScore}
    </div>
  </div>
);

const StockScanner: React.FC = () => {
  // Templates state
  const templates: ScanTemplate[] = [
    {
      id: "value-stocks",
      name: "Value Stocks",
      parameters: [
        { ...PARAM_DEFS["market-cap-range"], value: { ...PARAM_DEFS["market-cap-range"].value } },
        { ...PARAM_DEFS["pe-ratio-range"], value: { ...PARAM_DEFS["pe-ratio-range"].value } }
      ]
    },
    {
      id: "high-dividend",
      name: "High Dividend",
      parameters: [
        { ...PARAM_DEFS["dividend-presence"], value: true },
        { ...PARAM_DEFS["market-cap-range"], value: { ...PARAM_DEFS["market-cap-range"].value } }
      ]
    },
    {
      id: "blue-chip",
      name: "Blue Chip",
      parameters: [
        { ...PARAM_DEFS["market-cap-range"], value: { min: 100, max: 2000 } },
        { ...PARAM_DEFS["dividend-presence"], value: true }
      ]
    },
    {
      id: "stable-income",
      name: "Stable Income",
      parameters: [
        { ...PARAM_DEFS["dividend-presence"], value: true }
      ]
    }
  ];
  const [activeTemplate, setActiveTemplate] = useState<string>("value-stocks");
  
  // Parameter categories
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "supportedFilters",
      name: "Supported Filters",
      parameters: [
        "market-cap-range",
        "dividend-presence",
        "pe-ratio-range",
        "ttm-earnings-growth"
      ]
    }
  ]);
  const [expandedCategory, setExpandedCategory] = useState<string>("supportedFilters");
  
  // Parameters state
  const [parameters, setParameters] = useState<Parameter[]>([]);
  
  // Scanner configuration state
  const [logicOperator, setLogicOperator] = useState<string>("AND");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [scanResults, setScanResults] = useState<Stock[]>([]);
  
  // Parameter configuration state (for UI controls)
  const [compareToIndustry, setCompareToIndustry] = useState<boolean>(false);
  
  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add sector options
  const sectorOptions = [
    "All",
    "Basic Materials",
    "Communication Services",
    "Consumer Cyclical",
    "Consumer Defensive",
    "Energy",
    "Financial Services",
    "Healthcare",
    "Industrials",
    "Real Estate",
    "Technology",
    "Utilities"
  ];
  const [selectedSector, setSelectedSector] = useState<string>("All");
  
  const navigate = useNavigate();
  
  // Function to add a parameter
  const addParameter = useCallback((parameterId: string) => {
    if (!parameters.some(p => p.id === parameterId)) {
      setParameters(prev => [...prev, { ...PARAM_DEFS[parameterId] }]);
    }
  }, [parameters]);
  
  // Function to remove a parameter
  const removeParameter = useCallback((parameterId: string) => {
    setParameters(prev => prev.filter(p => p.id !== parameterId));
  }, []);
  
  // Function to update a parameter
  const updateParameter = useCallback((parameterId: string, updates: Partial<Parameter>) => {
    setParameters(prev => 
      prev.map(p => 
        p.id === parameterId 
          ? { ...p, ...updates } 
          : p
      )
    );
  }, []);
  
  // Toggle category expansion
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? "" : categoryId);
  }, [expandedCategory]);
  
  // Function to select a template
  const selectTemplate = useCallback((templateId: string) => {
    setActiveTemplate(templateId);
    const found = templates.find(t => t.id === templateId);
    if (found) {
      setParameters(found.parameters.map(p => ({ ...p, value: { ...p.value } })));
    } else {
      setParameters([]);
    }
  }, []);
  
  // Helper: Convert parameters to ScanFilters
  function buildScanFilters(parameters: Parameter[]): any {
    const filters: any = {};
    parameters.forEach(param => {
      if (param.id === 'market-cap-range') {
        // Convert from billions (B) to USD
        filters.marketCapRange = [
          param.value.min * 1_000_000_000,
          param.value.max * 1_000_000_000
        ];
      } else if (param.id === 'pe-ratio-range') {
        filters.peRatioRange = [param.value.min, param.value.max];
      } else if (param.id === 'dividend-presence') {
        filters.hasDividend = param.value;
      } else if (param.id === 'ttm-earnings-growth') {
        filters.minEarningsGrowth = param.value;
      }
    });
    // Sector is a string, only add if not 'All'
    if (selectedSector && selectedSector !== 'All') {
      filters.sector = selectedSector;
    }
    return filters;
  }
  
  // Refactor runScanner to use backend
  const runScanner = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowAll(false);
    try {
      const filters = buildScanFilters(parameters);
      const results = await scanStocks(filters);
      let stocks: any[] = [];
      if (Array.isArray(results)) {
        stocks = results;
      } else if (results && typeof results === 'object' && Array.isArray((results as any).results)) {
        stocks = (results as any).results;
      }
      // Map backend fields to local Stock type
      const mapped: Stock[] = stocks.map((item: any, idx: number) => ({
        id: idx.toString(),
        ticker: item.symbol || item.ticker,  // Prefer symbol
        symbol: item.symbol || item.ticker,  // Ensure symbol field exists
        companyName: item.companyName || item.name || item.symbol || '-',
        currentPrice: item.currentPrice,
        peRatio: item.peRatio,
        dividendYield: item.dividendYield,
        marketCap: item.marketCap,
        earningsGrowth: item.earningsGrowth,
        sector: item.sector,
        futureVestScore: item.futureVestScore
      }));
      setScanResults(mapped);
      setShowResults(true);
      if (mapped.length === 0) {
        setError('No stocks match the filter criteria. Try adjusting your parameters.');
      }
    } catch (e: any) {
      setError('Scan failed. Please try again later.');
      setScanResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  }, [parameters, selectedSector]);
  
  // Reset configuration
  const resetConfiguration = useCallback(() => {
    setParameters([
      { ...PARAM_DEFS["market-cap-range"], value: { ...PARAM_DEFS["market-cap-range"].value } },
      { ...PARAM_DEFS["pe-ratio-range"], value: { ...PARAM_DEFS["pe-ratio-range"].value } }
    ]);
    setActiveTemplate("value-stocks");
    setLogicOperator("AND");
    setShowResults(false);
    setShowAll(false);
  }, []);
  
  // Save configuration
  const saveConfiguration = useCallback(() => {
    // In a real app, this would save to a database
    alert("Configuration saved!");
  }, [parameters, logicOperator]);
  
  // Get the preview results (limited to 3)
  const previewResults = scanResults.slice(0, 3);
  
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    selectTemplate("value-stocks");
  }, [selectTemplate]);
  
  return (
    <PageContainer>
      <MainContent>
        <PageHeader>
          <Heading>Stock Scanner</Heading>
          <Subheading>Build custom screens to discover investment opportunities.</Subheading>
        </PageHeader>
        
        <TemplatesSection>
          <TemplatesHeader>Scanner Templates</TemplatesHeader>
          <TemplateButtonsContainer>
            {templates.map(template => 
              activeTemplate === template.id ? (
                <ActiveTemplateButton 
                  key={template.id}
                  onClick={() => selectTemplate(template.id)}
                >
                  {template.name}
                </ActiveTemplateButton>
              ) : (
                <TemplateButton 
                  key={template.id}
                  onClick={() => selectTemplate(template.id)}
                >
                  {template.name}
                </TemplateButton>
              )
            )}
          </TemplateButtonsContainer>
        </TemplatesSection>
        
        <ThreeColumnLayout>
          {/* Parameter Categories */}
          <Panel>
            <PanelHeader>
              <PanelTitle>Parameter Categories</PanelTitle>
            </PanelHeader>
            <PanelContent>
              {categories.map(category => (
                <ParameterCategory key={category.id}>
                  <CategoryHeader onClick={() => toggleCategory(category.id)}>
                    <CategoryTitle>{category.name}</CategoryTitle>
                    <ExpandIcon expanded={expandedCategory === category.id}>
                      {expandedCategory === category.id ? "▼" : "▶"}
                    </ExpandIcon>
                  </CategoryHeader>
                  <CategoryContent expanded={expandedCategory === category.id}>
                    {category.parameters.map(paramId => {
                      // Find the parameter name based on the ID
                      const paramName = (() => {
                        switch(paramId) {
                          case "pe-ratio": return "P/E Ratio";
                          case "ps-ratio": return "P/S Ratio";
                          case "pb-ratio": return "P/B Ratio";
                          case "ev-ebitda": return "EV/EBITDA";
                          case "roe": return "Return on Equity (ROE)";
                          default: return paramId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        }
                      })();
                      
                      // Tooltip text for each filter
                      const tooltipText = (() => {
                        switch(paramId) {
                          case "market-cap-range": return "Total market value of a company's outstanding shares.";
                          case "dividend-presence": return "Indicates if the company pays dividends.";
                          case "pe-ratio-range": return "Price-to-Earnings Ratio: Share price relative to earnings per share.";
                          case "ttm-earnings-growth": return "Year-over-year growth in company earnings.";
                          default: return undefined;
                        }
                      })();
                      
                      // Check if parameter is already in use
                      const paramExists = parameters.some(p => p.id === paramId);
                      
                      return (
                        <ParameterItem key={paramId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            {paramName} {tooltipText && <span style={{ marginLeft: 6, display: 'flex', alignItems: 'center' }}><InfoTooltip text={tooltipText} /></span>}
                          </span>
                          {!paramExists && (
                            <AddButton onClick={() => addParameter(paramId)}>+</AddButton>
                          )}
                        </ParameterItem>
                      );
                    })}
                  </CategoryContent>
                </ParameterCategory>
              ))}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 500, fontSize: 15, color: 'var(--text-dark)' }}>Sector</label>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  style={{ width: '100%', marginTop: 8, padding: '8px', borderRadius: 4, border: '1px solid var(--gray-300)', fontSize: 14 }}
                >
                  {sectorOptions.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </PanelContent>
          </Panel>
          
          {/* Scanner Configuration */}
          <Panel>
            <PanelHeader>
              <PanelTitle>Scanner Configuration</PanelTitle>
            </PanelHeader>
            <PanelContent>
              {parameters.map(param => {
                if (param.id === 'market-cap-range') {
                  const min = param.value.min;
                  const max = param.value.max;
                  return (
                    <ConfigItem key={param.id}>
                      <ConfigHeader>
                        <ConfigTitle>
                          {param.name}
                          {param.id === 'market-cap-range' && <InfoTooltip text="Total market value of a company's outstanding shares." />}
                        </ConfigTitle>
                        <CloseButton onClick={() => removeParameter(param.id)}>×</CloseButton>
                      </ConfigHeader>
                      <SliderContainer>
                        <label style={{ fontSize: 13 }}>Min: ${min}B</label>
                        <input
                          type="range"
                          min={1}
                          max={max}
                          value={min}
                          onChange={e => {
                            const newMin = Math.min(Number(e.target.value), max - 1);
                            updateParameter(param.id, { value: { ...param.value, min: newMin } });
                          }}
                          style={{ width: '100%' }}
                        />
                        <label style={{ fontSize: 13, marginLeft: 8 }}>Max: ${max}B</label>
                        <input
                          type="range"
                          min={min}
                          max={2000}
                          value={max}
                          onChange={e => {
                            const newMax = Math.max(Number(e.target.value), min + 1);
                            updateParameter(param.id, { value: { ...param.value, max: newMax } });
                          }}
                          style={{ width: '100%' }}
                        />
                      </SliderContainer>
                      <Range>
                        <RangeLabel>Range: ${min}B - ${max}B</RangeLabel>
                      </Range>
                    </ConfigItem>
                  );
                }
                if (param.id === 'pe-ratio-range') {
                  const min = param.value.min;
                  const max = param.value.max;
                  return (
                    <ConfigItem key={param.id}>
                      <ConfigHeader>
                        <ConfigTitle>
                          {param.name}
                          {param.id === 'pe-ratio-range' && <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." />}
                        </ConfigTitle>
                        <CloseButton onClick={() => removeParameter(param.id)}>×</CloseButton>
                      </ConfigHeader>
                      <SliderContainer>
                        <label style={{ fontSize: 13 }}>Min: {min}</label>
                        <input
                          type="range"
                          min={0}
                          max={max}
                          value={min}
                          onChange={e => {
                            const newMin = Math.min(Number(e.target.value), max - 1);
                            updateParameter(param.id, { value: { ...param.value, min: newMin } });
                          }}
                          style={{ width: '100%' }}
                        />
                        <label style={{ fontSize: 13, marginLeft: 8 }}>Max: {max}</label>
                        <input
                          type="range"
                          min={min}
                          max={100}
                          value={max}
                          onChange={e => {
                            const newMax = Math.max(Number(e.target.value), min + 1);
                            updateParameter(param.id, { value: { ...param.value, max: newMax } });
                          }}
                          style={{ width: '100%' }}
                        />
                      </SliderContainer>
                      <Range>
                        <RangeLabel>Range: {min} - {max}</RangeLabel>
                      </Range>
                    </ConfigItem>
                  );
                }
                if (param.id === 'dividend-presence') {
                  return (
                    <ConfigItem key={param.id}>
                      <ConfigHeader>
                        <ConfigTitle>
                          {param.name}
                          {param.id === 'dividend-presence' && <InfoTooltip text="Indicates if the company pays dividends." />}
                        </ConfigTitle>
                        <CloseButton onClick={() => removeParameter(param.id)}>×</CloseButton>
                      </ConfigHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                        <label style={{ fontSize: 13 }}>Has Dividend</label>
                        <input
                          type="checkbox"
                          checked={param.value}
                          onChange={e => updateParameter(param.id, { value: e.target.checked })}
                        />
                      </div>
                    </ConfigItem>
                  );
                }
                if (param.id === 'ttm-earnings-growth') {
                  return (
                    <ConfigItem key={param.id}>
                      <ConfigHeader>
                        <ConfigTitle>
                          {param.name}
                          {param.id === 'ttm-earnings-growth' && <InfoTooltip text="Year-over-year growth in company earnings." />}
                        </ConfigTitle>
                        <CloseButton onClick={() => removeParameter(param.id)}>×</CloseButton>
                      </ConfigHeader>
                      <SliderContainer>
                        <input
                          type="range"
                          min={-50}
                          max={100}
                          value={param.value}
                          onChange={e => updateParameter(param.id, { value: Number(e.target.value) })}
                          style={{ width: '100%' }}
                        />
                      </SliderContainer>
                      <Range>
                        <RangeLabel>Min Growth: {param.value}%</RangeLabel>
                      </Range>
                    </ConfigItem>
                  );
                }
                if (param.id === "pe-ratio") {
                  // Deprecated, no longer rendered
                  return null;
                }
                if (param.id === "roe") {
                  // Deprecated, no longer rendered
                  return null;
                }
                // Generic parameter rendering for other types
                return (
                  <ConfigItem key={param.id}>
                    <ConfigHeader>
                      <ConfigTitle>{param.name}</ConfigTitle>
                      <CloseButton onClick={() => removeParameter(param.id)}>×</CloseButton>
                    </ConfigHeader>
                    <div style={{ fontSize: "14px", color: "var(--text-medium)", padding: "12px 0" }}>
                      {Array.isArray(param.value) ? '[Array]' : (typeof param.value === 'object' && param.value !== null) ? '[Object]' : String(param.value)}
                      <br />
                      Parameter configuration not implemented in this demo.
                    </div>
                  </ConfigItem>
                );
              })}
              
              <LogicControls>
                <LogicButton 
                  active={logicOperator === "AND"} 
                  onClick={() => setLogicOperator("AND")}
                  style={{ fontWeight: logicOperator === "AND" ? 600 : 400 }}
                >
                  AND
                </LogicButton>
                <LogicButton 
                  active={logicOperator === "OR"} 
                  onClick={() => setLogicOperator("OR")}
                  style={{ fontWeight: logicOperator === "OR" ? 600 : 400 }}
                >
                  OR
                </LogicButton>
                <div style={{ flex: 1 }}></div>
                <LogicButton>Group ( )</LogicButton>
                <LogicButton onClick={() => setExpandedCategory("supportedFilters")}>
                  Add Parameter
                </LogicButton>
              </LogicControls>
              
              <ButtonGroup>
                <RunButton onClick={runScanner}>Run Scanner</RunButton>
                <ActionButton onClick={saveConfiguration}>Save</ActionButton>
                <ActionButton onClick={resetConfiguration}>Reset</ActionButton>
              </ButtonGroup>
            </PanelContent>
          </Panel>
          
          {/* Results Preview */}
          <Panel>
            <PanelHeader style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <PanelTitle>Results Preview</PanelTitle>
              <button
                disabled={!scanResults || scanResults.length === 0}
                style={{
                  background: !scanResults || scanResults.length === 0 ? '#eee' : '#ede9fe',
                  color: !scanResults || scanResults.length === 0 ? '#aaa' : '#6d28d9',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: !scanResults || scanResults.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
                onClick={async()=>{
                  if(!scanResults||scanResults.length===0){return;}
                  const username = localStorage.getItem('username') || 'guest';
                  // 分组名与模板对应
                  const templateMap: Record<string, string> = {"value-stocks":"scanner1","high-dividend":"scanner2","blue-chip":"scanner3","stable-income":"scanner4"};
                  const groupName = templateMap[activeTemplate] || 'scanner1';
                  let groupId;
                  try {
                    const res = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups?username=${encodeURIComponent(username)}`);
                    const groups = await res.json();
                    let group = groups.find((g: any) => g.name === groupName);
                    if (!group) {
                      const createRes = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: groupName, username })
                      });
                      group = await createRes.json();
                    }
                    groupId = group.id;
                  } catch (e) { alert('Failed to create or get watchlist group.'); return; }
                  for(const stock of scanResults){
                    try{
                      await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${groupId}/items`,{
                        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({symbol:stock.ticker,username})
                      });
                    }catch(e){}
                  }
                  alert(`Added ${scanResults.length} stocks to watchlist "${groupName}"`);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:3}}><polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27"></polygon></svg>
                Favorite All
              </button>
            </PanelHeader>
            <PanelContent>
              {loading ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-medium)' }}>
                  Loading...
                </div>
              ) : error && scanResults.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--danger)' }}>
                  No stocks match the filter criteria.
                </div>
              ) : showResults ? (
                <>
                  {previewResults.length > 0 ? (
                    <>
                      {previewResults.map((stock) => (
                        <div key={stock.id} style={{ marginBottom: 16 }}>
                          <PreviewCard 
                            stock={stock} 
                            onClick={() => navigate(`/stock/${stock.symbol}?timeframe=1d&chart=candlestick`)}
                          />
                        </div>
                      ))}
                      {scanResults.length > 3 && (
                        <div style={{ marginTop: "16px", fontSize: "14px", color: "var(--text-medium)" }}>
                          + {scanResults.length - 3} more stocks
                        </div>
                      )}
                      <ViewAllButton onClick={() => setShowAll(true)}>View All Results</ViewAllButton>
                    </>
                  ) : (
                    <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-medium)" }}>
                      No stocks match your criteria. Try adjusting your parameters.
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: "24px 0", textAlign: "center", color: "var(--text-medium)" }}>
                  Run the scanner to see matching stocks.
                </div>
              )}
            </PanelContent>
          </Panel>
        </ThreeColumnLayout>
        
        {showResults && scanResults.length > 0 && (
          <ResultsFooter>
            <MatchCount>{scanResults.length} stocks match your criteria</MatchCount>
          </ResultsFooter>
        )}
        {showAll && showResults && scanResults.length > 0 && (
          <div
            style={{
              margin: '32px 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {scanResults.map((stock) => (
              <PreviewCard
                key={stock.id}
                stock={stock}
                onClick={() => navigate(`/stock/${stock.symbol}?timeframe=1d&chart=candlestick`)}
              />
            ))}
          </div>
        )}
      </MainContent>
    </PageContainer>
  );
};

export default StockScanner;
