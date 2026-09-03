# FutureVest — My Frontend Contribution

FutureVest is a web platform for valuing stocks and discovering growth opportunities across thousands of U.S. equities, built as a 7-person team project for CSSE6400 (Software Architecture) at the University of Queensland. The full system is a microservices backend (auth, stocks, tooltips, and watchlist services) behind a React/TypeScript frontend, deployed on AWS (ECS Fargate, RDS Postgres, an Application Load Balancer, and WAF).

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

## Tech stack

React 19, TypeScript, styled-components, Chart.js (via react-chartjs-2), Framer Motion, React Router.

## Note

This code depends on backend services (auth, stocks, tooltips, watchlist) and a `config.ts` pointing at API hosts that aren't included here, so it isn't meant to run standalone — it's presented as a code sample of my actual contribution to a larger system. The full project's architecture (microservices, AWS deployment, database design) was a team effort I contributed to but didn't solely build.
