
import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, text
import os
from dotenv import dotenv_values

config = dotenv_values("../server/.env")
engine = create_engine(config["DATABASE_URL"])

def ingest_stock(ticker: str, period: str = "6mo"):
    print(f"Fetching data for {ticker}...")

    raw = yf.download(ticker, period=period, auto_adjust=True, progress=False)

    if raw.empty:
        print(f"No data found for {ticker}. Check the ticker symbol.")
        return


    if isinstance(raw.columns, pd.MultiIndex):
        raw.columns = raw.columns.get_level_values(0)

    df = raw.reset_index()

    df.columns = [col.lower() for col in df.columns]
    df = df.rename(columns={"index": "date"})

    df["ticker"] = ticker.upper()

    df = df[["ticker", "date", "open", "high", "low", "close", "volume"]]

    df = df.dropna()

    df["date"] = pd.to_datetime(df["date"])

    print(f"Fetched {len(df)} rows for {ticker}")
    print(df.head())

    from sqlalchemy import inspect
    inspector = inspect(engine)

    if inspector.has_table("stock_data"):
        with engine.begin() as conn:
            conn.execute(text(f"DELETE FROM stock_data WHERE ticker = '{ticker.upper()}'"))

    df.to_sql(
        name="stock_data",
        con=engine,
        if_exists="append",
        index=False
    )


if __name__ == "__main__":
    tickers = ["AAPL", "MSFT", "TSLA", "INFY"]
    for ticker in tickers:
        ingest_stock(ticker, period="6mo")