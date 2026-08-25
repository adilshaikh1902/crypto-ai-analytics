import pandas as pd
import numpy as np

def analyze_market_trends(price_list):
    """
    Descriptive Analytics: Calculates trends and volatility.
    """
    df = pd.DataFrame(price_list)
    
    # 1. Trend Detection using Simple Moving Average (SMA)
    df['SMA_7'] = df['price'].rolling(window=7).mean()
    current_price = df['price'].iloc[-1]
    sma_7 = df['SMA_7'].iloc[-1]
    
    if current_price > sma_7 * 1.05:
        trend = "Uptrend"
    elif current_price < sma_7 * 0.95:
        trend = "Downtrend"
    else:
        trend = "Sideways"
        
    # 2. Volatility Analysis (Standard Deviation of returns)
    df['returns'] = df['price'].pct_change()
    volatility = df['returns'].std() * 100 # Percentage
    
    if volatility < 2:
        risk = "Low"
    elif volatility < 5:
        risk = "Medium"
    else:
        risk = "High"
        
    return {
        "trend": trend,
        "volatility_score": round(volatility, 2),
        "risk_level": risk,
        "current_price": round(current_price, 2)
    }