import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MiniChart from '../components/MiniChart';
import SearchBar from '../components/SearchBar';
import { Stock } from '../types/stock';
import StockCard from '../components/StockCard';
import { searchStocks, getStockDetails } from '../services/stockService';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';
import { API_HOSTS } from '../config';

const PageContainer = styled.div`
  background-color: white;
  padding: 30px;
  min-height: calc(100vh - 130px);
`;

const MainContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

// Updated with purple color scheme to match design
const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid var(--gray-light);
  padding: 24px 0;
  margin-bottom: 24px;
  box-shadow: none;
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const Subheading = styled.p`
  font-size: 15px;
  color: var(--text-medium);
  margin: 0;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: 24px;
  overflow-x: auto;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? 'var(--purple-primary)' : 'var(--text-medium)'};
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${props => props.active ? 'var(--purple-primary)' : 'transparent'};
  }
  
  &:hover {
    color: var(--purple-primary);
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 280px;
`;

// Custom styled SearchInput to match the Purple theme
const StyledSearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid var(--gray-light);
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--purple-light);
    box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.1);
  }
`;

const CreateWatchlistButton = styled.button`
  background-color: var(--purple-primary);
  color: var(--white);
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--purple-dark);
    box-shadow: 0 4px 8px rgba(109, 40, 217, 0.2);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: var(--white);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid var(--gray-light);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid var(--purple-primary);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(109, 40, 217, 0.1);
  }
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StockInfo = styled.div``;

const StockSymbol = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--purple-primary);
  margin: 0 0 4px 0;
`;

const StockName = styled.p`
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
`;

const ScoreCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--purple-ultralight);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: var(--purple-primary);
  border: 2px solid var(--purple-light);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricItem = styled.div``;

const MetricLabel = styled.div`
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
`;

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: var(--text-dark);
`;

const ChangeValue = styled.span<{ positive: boolean }>`
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};
  font-weight: 500;
  margin-left: 6px;
`;

const ChartContainer = styled.div`
  height: 40px;
  margin-bottom: 16px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CardButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const PrimaryButton = styled(CardButton)`
  background-color: var(--purple-ultralight);
  color: var(--purple-primary);
  border: 1px solid var(--purple-light);
  
  &:hover {
    background-color: var(--purple-light);
    color: var(--purple-dark);
  }
`;

const SecondaryButton = styled(CardButton)`
  background-color: var(--white);
  color: var(--text-medium);
  border: 1px solid var(--gray-light);
  
  &:hover {
    background-color: var(--gray-light);
  }
`;

const EmptyState = styled.div`
  background-color: var(--white);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  border: 1px solid var(--gray-light);
`;

const EmptyStateTitle = styled.h3`
  font-size: 18px;
  color: var(--text-dark);
  margin-bottom: 12px;
`;

const EmptyStateText = styled.p`
  font-size: 14px;
  color: var(--text-medium);
  margin-bottom: 24px;
`;

// Update SearchBar styles to match the purple theme
const StyledSearchBar = styled(SearchBar)`
  input {
    border: 1px solid var(--gray-light);
    
    &:focus {
      border-color: var(--purple-light);
      box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.1);
    }
  }
  
  div[role="listbox"] div:hover {
    background-color: var(--purple-ultralight);
  }
`;

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

interface WatchlistItem {
  id: number;
  symbol: string;
}

interface WatchlistGroup {
  id: number;
  name: string;
  items: WatchlistItem[];
}

const Watchlist: React.FC = () => {
  const [groups, setGroups] = useState<WatchlistGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [addSymbol, setAddSymbol] = useState('');
  const [renamingGroupId, setRenamingGroupId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [groupStockDetails, setGroupStockDetails] = useState<Record<number, Stock[]>>({});
  const navigate = useNavigate();

  const getUsername = () => localStorage.getItem('username') || '';

  // Fetch all groups
  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      if (response.ok) {
        setGroups(data);
        if (data.length > 0 && !activeGroupId) setActiveGroupId(data[0].id);
        if (data.length === 0) setActiveGroupId(null);
      } else {
        setError(data.error || 'Failed to fetch watchlists');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, []);

  // Create new group
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newGroupName.trim(), username })
      });
      const data = await response.json();
      if (response.ok) {
        setNewGroupName('');
        fetchGroups();
      } else {
        setError(data.error || 'Failed to create watchlist');
      }
    } catch (e) {
      setError('Network error');
    }
  };

  // Rename group
  const handleRenameGroup = async (groupId: number) => {
    if (!renameValue.trim()) return;
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: renameValue.trim(), username })
      });
      const data = await response.json();
      if (response.ok) {
        setRenamingGroupId(null);
        setRenameValue('');
        fetchGroups();
      } else {
        setError(data.error || 'Failed to rename watchlist');
      }
    } catch (e) {
      setError('Network error');
    }
  };

  // Delete group
  const handleDeleteGroup = async (groupId: number) => {
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${groupId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await response.json();
      if (response.ok) {
        if (activeGroupId === groupId) setActiveGroupId(null);
        fetchGroups();
      } else {
        setError(data.error || 'Failed to delete watchlist');
      }
    } catch (e) {
      setError('Network error');
    }
  };

  // Batch fetch all stock details for current group
  useEffect(() => {
    const fetchDetails = async () => {
      if (!activeGroup || activeGroup.items.length === 0) {
        setGroupStockDetails(prev => ({ ...prev, [activeGroupId || 0]: [] }));
        return;
      }
      const details = await Promise.all(
        activeGroup.items.map(async item => {
          try {
            return await getStockDetails(item.symbol);
          } catch (e) {
            // Optionally log error: console.warn('Failed to fetch details for', item.symbol, e);
            return null; // Skip this stock
          }
        })
      );
      setGroupStockDetails(prev => ({ ...prev, [activeGroupId || 0]: details.filter(Boolean) as Stock[] }));
    };
    if (activeGroupId) fetchDetails();
  }, [activeGroupId, groups]);

  // Stock search autocomplete
  const handleSearchSymbol = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddSymbol(e.target.value.toUpperCase());
    if (e.target.value.trim().length > 0) {
      try {
        const results = await searchStocks(e.target.value.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Select search result
  const handleSelectStock = (stock: Stock) => {
    setAddSymbol(stock.ticker);
    setSelectedStock(stock);
    setSearchResults([]);
  };

  // Add stock to group
  const handleAddStock = async () => {
    if (!addSymbol.trim() || !activeGroupId) return;
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${activeGroupId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: addSymbol.trim().toUpperCase(), username })
      });
      const data = await response.json();
      if (response.ok) {
        setAddSymbol('');
        fetchGroups();
      } else {
        setError(data.error || 'Failed to add stock');
      }
    } catch (e) {
      setError('Network error');
    }
  };

  // Remove stock from group
  const handleRemoveStock = async (symbol: string) => {
    if (!activeGroupId) return;
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${activeGroupId}/items/${symbol}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await response.json();
      if (response.ok) {
        fetchGroups();
      } else {
        setError(data.error || 'Failed to remove stock');
      }
    } catch (e) {
      setError('Network error');
    }
  };

  // Currently active group
  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  const handleAddStockFromDropdown = async (symbol: string) => {
    if (!symbol.trim() || !activeGroupId) return;
    setError(null);
    try {
      const username = getUsername();
      const response = await authFetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${activeGroupId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol: symbol.trim().toUpperCase(), username })
      });
      const data = await response.json();
      if (response.ok) {
        fetchGroups();
      } else {
        setError(data.error || 'Failed to add stock');
      }
    } catch (e) {
      setError('Network error');
    }
  };

  return (
    <PageContainer>
      <MainContent>
        <PageHeader>
          <Heading>My Watchlists</Heading>
          <Subheading>Manage your custom stock watchlists.</Subheading>
        </PageHeader>
        <TabsContainer>
          {groups.map(group => (
            <Tab
              key={group.id}
              active={activeGroupId === group.id}
              onClick={() => setActiveGroupId(group.id)}
            >
              {renamingGroupId === group.id ? (
                <>
                  <input
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    style={{ width: 100, marginRight: 4 }}
                  />
                  <button onClick={() => handleRenameGroup(group.id)}>Save</button>
                  <button onClick={() => setRenamingGroupId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {group.name}
                  <span style={{ marginLeft: 8, cursor: 'pointer', color: '#888' }} onClick={e => { e.stopPropagation(); setRenamingGroupId(group.id); setRenameValue(group.name); }}>✏️</span>
                  <span style={{ marginLeft: 4, cursor: 'pointer', color: '#888' }} onClick={e => { e.stopPropagation(); handleDeleteGroup(group.id); }}>🗑️</span>
                </>
              )}
            </Tab>
          ))}
          <Tab active={false} onClick={() => setActiveGroupId(null)}>
            + New Watchlist
          </Tab>
        </TabsContainer>
        {activeGroupId === null ? (
          <ActionBar>
            <input
              type="text"
              placeholder="Watchlist name"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '200px' }}
            />
            <CreateWatchlistButton onClick={handleCreateGroup} style={{ marginLeft: 8 }}>
              <PlusIcon /> Create Watchlist
            </CreateWatchlistButton>
          </ActionBar>
        ) : (
          <ActionBar>
            <div style={{ position: 'relative', width: 240, display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Add stock symbol or name"
                value={addSymbol}
                onChange={handleSearchSymbol}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
              />
              {(addSymbol.trim().length > 0 && searchResults.length > 0) && (
                <div style={{ position: 'absolute', top: 40, left: 0, right: 0, background: '#fff', border: '1px solid #eee', zIndex: 10, borderRadius: 6 }}>
                  {searchResults.map(stock => (
                    <div key={stock.ticker} style={{ padding: 8, cursor: 'pointer' }} onClick={() => { setAddSymbol(''); setSearchResults([]); setSelectedStock(null); handleAddStockFromDropdown(stock.ticker); }}>
                      {stock.ticker} - {stock.companyName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ActionBar>
        )}
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : groups.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>No Watchlists</EmptyStateTitle>
            <EmptyStateText>Create your first watchlist to start tracking stocks.</EmptyStateText>
          </EmptyState>
        ) : activeGroup && (groupStockDetails[activeGroupId || 0]?.length === 0) ? (
          <EmptyState>
            <EmptyStateTitle>No Stocks</EmptyStateTitle>
            <EmptyStateText>Add stocks to your watchlist to see them here.</EmptyStateText>
          </EmptyState>
        ) : (
          <WatchlistGrid>
            {groupStockDetails[activeGroupId || 0]?.map((stock) => (
              <div key={stock.ticker}>
                <StockCard
                  stock={stock}
                  onClick={() => navigate(`/stock/${stock.ticker}?timeframe=1d&chart=candlestick`)}
                />
                <SecondaryButton onClick={() => handleRemoveStock(stock.ticker)} style={{ marginTop: 8 }}>
                  <TrashIcon /> Remove
                </SecondaryButton>
              </div>
            ))}
          </WatchlistGrid>
        )}
      </MainContent>
    </PageContainer>
  );
};

export default Watchlist;
