# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack blog platform with three independent services orchestrated via Docker Compose:
- **`blog-api`** — Node.js/Express REST API (port 3000)
- **`blog-management`** — React/Vite admin dashboard (port 5175)
- **`public-website`** — React/Vite public reader site (port 5173)

## Commands

### blog-api
```bash
cd blog-api
npm run dev          # development (nodemon)
npm start            # production
npm run build        # prisma generate
npm run migrate      # prisma migrate deploy (run after schema changes)
```

### blog-management / public-website
```bash
cd blog-management   # or cd public-website
npm run dev          # dev server
npm run build        # production build
npm run lint         # eslint
npm run preview      # preview production build
```

### Docker (full stack)
```bash
docker compose up --build    # build and start all services
docker compose up            # start without rebuilding
```

No test suite is configured.

## Architecture

### blog-api

Entry point: `server.js` → `app.js` → routes in `src/routes/`

**Request flow:** route → auth middleware (if protected) → validator → `validate.js` → controller → Prisma → Postgres

- `src/utils/prisma.js` — singleton Prisma client using `@prisma/adapter-pg` (driver adapter pattern, not the default Prisma engine)
- `src/utils/asyncHandler.js` — wraps async route handlers to forward errors to the global error handler
- `src/middlewares/authMiddleware.js` — `verifyToken` decodes JWT and attaches `req.user`; `requireAdmin` checks `req.user.isAdmin`
- `src/middlewares/validators.js` + `validate.js` — express-validator chains + result checker

**Auth model:** JWT stored client-side. All origins are allowed in CORS (intentional — security is enforced by JWT on protected routes). Only admin users can create/update/delete posts and manage users.

**Route protection summary:**
- `GET /api/posts`, `GET /api/comments` — public
- `POST/PUT/DELETE /api/posts` — `verifyToken` + `requireAdmin`
- `POST /api/comments` — open (no auth required)
- `GET/POST/PUT /api/users` — `verifyToken` (POST also requires `requireAdmin`)
- `POST /api/users/login` — public

**Database schema** (`prisma/schema.prisma`): `User` → `BlogPost` → `Comment`. `BlogPost.isPublished` controls public visibility. `Comment.idUser` is nullable (anonymous comments allowed).

### blog-management

React 19 SPA with React Router v7.

- `src/context/AuthContext.jsx` — provides `{ user, login, logout, authError }`. JWT token and user object stored in `localStorage`.
- `src/hooks/useAuth.js` — consumes `AuthContext`
- `src/utils/api.js` — thin fetch wrapper that auto-attaches the Bearer token from localStorage. Base URL from `VITE_API_URL` env var.
- Pages: `LoginPage`, `PostsPage`, `UsersPage`, `CommentsPage`

### public-website

React 19 SPA (no router). Fetches published posts from `VITE_POSTS_URL` and comments from `VITE_COMMENTS_URL`. Minimal — no auth.

## Environment Variables

**blog-api** (`.env` in `blog-api/`, loaded only in non-production):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET`
- `PORT` (default: 3000)

**blog-management** (build-time Vite args):
- `VITE_API_URL` — base URL for the API (default: `http://localhost:3000`)

**public-website** (build-time Vite args):
- `VITE_POSTS_URL` — default: `http://localhost:3000/api/posts`
- `VITE_COMMENTS_URL` — default: `http://localhost:3000/api/comments`

Docker Compose reads from a `.env` file at the repo root for `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`, and the `VITE_*` URLs.
