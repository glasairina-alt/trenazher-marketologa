import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { calculatedMetrics } = await req.json();

    console.log('Checking metrics:', calculatedMetrics);

    // Fetch correct answers from database
    const { data: correctAnswersData, error } = await supabase
      .from("metric_answers")
      .select("*");

    if (error) {
      console.error('Error fetching correct answers:', error);
      throw error;
    }

    // Build answers map
    const answersMap: Record<string, number[]> = {};
    correctAnswersData?.forEach((item) => {
      answersMap[item.metric_name] = item.correct_values;
    });

    console.log('Correct answers loaded:', Object.keys(answersMap));

    // Check if value matches any of the correct values (with tolerance)
    const isValueCorrect = (value: string, correctValues: number[]) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return false;
      return correctValues.some(correct => Math.abs(numValue - correct) < 0.01);
    };

    // Validate each metric
    const results = {
      ctr: isValueCorrect(calculatedMetrics.ctr, answersMap.ctr || []),
      cpc: isValueCorrect(calculatedMetrics.cpc, answersMap.cpc || []),
      cpm: isValueCorrect(calculatedMetrics.cpm, answersMap.cpm || []),
      cr1: isValueCorrect(calculatedMetrics.cr1, answersMap.cr1 || []),
      cpl: isValueCorrect(calculatedMetrics.cpl, answersMap.cpl || []),
      cr2: isValueCorrect(calculatedMetrics.cr2, answersMap.cr2 || []),
      avgCheck: isValueCorrect(calculatedMetrics.avgCheck, answersMap.avgCheck || []),
      romi: isValueCorrect(calculatedMetrics.romi, answersMap.romi || []),
    };

    const allCorrect = Object.values(results).every(r => r === true);

    console.log('Validation results:', results, 'All correct:', allCorrect);

    return new Response(
      JSON.stringify({ 
        isCorrect: allCorrect,
        // Don't return individual metric results to prevent guessing
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in check-metrics function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});