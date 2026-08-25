import requests
import pandas as pd
import time

from fastapi import APIRouter
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from app.ml_services.predictor import (
    prepare_features,
    train_basic_model,
    predict_movement
)

router = APIRouter()

# ✅ Retry session (handles SSL/network issues)
session = requests.Session()

retry = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
)

adapter = HTTPAdapter(max_retries=retry)
session.mount("https://", adapter)

# ✅ Safe API call (NEVER crashes)
def safe_request(url, params=None):
    try:
        response = session.get(
            url,
            params=params,
            timeout=10,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print("❌ API ERROR:", e)
        return None


# ✅ Cache
data_cache = {}
list_cache = {"timestamp": 0, "data": []}
CACHE_EXPIRY = 300  # 5 min

COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"


# ✅ Get coin list
@router.get("/list-coins")
def get_list_coins():
    current_time = time.time()

    # Serve cache
    if current_time - list_cache["timestamp"] < CACHE_EXPIRY and list_cache["data"]:
        return list_cache["data"]

    url = f"{COINGECKO_BASE_URL}/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 100,
        "page": 1,
        "sparkline": False
    }

    coins_data = safe_request(url, params)

    if coins_data:
        list_cache["timestamp"] = current_time
        list_cache["data"] = coins_data
        return coins_data

    # fallback
    if list_cache["data"]:
        return list_cache["data"]

    return []  # ✅ never crash


# ✅ Market data
@router.get("/market-data/{coin_id}")
def get_market_data(coin_id: str, days: int = 30):
    current_time = time.time()

    # Serve cache
    if coin_id in data_cache:
        cached = data_cache[coin_id]
        if current_time - cached["timestamp"] < CACHE_EXPIRY:
            return cached["data"]

    url = f"{COINGECKO_BASE_URL}/coins/{coin_id}/market_chart"
    params = {"vs_currency": "usd", "days": days, "interval": "daily"}

    data = safe_request(url, params)

    if not data:
        if coin_id in data_cache:
            return data_cache[coin_id]["data"]
        return {"prices": []}  # ✅ prevent crash

    prices = data.get("prices", [])

    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    result = {"prices": df.to_dict(orient="records")}

    data_cache[coin_id] = {
        "timestamp": current_time,
        "data": result
    }

    return result


# ✅ AI Analysis
@router.get("/analyze/{coin_id}")
def get_coin_analysis(coin_id: str):
    market_data = get_market_data(coin_id, days=90)

    if not market_data["prices"]:
        return {
            "coin": coin_id,
            "error": "No data available"
        }

    df = pd.DataFrame(market_data["prices"])
    df_features = prepare_features(df)

    model = train_basic_model(df_features)

    latest_features = df_features[['returns', 'sma_ratio', 'volatility']].tail(1)
    prediction = predict_movement(latest_features)

    current_price = df['price'].iloc[-1]

    return {
        "coin": coin_id,
        "current_price": round(current_price, 2),
        "prediction": prediction,
        "confidence": "Based on 90-day Random Forest Analysis",
        "disclaimer": "Educational use only"
    }


# ✅ News (mock)
@router.get("/news/{coin_id}")
def get_crypto_news(coin_id: str):
    return [
        {
            "title": f"{coin_id.capitalize()} sees massive institutional inflow",
            "source": "CryptoDaily",
            "url": "#",
            "sentiment": "Positive",
            "time": "2h ago"
        },
        {
            "title": "New regulatory framework proposed for digital assets",
            "source": "FinanceWire",
            "url": "#",
            "sentiment": "Neutral",
            "time": "5h ago"
        }
    ]