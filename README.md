# FutureVest — My Frontend Contribution

FutureVest is a web platform for valuing stocks and discovering growth opportunities across thousands of U.S. equities, built as a 6-person team project for CSSE6400 (Software Architecture) at the University of Queensland. The full system is a microservices backend (auth, stocks, tooltips, and watchlist services) behind a React/TypeScript frontend, deployed on AWS (ECS Fargate, RDS Postgres, an Application Load Balancer, and WAF).

**This repo is not the full team project** — it's a focused extract of the pages and features I personally built, since the complete codebase is a private team repository I don't have sole ownership of. What's here is my actual, verified contribution, pulled directly from my commits on the team repo:

- **Complete pages I built from scratch** (verified via commit history): Stock Search, Stock Scanner, News, Watchlist, Learning Center, Peer Comparison, Account Settings, Valuation Models, Settings, and Notifications.
- **Enhancements to an existing page**: Stock Detail (added action buttons and additional functionality to a page other teammates had started).
- Site-wide navigation and UI polish across these pages.

The `components/`, `services/`, `utils/`, `types/`, and `context/` folders included here are shared project infrastructure that these pages depend on to make sense as working code — built collaboratively with my teammates, not solely by me. They're included for context, not as a claim of authorship.

## What these pages do

- **Stock Search & Stock Scanner**: search and systematically screen stocks with configurable filters (the scanner supports templated screens like value, growth, and momentum criteria).
- **Watchlist**: create and manage watchlist groups, add/remove stocks, track performance.
- **Peer Comparison**: side-by-side comparison of a stock against its peers on key metrics.
- **Valuation Models**: educational breakdowns of valuation approaches (P/E, DCF, P/B) applied to real stock data.
- **Learning Center / News**: investment education content and market news.
- **Account Settings / Settings / Notifications**: user preference and notification management.
- **Stock Detail (enhanced)**: added interactive actions on top of the existing stock detail page.

## Screens

Screenshots of the pages I built, taken from the app running locally. (Pages other teammates built — Home, Login, Sign Up, About — aren't shown here since they aren't part of this extract.)

**Stock Search** — filter by sector, market cap, FutureVest Score, P/E ratio, and earnings growth
![01-stock-search](https://github.com/user-attachments/assets/629dc922-5894-4327-b7f6-4eb92645f297)

**Stock Scanner** — build custom multi-parameter screens from templates like Value Stocks or High Dividend
<img width="1116" height="619" alt="02-stock-scanner" src="https://github.com/user-attachments/assets/bc19f0ba-f844-4e86-9abf-3da2738dfd3b" />

**Valuation Models** — P/E, P/B, P/S, DCF, EV/EBITDA, and Dividend Yield explained with formulas and best-use cases
<img width="1117" height="618" alt="03-valuation-models" src="https://github.com/user-attachments/assets/fb0180ac-f7b7-409c-b620-4e015a4cdec6" />

**Peer Comparison** — compare up to 5 companies side by side across fundamental, growth, and value metrics
<img width="1117" height="619" alt="04-peer-comparison" src="https://github.com/user-attachments/assets/6bb83cd1-e6ed-4972-b3d9-7647ddfc0662" />

**Learning Center** — glossary of key valuation terms for new investors
<img width="1117" height="616" alt="05-learning-center" src="https://github.com/user-attachments/assets/6074a671-5bbb-4e72-9f85-cabb97e8bb3c" />

**News & Events** — categorized market news feed
<img width="1117" height="618" alt="06-news-events" src="https://github.com/user-attachments/assets/ba837b1e-2287-4770-b4d9-2cf197478266" />

**Profile Settings** — account details and preferences
<img width="1117" height="620" alt="07-profile-settings" src="https://github.com/user-attachments/assets/8d7be085-5639-4bb4-a66a-d60d59b8638d" />

## Tech stack

React 19, TypeScript, styled-components, Chart.js (via react-chartjs-2), Framer Motion, React Router.

## Note

This code depends on backend services (auth, stocks, tooltips, watchlist) and a `config.ts` pointing at API hosts that aren't included here, so it isn't meant to run standalone — it's presented as a code sample of my actual contribution to a larger system. The full project's architecture (microservices, AWS deployment, database design) was a team effort I contributed to but didn't solely build.
