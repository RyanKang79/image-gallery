/*
  # Create Images and Donations Tables

  1. New Tables
    - `images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `title` (text) - Image title/name
      - `description` (text, nullable) - Optional image description
      - `image_url` (text) - URL to the stored image
      - `uploader_name` (text) - Name of the person who uploaded
      - `total_donations` (numeric) - Total amount donated for this image
      - `donation_count` (integer) - Number of donations received
      - `created_at` (timestamptz) - Upload timestamp
    
    - `donations`
      - `id` (uuid, primary key) - Unique identifier for each donation
      - `image_id` (uuid, foreign key) - Reference to the image
      - `donor_name` (text) - Name of the donor
      - `amount` (numeric) - Donation amount
      - `message` (text, nullable) - Optional message from donor
      - `created_at` (timestamptz) - Donation timestamp
  
  2. Security
    - Enable RLS on both tables
    - Allow public read access to images (anyone can view)
    - Allow public insert for images (anyone can upload)
    - Allow public read access to donations (transparent donation history)
    - Allow public insert for donations (anyone can donate)
  
  3. Important Notes
    - Default values ensure data integrity
    - Foreign key constraint maintains referential integrity
    - Indexes on image_id for faster donation queries
*/

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  uploader_name text NOT NULL,
  total_donations numeric DEFAULT 0,
  donation_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  donor_name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  message text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_image_id ON donations(image_id);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images
CREATE POLICY "Anyone can view images"
  ON images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can upload images"
  ON images FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update image stats"
  ON images FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- RLS Policies for donations
CREATE POLICY "Anyone can view donations"
  ON donations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  TO public
  WITH CHECK (true);