-- Добавляем уникальное ограничение на user_id
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Обновляем триггерную функцию, чтобы избежать дублирования
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;