# Stock Market Analytics Engine

A full-stack data analytics platform that fetches real stock market data, computes technical indicators using Python, and displays everything on an interactive web dashboard.

**Live demo:** https://stock-analytics-engine.vercel.app

---

## What it does

- Fetches 6 months of OHLCV (Open, High, Low, Close, Volume) data for any supported stock ticker from Yahoo Finance
- Computes 8 technical indicators — SMA 20, SMA 50, EMA 12, EMA 26, RSI, MACD, Bollinger Bands, OBV
- Generates automated buy/sell/hold signals based on golden cross, death cross, and RSI thresholds
- Calculates summary statistics — Sharpe ratio, max drawdown, annualised volatility, total return
- Displays everything on an interactive candlestick chart dashboard with RSI and MACD panels
- Includes a multi-stock correlation matrix to compare how stocks move relative to each other

---

## Tech stack

| Layer | Technology |
|---|---|
| Data ingestion | Python, yfinance, Pandas |
| Analytics engine | Python, NumPy, ta library |
| Database | PostgreSQL (Neon) |
| ORM | SQLAlchemy |
| Backend bridge | Node.js, Express.js, child_process |
| Frontend | React.js, Vite |
| Charts | TradingView lightweight-charts, Recharts |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project architecture

User searches ticker
↓
React frontend (Vercel)
↓ HTTP request
Node.js / Express (Render)
↓ child_process.spawn
Python analytics engine
↓ SQLAlchemy
PostgreSQL database (Neon)
↓ computed JSON
Back up the chain to React

The Node.js server acts as a bridge — it spawns Python as a child process, captures the JSON output from stdout, and returns it as an API response. Python handles all data and analytics logic; Node.js handles routing; React handles display.

---

## Folder structure

```
stock-analytics-engine/
├── analytics/
│   ├── engine.py
│   ├── ingest.py
│   ├── run.py
│   ├── correlate.py
│   └── requirements.txt
├── server/
│   ├── index.js
│   ├── routes/
│   │   └── analyse.js
│   └── utils/
│       └── runPython.js
├── client/
│   └── src/
│       ├── App.jsx
│       ├── hooks/
│       │   └── useStockData.js
│       └── components/
│           ├── CandlestickChart.jsx
│           ├── IndicatorPanel.jsx
│           ├── SummaryCards.jsx
│           └── ChartGuide.jsx
└── notebooks/
    ├── 01_data_exploration.ipynb
    ├── 02_indicators.ipynb
    ├── 03_signals.ipynb
    └── 04_correlation.ipynb
```
---

## Technical indicators explained

**SMA (Simple Moving Average)** — average closing price over N days. SMA 20 and SMA 50 are used to identify trend direction and crossover signals.

**EMA (Exponential Moving Average)** — like SMA but gives more weight to recent prices. Reacts faster to price changes.

**RSI (Relative Strength Index)** — momentum indicator on a 0-100 scale. Above 70 = overbought (likely to fall). Below 30 = oversold (likely to rise).

**MACD (Moving Average Convergence Divergence)** — difference between EMA 12 and EMA 26. The signal line and histogram reveal momentum direction and strength.

**Bollinger Bands** — SMA 20 with upper and lower bands at 2 standard deviations. Price near upper band = potentially overbought. Bands squeezing = big move incoming.

**OBV (On Balance Volume)** — cumulative volume indicator. Rising OBV with flat price suggests upcoming price increase.

---

## Signal logic

| Signal | Condition |
|---|---|
| Buy | SMA 20 crosses above SMA 50 (golden cross) |
| Sell | SMA 20 crosses below SMA 50 (death cross) |
| Buy | RSI drops below 30 (oversold) |
| Sell | RSI rises above 70 (overbought) |
| Hold | None of the above conditions met |

---

## Currently supported tickers

AAPL, MSFT, TSLA, INFY

To add more tickers, run `ingest.py` locally with the new ticker symbol.

---

## Running locally

**Prerequisites:** Python 3.9+, Node.js 18+

**1. Clone the repo**
```bash
git clone https://github.com/AdarshSiingh/Stock-Analytics-Engine.git
cd Stock-Analytics-Engine
```

**2. Set up Python environment**
```bash
cd analytics
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 3. Set up environment variables

Create `server/.env`:

```env
PORT=4000
DATABASE_URL=your_neon_postgresql_connection_string
```

## 4. Ingest stock data
```bash
cd analytics
source venv/bin/activate
python3 ingest.py
```

**5. Start the backend**
```bash
cd server
npm install
npm run dev
```

**6. Start the frontend**
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Jupyter notebooks

Four notebooks in the `notebooks/` folder document the full analytical process:

- `01_data_exploration.ipynb` — raw data shape, distributions, price history, volume analysis
- `02_indicators.ipynb` — visualisation of all technical indicators with Matplotlib
- `03_signals.ipynb` — buy/sell signal analysis and 10-day signal performance backtesting
- `04_correlation.ipynb` — multi-stock correlation matrix, rolling correlation, scatter plots

---

## Key concepts demonstrated

- ETL pipeline design — Extract (yfinance), Transform (Pandas), Load (PostgreSQL)
- Technical analysis — industry-standard financial indicators computed from scratch
- Cross-language bridge — Node.js spawning Python via child_process and capturing stdout
- REST API design — Express routes with input validation and error handling
- React patterns — custom hooks, component composition, props, state management
- Data visualization — Matplotlib, Seaborn, Recharts, TradingView lightweight-charts
- Cloud deployment — Vercel, Render, Neon with zero ongoing cost