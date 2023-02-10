import yfinance as yf

msft = yf.Ticker('MSFT')
hist = msft.history(period='1mo', interval='15m')
hist.rename(str.lower, axis='columns').to_json('data.json', orient='records')
