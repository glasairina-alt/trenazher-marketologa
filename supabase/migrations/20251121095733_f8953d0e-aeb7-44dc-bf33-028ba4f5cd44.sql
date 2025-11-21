-- Drop the existing policy that allows all authenticated users to view metric answers
DROP POLICY IF EXISTS "All authenticated users can view metric answers" ON public.metric_answers;

-- Create a new policy that only allows admins to view metric answers
CREATE POLICY "Only admins can view metric answers"
ON public.metric_answers
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));