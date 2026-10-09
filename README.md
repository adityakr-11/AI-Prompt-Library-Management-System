# AI Prompt Library Management System

A full-stack, database-driven web application to create, organize, store, manage, and reuse AI prompts efficiently with integrated AI assistance and real-time usage analytics.

---

## 🚀 Features

- **🔐 Secure User Authentication**: Registration and login with bcrypt password hashing and JWT (JSON Web Tokens).
- **📚 Centralized Prompt Library**: Complete CRUD operations for prompts (Create, Read, Update, Delete) with ownership validation.
- **🏷️ Flexible Categorization & Tagging**: Normalized category classification (Programming, Web Development, Database, AI, etc.) and many-to-many tag relations.
- **❤️ Favorites Management**: Save and access high-priority prompts quickly with one-click toggling and database persistence.
- **📋 Copy & Usage Tracking**: Automatically copies prompt text to clipboard, increments `usage_count`, and logs copy events into `prompt_usage`.
- **📊 Real-Time Analytics Dashboard**: Computes personalized metrics including Total Prompts, Favorites, Categories Used, Prompt Copies, and Recent Prompts.
- **🤖 Integrated AI Assistant**: Generate, improve, or rewrite prompts with AI (OpenAI API integration with intelligent prompt-engineering fallback).
- **📱 Modern Responsive UI**: Clean interface built with React, Vite, Lucide Icons, and custom CSS.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Styling**: Modern Custom CSS (Flexbox, Grid, CSS Variables)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (RESTful API architecture)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Database Driver**: `mysql2/promise` (connection pooling)
- **AI Integration**: OpenAI SDK + Smart Prompt Generator Fallback
- **Environment**: `dotenv`, `cors`, `nodemon`

### Database
- **Engine**: MySQL 8.0
- **Database Name**: `ai_prompt_library`

---

## 📐 System Architecture

```text
React Frontend (Port 5173)
        │
        ▼ HTTP REST API (JWT Bearer Auth)
Node.js + Express Backend (Port 5001)
        ├──► MySQL Database (Port 3306)
        └──► AI Service (OpenAI API / Smart Engine)
```

---

## 🗄️ Database Design

The relational schema is fully normalized into 7 tables:

1. **`users`**: Account credentials and profile (`id`, `name`, `email`, `password`, `created_at`, `updated_at`).
2. **`categories`**: Standardized prompt categories (`id`, `category_name`, `created_at`).
3. **`prompts`**: Core prompt records (`id`, `user_id`, `category_id`, `title`, `description`, `prompt_text`, `usage_count`, timestamps).
4. **`tags`**: Reusable tags (`id`, `tag_name`, `created_at`).
5. **`prompt_tags`**: Many-to-many link table (`prompt_id`, `tag_id`).
6. **`favorites`**: User-favorited prompts (`id`, `user_id`, `prompt_id`, `created_at`) with unique constraint on `(user_id, prompt_id)`.
7. **`prompt_usage`**: Audit log of prompt actions (`id`, `user_id`, `prompt_id`, `action_type`, `created_at`).

---

## 🔌 REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and return JWT token + user info

### Prompts
- `GET /api/prompts` - Retrieve logged-in user's prompts with tags & category
- `POST /api/prompts` - Create a new prompt with categories and tags
- `PUT /api/prompts/:id` - Update existing prompt and its tags
- `DELETE /api/prompts/:id` - Delete prompt (cascades to tags & favorites)

### Categories
- `GET /api/categories` - Fetch all available prompt categories

### Favorites
- `GET /api/favorites` - Get array of favorited prompt IDs for current user
- `POST /api/favorites/:promptId` - Add prompt to favorites
- `DELETE /api/favorites/:promptId` - Remove prompt from favorites

### Usage Tracking
- `POST /api/usage/:id/copy` - Record clipboard copy and increment usage count

### Dashboard
- `GET /api/dashboard` - Get dynamic statistics (total prompts, favorites, categories, copy count) and recent prompts

### AI Assistant
- `POST /api/ai/generate` - Generate, improve, or rewrite prompt text

### System Health
- `GET /api/health` - Backend server status check

---

## 🚀 Getting Started

### 1. Database Setup
Ensure MySQL is running on port 3306. Verify database credentials in `backend/.env`:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_prompt_library
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key_optional
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
# Server will run at http://localhost:5001
```

### 3. Start Frontend Client
```bash
# In the root directory
npm install
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 🔒 Security Implementations

- **Password Hashing**: Salts and hashes passwords using `bcryptjs` before storage.
- **JWT Authorization**: Enforces user identity and validates authorization tokens on protected endpoints.
- **Parameterized Queries**: Prevents SQL injection across all database interactions.
- **User Ownership Validation**: Users can only modify, delete, and copy their own prompt records.
- **CORS Protection**: Controlled cross-origin access between frontend and backend.
- **Secure Secret Handling**: API keys and database credentials reside exclusively on the server in `.env`.
