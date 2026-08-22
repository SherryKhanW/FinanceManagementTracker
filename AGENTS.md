AGENTS.md

FinanceTracker

Project Goal

This project exists to learn modern full-stack software engineering and applied AI, not to build the most feature-rich finance application.

Every design decision should optimize for:

* learning
* clean architecture
* maintainability
* production-quality practices
* finishing the project

Avoid adding features simply because they are possible.

⸻

Primary Objective

Build a minimal personal finance tracker where a user can:

* authenticate
* manually add expenses
* upload a bank statement PDF
* automatically extract transactions
* categorize transactions using AI
* edit incorrect categories
* view a simple dashboard
* receive one AI-generated monthly spending summary

Everything else is considered out of scope unless explicitly requested.

⸻

Non-Goals

Do NOT add:

* microservices
* CQRS
* Event Sourcing
* Kafka
* RabbitMQ
* Redis
* Celery
* LangChain
* vector databases
* RAG
* AI chatbots
* OCR for scanned PDFs
* multiple bank integrations
* budgeting
* investment tracking
* goals
* subscription detection
* anomaly detection
* advanced forecasting
* recommendation engines
* custom rule engines
* transaction splitting
* notifications
* emails
* WebSockets

If unsure whether something belongs in the MVP:

Prefer not implementing it.

⸻

Tech Stack

Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Recharts

Backend

* Python
* FastAPI
* SQLAlchemy
* Alembic
* Pydantic

Database

* Supabase PostgreSQL

Authentication

* Supabase Auth

Storage

* Supabase Storage

Deployment

* Frontend → Vercel
* Backend → Railway

⸻

Architecture

Use a modular monolith.

Never suggest microservices.

Backend structure:

backend/

* app/
  * api/
  * services/
  * models/
  * schemas/
  * database.py
  * auth.py
  * main.py

Keep responsibilities separated without overengineering.

Controllers (API routes)

* validate requests
* call services
* return responses

Services

* business logic
* AI integration
* PDF parsing
* dashboard calculations

Models

* SQLAlchemy entities

Schemas

* Pydantic request/response models

⸻

Engineering Philosophy

Always prefer:

* readable code
* small functions
* explicit naming
* minimal abstractions
* simplicity
* maintainability

Avoid:

* unnecessary design patterns
* premature optimization
* generic abstractions
* excessive configuration
* enterprise complexity

Every abstraction should solve a real problem.

⸻

AI Philosophy

AI is an enhancement—not the application.

The backend should perform:

* calculations
* aggregation
* validation
* filtering
* persistence

The AI should only perform:

1. Transaction categorization

Input

* transaction description
* amount
* available categories

Output

* category
* confidence

2. Monthly spending summary

Input

* already calculated metrics

Output

* natural language explanation

Never ask the AI to perform calculations that can be done deterministically.

⸻

MVP Features

Authentication

* login
* signup

Transactions

* create
* update
* delete
* list

Imports

* upload one PDF format
* extract transactions
* preview before import
* save transactions

Dashboard

* total spending
* spending by category
* monthly spending chart

AI

* categorize transactions
* monthly insight

Nothing more.

⸻

Database Design

Keep the schema small.

Tables:

* UserProfile
* Category
* Transaction
* StatementImport

Only add new tables when absolutely necessary.

⸻

API Design

Keep endpoints RESTful.

Examples:

GET /transactions

POST /transactions

PUT /transactions/{id}

DELETE /transactions/{id}

POST /imports/preview

POST /imports/confirm

GET /dashboard

GET /insights

Avoid creating deeply nested endpoints.

⸻

Coding Standards

Always

* use type hints
* use Pydantic models
* validate input
* return consistent responses
* keep functions short
* write meaningful commit messages

Never

* duplicate logic
* hardcode secrets
* commit .env files
* bypass validation

⸻

UI Philosophy

The UI should be:

* simple
* clean
* responsive
* minimal

Avoid animations unless they improve usability.

The goal is functionality, not visual complexity.

⸻

Error Handling

Always:

* return meaningful errors
* validate user input
* handle failed uploads
* handle invalid PDFs
* handle AI failures gracefully

Never expose internal exceptions to users.

⸻

Learning Priority

When implementing any feature:

1. Explain why the architecture is designed that way.
2. Explain alternative approaches.
3. Explain why this implementation was chosen.
4. Keep the implementation as small as possible.

The goal is to understand the system—not simply finish it.

⸻

Decision Rule

Before introducing a new dependency, abstraction, or feature, ask:

1. Does this improve learning?
2. Does this make the MVP better?
3. Would a senior engineer consider this justified?

If the answer to any of these is “no,” do not implement it.

⸻

Definition of Success

The project is successful if it demonstrates:

* modern full-stack development
* clean backend architecture
* REST API design
* authentication
* PostgreSQL integration
* PDF processing
* applied AI
* interactive dashboard
* cloud deployment

It is not successful because it has the most features.

Keep the project focused, understandable, and finishable.


## Design Review Rules

When reviewing UI/UX designs, follow the design review process defined in:
- `.design-rules/SKILL.md` — Main review methodology
- `.design-rules/references/hig-lookup.md` — Topic-to-file mapping
- `.design-rules/references/hig/` — 53 design guideline documents

Always load the relevant guideline files before providing design feedback.