-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    major VARCHAR(100),
    year INTEGER,
    interests TEXT[],
    bio TEXT,
    profile_photo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    student1_id INTEGER REFERENCES students(id),
    student2_id INTEGER REFERENCES students(id),
    status VARCHAR(50) DEFAULT 'pending',
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    sender_id INTEGER REFERENCES students(id),
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar blocks table
CREATE TABLE IF NOT EXISTS calendar_blocks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_free BOOLEAN DEFAULT true
);
