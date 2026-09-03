import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface NavigationItem {
  path?: string;
  label?: string;
  icon?: React.ReactNode;
  section?: string;
}

const NavContainer = styled.div`
  position: fixed;
  top: 130px; /* Match exactly to the total height of both navbars */
  left: 0;
  width: 240px; /* Match exactly to the value in App.css */
  height: calc(100vh - 130px);
  background-color: var(--white);
  border-right: 1px solid var(--gray-light);
  padding: 20px 0;
  overflow-y: auto;
  z-index: 100;
`;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 16px; /* Reduced padding */
  margin: 20px 0 6px; /* Reduced margin */
`;

const NavItemContainer = styled(motion.div)`
  position: relative;
`;

const NavItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px; /* Reduced gap */
  padding: 10px 16px; /* Reduced padding */
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-medium)'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: var(--primary-color);
    background-color: var(--primary-ultralight);
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 0 4px 4px 0;
`;

const IconWrapper = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-light)'};
  transition: all 0.2s ease;
`;

const NavBadge = styled.span`
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const navigationItems: NavigationItem[] = [
    { 
      path: '/dashboard', 
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      )
    },
    { section: 'Market Analysis' },
    { 
      path: '/stock-search', 
      label: 'Stock Search',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    },
    { 
      path: '/stock-scanner', 
      label: 'Stock Scanner',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      )
    },
    { 
      path: '/watchlist', 
      label: 'Watchlists',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    { 
      path: '/alerts', 
      label: 'Alerts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    },
    { section: 'Research Tools' },
    { 
      path: '/valuation-models', 
      label: 'Valuation Models',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    { 
      path: '/comparison', 
      label: 'Peer Comparison',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 18 11 12 17 6"></polyline>
          <polyline points="7 18 1 12 7 6"></polyline>
        </svg>
      )
    },
    { 
      path: '/news', 
      label: 'News & Events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    { 
      path: '/learning', 
      label: 'Learning Center',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      )
    },
    { section: 'Account' },
    { 
      path: '/profile-settings', 
      label: 'Profile Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
  ];

  // Check if a path is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <NavContainer>
      {navigationItems.map((item, index) => {
        if (item.section) {
          return <SectionTitle key={`section-${index}`}>{item.section}</SectionTitle>;
        }
        
        const active = item.path ? isActive(item.path) : false;
        
        return (
          <NavItemContainer key={`item-${index}`}>
            {active && (
              <ActiveIndicator 
                layoutId="activeIndicator"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <NavItem to={item.path || '#'} active={active}>
              <IconWrapper active={active}>
                {item.icon}
              </IconWrapper>
              {item.label}
            </NavItem>
          </NavItemContainer>
        );
      })}
    </NavContainer>
  );
};

export default Navigation; 
