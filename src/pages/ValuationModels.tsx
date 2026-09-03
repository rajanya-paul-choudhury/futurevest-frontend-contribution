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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const ModelCard = styled.div`
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--gray-light);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, var(--purple-primary) 0%, var(--purple-medium) 100%);
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: var(--text-medium);
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ModelFormula = styled.div`
  background-color: var(--purple-ultralight);
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  color: var(--purple-dark);
  margin-bottom: 15px;
  border-left: 3px solid var(--purple-primary);
`;

const UseCases = styled.div`
  margin-top: 12px;
`;

const UseCaseTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const UseCaseList = styled.ul`
  padding-left: 20px;
  margin: 0;
`;

const UseCaseItem = styled.li`
  font-size: 13px;
  color: var(--text-medium);
  margin-bottom: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 40px 0 20px;
`;

const ComparisionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: var(--purple-ultralight);
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: var(--purple-dark);
  border-bottom: 1px solid var(--gray-light);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: var(--gray-50);
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-light);
  font-size: 14px;
  color: var(--text-medium);
`;

const valuationModels = [
  {
    id: 1,
    title: "Price-to-Earnings Ratio (P/E)",
    description: "Measures a company's current share price relative to its per-share earnings. A higher P/E ratio could mean that a company's stock is overvalued, or that investors are expecting high growth rates in the future.",
    formula: "P/E Ratio = Share Price / Earnings Per Share",
    useCases: [
      "Comparing valuation of similar companies",
      "Identifying potentially overvalued stocks",
      "Quick assessment of company valuation"
    ]
  },
  {
    id: 2,
    title: "Price-to-Book Ratio (P/B)",
    description: "Compares a company's market value to its book value. The market value is the current stock price, and the book value is the value of all assets minus liabilities, divided by the number of shares outstanding.",
    formula: "P/B Ratio = Share Price / Book Value Per Share",
    useCases: [
      "Evaluating financial and banking stocks",
      "Identifying undervalued companies",
      "Asset-heavy business assessment"
    ]
  },
  {
    id: 3,
    title: "Price-to-Sales Ratio (P/S)",
    description: "Compares a company's stock price to its revenues. It's an indicator of the value placed on each dollar of a company's sales or revenues. Useful when a company doesn't have earnings.",
    formula: "P/S Ratio = Market Capitalization / Annual Sales",
    useCases: [
      "Evaluating growth companies with no earnings",
      "Comparing companies in the same industry",
      "Assessing early-stage technology companies"
    ]
  },
  {
    id: 4,
    title: "Discounted Cash Flow (DCF)",
    description: "Values a company based on projections of how much cash flow it will generate in the future, adjusted for the time value of money. This is considered one of the most thorough valuation models.",
    formula: "DCF = CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CFn/(1+r)ⁿ",
    useCases: [
      "Long-term investment analysis",
      "Intrinsic value determination",
      "Merger and acquisition evaluation"
    ]
  },
  {
    id: 5,
    title: "Enterprise Value to EBITDA (EV/EBITDA)",
    description: "Compares a company's enterprise value to its earnings before interest, taxes, depreciation, and amortization. This metric is capital structure-neutral, making it useful for comparing companies with different debt levels.",
    formula: "EV/EBITDA = Enterprise Value / EBITDA",
    useCases: [
      "Capital-intensive industry analysis",
      "Comparing companies with different debt levels",
      "Acquisition target evaluation"
    ]
  },
  {
    id: 6,
    title: "Dividend Yield",
    description: "Shows how much a company pays out in dividends each year relative to its stock price. It's a measure of the cash flow you're getting for each dollar invested in an equity position.",
    formula: "Dividend Yield = Annual Dividends Per Share / Share Price",
    useCases: [
      "Income investment strategy",
      "Mature company evaluation",
      "Retirement portfolio construction"
    ]
  }
];

const modelComparison = [
  {
    model: "P/E Ratio",
    bestFor: "Profitable, established companies",
    limitations: "Doesn't work for companies with negative earnings",
    industry: "All industries, especially consumer goods, utilities"
  },
  {
    model: "P/B Ratio",
    bestFor: "Asset-heavy businesses",
    limitations: "Less relevant for companies with few tangible assets",
    industry: "Banking, insurance, real estate"
  },
  {
    model: "P/S Ratio",
    bestFor: "Growth companies, startups",
    limitations: "Ignores profitability and cost structure",
    industry: "Technology, biotech, retail"
  },
  {
    model: "DCF",
    bestFor: "Stable businesses with predictable cash flows",
    limitations: "Highly sensitive to assumptions and growth rates",
    industry: "Utilities, consumer staples, infrastructure"
  },
  {
    model: "EV/EBITDA",
    bestFor: "Capital-intensive businesses",
    limitations: "Doesn't account for capital expenditure needs",
    industry: "Manufacturing, telecommunications, energy"
  }
];

const ValuationModels: React.FC = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Valuation Models</PageTitle>
          <PageDescription>
            Understand different valuation methodologies that help investors determine if a stock is fairly valued, overvalued, or undervalued.
            Each model has its strengths and weaknesses, and is better suited for different types of companies and industries.
          </PageDescription>
        </PageHeader>
        
        <CardsGrid>
          {valuationModels.map((model) => (
            <ModelCard key={model.id}>
              <CardHeader>
                <CardTitle>{model.title} <InfoTooltip text={model.description} /></CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{model.description}</CardDescription>
                <ModelFormula>{model.formula}</ModelFormula>
                <UseCases>
                  <UseCaseTitle>Best Used For:</UseCaseTitle>
                  <UseCaseList>
                    {model.useCases.map((useCase, index) => (
                      <UseCaseItem key={index}>{useCase}</UseCaseItem>
                    ))}
                  </UseCaseList>
                </UseCases>
              </CardContent>
            </ModelCard>
          ))}
        </CardsGrid>
        
        <SectionTitle>Comparison of Valuation Models</SectionTitle>
        <ComparisionTable>
          <TableHead>
            <tr>
              <TableHeader>Valuation Model</TableHeader>
              <TableHeader>Best For</TableHeader>
              <TableHeader>Limitations</TableHeader>
              <TableHeader>Industries</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {modelComparison.map((item, index) => (
              <TableRow key={index}>
                <TableCell><strong>{item.model}</strong></TableCell>
                <TableCell>{item.bestFor}</TableCell>
                <TableCell>{item.limitations}</TableCell>
                <TableCell>{item.industry}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </ComparisionTable>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ValuationModels;
