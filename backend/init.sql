-- Step 1: Create a dedicated user with a secure password
CREATE USER rikub_golang_user WITH ENCRYPTED PASSWORD 'rikub_golang_pass';

-- Step 2: Revoke default permissions on the public schema for safety
  REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Step 3: Connect to your specific application database
\c rikub_database;

-- Step 4: Grant schema access to the backend user
GRANT USAGE ON SCHEMA public TO rikub_golang_user;

-- Step 5: Grant standard data access operations
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rikub_golang_user;

-- Step 6: Grant permission to use auto-incrementing ID sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rikub_golang_user;

-- Step 7: (Optional) Ensure FUTURE tables automatically get these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rikub_golang_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO rikub_golang_user;
