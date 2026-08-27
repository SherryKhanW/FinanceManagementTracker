# Finance Management Tracker

A full stack, AI powered personal finance platform for tracking expenses, managing budgets, analyzing spending, and generating personalized financial insights.

Live Demo: https://finance-management-tracker-chi.vercel.app/signup

Features

*  Authentication — Supabase Auth with JWT-protected APIs and user-level data isolation.
*  Expense Management — Full CRUD with categories, dates, amounts, and descriptions.
*  Monthly Budgets — Set budgets and track spent, remaining, and percentage used.
*  Spending Analytics — Category breakdowns and multi-month spending trends with Recharts.
*  AI Insights — Forecasts month-end spending and generates personalized budgeting recommendations.
*  Redis Caching — Caches user/month-specific analytics to reduce repeated database queries.

Architecture

                         ┌─────────────────────┐
                         │       Browser       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js / Vercel  │
                         └──────────┬──────────┘
                                    │ HTTPS + JWT
                                    ▼
                         ┌─────────────────────┐
                         │ FastAPI / Railway   │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             ┌────────────┐  ┌──────────────┐  ┌────────────┐
             │   Redis    │  │  PostgreSQL  │  │  Groq LLM  │
             │   Cache    │  │  / Supabase  │  │  Insights  │
             └────────────┘  └──────────────┘  └────────────┘

The backend follows a layered architecture:

Router → Service → Repository → PostgreSQL

This separates API routing, business logic, and database access while keeping authentication, caching, and AI integrations isolated.

Tech Stack

Layer	Technologies
Frontend	Next.js, React, TypeScript, Tailwind CSS, Recharts
Backend	FastAPI, Python, SQLAlchemy, Pydantic, Alembic
Database & Auth	PostgreSQL, Supabase, Supabase Auth, JWT
Caching	Redis
AI	Groq, openai/gpt-oss-20b
Deployment	Vercel, Railway, Supabase

AI Financial Insights

Financial calculations are performed deterministically before being passed to the LLM.

Expenses + Budget
        │
        ▼
Financial Analytics
        │
        ├── Budget utilization
        ├── Average daily spend
        ├── Category breakdown
        └── Month-end forecast
        │
        ▼
Structured Financial Context
        │
        ▼
     Groq LLM
        │
        ▼
Personalized Recommendations

This keeps numerical calculations predictable while using the LLM for interpretation and recommendations.

API

Expenses

POST    /expenses
GET     /expenses
PATCH   /expenses/{id}
DELETE  /expenses/{id}
GET     /expenses/summary

Budgets

GET     /budgets/current
PUT     /budgets/current

Insights

GET     /insights

Run Locally

Backend

cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Swagger:

http://127.0.0.1:8000/docs

Frontend

cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000

Deployment

Frontend    → Vercel
Backend     → Railway
Database    → Supabase PostgreSQL
Auth        → Supabase Auth
Cache       → Redis
AI          → Groq
