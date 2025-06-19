
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if there's already a challenge for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingChallenge } = await supabase
      .from('daily_challenges')
      .select('id')
      .eq('challenge_date', today)
      .maybeSingle();

    if (existingChallenge) {
      console.log('Challenge already exists for today');
      return new Response(JSON.stringify({ message: 'Challenge already exists for today' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate challenge using Gemini AI
    const challengePrompt = `Generate a coding interview question for a daily challenge. The question should be:
    - Medium difficulty level
    - Suitable for software engineering interviews
    - Include a clear problem statement
    - Focus on algorithms, data structures, or system design
    - Be engaging and educational

    Please provide the response in this exact JSON format:
    {
      "title": "Question title (concise, under 60 characters)",
      "content": "Detailed problem description with examples and constraints",
      "difficulty": "Medium",
      "tags": ["array of relevant tags like 'arrays', 'dynamic-programming', etc"],
      "question_type": "Coding",
      "ai_hint": "A helpful hint for solving the problem without giving away the complete solution"
    }

    Make sure the content is comprehensive but concise, includes examples, and clearly states the problem requirements.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: challengePrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    // Parse the JSON response from Gemini
    let challengeData;
    try {
      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        challengeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in Gemini response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      throw new Error('Failed to parse Gemini response as JSON');
    }

    // Validate the required fields
    if (!challengeData.title || !challengeData.content || !challengeData.difficulty) {
      throw new Error('Invalid challenge data structure from Gemini');
    }

    // Insert the challenge into the database
    const { data: newChallenge, error: insertError } = await supabase
      .from('daily_challenges')
      .insert([{
        challenge_date: today,
        title: challengeData.title,
        content: challengeData.content,
        difficulty: challengeData.difficulty,
        tags: challengeData.tags || [],
        question_type: challengeData.question_type || 'Coding',
        ai_hint: challengeData.ai_hint
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw new Error(`Failed to save challenge: ${insertError.message}`);
    }

    console.log('Successfully generated daily challenge:', newChallenge.id);

    return new Response(JSON.stringify({ 
      success: true, 
      challenge: newChallenge,
      message: 'Daily challenge generated successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-daily-challenge function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate daily challenge' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
