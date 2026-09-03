import React from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding: 40px;
  padding-left: 260px;
`;

const Heading = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const InfoCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  padding: 20px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 14px;
  color: #444;
`;

const educationalContent = [
  {
    title: "P/E Ratio (Price-to-Earnings)",
    text: "Measures a company's current share price relative to its earnings per share. Useful for evaluating stock valuation."
  },
  {
    title: "Dividend Yield",
    text: "Shows how much a company pays in dividends each year relative to its stock price. Good for income-focused investors."
  },
  {
    title: "Market Capitalization",
    text: "The total value of a company’s shares. Often used to classify companies as small-cap, mid-cap, or large-cap."
  },
  {
    title: "Earnings Per Share (EPS)",
    text: "Represents how much profit a company makes for each share. Higher EPS often means better profitability."
  },
  {
    title: "Valuation Scores",
    text: "FutureVest assigns a score based on various metrics like P/E, growth, and earnings to help assess investment potential."
  }
];

const LearningCenter: React.FC = () => {
  return (
    <PageWrapper>
      <Heading>Learning Center</Heading>
      <Description>Learn key valuation terms to become a smarter investor.</Description>
      <CardGrid>
        {educationalContent.map((item, index) => (
          <InfoCard key={index}>
            <Title>{item.title}</Title>
            <Text>{item.text}</Text>
          </InfoCard>
        ))}
      </CardGrid>
    </PageWrapper>
  );
};

export default LearningCenter;
