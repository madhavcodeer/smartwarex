# Production Dockerfile for Render
# This builds the Backend + ML Engine

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
# Updated: libgl1-mesa-glx -> libgl1 for Debian 12 compatibility
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install OpenCV headless if not present (prevents GUI errors)
RUN pip install opencv-python-headless

# Copy Backend Code
COPY backend/ .

# Copy ML Engine
COPY ml-engine/ /ml-engine

# Set PYTHONPATH
ENV PYTHONPATH="${PYTHONPATH}:/ml-engine"

# Expose the port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
