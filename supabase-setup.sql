-- FeeSync – Smart Fee Management Supabase Database Setup
-- Run this SQL in your Supabase project's SQL Editor

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT,
  timing TEXT,
  fee INTEGER DEFAULT 0,
  gst_rate INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 0,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  roll_number TEXT,
  status TEXT DEFAULT 'Active',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
  joining_date DATE,
  notes TEXT,
  discount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  status TEXT DEFAULT 'unpaid',
  amount INTEGER DEFAULT 0,
  paid_on DATE,
  paid_at TIMESTAMPTZ,
  late_fee INTEGER DEFAULT 0,
  notes TEXT,
  due_date DATE,
  parent_payment_id TEXT REFERENCES payments(id) ON DELETE CASCADE,
  reminder_scheduled_at TIMESTAMPTZ,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create installments table
CREATE TABLE IF NOT EXISTS installments (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount INTEGER DEFAULT 0,
  due_date DATE,
  status TEXT DEFAULT 'unpaid',
  paid_amount INTEGER DEFAULT 0,
  paid_on DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  gstin TEXT,
  address TEXT,
  email TEXT,
  upi_id TEXT
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  enable_gst BOOLEAN DEFAULT true,
  enable_discounts BOOLEAN DEFAULT true,
  enable_late_fees BOOLEAN DEFAULT true,
  enable_whatsapp BOOLEAN DEFAULT true,
  csv_export BOOLEAN DEFAULT true,
  compact_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Fix legacy schemas where user_id was stored as TEXT
-- Targets: batches, students, payments, settings
-- -----------------------------------------------------------------------------

-- Backup table for invalid rows (so no data is lost)
CREATE TABLE IF NOT EXISTS public.invalid_user_id_rows_backup (
  backup_id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  row_id TEXT,
  bad_user_id TEXT,
  row_data JSONB NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
DECLARE
  t TEXT;
  user_id_type TEXT;
  fk_rec RECORD;
BEGIN
  FOREACH t IN ARRAY ARRAY['batches', 'students', 'payments', 'settings']
  LOOP
    -- Skip table if it doesn't exist
    IF to_regclass(format('public.%I', t)) IS NULL THEN
      CONTINUE;
    END IF;

    SELECT data_type
      INTO user_id_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = t
      AND column_name = 'user_id';

    IF user_id_type IS NULL THEN
      CONTINUE;
    END IF;

    -- If user_id is text-like, quarantine invalid rows then convert
    IF user_id_type <> 'uuid' THEN
      EXECUTE format(
        $sql$
          INSERT INTO public.invalid_user_id_rows_backup (table_name, row_id, bad_user_id, row_data)
          SELECT %L,
                 x.id::text,
                 x.user_id::text,
                 to_jsonb(x)
          FROM public.%I x
          WHERE x.user_id IS NULL
             OR btrim(x.user_id::text) = ''
             OR NOT (btrim(x.user_id::text) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
             OR NOT EXISTS (
                  SELECT 1
                  FROM auth.users u
                  WHERE u.id::text = btrim(x.user_id::text)
             )
        $sql$,
        t,
        t
      );

      EXECUTE format(
        $sql$
          DELETE FROM public.%I x
          WHERE x.user_id IS NULL
             OR btrim(x.user_id::text) = ''
             OR NOT (btrim(x.user_id::text) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')
             OR NOT EXISTS (
                  SELECT 1
                  FROM auth.users u
                  WHERE u.id::text = btrim(x.user_id::text)
             )
        $sql$,
        t
      );

      -- Remove existing user_id foreign keys before type change
      FOR fk_rec IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
        WHERE con.contype = 'f'
          AND nsp.nspname = 'public'
          AND rel.relname = t
          AND att.attname = 'user_id'
      LOOP
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', t, fk_rec.conname);
      END LOOP;

      -- Safe conversion requested
      EXECUTE format('ALTER TABLE public.%I ALTER COLUMN user_id TYPE UUID USING user_id::uuid', t);
    END IF;

    -- Enforce canonical constraints
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN user_id SET NOT NULL', t);
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', t, t || '_user_id_fkey');
    EXECUTE format(
      'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE',
      t,
      t || '_user_id_fkey'
    );
  END LOOP;
END $$;

-- Enable Row Level Security
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Batches policies
DROP POLICY IF EXISTS "Users can select their own batches" ON batches;
DROP POLICY IF EXISTS "Users can insert their own batches" ON batches;
DROP POLICY IF EXISTS "Users can update their own batches" ON batches;
DROP POLICY IF EXISTS "Users can delete their own batches" ON batches;

CREATE POLICY "Users can select their own batches"
  ON batches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own batches"
  ON batches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own batches"
  ON batches FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own batches"
  ON batches FOR DELETE
  USING (auth.uid() = user_id);

-- Students policies
DROP POLICY IF EXISTS "Users can select their own students" ON students;
DROP POLICY IF EXISTS "Users can insert their own students" ON students;
DROP POLICY IF EXISTS "Users can update their own students" ON students;
DROP POLICY IF EXISTS "Users can delete their own students" ON students;

CREATE POLICY "Users can select their own students"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own students"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students"
  ON students FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students"
  ON students FOR DELETE
  USING (auth.uid() = user_id);

-- Payments policies
DROP POLICY IF EXISTS "Users can select their own payments" ON payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON payments;
DROP POLICY IF EXISTS "Users can delete their own payments" ON payments;

CREATE POLICY "Users can select their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);

-- Installments policies
DROP POLICY IF EXISTS "Users can select their own installments" ON installments;
DROP POLICY IF EXISTS "Users can insert their own installments" ON installments;
DROP POLICY IF EXISTS "Users can update their own installments" ON installments;
DROP POLICY IF EXISTS "Users can delete their own installments" ON installments;

CREATE POLICY "Users can select their own installments"
  ON installments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own installments"
  ON installments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own installments"
  ON installments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own installments"
  ON installments FOR DELETE
  USING (auth.uid() = user_id);

-- Profiles policies
DROP POLICY IF EXISTS "Users can select their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

CREATE POLICY "Users can select their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Settings policies
DROP POLICY IF EXISTS "Users can select their own settings" ON settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON settings;

CREATE POLICY "Users can select their own settings"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
  ON settings FOR DELETE
  USING (auth.uid() = user_id);
