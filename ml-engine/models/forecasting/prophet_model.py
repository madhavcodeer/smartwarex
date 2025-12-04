"""
Demand Forecasting using Prophet, ARIMA, and LSTM
"""
import numpy as np
import pandas as pd
from prophet import Prophet
from statsmodels.tsa.arima.model import ARIMA
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')


class DemandForecaster:
    """Multi-model demand forecasting system."""
    
    def __init__(self):
        self.prophet_model = None
        self.arima_model = None
        self.scaler = MinMaxScaler()
    
    def prepare_data(self, data: pd.DataFrame, date_col: str = 'date', value_col: str = 'quantity') -> pd.DataFrame:
        """
        Prepare data for forecasting.
        
        Args:
            data: DataFrame with date and quantity columns
            date_col: Name of date column
            value_col: Name of value column
        
        Returns:
            Prepared DataFrame
        """
        df = data.copy()
        df[date_col] = pd.to_datetime(df[date_col])
        df = df.sort_values(date_col)
        df = df[[date_col, value_col]]
        return df
    
    def forecast_prophet(self, data: pd.DataFrame, periods: int = 30, freq: str = 'D') -> Dict:
        """
        Forecast using Facebook Prophet.
        
        Args:
            data: DataFrame with 'ds' (date) and 'y' (value) columns
            periods: Number of periods to forecast
            freq: Frequency ('D' for daily, 'W' for weekly, 'M' for monthly)
        
        Returns:
            Dictionary with forecast results
        """
        # Prepare data for Prophet
        df_prophet = data.copy()
        df_prophet.columns = ['ds', 'y']
        
        # Initialize and fit model
        self.prophet_model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
        self.prophet_model.fit(df_prophet)
        
        # Make future dataframe
        future = self.prophet_model.make_future_dataframe(periods=periods, freq=freq)
        
        # Predict
        forecast = self.prophet_model.predict(future)
        
        # Extract components
        return {
            'forecast': forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']],
            'trend': forecast[['ds', 'trend']],
            'seasonality': {
                'yearly': forecast[['ds', 'yearly']].tail(365) if 'yearly' in forecast.columns else None,
                'weekly': forecast[['ds', 'weekly']].tail(7) if 'weekly' in forecast.columns else None
            },
            'components': self.prophet_model.plot_components(forecast)
        }
    
    def forecast_arima(self, data: pd.DataFrame, order: tuple = (1, 1, 1), periods: int = 30) -> Dict:
        """
        Forecast using ARIMA.
        
        Args:
            data: DataFrame with time series data
            order: ARIMA order (p, d, q)
            periods: Number of periods to forecast
        
        Returns:
            Dictionary with forecast results
        """
        # Extract values
        values = data.iloc[:, 1].values
        
        # Fit ARIMA model
        self.arima_model = ARIMA(values, order=order)
        fitted_model = self.arima_model.fit()
        
        # Forecast
        forecast = fitted_model.forecast(steps=periods)
        
        # Get confidence intervals
        forecast_result = fitted_model.get_forecast(steps=periods)
        conf_int = forecast_result.conf_int()
        
        # Create forecast dataframe
        last_date = data.iloc[-1, 0]
        forecast_dates = pd.date_range(start=last_date, periods=periods+1, freq='D')[1:]
        
        forecast_df = pd.DataFrame({
            'date': forecast_dates,
            'forecast': forecast,
            'lower_bound': conf_int.iloc[:, 0],
            'upper_bound': conf_int.iloc[:, 1]
        })
        
        return {
            'forecast': forecast_df,
            'aic': fitted_model.aic,
            'bic': fitted_model.bic,
            'summary': fitted_model.summary()
        }
    
    def forecast_lstm(self, data: pd.DataFrame, periods: int = 30, lookback: int = 7) -> Dict:
        """
        Forecast using LSTM (simplified version).
        
        Args:
            data: DataFrame with time series data
            periods: Number of periods to forecast
            lookback: Number of past periods to use for prediction
        
        Returns:
            Dictionary with forecast results
        """
        # Note: This is a simplified version. Full LSTM implementation would require TensorFlow/Keras
        # For now, we'll use a simple moving average as a placeholder
        
        values = data.iloc[:, 1].values
        
        # Simple moving average forecast
        forecast = []
        for i in range(periods):
            if len(values) >= lookback:
                pred = np.mean(values[-lookback:])
            else:
                pred = np.mean(values)
            forecast.append(pred)
            values = np.append(values, pred)
        
        last_date = data.iloc[-1, 0]
        forecast_dates = pd.date_range(start=last_date, periods=periods+1, freq='D')[1:]
        
        forecast_df = pd.DataFrame({
            'date': forecast_dates,
            'forecast': forecast
        })
        
        return {
            'forecast': forecast_df,
            'model_type': 'LSTM (simplified)',
            'lookback': lookback
        }
    
    def ensemble_forecast(self, data: pd.DataFrame, periods: int = 30) -> Dict:
        """
        Create ensemble forecast combining Prophet, ARIMA, and LSTM.
        
        Args:
            data: DataFrame with time series data
            periods: Number of periods to forecast
        
        Returns:
            Dictionary with ensemble forecast
        """
        # Get individual forecasts
        prophet_result = self.forecast_prophet(data, periods)
        arima_result = self.forecast_arima(data, periods=periods)
        lstm_result = self.forecast_lstm(data, periods=periods)
        
        # Combine forecasts (simple average)
        prophet_forecast = prophet_result['forecast']['yhat'].tail(periods).values
        arima_forecast = arima_result['forecast']['forecast'].values
        lstm_forecast = lstm_result['forecast']['forecast'].values
        
        ensemble_forecast = (prophet_forecast + arima_forecast + lstm_forecast) / 3
        
        last_date = data.iloc[-1, 0]
        forecast_dates = pd.date_range(start=last_date, periods=periods+1, freq='D')[1:]
        
        ensemble_df = pd.DataFrame({
            'date': forecast_dates,
            'ensemble_forecast': ensemble_forecast,
            'prophet_forecast': prophet_forecast,
            'arima_forecast': arima_forecast,
            'lstm_forecast': lstm_forecast
        })
        
        return {
            'forecast': ensemble_df,
            'individual_results': {
                'prophet': prophet_result,
                'arima': arima_result,
                'lstm': lstm_result
            }
        }
    
    def calculate_accuracy(self, actual: np.ndarray, predicted: np.ndarray) -> Dict:
        """
        Calculate forecast accuracy metrics.
        
        Args:
            actual: Actual values
            predicted: Predicted values
        
        Returns:
            Dictionary with accuracy metrics
        """
        mape = mean_absolute_percentage_error(actual, predicted) * 100
        rmse = np.sqrt(mean_squared_error(actual, predicted))
        mae = np.mean(np.abs(actual - predicted))
        
        return {
            'mape': mape,
            'rmse': rmse,
            'mae': mae
        }
    
    def detect_seasonality(self, data: pd.DataFrame) -> Dict:
        """
        Detect seasonality patterns in data.
        
        Args:
            data: DataFrame with time series data
        
        Returns:
            Dictionary with seasonality information
        """
        values = data.iloc[:, 1].values
        
        # Simple seasonality detection using autocorrelation
        from statsmodels.tsa.stattools import acf
        
        acf_values = acf(values, nlags=min(365, len(values) - 1))
        
        # Find peaks in ACF
        peaks = []
        for i in range(1, len(acf_values) - 1):
            if acf_values[i] > acf_values[i-1] and acf_values[i] > acf_values[i+1]:
                if acf_values[i] > 0.3:  # Threshold for significant correlation
                    peaks.append(i)
        
        return {
            'has_seasonality': len(peaks) > 0,
            'seasonal_periods': peaks[:5],  # Top 5 seasonal periods
            'acf_values': acf_values
        }


# Example usage
if __name__ == "__main__":
    # Create sample demand data
    np.random.seed(42)
    dates = pd.date_range(start='2023-01-01', periods=365, freq='D')
    
    # Simulate demand with trend and seasonality
    trend = np.linspace(100, 150, 365)
    seasonality = 20 * np.sin(2 * np.pi * np.arange(365) / 7)  # Weekly seasonality
    noise = np.random.normal(0, 5, 365)
    demand = trend + seasonality + noise
    
    data = pd.DataFrame({
        'date': dates,
        'quantity': demand
    })
    
    # Initialize forecaster
    forecaster = DemandForecaster()
    
    # Run Prophet forecast
    print("Running Prophet forecast...")
    prophet_result = forecaster.forecast_prophet(data, periods=30)
    print(f"Prophet forecast shape: {prophet_result['forecast'].shape}")
    
    # Run ARIMA forecast
    print("\nRunning ARIMA forecast...")
    arima_result = forecaster.forecast_arima(data, periods=30)
    print(f"ARIMA AIC: {arima_result['aic']:.2f}")
    
    # Run ensemble forecast
    print("\nRunning ensemble forecast...")
    ensemble_result = forecaster.ensemble_forecast(data, periods=30)
    print(f"Ensemble forecast shape: {ensemble_result['forecast'].shape}")
    
    # Detect seasonality
    print("\nDetecting seasonality...")
    seasonality_result = forecaster.detect_seasonality(data)
    print(f"Has seasonality: {seasonality_result['has_seasonality']}")
    print(f"Seasonal periods: {seasonality_result['seasonal_periods']}")
