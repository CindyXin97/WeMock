import { neon } from '@neondatabase/serverless'

// Initialize the SQL client with your connection string
export const sql = neon(process.env.DATABASE_URL || '')

// Helper to create tables if they don't exist
export async function initDB() {
  try {
    // Create users table with profile fields
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        nickname TEXT,
        contact_info TEXT,
        target_role TEXT,                  -- DA/DS/DE/Other
        work_experience TEXT,              -- 0/1-3/4-5/>5
        practice_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
        target_industry TEXT,
        target_company TEXT,
        available_times JSONB DEFAULT '{}'::JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create matches table for storing match information
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        user_id_1 INTEGER NOT NULL REFERENCES users(id),
        user_id_2 INTEGER NOT NULL REFERENCES users(id),
        match_score FLOAT,
        status TEXT DEFAULT 'pending',     -- pending/accepted/rejected
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create interviews table for storing interview appointments
    await sql`
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id),
        interviewer_id INTEGER NOT NULL REFERENCES users(id),
        interviewee_id INTEGER NOT NULL REFERENCES users(id),
        interview_type TEXT,               -- SQL/Python/Case Study/etc.
        scheduled_time TIMESTAMP WITH TIME ZONE,
        status TEXT DEFAULT 'scheduled',   -- scheduled/completed/cancelled
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create ratings table for post-interview feedback
    await sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        interview_id INTEGER NOT NULL REFERENCES interviews(id),
        rated_by_id INTEGER NOT NULL REFERENCES users(id),
        rated_user_id INTEGER NOT NULL REFERENCES users(id),
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database tables:', error)
  }
} 