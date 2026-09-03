import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MiniChart from '../components/MiniChart';
import { searchStocks, scanStocks, getTooltips } from '../services/stockService';
import { Stock, ScanFilters } from '../types/stock';
import InfoTooltip from '../components/InfoTooltip';
import { API_HOSTS } from '../config';
import StockCard from '../components/StockCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PageContainer = styled.div`
  background-color: var(--gray-ultralight);
  padding: 30px;
  min-height: calc(100vh - 130px);
`;

const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
`;

const PageHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
  transition: all 0.2s;
  background-color: var(--gray-ultralight);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.1);
    background-color: white;
  }
  
  &::placeholder {
    color: var(--gray-medium);
  }
`;

const FiltersAndResults = styled.div`
  display: flex;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Filters = styled.div`
  width: 280px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterHeading = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 16px 0;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray-ultralight);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-medium);
  margin-bottom: 12px;
`;

const FilterChip = styled.div<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.active ? 'var(--primary-ultralight)' : 'var(--gray-ultralight)'};
  border-radius: 16px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 13px;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-medium)'};
  transition: all 0.15s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-ultralight)' : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-1px);
  }
`;

const SliderContainer = styled.div`
  margin-bottom: 16px;
  padding: 0 4px;
`;

const RangeSlider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: linear-gradient(to right, var(--primary-light), var(--primary-color));
  border-radius: 2px;
  outline: none;
  margin: 10px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transition: all 0.15s;
    
    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transition: all 0.15s;
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-medium);
`;

const Button = styled.button`
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: var(--text-medium);
  border: 1px solid var(--gray-light);
  margin-top: 8px;
  
  &:hover {
    background-color: var(--gray-ultralight);
  }
`;

const ResultsContainer = styled.div`
  flex: 1;
`;

const ResultsControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
`;

const ViewToggleButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-medium)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--gray-light)'};
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  
  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  
  &:last-child {
    border-radius: 0 6px 6px 0;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--gray-ultralight)'};
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  background-color: white;
  color: var(--text-medium);
  border: 1px solid var(--gray-light);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: var(--gray-ultralight);
    color: var(--text-dark);
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const ChartContainer = styled.div`
  height: 40px;
  margin: 12px -16px;
`;

const CardFooter = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const CardButton = styled.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const PrimaryCardButton = styled(CardButton)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--primary-dark);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryCardButton = styled(CardButton)`
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  
  &:hover {
    background-color: var(--primary-ultralight);
  }
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-dark);
  background-color: var(--gray-ultralight);
  border-bottom: 1px solid var(--gray-light);
  font-size: 13px;
`;

const TableRow = styled.tr`
  transition: all 0.15s;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-ultralight);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-ultralight);
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: var(--text-dark);
`;

const ActionIconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-medium);
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: 4px;
  
  &:hover {
    background-color: var(--gray-ultralight);
    color: var(--primary-color);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const PaginationInfo = styled.div`
  font-size: 13px;
  color: var(--text-medium);
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 6px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-medium)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--gray-light)'};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--gray-ultralight)'};
  }
`;

const getUsername = () => localStorage.getItem('username') || 'guest';


const mockStocks = [
  {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 192.32,
    changePercent: 1.23,
    logo: 'https://logo.clearbit.com/apple.com',
    sector: 'Technology'
  },
  {
    ticker: 'MSFT',
    companyName: 'Microsoft Corp.',
    currentPrice: 340.15,
    changePercent: -0.85,
    logo: 'https://logo.clearbit.com/microsoft.com',
    sector: 'Technology'
  },
  {
    ticker: 'TSLA',
    companyName: 'Tesla Inc.',
    currentPrice: 720.50,
    changePercent: 2.11,
    logo: 'https://logo.clearbit.com/tesla.com',
    sector: 'Auto Manufacturers'
  },
  {
    ticker: 'AMZN',
    companyName: 'Amazon.com Inc.',
    currentPrice: 135.22,
    changePercent: 0.67,
    logo: 'https://logo.clearbit.com/amazon.com',
    sector: 'Internet Retail'
  },
  {
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    currentPrice: 2750.10,
    changePercent: -1.02,
    logo: 'https://logo.clearbit.com/google.com',
    sector: 'Internet Services'
  }
];

const StockSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for filters
  const [marketCapRange, setMarketCapRange] = useState<[number, number]>([1, 100]);
  const [peRatioRange, setPeRatioRange] = useState<[number, number]>([0, 50]);
  const [minScoreRange, setMinScoreRange] = useState<[number, number]>([0, 100]);
  const [earningsGrowthRange, setEarningsGrowthRange] = useState<[number, number]>([-20, 50]);
  
  // State for view and sorting
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // State for tooltips
  const [tooltips, setTooltips] = useState<Record<string, string>>({});

  // State for adding to watchlist
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);

  // State for initial stocks
  const [initialStocks, setInitialStocks] = useState<Stock[]>([]);

  // State for all stocks
  const [allStocks, setAllStocks] = useState<Stock[]>([]);

  // State for filterActive
  const [filterActive, setFilterActive] = useState(false);

  // Fetch tooltips from backend on mount
  useEffect(() => {
    getTooltips().then(setTooltips).catch(() => {});
  }, []);

  // Function to download searchResults as CSV
  const exportAsCSV = useCallback(() => {
    if (searchResults.length === 0) return;
    
    // Create headers
    const headers = ['Symbol', 'Name', 'Price', 'Change', 'Market Cap', 'P/E Ratio', 'Score'];
    
    // Create rows data
    const data = searchResults.map(stock => [
      stock.ticker,
      stock.companyName,
      stock.currentPrice?.toFixed(2) || 'N/A',
      stock.priceChange ? `${stock.priceChange > 0 ? '+' : ''}${stock.priceChange.toFixed(2)}%` : 'N/A',
      `$${(stock.marketCap / 1000000000).toFixed(2)}B`,
      stock.peRatio.toFixed(2),
      stock.futureVestScore
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_search_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [searchResults]);

  // Function to save search as a watchlist
  const saveAsWatchlist = useCallback(() => {
    if (searchResults.length === 0) return;
    
    // In a real app, would call an API to save this as a watchlist
    alert(`Saved ${searchResults.length} stocks to a new watchlist`);
  }, [searchResults]);
  
  // Effect to initialize search results
  useEffect(() => {
    (async () => {
      try {
        const all = await scanStocks({
          marketCapRange: [0, 2_000_000_000_000],
          peRatioRange: [0, 100],
          minEarningsGrowth: -20
        });
        setAllStocks(all);
        setInitialStocks(all.slice(0, 10));
        setSearchResults(all.slice(0, 10));
      } catch (e) {
        setAllStocks([]);
        setInitialStocks([]);
        setSearchResults([]);
      }
    })();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  // Handle search submission
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query) {
      setLoading(true);
      try {
        const results = await searchStocks(query);
        setSearchResults(results);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {

      setSearchResults(allStocks);
    }
    setCurrentPage(1);
  };
  
  // Handle filter application
  const applyFilters = () => {
    setFilterActive(true);
  };
  
  // Handle filter reset
  const resetFilters = () => {
    setFilterActive(false);
    setMarketCapRange([1, 100]);
    setPeRatioRange([0, 50]);
    setMinScoreRange([0, 100]);
    setEarningsGrowthRange([-20, 50]);
    setCurrentPage(1);
    setLoading(true);
    (async () => {
      try {
        const filters: ScanFilters = {
          marketCapRange: [1 * 1e9, 100 * 1e9],
          peRatioRange: [0, 50],
          minEarningsGrowth: -20,
        };
        console.log('resetFilters filters:', filters);
        const results = await scanStocks(filters);
        setSearchResults(results);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    })();
  };
  
  // Get or create default watchlist group
  const getOrCreateDefaultWatchlistGroup = async () => {
    const username = getUsername();
    // Get all groups
    const res = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups?username=${encodeURIComponent(username)}`);
    const groups = await res.json();
    let group = groups.find((g: any) => g.name === 'stock search' || g.name === 'Default' || g.name === 'My Watchlist');
    if (!group) {
      // If not found, create
      const createRes = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'stock search', username })
      });
      group = await createRes.json();
    }
    return group.id;
  };

  const handleAddToWatchlist = async (symbol: string) => {
    setAdding(symbol);
    try {
      const username = getUsername();
      const groupId = await getOrCreateDefaultWatchlistGroup();
      await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${groupId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, username })
      });
      setAdded(prev => [...prev, symbol]);
    } catch (e) {
      alert('Add to watchlist failed, please try again');
    } finally {
      setAdding(null);
    }
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(searchResults.length / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Navigation to stock detail page
  const navigateToStockDetail = (symbol: string) => {
    console.log(`Navigating to stock details for ${symbol}`);
    navigate(`/stock/${symbol}`);
  };
  

  const handleViewModeChange = (mode: 'grid' | 'table') => {
    setViewMode(mode);
    applyFilters();
  };
  
  // Get filtered stocks based on filterActive
  const getFilteredStocks = () => {
    const base = query ? searchResults : allStocks;
    let filtered = base;
    if (filterActive) {
      const [capMin, capMax] = marketCapRange;
      const [peMin, peMax] = peRatioRange;
      const [scoreMin, scoreMax] = minScoreRange;
      const [growthMin, growthMax] = earningsGrowthRange;
      filtered = base.filter(stock =>
        stock.marketCap >= capMin * 1e9 && stock.marketCap <= capMax * 1e9 &&
        stock.peRatio >= peMin && stock.peRatio <= peMax &&
        stock.futureVestScore >= scoreMin && stock.futureVestScore <= scoreMax &&
        stock.earningsGrowth >= growthMin && stock.earningsGrowth <= growthMax
      );
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'score':
          comparison = a.futureVestScore - b.futureVestScore;
          break;
        case 'price':
          comparison = (a.currentPrice || 0) - (b.currentPrice || 0);
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'change':
          comparison = (a.priceChange || 0) - (b.priceChange || 0);
          break;
        case 'symbol':
          comparison = a.ticker.localeCompare(b.ticker);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  return (
    <PageContainer>
      <MainContent>
        <PageHeader>
          <Heading>Stock Search</Heading>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <SearchInput 
              placeholder="Search by symbol, company name, or industry..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{
                background: '#6d28d9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500',
                fontSize: '14px',
                minWidth: '80px',
                height: '44px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5b21b6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#6d28d9';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="21 21l-4.35-4.35"/>
              </svg>
              Search
            </button>
          </form>
        </PageHeader>
        
        <FiltersAndResults>
          <Filters>
            <FilterHeading>Filters</FilterHeading>
            
            {filterActive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px 0' }}>
                <span style={{ background: '#ede9fe', color: '#6d28d9', borderRadius: 16, padding: '4px 16px', fontWeight: 500, fontSize: 14 }}>
                  Filter On
                </span>
                <button
                  style={{ background: 'none', border: 'none', color: '#6d28d9', fontSize: 18, cursor: 'pointer', marginLeft: 4 }}
                  onClick={resetFilters}
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </div>
            )}
            
            <FilterSection>
              <FilterLabel>
                Market Cap <InfoTooltip text="Total market value of a company's outstanding shares." />
              </FilterLabel>
              <SliderContainer>
                <Slider
                  range
                  min={1}
                  max={5000}
                  value={marketCapRange}
                  onChange={val => {
                    setMarketCapRange(val as [number, number]);
                    if (!filterActive) setFilterActive(true);
                    applyFilters();
                  }}
                />
                <SliderLabels>
                  <span>${marketCapRange[0]}B</span>
                  <span>${marketCapRange[1]}B</span>
                </SliderLabels>
              </SliderContainer>
            </FilterSection>
            
            <FilterSection>
              <FilterLabel>
                FutureVest Score <InfoTooltip text="A proprietary score indicating overall investment quality." />
              </FilterLabel>
              <SliderContainer>
                <Slider
                  range
                  min={0}
                  max={100}
                  value={minScoreRange}
                  onChange={val => {
                    setMinScoreRange(val as [number, number]);
                    if (filterActive) applyFilters();
                  }}
                />
                <SliderLabels>
                  <span>{minScoreRange[0]}</span>
                  <span>{minScoreRange[1]}</span>
                </SliderLabels>
              </SliderContainer>
            </FilterSection>
            
            <FilterSection>
              <FilterLabel>
                P/E Ratio
                <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." />
              </FilterLabel>
              <SliderContainer>
                <Slider
                  range
                  min={0}
                  max={200}
                  value={peRatioRange}
                  onChange={val => {
                    setPeRatioRange(val as [number, number]);
                    if (filterActive) applyFilters();
                  }}
                />
                <SliderLabels>
                  <span>{peRatioRange[0]}</span>
                  <span>{peRatioRange[1]}</span>
                </SliderLabels>
              </SliderContainer>
            </FilterSection>
            
            <FilterSection>
              <FilterLabel>
                Earnings Growth
                <InfoTooltip text="Year-over-year growth in company earnings." />
              </FilterLabel>
              <SliderContainer>
                <Slider
                  range
                  min={-50}
                  max={100}
                  value={earningsGrowthRange}
                  onChange={val => {
                    setEarningsGrowthRange(val as [number, number]);
                    if (filterActive) applyFilters();
                  }}
                />
                <SliderLabels>
                  <span>{earningsGrowthRange[0]}</span>
                  <span>{earningsGrowthRange[1]}</span>
                </SliderLabels>
              </SliderContainer>
            </FilterSection>
          </Filters>
          
          <ResultsContainer>
            <ResultsControls>
              <ViewToggle>
                <ViewToggleButton 
                  active={viewMode === 'grid'}
                  onClick={() => handleViewModeChange('grid')}
                >
                  Grid
                </ViewToggleButton>
                <ViewToggleButton
                  active={viewMode === 'table'} 
                  onClick={() => handleViewModeChange('table')}
                >
                  Table
                </ViewToggleButton>
              </ViewToggle>
              
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button
                  style={{
                    background:'#ede9fe',color:'#6d28d9',border:'none',borderRadius:8,padding:'8px 20px',fontWeight:600,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',gap:8
                  }}
                  onClick={async()=>{
                    if(!query||!query.trim()){
                      alert('Please enter a search keyword to use batch favorite.');
                      return;
                    }
                    const username = getUsername();

                    let groupId;
                    try {
                      const res = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups?username=${encodeURIComponent(username)}`);
                      let group = await res.json();
                      if(!group || group.name !== query){
                        const createRes = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups`,{
                          method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:query,username})
                        });
                        group = await createRes.json();
                      }
                      groupId = group.id;
                    }catch(e){alert('Failed to create or get watchlist group.');return;}

                    const stocks = getFilteredStocks();
                    for(const stock of stocks){
                      try{
                        await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${groupId}/items`,{
                          method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({symbol:stock.ticker,username})
                        });
                      }catch(e){}
                    }
                    alert(`Added ${stocks.length} stocks to watchlist "${query}"`);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4}}><polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27"></polygon></svg>
                  Favorite All
                </button>
              </div>
            </ResultsControls>
            
            {loading ? (
              <div>Loading...</div>
            ) : getFilteredStocks().length === 0 ? (
              <>
                <div style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: 32,
                  margin: '32px 0 16px 0',
                  textAlign: 'center',
                  color: '#7f8c8d',
                  fontSize: 18,
                  fontWeight: 500
                }}>
                  No stocks match your criteria. Showing default results below.
                </div>
                {viewMode === 'grid' ? (
                  <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 0 }}>
                    {initialStocks.map(stock => (
                      <div key={stock.ticker} style={{ width: 320 }}>
                        <StockCard stock={stock} onClick={() => navigateToStockDetail(stock.ticker)} onAddToWatchlist={handleAddToWatchlist} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ResultsTable>
                    <thead>
                      <tr>
                        <TableHeader>Symbol</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Price</TableHeader>
                        <TableHeader>Change</TableHeader>
                        <TableHeader>Market Cap <InfoTooltip text="Total market value of a company's outstanding shares." /></TableHeader>
                        <TableHeader>P/E Ratio <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." /></TableHeader>
                        <TableHeader>Earnings Growth <InfoTooltip text="Year-over-year growth in company earnings." /></TableHeader>
                        <TableHeader>Score</TableHeader>
                        <TableHeader>Actions</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {initialStocks.map((stock) => (
                        <TableRow key={stock.id}>
                          <TableCell>{stock.ticker}</TableCell>
                          <TableCell>{stock.companyName}</TableCell>
                          <TableCell>${stock.currentPrice?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell>
                            {stock.priceChange ? `${stock.priceChange > 0 ? '+' : ''}${stock.priceChange.toFixed(2)}%` : 'N/A'}
                          </TableCell>
                          <TableCell>${(stock.marketCap / 1000000000).toFixed(2)}B</TableCell>
                          <TableCell>{stock.peRatio.toFixed(2)}</TableCell>
                          <TableCell>{stock.futureVestScore}</TableCell>
                          <TableCell>
                            <ActionIconButton onClick={() => navigateToStockDetail(stock.ticker)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </ActionIconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </ResultsTable>
                )}
              </>
            ) : viewMode === 'grid' ? (
              <ResultsGrid>
                {currentItems.map((stock) => (
                  <div key={stock.ticker} style={{ width: 320 }}>
                    <StockCard stock={stock} onClick={() => navigateToStockDetail(stock.ticker)} onAddToWatchlist={handleAddToWatchlist} />
                  </div>
                ))}
              </ResultsGrid>
            ) : (
              <ResultsTable>
                <thead>
                  <tr>
                    <TableHeader>Symbol</TableHeader>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader>Change</TableHeader>
                    <TableHeader>Market Cap <InfoTooltip text="Total market value of a company's outstanding shares." /></TableHeader>
                    <TableHeader>P/E Ratio <InfoTooltip text="Price-to-Earnings Ratio: Share price relative to earnings per share." /></TableHeader>
                    <TableHeader>Earnings Growth <InfoTooltip text="Year-over-year growth in company earnings." /></TableHeader>
                    <TableHeader>Score</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.ticker}</TableCell>
                      <TableCell>{stock.companyName}</TableCell>
                      <TableCell>${stock.currentPrice?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>
                        {stock.priceChange ? `${stock.priceChange > 0 ? '+' : ''}${stock.priceChange.toFixed(2)}%` : 'N/A'}
                      </TableCell>
                      <TableCell>${(stock.marketCap / 1000000000).toFixed(2)}B</TableCell>
                      <TableCell>{stock.peRatio.toFixed(2)}</TableCell>
                      <TableCell>{stock.futureVestScore}</TableCell>
                      <TableCell>
                        <ActionIconButton onClick={() => navigateToStockDetail(stock.ticker)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </ActionIconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </ResultsTable>
            )}
            
            {getFilteredStocks().length > 0 && (
              <Pagination>
                <PaginationInfo>
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, getFilteredStocks().length)} of {getFilteredStocks().length} results
                </PaginationInfo>
                <PaginationControls>
                  {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map((number) => (
                    <PaginationButton 
                      key={number}
                      active={currentPage === number}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </PaginationButton>
                  ))}
                  {pageCount > 5 && currentPage < pageCount && (
                    <PaginationButton onClick={() => handlePageChange(currentPage + 1)}>
                      Next
                    </PaginationButton>
                  )}
                </PaginationControls>
              </Pagination>
            )}
          </ResultsContainer>
        </FiltersAndResults>
      </MainContent>
    </PageContainer>
  );
};

export default StockSearch;
