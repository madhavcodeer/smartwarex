# 🐳 SmartWareX Docker Setup

Run the entire SmartWareX stack (Frontend, Backend, Database, Redis) with a single command.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## 🚀 How to Run

1. **Start the Application**
   ```bash
   docker-compose up --build
   ```
   This will:
   - Build the backend and frontend images
   - Start PostgreSQL database
   - Start Redis cache
   - Start Backend API (http://localhost:8000)
   - Start Frontend (http://localhost:3000)

2. **Access the App**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Stop the Application**
   Press `Ctrl+C` in the terminal, or run:
   ```bash
   docker-compose down
   ```

## 🛠️ Troubleshooting

### Database Issues
If you have database connection errors, you might need to reset the volume:
```bash
docker-compose down -v
docker-compose up --build
```

### Port Conflicts
If ports 3000 or 8000 are already in use on your machine, you can modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000" # Maps host port 3001 to container port 3000
```

## 🏗️ Architecture

- **Frontend**: React + Vite (Node 18 Alpine)
- **Backend**: FastAPI (Python 3.10 Slim)
- **Database**: PostgreSQL 14 Alpine
- **Cache**: Redis 7 Alpine
- **ML Engine**: Mounted as a volume to the backend container

## 📝 Notes for Development

- **Live Reloading**: Both frontend and backend are configured with volumes, so changes you make to the code on your machine will instantly reflect in the running containers.
- **Environment Variables**: The setup uses default values suitable for local development.
