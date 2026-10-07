# TradeX — Smart Stock Trading Platform

TradeX is an educational, simulated stock trading platform built with React and Vite. It allows users to practice stock trading with virtual currency in a risk-free environment.

## 🚀 Features

- **Virtual Portfolio**: Start with ₹10,00,000 in virtual currency.
- **Market Simulator**: Realistic mock data for popular stocks (AAPL, MSFT, TSLA, etc.).
- **Trading Engine**: Execute Buy and Sell orders instantly.
- **Interactive Charts**: Track stock history with interactive Recharts.
- **Watchlist**: Save and monitor favorite stocks.
- **Transaction History**: Keep a complete log of all your trades.
- **Dark/Light Mode**: Full theme support.
- **No API Keys Needed**: Everything runs locally in your browser using `localStorage`.

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS with CSS Variables for Theming
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: LocalStorage API

## 📂 Folder Structure

```
src/
├── components/       # Reusable UI components (Sidebar, Navbar, Cards, Charts, Toasts)
├── context/          # React Context (AuthContext, ToastContext)
├── data/             # Mock data and chart generation logic
├── pages/            # Application pages (Dashboard, Trade, Portfolio, etc.)
├── utils/            # Helper functions for trading and localStorage
├── App.jsx           # Main Router and Provider setup
├── main.jsx          # React entry point
└── index.css         # Global styles and themes
```

## ⚙️ Installation & Running

Follow these simple steps to run the platform locally on your machine.

1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone the repository or navigate to the project folder.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## 👨💻 Using the Demo Account

You don't need to create a real account. On the Login page, simply click **"Continue as Demo User"** to instantly access a fully populated demo account with ₹10,00,000 starting balance.

## ⚠️ Disclaimer

TradeX is strictly an **educational project**. All prices, trades, and market data are simulated. It does not use real money, connect to real brokerages, or provide actual financial advice.

---
*Tagline: "Learn. Trade. Grow."*
