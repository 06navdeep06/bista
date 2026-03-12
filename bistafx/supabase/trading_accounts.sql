-- Create the trading_accounts table in Supabase SQL Editor
-- Run this in your Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS trading_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  mt5_login TEXT NOT NULL,
  mt5_server TEXT NOT NULL,
  last_balance NUMERIC DEFAULT 0,
  equity NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE trading_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read their own rows
CREATE POLICY "Users can view own accounts"
  ON trading_accounts
  FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: service role can insert
CREATE POLICY "Service can insert accounts"
  ON trading_accounts
  FOR INSERT
  WITH CHECK (true);

-- Policy: service role can update
CREATE POLICY "Service can update accounts"
  ON trading_accounts
  FOR UPDATE
  USING (true);

-- Index for fast lookup
CREATE INDEX idx_trading_accounts_user_id ON trading_accounts(user_id);
CREATE INDEX idx_trading_accounts_mt5_login ON trading_accounts(mt5_login);
