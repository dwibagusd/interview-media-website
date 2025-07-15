-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'admin')),
  full_name VARCHAR(100),
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create press_releases table
CREATE TABLE IF NOT EXISTS press_releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(50),
  published_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(100) NOT NULL,
  temperature INTEGER,
  condition VARCHAR(100),
  humidity INTEGER,
  wind_speed INTEGER,
  pressure INTEGER,
  forecast_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create early_warnings table
CREATE TABLE IF NOT EXISTS early_warnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  warning_level VARCHAR(20) CHECK (warning_level IN ('Rendah', 'Sedang', 'Tinggi')),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_requests table
CREATE TABLE IF NOT EXISTS interview_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interviewer_name VARCHAR(100) NOT NULL,
  media_name VARCHAR(100) NOT NULL,
  topic TEXT NOT NULL,
  interview_method VARCHAR(50) CHECK (interview_method IN ('phone', 'whatsapp', 'inperson', 'virtual')),
  interview_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  virtual_link VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_recordings table
CREATE TABLE IF NOT EXISTS interview_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_request_id UUID REFERENCES interview_requests(id),
  token VARCHAR(100),
  interviewee_name VARCHAR(100) NOT NULL,
  recording_duration INTEGER, -- in seconds
  transcription TEXT,
  audio_file_url VARCHAR(500),
  pdf_file_url VARCHAR(500),
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_requests_status ON interview_requests(status);
CREATE INDEX IF NOT EXISTS idx_interview_requests_datetime ON interview_requests(interview_datetime);
CREATE INDEX IF NOT EXISTS idx_interview_recordings_request_id ON interview_recordings(interview_request_id);
CREATE INDEX IF NOT EXISTS idx_press_releases_date ON press_releases(published_date);
CREATE INDEX IF NOT EXISTS idx_weather_data_date ON weather_data(forecast_date);
