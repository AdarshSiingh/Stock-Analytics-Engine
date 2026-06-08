
import sys
import json
import numpy as np
from engine import StockAnalytics


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)



if len(sys.argv) < 2:
    print(json.dumps({"error": "No ticker provided"}))
    sys.exit(1)

ticker = sys.argv[1]
period = sys.argv[2] if len(sys.argv) > 2 else "6mo"


try:
    s = StockAnalytics(ticker)
    s.run_all()

    output = {
        "ticker"  : ticker.upper(),
        "summary" : s.summary(),
        "candles" : s.to_json_records()
    }

    print(json.dumps(output, cls=NumpyEncoder))

except ValueError as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

except Exception as e:
    print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
    sys.exit(1)