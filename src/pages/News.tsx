import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const PageContainer = styled.div`
  margin-left: 0;
  padding-top: 60px;
  min-height: 100vh;
  background-color: #F9FAFB;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
`;

const PageHeading = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

const PageSubheading = styled.p`
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 30px;
`;

const CategoryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 30px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#1E3A8A' : '#6B7280'};
  border-bottom: ${props => props.active ? '2px solid #1E3A8A' : 'none'};
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.active ? '#1E3A8A' : '#4B5563'};
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeaturedNewsCard = styled.div`
  grid-column: 1 / -1;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FeaturedImage = styled.div`
  height: 240px;
  background-size: cover;
  background-position: center;
  
  @media (min-width: 768px) {
    width: 50%;
    height: auto;
  }
`;

const FeaturedContent = styled.div`
  padding: 24px;
  flex: 1;
`;

const NewsCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }
`;

const NewsImage = styled.div`
  height: 180px;
  background-size: cover;
  background-position: center;
`;

const NewsContent = styled.div`
  padding: 20px;
`;

const NewsCategory = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #6D28D9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 8px;
`;

const NewsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  font-size: 14px;
  color: #4B5563;
  margin: 0 0 16px 0;
  line-height: 1.6;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #6B7280;
`;

const NewsSource = styled.span`
  display: flex;
  align-items: center;
`;

const SourceLogo = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  background-size: cover;
  background-position: center;
`;

const NewsTime = styled.span``;

const LoadMoreButton = styled.button`
  background-color: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  margin: 40px auto 0;
  display: block;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #F9FAFB;
  }
`;

// Mock data for news items
const newsItems = [
  {
    id: 1,
    category: 'Market Update',
    title: 'Fed Signals Interest Rate Hold as Inflation Cools',
    summary: 'The Federal Reserve indicates it will maintain current interest rates through Q3 as inflation data shows signs of moderating to target levels.',
    source: 'Bloomberg',
    sourceLogo: 'https://assets.bwbx.io/s3/javelin/public/hub/images/favicon-black-63a1e699.png',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    featured: true
  },
  {
    id: 2,
    category: 'Technology',
    title: 'Apple Beats Expectations in Q2 Earnings',
    summary: 'Apple reported higher-than-expected revenue and EPS, driven by iPhone 15 sales and strong performance in services.',
    source: 'CNBC',
    sourceLogo: 'https://www.cnbc.com/favicon.ico',
    time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80'
  },
  {
    id: 3,
    category: 'Automotive',
    title: 'Tesla Unveils New Gigafactory in India',
    summary: 'Elon Musk confirms Tesla\'s expansion into India with a $5B investment plan. Production to begin next year.',
    source: 'Reuters',
    sourceLogo: 'https://www.reuters.com/pf/resources/images/reuters/logo-reuters.svg?d=108',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1601158935942-52255782d322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80'
  },
  {
    id: 4,
    category: 'Technology',
    title: 'Microsoft Partners with OpenAI to Launch AI-Powered Copilot',
    summary: 'The new AI Copilot will integrate into Office 365, helping users write emails, summarize meetings, and automate workflows.',
    source: 'The Verge',
    sourceLogo: 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395361/favicon-64x64.0.ico',
    time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1661961110144-12ac85918e40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 5,
    category: 'Finance',
    title: 'Dividend Stocks See Inflows Amid Market Volatility',
    summary: 'Investors are shifting into high-yield dividend stocks as a safe haven during earnings season swings.',
    source: 'MarketWatch',
    sourceLogo: 'https://mw3.wsj.net/mw5/content/images/favicons/apple-touch-icon.png',
    time: '2 days ago',
    image: 'https://images.unsplash.com/photo-1590283603385-c2b72cde865b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 6,
    category: 'Cryptocurrency',
    title: 'Bitcoin Surges Past $60,000 as ETF Approval Nears',
    summary: 'Bitcoin reaches a new 18-month high as market anticipates SEC approval for multiple spot Bitcoin ETFs.',
    source: 'CoinDesk',
    sourceLogo: 'https://www.coindesk.com/pf/resources/images/favicon/favicon-32x32.png',
    time: '3 days ago',
    image: 'https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 7,
    category: 'Real Estate',
    title: 'Commercial Real Estate Shows Signs of Recovery',
    summary: 'Office occupancy rates increase in major cities as companies implement hybrid work policies requiring partial in-office presence.',
    source: 'Wall Street Journal',
    sourceLogo: 'https://www.wsj.com/webpack/favicon-32x32.png',
    time: '3 days ago',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  }
];

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleItems, setVisibleItems] = useState(7);

  const categories = ['All', 'Market Update', 'Technology', 'Finance', 'Cryptocurrency', 'Automotive', 'Real Estate'];
  
  const filteredNews = activeCategory === 'All' 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);
  
  const featuredNews = filteredNews.find(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured).slice(0, visibleItems - (featuredNews ? 1 : 0));
  
  const loadMore = () => {
    setVisibleItems(prevCount => prevCount + 6);
  };

  return (
    <>
      <Header />
      <Navigation />
      <PageContainer>
        <ContentWrapper>
          <PageHeading>Latest Market News</PageHeading>
          <PageSubheading>Stay informed with breaking news and analysis that could impact your investments</PageSubheading>
          
          <CategoryTabs>
            {categories.map(category => (
              <CategoryTab 
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </CategoryTab>
            ))}
          </CategoryTabs>
          
          <NewsGrid>
            {featuredNews && (
              <FeaturedNewsCard>
                <FeaturedImage style={{ backgroundImage: `url(${featuredNews.image})` }} />
                <FeaturedContent>
                  <NewsCategory>{featuredNews.category}</NewsCategory>
                  <NewsTitle>{featuredNews.title}</NewsTitle>
                  <NewsSummary>{featuredNews.summary}</NewsSummary>
                  <NewsFooter>
                    <NewsSource>
                      <SourceLogo style={{ backgroundImage: `url(${featuredNews.sourceLogo})` }} />
                      {featuredNews.source}
                    </NewsSource>
                    <NewsTime>{featuredNews.time}</NewsTime>
                  </NewsFooter>
                </FeaturedContent>
              </FeaturedNewsCard>
            )}
            
            {regularNews.map(item => (
              <NewsCard key={item.id}>
                <NewsImage style={{ backgroundImage: `url(${item.image})` }} />
                <NewsContent>
                  <NewsCategory>{item.category}</NewsCategory>
                  <NewsTitle>{item.title}</NewsTitle>
                  <NewsSummary>{item.summary}</NewsSummary>
                  <NewsFooter>
                    <NewsSource>
                      <SourceLogo style={{ backgroundImage: `url(${item.sourceLogo})` }} />
                      {item.source}
                    </NewsSource>
                    <NewsTime>{item.time}</NewsTime>
                  </NewsFooter>
                </NewsContent>
              </NewsCard>
            ))}
          </NewsGrid>
          
          {filteredNews.length > visibleItems && (
            <LoadMoreButton onClick={loadMore}>
              Load More News
            </LoadMoreButton>
          )}
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default News;
