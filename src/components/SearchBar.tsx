import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { searchStocks } from '../services/stockService';
import { Stock } from '../types/stock';

interface SearchBarProps {
  onSelectStock: (stock: Stock) => void;
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  font-size: 1rem;
  border: 2px solid #e1e4e8;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f2f6;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }
`;

const StockSymbol = styled.span`
  font-weight: bold;
  color: #2c3e50;
  margin-right: 8px;
`;

const StockName = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #7f8c8d;
`;

const SearchBar: React.FC<SearchBarProps> = ({ onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const stocks = await searchStocks(query);
        setResults(stocks);
      } catch (error) {
        console.error('Error searching stocks:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectStock = (stock: Stock) => {
    onSelectStock(stock);
    setQuery(`${stock.ticker} - ${stock.companyName}`);
    setShowResults(false);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Search by ticker symbol or company name"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />
      
      {showResults && (
        <SearchResults>
          {loading ? (
            <NoResults>Loading...</NoResults>
          ) : results.length > 0 ? (
            results.map((stock) => (
              <SearchResultItem
                key={stock.id}
                onMouseDown={() => handleSelectStock(stock)}
              >
                <StockSymbol>{stock.ticker}</StockSymbol>
                <StockName>{stock.companyName}</StockName>
              </SearchResultItem>
            ))
          ) : query.trim().length >= 2 ? (
            <NoResults>No results found</NoResults>
          ) : null}
        </SearchResults>
      )}
    </SearchContainer>
  );
};

export default SearchBar; 