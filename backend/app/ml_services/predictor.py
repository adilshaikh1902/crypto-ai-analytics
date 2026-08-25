import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

MODEL_PATH = "backend/app/ml_services/models/rf_model.pkl"

def prepare_features(df):
    """
    Transforms raw price data into technical features for ML.
    """
    # Feature 1: Daily Returns (Percentage Change)
    df['returns'] = df['price'].pct_change()
    
    # Feature 2: 7-day Moving Average Ratio
    df['sma_7'] = df['price'].rolling(window=7).mean()
    df['sma_ratio'] = df['price'] / df['sma_7']
    
    # Feature 3: Rolling Volatility
    df['volatility'] = df['returns'].rolling(window=7).std()
    
    # Target Variable: 1 if next day price is higher, 0 otherwise (Simplification)
    df['target'] = (df['price'].shift(-1) > df['price']).astype(int)
    
    return df.dropna()

def train_basic_model(df):
    """
    Trains a Random Forest Classifier on historical data.
    """
    features = ['returns', 'sma_ratio', 'volatility']
    X = df[features]
    y = df['target']
    
    # Initialize and train
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    return model

def predict_movement(current_data_row):
    """
    Predicts the direction for the next interval.
    """
    if not os.path.exists(MODEL_PATH):
        return "Model not trained"
    
    model = joblib.load(MODEL_PATH)
    prediction = model.predict(current_data_row)
    
    return "Rise" if prediction[0] == 1 else "Fall/Stable"