-- ---------------------------------------------------------------------------
-- Lock the PostgREST API off.
--
-- Supabase exposes every table in the `public` schema over PostgREST, reachable
-- with the anon key — which is public by design and shipped to browsers. Tables
-- created through the Supabase dashboard get row-level security switched on by
-- default; tables created by a Prisma migration do NOT.
--
-- Without this migration, anyone holding the anon key could read the whole
-- shipment register, every client contact, and the staff password hashes.
--
-- This application never talks to PostgREST. It reaches Postgres through Prisma
-- using the pooled connection string, as the table owner, and table owners
-- bypass RLS — so enabling RLS with no policies costs the application nothing
-- and closes the API completely.
--
-- If you ever want to query Supabase from a browser or another service, add
-- explicit policies then. Do not disable this.
-- ---------------------------------------------------------------------------

-- 1. Enable RLS on every table. With no policies attached, RLS denies all
--    access to any role that is not the owner.
DO $$
DECLARE
  target RECORD;
BEGIN
  FOR target IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target.tablename);
  END LOOP;
END
$$;

-- 2. Revoke every grant from the two roles PostgREST authenticates as, and stop
--    future tables inheriting grants. Guarded by an existence check so this
--    migration also runs on a plain Postgres, where these roles do not exist.
DO $$
DECLARE
  api_role TEXT;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated']
  LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON SCHEMA public FROM %I', api_role);

      -- Applies to objects created later by the role running migrations.
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %I', api_role);
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', api_role);
      EXECUTE format(
        'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I', api_role);

      RAISE NOTICE 'Revoked public-schema access from role %', api_role;
    ELSE
      RAISE NOTICE 'Role % does not exist here (not a Supabase database) — skipped', api_role;
    END IF;
  END LOOP;
END
$$;
