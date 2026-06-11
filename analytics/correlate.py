

import sys
import json
import os
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from dotenv import dotenv_values


DATABASE_URL = os.environ.get("DATABASE_URL") or dotenv_values("../server/.env").get("DATABASE_URL")
engine = create_engine(DATABASE_URL)



def load_closing_prices(tickers: list) -> pd.DataFrame:
  
    frames = []

    for ticker in tickers:
        query = f"""
            SELECT date, close 
            FROM stock_data 
            WHERE ticker = '{ticker.upper()}'
            ORDER BY date ASC
        """
        df = pd.read_sql(query, engine)
        df = df.set_index('date')[['close']]
        df.columns = [ticker.upper()]
        frames.append(df)

    
    combined = frames[0]
    for frame in frames[1:]:
        combined = combined.join(frame, how='inner')

    return combined



def compute_correlation(tickers: list) -> dict:
   
    df = load_closing_prices(tickers)


    returns = df.pct_change().dropna()

   
    corr_matrix = returns.corr()


    corr_rounded = corr_matrix.round(3)

   
    pairs = []
    tickers_list = corr_rounded.columns.tolist()

    for i in range(len(tickers_list)):
        for j in range(i + 1, len(tickers_list)):
            t1 = tickers_list[i]
            t2 = tickers_list[j]
            corr_val = corr_rounded.loc[t1, t2]
            pairs.append({
                'pair'       : f"{t1} / {t2}",
                'correlation': float(corr_val),
                'relationship': (
                    'strong positive' if corr_val > 0.7 else
                    'moderate positive' if corr_val > 0.4 else
                    'weak positive' if corr_val > 0 else
                    'weak negative' if corr_val > -0.4 else
                    'moderate negative' if corr_val > -0.7 else
                    'strong negative'
                )
            })

    
    pairs.sort(key=lambda x: abs(x['correlation']), reverse=True)

    return {
        'tickers'   : tickers_list,
        'matrix'    : corr_rounded.to_dict(),
        'pairs'     : pairs,
        'date_range': {
            'from': str(df.index[0].date()),
            'to'  : str(df.index[-1].date()),
            'days': len(df)
        }
    }



class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.integer):
            return int(obj)
        return super().default(obj)



if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No tickers provided"}))
        sys.exit(1)

    
    tickers = sys.argv[1].split(',')

    if len(tickers) < 2:
        print(json.dumps({"error": "Need at least 2 tickers for correlation"}))
        sys.exit(1)

    try:
        result = compute_correlation(tickers)
        print(json.dumps(result, cls=NumpyEncoder))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)