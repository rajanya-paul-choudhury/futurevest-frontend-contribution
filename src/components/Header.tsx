import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 70px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  z-index: 100;
`;

const SearchBarContainer = styled.div`
  position: relative;
  margin-right: auto;
  width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 0 15px;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #ddd;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconLink = styled(Link)`
  background: transparent;
  border: none;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 2px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #666;
  cursor: pointer;
`;

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };

    if (onSearch) {
      onSearch(target.search.value);
    } else {
      navigate(`/search?query=${encodeURIComponent(target.search.value)}`);
    }
  };

  return (
    <HeaderContainer>
      <SearchBarContainer>
        <form onSubmit={handleSearch}>
          <SearchInput
            name="search"
            placeholder="Search stocks, metrics, or learn..."
            aria-label="Search"
          />
        </form>
      </SearchBarContainer>

      <UserSection>
        <IconLink to="/notifications" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
            <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" clipRule="evenodd" />
          </svg>
        </IconLink>

        <IconLink to="/account" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
          </svg>
        </IconLink>

        <Link to="/account"> 
          <UserAvatar>SG</UserAvatar>
        </Link>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
