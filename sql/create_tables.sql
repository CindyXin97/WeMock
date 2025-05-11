-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMP,
  password TEXT,
  image TEXT,
  target_role TEXT,
  work_experience TEXT,
  practice_areas TEXT[],
  target_industry TEXT,
  target_company TEXT,
  available_time JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建面试表
CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  status TEXT,
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  interviewer_id TEXT REFERENCES users(id),
  interviewee_id TEXT REFERENCES users(id)
);

-- 创建反馈表
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id TEXT UNIQUE REFERENCES interviews(id),
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 