-- Set sellwithsmo@gmail.com as admin (if they've already signed up)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'sellwithsmo@gmail.com';

-- Auto-promote this email to admin on signup if not already done
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_role TEXT := 'member';
BEGIN
  IF NEW.email = 'sellwithsmo@gmail.com' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    v_role
  );
  RETURN NEW;
END;
$$;
