# 🔐 Setup Guide: Authentication & Signup/Login System

This document outlines how the authentication gateway inside your portfolio operates and how to wire it to your own hosted backend service.

---

## 🛠️ System Architecture

The login/signup system is built client-side in React and talks to a backend database and authentication service (configured by default for Supabase APIs). 

### How It Works:
1. **Frontend Input**: The user enters their email and password on the **Secure Access Portal** (`/portal`).
2. **Gateway Configuration**: The app looks for an active API URL and public API key. These can be set either via environment variables or entered directly by clicking the **Settings** button in the Portal form (saves to local browser storage).
3. **Database Handshake**: The app sends credentials over HTTPS to the auth endpoint.
4. **Email Verification**:
   - If the backend has email confirmation enabled, it will email a confirmation link to the user.
   - The frontend intercepts verification-required errors and shows the **Verification Hub** viewport.
5. **Token Storage**: Once verified, the backend returns a JSON Web Token (JWT) session object, logging the user in and unlocking the guestbook ledger database.

---

## 🚀 Setting Up Your Auth Backend

To link this signup/login portal to your database, follow these steps:

### Option A: Quick Configuration (Runtime)
1. Navigate to the **Portal** page (`/portal`) on your live site.
2. Click the **Settings** link at the bottom of the card.
3. Paste your **Auth API URL** and **Auth Anon Key** (from your database provider dashboard) and click **Save**.
4. The system immediately binds to your project and allows signup and login!

### Option B: Deploying with Environment Variables (Permanent)
To ensure the app connects out-of-the-box for all visitors without typing credentials, create a `.env` file in the root folder of your project:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key...
```

*When building/deploying your project on Vercel, Netlify, or GitHub Pages, add these two environment variables inside their respective deployment console settings.*

---

## 🛡️ Database Schema Requirements

To enable the interactive Guestbook Signatures ledger (the log ledger shown upon successful sign-in), create a table in your database with the following structure:

### Table Name: `guestbook`
| Column Name | Data Type | Default / Constraints |
| :--- | :--- | :--- |
| `id` | bigint | Primary Key, Auto-increment |
| `created_at` | timestamp with time zone | `now()` |
| `email` | text | Not Null |
| `comment` | text | Not Null |

### Row Level Security (RLS) Rules:
If using Supabase or PostgREST, configure RLS rules on the `guestbook` table so users can sign:
- **Enable Read**: Allow public access (Anon) to read entries (`SELECT`).
- **Enable Write**: Allow authenticated users (`INSERT` only when `auth.role() = 'authenticated'`).

---

## 💾 Copy-Paste SQL Editor Code

Paste this SQL code directly into the **SQL Editor** tab inside your Supabase Dashboard to automatically configure the table, enable Row-Level Security, and setup access control policies:

```sql
-- 1. Create the Guestbook Table
create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  comment text not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.guestbook enable row level security;

-- 3. Policy: Allow Anyone (Public / Anonymous) to view guestbook signs
create policy "Allow public read access"
on public.guestbook
for select
to public
using (true);

-- 4. Policy: Allow Authenticated Users to sign the guestbook
create policy "Allow authenticated insert access"
on public.guestbook
for insert
to authenticated
with check (true);
```

