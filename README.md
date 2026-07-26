# 💰 Finance Management Tracker

A full-stack personal finance management application built with **Next.js**, **FastAPI**, **Supabase**, and **PostgreSQL**. The application allows users to securely manage their expenses while demonstrating modern backend architecture, authentication, and scalable API design.

## 🚀 Features

### Authentication
- Secure user authentication with Supabase Auth
- JWT-based authorization
- Protected API endpoints
- Retrieve authenticated user profile

### Expense Management
- Create expenses
- View all expenses for the authenticated user
- User-level data isolation
- RESTful API design

### Backend Architecture
- Layered architecture
    - Router
    - Service
    - Repository
- Dependency Injection using FastAPI
- SQLAlchemy ORM
- Alembic database migrations
- Pydantic request/response validation

---

## 🛠 Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase JavaScript SDK

### Backend
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL (Supabase)
- Alembic
- Pydantic v2
- Uvicorn

### Authentication
- Supabase Auth
- JWT Authentication

---

## 📂 Project Structure

```
FinanceManagementTracker/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── db/
│   │   ├── dependencies/
│   │   ├── expenses/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🏗 Architecture

The backend follows a layered architecture that separates concerns between API routing, business logic, and database access.

```
Client
   │
   ▼
FastAPI Router
   │
   ▼
Dependency Injection
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
PostgreSQL (Supabase)
```

This architecture keeps controllers lightweight, centralizes business logic in services, and isolates database operations within repositories.

---

## 🔐 Authentication Flow

```
Frontend
      │
      ▼
Supabase Authentication
      │
      ▼
JWT Access Token
      │
      ▼
FastAPI
      │
      ▼
Protected Endpoint
      │
      ▼
Current User
```

Each protected endpoint verifies the JWT with Supabase before accessing application data.

---

## 📌 Current API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Retrieve authenticated user |

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/expenses` | Create a new expense |
| GET | `/expenses` | Retrieve all expenses for the authenticated user |

---

## 🚧 Planned Features

- Retrieve a single expense
- Update an expense
- Delete an expense
- Expense filtering
- Budget management
- Spending analytics
- AI-powered financial insights
- Expense forecasting
- Dashboard visualizations

---

## ⚙️ Running the Project

### Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows
# .venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:3000
```

---

## 📖 Learning Goals

This project was built to deepen understanding of:

- REST API design
- FastAPI
- Dependency Injection
- SQLAlchemy ORM
- PostgreSQL
- Authentication with JWT
- Full-stack application architecture
- Clean backend design patterns

---

## 📄 License

This project is for educational and portfolio purposes.