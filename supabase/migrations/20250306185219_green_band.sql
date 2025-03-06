/*
  # Initial Schema Setup for Timeshare Reform Petition

  1. New Tables
    - `petitions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `story` (text)
      - `assessed_value` (numeric)
      - `created_at` (timestamp)
      - `signature_count` (integer)
    
    - `signatures`
      - `id` (uuid, primary key)
      - `petition_id` (uuid, references petitions)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their petitions
    - Add policies for public access to signatures
*/

-- Create petitions table
CREATE TABLE IF NOT EXISTS petitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  story text NOT NULL,
  assessed_value numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  signature_count integer DEFAULT 0
);

-- Create signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_id uuid REFERENCES petitions NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

-- Policies for petitions
CREATE POLICY "Users can create petitions"
  ON petitions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own petitions"
  ON petitions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read petitions"
  ON petitions
  FOR SELECT
  TO anon
  USING (true);

-- Policies for signatures
CREATE POLICY "Anyone can create signatures"
  ON signatures
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read signatures"
  ON signatures
  FOR SELECT
  TO anon
  USING (true);

-- Create function to update signature count
CREATE OR REPLACE FUNCTION update_signature_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE petitions
    SET signature_count = signature_count + 1
    WHERE id = NEW.petition_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for signature count
CREATE TRIGGER update_signature_count_trigger
AFTER INSERT ON signatures
FOR EACH ROW
EXECUTE FUNCTION update_signature_count();