
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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
    const { code, language, title, category } = await req.json();

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user's Gemini API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('user_api_keys')
      .select('gemini_api_key')
      .eq('user_id', user.id)
      .single();

    if (apiKeyError || !apiKeyData?.gemini_api_key) {
      throw new Error('Gemini API key not found. Please add your API key in settings.');
    }

    const geminiApiKey = apiKeyData.gemini_api_key;

    // Create the code review prompt for Gemini
    const prompt = `
You are an experienced software engineer and mentor providing a constructive code review. 

Code to Review:
\`\`\`${language}
${code}
\`\`\`

Programming Language: ${language}
${title ? `Context: ${title}` : ''}
${category ? `Category: ${category}` : ''}

Please provide a comprehensive code review that includes:

## 🔍 Code Quality Assessment
- Overall code structure and organization
- Readability and maintainability
- Adherence to best practices for ${language}

## 🚨 Issues & Concerns
- Potential bugs or logical errors
- Performance concerns
- Security considerations
- Edge cases that might not be handled

## 💡 Improvement Suggestions
- Specific recommendations for better code structure
- More efficient algorithms or approaches
- Better variable naming and code clarity
- Error handling improvements

## 🏗️ Best Practices & Patterns
- Recommended design patterns for this type of problem
- ${language}-specific best practices
- Code style and formatting suggestions

## 📝 Step-by-Step Enhancement Guide
- Prioritized list of improvements to implement
- Explanation of why each improvement matters
- How to approach refactoring safely

## 🎯 Learning Opportunities
- Key concepts demonstrated in this code
- Areas for further learning and skill development
- Resources or topics to explore

**Important**: Act as a mentor, not a code rewriter. Focus on teaching and guiding rather than providing a complete rewritten solution. Be constructive, encouraging, and educational in your feedback.
    `;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const codeReview = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ review: codeReview }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in review-code function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
