// components/AddToWatchlistButton.tsx
import React, { useState, useContext } from 'react';
import { Stock } from '../types/stock';
import { API_HOSTS } from '../config';
import axios from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';

interface Props {
  stock: Stock;
}

const AddToWatchlistButton: React.FC<Props> = ({ stock }) => {
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const { username: contextUsername } = useContext(AuthContext);
  const username = contextUsername || localStorage.getItem('username') || 'guest';

  // 查找或创建默认分组
  const getOrCreateDefaultWatchlistGroup = async () => {
    const res = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups?username=${encodeURIComponent(username)}`);
    const groups = await res.json();
    let group = groups.find((g: any) => g.name === 'stock search' || g.name === 'Default' || g.name === 'My Watchlist');
    if (!group) {
      const createRes = await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'stock search', username })
      });
      group = await createRes.json();
    }
    return group.id;
  };

  const handleClick = async () => {
    if (adding || added) return;
    setAdding(true);
    try {
      const groupId = await getOrCreateDefaultWatchlistGroup();
      await fetch(`${API_HOSTS.watchlist}/api/watchlist/groups/${groupId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: stock.ticker, username })
      });
      setAdded(true);
    } catch (err) {
      alert('Failed to add to watchlist');
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: added ? '#4CAF50' : 'var(--purple-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
      }}
      disabled={adding || added}
    >
      {added ? 'Added' : (adding ? 'Adding...' : 'Add to Watchlist')}
    </button>
  );
};

export default AddToWatchlistButton;
