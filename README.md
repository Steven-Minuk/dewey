# Dewey

A full-stack web application for exploring brand and daily spend data, built with a React frontend and a Python/Flask backend connected to Azure SQL Database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Create React App |
| Backend | Python 3.11, Flask 3.0 |
| Database | Azure SQL (via pyodbc + ODBC Driver 18) |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
dewey/
├── backend/
│   ├── app.py               # Flask application & API routes
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container definition
│   └── .env.docker          # Environment variables (not committed)
├── frontend/
│   ├── src/                 # React source files
│   ├── public/
│   ├── package.json
│   └── Dockerfile           # Frontend container definition
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/brands` | Returns top 50 brands with ID, name, type, URL, and industry info |
| GET | `/api/daily-spend` | Returns top 50 daily spend records with brand, amount, state, and date |

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- Access to an Azure SQL Database instance

### 1. Configure Environment Variables

Create a `backend/.env.docker` file with your Azure SQL credentials:

```env
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=your-database-name
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
AZURE_SQL_DRIVER=ODBC Driver 18 for SQL Server
```

> ⚠️ Never commit `.env.docker` to version control.

### 2. Run with Docker Compose

```bash
docker compose up --build
```

This starts two services:

| Service | Local URL |
|---------|-----------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |

To stop the services:

```bash
docker compose down
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask dev server runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The React dev server runs at `http://localhost:3000` with hot reload enabled.

---

## Dependencies

### Backend (`requirements.txt`)

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | 3.0.3 | Web framework |
| flask-cors | 4.0.0 | Cross-origin request handling |
| python-dotenv | 1.0.1 | Environment variable loading |
| pyodbc | 5.1.0 | Azure SQL Database connectivity |

### Frontend (`package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.0 | UI framework |
| react-dom | ^19.2.0 | DOM rendering |
| react-scripts | 5.0.1 | CRA build tooling |

---

## Docker Details

- The **backend** container installs Microsoft ODBC Driver 18 for SQL Server at build time, required for Azure SQL connectivity.
- The **frontend** container is served via Nginx on port 80, mapped to `3000` on the host.
- Both containers restart automatically unless explicitly stopped (`restart: unless-stopped`).
