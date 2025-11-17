-- Добавляем новую роль premium_user в enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'premium_user';

-- Создаем таблицу для хранения контента кейса
CREATE TABLE public.case_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL DEFAULT 'Анна',
  case_title text NOT NULL DEFAULT 'Кейс цветочного магазина',
  product_price numeric NOT NULL DEFAULT 2500,
  product_description text NOT NULL DEFAULT 'Премиум цветы с доставкой',
  budget numeric NOT NULL DEFAULT 15000,
  image_1_url text,
  image_2_url text,
  image_3_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Создаем таблицу для хранения текстов диалога
CREATE TABLE public.dialog_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage text NOT NULL,
  message_key text NOT NULL,
  message_text text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(stage, message_key)
);

-- Создаем таблицу для метрик рекламы
CREATE TABLE public.ad_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  impressions numeric NOT NULL DEFAULT 45000,
  clicks numeric NOT NULL DEFAULT 1800,
  conversions numeric NOT NULL DEFAULT 45,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Вставляем начальные данные
INSERT INTO public.case_content (client_name, case_title, product_price, product_description, budget)
VALUES ('Анна', 'Кейс цветочного магазина', 2500, 'Премиум цветы с доставкой', 15000);

INSERT INTO public.ad_metrics (impressions, clicks, conversions)
VALUES (45000, 1800, 45);

-- Включаем RLS
ALTER TABLE public.case_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialog_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_metrics ENABLE ROW LEVEL SECURITY;

-- Политики для case_content
CREATE POLICY "Admins can manage case content"
ON public.case_content
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "All authenticated users can view case content"
ON public.case_content
FOR SELECT
TO authenticated
USING (true);

-- Политики для dialog_messages
CREATE POLICY "Admins can manage dialog messages"
ON public.dialog_messages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "All authenticated users can view dialog messages"
ON public.dialog_messages
FOR SELECT
TO authenticated
USING (true);

-- Политики для ad_metrics
CREATE POLICY "Admins can manage ad metrics"
ON public.ad_metrics
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "All authenticated users can view ad metrics"
ON public.ad_metrics
FOR SELECT
TO authenticated
USING (true);

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для обновления updated_at
CREATE TRIGGER update_case_content_updated_at
BEFORE UPDATE ON public.case_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dialog_messages_updated_at
BEFORE UPDATE ON public.dialog_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();