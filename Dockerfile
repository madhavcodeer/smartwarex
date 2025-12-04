# Production Dockerfile for Render
# This builds the Backend + ML Engine

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (needed for ML libraries)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
COPY backend/ .

# Copy ML Engine (Critical for Vision/AI features)
# We copy this to the root so the relative imports work
COPY ml-engine/ /ml-engine

# Set PYTHONPATH to ensure imports work correctly
ENV PYTHONPATH="${PYTHONPATH}:/ml-engine"

# Expose the port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
