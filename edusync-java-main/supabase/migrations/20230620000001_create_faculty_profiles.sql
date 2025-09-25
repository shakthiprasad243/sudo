-- Create faculty profiles for testing
-- This script creates faculty profiles that can be used for testing the student-faculty routing system

-- First, we need to create auth.users entries for these faculty members
-- In a real implementation, these would be created through the Supabase auth system
-- For testing purposes, we'll insert mock UUIDs

-- Insert faculty profiles (using mock UUIDs for testing)
INSERT INTO profiles (id, full_name, email, role) 
VALUES 
  ('11111111-1111-1111-1111-111111111111'::UUID, 'Dr. Smith', 'smith@university.edu', 'faculty'),
  ('22222222-2222-2222-2222-222222222222'::UUID, 'Prof. Johnson', 'johnson@university.edu', 'faculty')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;