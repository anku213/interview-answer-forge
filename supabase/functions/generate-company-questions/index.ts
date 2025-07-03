
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { count = 5, difficulty = 'Medium' } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Get companies from database
    const { data: companies, error: companiesError } = await supabaseClient
      .from('companies')
      .select('id, name')
      .limit(10);

    if (companiesError) {
      throw new Error('Failed to fetch companies');
    }

    const companyNames = companies?.map(c => c.name).join(', ') || 'Google, Microsoft, Amazon, Apple, Facebook';

    console.log(`Generating ${count} questions with difficulty: ${difficulty}`);

    const prompt = `Generate ${count} technical interview questions for top tech companies like ${companyNames}. 
    
    Requirements:
    - Difficulty level: ${difficulty}
    - Mix of question types: Coding (60%), System Design (25%), Theoretical (15%)
    - Include diverse topics: algorithms, data structures, system design, databases, networking
    - Each question should be realistic and commonly asked in interviews
    - Provide detailed content with examples where appropriate
    
    Format each question as JSON with these exact fields:
    - title: Question title
    - content: Detailed question description with examples
    - difficulty: "${difficulty}"
    - question_type: "Coding", "System Design", or "Theoretical"
    - tags: Array of 2-4 relevant tags
    - ai_hint: Helpful hint for solving the question
    - ai_explanation: Brief explanation of key concepts
    
    Return only a JSON array of questions, no other text.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    console.log('Generated text:', generatedText);

    // Parse the JSON response
    let questions;
    try {
      // Clean the response to extract JSON
      const jsonStart = generatedText.indexOf('[');
      const jsonEnd = generatedText.lastIndexOf(']') + 1;
      const jsonString = generatedText.slice(jsonStart, jsonEnd);
      questions = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Failed to parse generated questions');
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format generated');
    }

    console.log(`Parsed ${questions.length} questions`);

    // Insert questions into database
    const questionsToInsert = questions.map(q => ({
      company_id: companies?.[Math.floor(Math.random() * companies.length)]?.id || companies?.[0]?.id,
      title: q.title || 'Untitled Question',
      content: q.content || 'No content provided',
      difficulty: q.difficulty || difficulty,
      question_type: q.question_type || 'Coding',
      tags: Array.isArray(q.tags) ? q.tags : ['general'],
      ai_hint: q.ai_hint || null,
      ai_explanation: q.ai_explanation || null
    }));

    const { data: insertedQuestions, error: insertError } = await supabaseClient
      .from('company_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw new Error('Failed to save questions to database');
    }

    console.log(`Successfully inserted ${insertedQuestions?.length || 0} questions`);

    return new Response(JSON.stringify({
      success: true,
      generated_count: insertedQuestions?.length || 0,
      questions: insertedQuestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-company-questions function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
