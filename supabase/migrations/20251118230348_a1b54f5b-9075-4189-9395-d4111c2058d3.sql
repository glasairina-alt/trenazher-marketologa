-- Create table for storing correct metric answers
CREATE TABLE public.metric_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL UNIQUE,
  correct_values NUMERIC[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.metric_answers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view metric answers
CREATE POLICY "All authenticated users can view metric answers"
ON public.metric_answers
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to manage metric answers
CREATE POLICY "Admins can manage metric answers"
ON public.metric_answers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_metric_answers_updated_at
BEFORE UPDATE ON public.metric_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default metric answers (based on current hardcoded values)
INSERT INTO public.metric_answers (metric_name, correct_values) VALUES
  ('ctr', ARRAY[4, 4.0]),
  ('cpc', ARRAY[8.33, 8.3]),
  ('cpm', ARRAY[333.33, 333.3]),
  ('cr1', ARRAY[2.5]),
  ('cpl', ARRAY[333.33, 333.3]),
  ('cr2', ARRAY[60]),
  ('avgCheck', ARRAY[2500]),
  ('romi', ARRAY[500]);