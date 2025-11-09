-- PromptMaster Executive Database Schema

-- Users table (synced with Auth0)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  auth0_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  picture TEXT,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id SERIAL PRIMARY KEY,
  module VARCHAR(50) NOT NULL, -- 'foundation', 'intermediate', 'advanced', 'expert'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  business_context TEXT NOT NULL,
  task_description TEXT NOT NULL,
  learning_objectives JSONB NOT NULL, -- Array of learning objectives
  evaluation_criteria JSONB NOT NULL, -- Object with criteria and weights
  ideal_answer TEXT,
  difficulty VARCHAR(20) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'expert'
  estimated_time INTEGER, -- Minutes
  order_index INTEGER NOT NULL,
  is_capstone BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User attempts table
CREATE TABLE IF NOT EXISTS attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
  user_prompt TEXT NOT NULL,
  score INTEGER NOT NULL, -- 0-100
  criteria_scores JSONB NOT NULL, -- Breakdown by criteria
  strengths JSONB, -- Array of strength feedback
  improvements JSONB, -- Array of improvement suggestions
  rewrite_example TEXT,
  key_takeaway TEXT,
  time_spent INTEGER, -- Seconds
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  scenarios_completed INTEGER DEFAULT 0,
  scenarios_in_progress JSONB DEFAULT '[]', -- Array of scenario IDs
  module_progress JSONB DEFAULT '{}', -- Object with module completion stats
  skill_scores JSONB DEFAULT '{}', -- Spider chart data (6 dimensions)
  average_score FLOAT DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- Seconds
  capstone_completed BOOLEAN DEFAULT FALSE,
  capstone_score INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL, -- 'first_steps', 'week_warrior', etc.
  badge_name VARCHAR(100) NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_type)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  certificate_id VARCHAR(50) UNIQUE NOT NULL, -- PM-2025-XXXXXX
  full_name VARCHAR(255) NOT NULL,
  overall_score FLOAT NOT NULL,
  issue_date DATE NOT NULL,
  pdf_url TEXT,
  linkedin_badge_url TEXT,
  verification_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_scenario_id ON attempts(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_module ON scenarios(module);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON certificates(certificate_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to progress table
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
