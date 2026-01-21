# Coding Arena - Backend API Setup

A competitive programming platform with code submission and automated judging.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** (free tier works)
- **Redis Instance** (Upstash recommended for serverless)

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `bullmq` - Redis-based job queue
- `ioredis` - Redis client

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the database schema from `database_schema.md` in Supabase SQL Editor
3. Get your project credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Up Redis

**Option A: Upstash (Recommended - Serverless)**
1. Create a database at [upstash.com](https://upstash.com)
2. Copy the `REDIS_URL` connection string

**Option B: Self-Hosted Redis**
1. Install and run Redis locally or use a cloud provider
2. Note the `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD`

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Redis (Upstash)
REDIS_URL=rediss://default:password@your-host.upstash.io:6379

# OR Redis (Self-hosted)
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=your-password
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📡 API Endpoints

### Problems

- **GET** `/api/problems` - Get all published problems
- **GET** `/api/problems/[id]` - Get problem details with example test cases

### Submissions

- **POST** `/api/submit` - Submit code for judging
  ```json
  {
    "problemId": "uuid",
    "language": "cpp|python|javascript",
    "code": "your code here"
  }
  ```

- **GET** `/api/submissions/[id]` - Get submission status and results

### Authentication (Optional)

- **POST** `/api/auth/signup` - Create account
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "username"
  }
  ```

- **POST** `/api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

---

## 🏗️ Project Structure

```
coding-arena/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   ├── problems/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   ├── submissions/
│   │   │   └── [id]/route.ts
│   │   └── submit/route.ts
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser client
│   │   └── server.ts        # Server client
│   ├── queue.ts             # BullMQ queue setup
│   ├── redis.ts             # Redis client
│   └── utils.ts             # Validation utilities
├── types/
│   └── database.types.ts    # TypeScript types
├── .env.example             # Environment template
└── package.json
```

---

## 🔧 Next Steps

After setting up the API routes, you'll need to:

1. **Build the Judge Worker** - Separate service that processes the queue and runs code in Docker
2. **Create Frontend UI** - Display problems, submit code, show results
3. **Add Realtime Updates** - Subscribe to submission status changes
4. **Deploy** - Deploy API to Vercel, worker to Render/Railway

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists with correct credentials
- Restart the dev server after creating `.env.local`

### "Missing Redis configuration"
- Check `.env.local` has either `REDIS_URL` or `REDIS_HOST`
- Verify Redis instance is running and accessible

### npm not found
- Install Node.js from [nodejs.org](https://nodejs.org)
- Ensure npm is in your system PATH
- Restart your terminal after installation

---

## 📚 Documentation

- Implementation Plan: `implementation_plan.md`
- Database Schema: `database_schema.md`
- Task Checklist: `task.md`

---

## 🤝 Contributing

This is a work in progress. The API routes are complete and ready to use once configured.

## 📄 License

MIT
