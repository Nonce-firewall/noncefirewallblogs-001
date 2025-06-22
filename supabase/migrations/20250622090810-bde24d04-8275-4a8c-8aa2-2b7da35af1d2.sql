
-- Remove the existing profile and user data to start fresh
DELETE FROM public.profiles WHERE email = 'noncefirewall@gmail.com';

-- Note: We cannot directly delete from auth.users table via SQL migrations
-- You'll need to manually delete the user from the Supabase dashboard
-- Go to Authentication > Users and delete the noncefirewall@gmail.com user there
