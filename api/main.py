import yfinance as yf

msft = yf.Ticker('AAPL')
hist = msft.history(period='max', interval='1d')
hist.rename(str.lower, axis='columns').to_json('data.json', orient='records')
