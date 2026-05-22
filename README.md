# CivicPulse — Poll & Voting System (Backend)

A robust REST API for a civic engagement poll and voting platform. Built with NestJS, PostgreSQL, and TypeORM. Features JWT authentication, role-based access control, vote submission with duplicate prevention, and state-based results aggregation.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [API Reference](#api-reference)
- [Business Logic](#business-logic)

---

## Overview

CivicPulse Backend powers a poll and voting system where users can sign up with their Nigerian state, vote on active polls, and view results broken down by state. Admins can create, update, open, close, and delete polls.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| PostgreSQL | Relational database |
| TypeORM | ORM and migrations |
| Passport + JWT | Authentication |
| bcrypt | Password hashing |
| class-validator | DTO validation |

---

## Features

- JWT-based authentication (signup & login)
- Role-based access control (user / admin)
- Poll management — create, update, open/close, delete (admin only)
- One vote per user per poll enforcement (DB-level unique constraint)
- Vote state copied from user profile at vote time
- Results aggregation with optional state-based filtering
- Password excluded from all API responses
- Global exception handling and validation pipe

---

## Project Structure

```
src/
├── auth/               # Authentication — signup, login, JWT strategy, guards
├── users/              # User entity and service
├── polls/              # Poll and PollOption entities, CRUD
├── votes/              # Vote submission
├── results/            # Results aggregation with state filtering
└── common/             # Shared decorators
```

---

## Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL v14+
- NestJS CLI (`npm install -g @nestjs/cli`)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Henshaw-knight/poll-voting-backend.git
cd poll-voting-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root. See [Environment Variables](#environment-variables) for the full list.

### 4. Create the database

Create a PostgreSQL database matching the name in your `.env`:

```sql
CREATE DATABASE poll_voting_db;
```

### 5. Run migrations

```bash
npm run migration:run
```

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=poll_voting_db

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

# App
PORT=3000
```

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `poll_voting_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | any long random string |
| `JWT_EXPIRES_IN` | JWT expiry duration | `1d`, `2d`, `7d` |
| `PORT` | Port the server runs on | `3000` |

---

## Database Migrations

This project uses TypeORM migrations with `synchronize: false` for full control over schema changes.

```bash
# Generate a new migration from entity changes
npm run migration:generate -- src/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | Public |
| POST | `/auth/login` | Login and receive JWT | Public |

**Signup request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "state": "Lagos"
}
```

**Login request body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Auth response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "state": "Lagos",
    "role": "user",
    "createdAt": "2026-05-13T15:16:49.734Z"
  }
}
```

---

### Polls

All poll endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/polls` | Get all polls | Auth |
| GET | `/polls?status=active` | Get polls filtered by status | Auth |
| GET | `/polls/:id` | Get a single poll with options | Auth |
| POST | `/polls` | Create a new poll | Admin |
| PATCH | `/polls/:id` | Update poll title/description | Admin |
| PATCH | `/polls/:id/status` | Open or close a poll | Admin |
| DELETE | `/polls/:id` | Delete a poll | Admin |

**Create poll request body:**
```json
{
  "title": "Best JavaScript Framework",
  "description": "Pick your favourite",
  "options": ["Angular", "React", "Vue", "Svelte"]
}
```

---

### Votes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/votes` | Cast a vote on a poll | Auth |

**Request body:**
```json
{
  "pollId": "poll-uuid",
  "optionId": "option-uuid"
}
```

---

### Results

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/results/:pollId` | Get results for a poll | Auth |
| GET | `/results/:pollId?state=Lagos` | Get results filtered by state | Auth |

**Response:**
```json
{
  "pollId": "uuid",
  "title": "Best JavaScript Framework",
  "status": "active",
  "totalVotes": 10,
  "filteredByState": null,
  "results": [
    {
      "optionId": "uuid",
      "optionText": "Angular",
      "voteCount": 5,
      "percentage": 50
    }
  ]
}
```

---

### Users

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users/me` | Get current user profile | Auth |

---

## Business Logic

**One vote per user per poll** — enforced at two levels:
- Application level: `VotesService` checks for an existing vote before saving
- Database level: unique constraint on `(user_id, poll_id)` in the `votes` table

**Admin creation** — there is no public endpoint for creating admin accounts by design. To create an admin, manually update the role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**State on votes** — a user's state is copied from their profile onto the vote at submission time. This means results by state remain accurate even if a user's profile state is updated later.

**Poll deletion** — deleting a poll also deletes all associated votes. Poll options are removed automatically via the `CASCADE` constraint.