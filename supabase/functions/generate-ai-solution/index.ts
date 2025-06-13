
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
    const { title, language, category, existingCode, existingAnswer } = await req.json();

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

    // Create the prompt for Gemini
    const prompt = `
You are an expert software engineer helping with interview preparation. 

Question: "${title}"
Programming Language: ${language}
Category: ${category}

${existingCode ? `Existing Code:\n${existingCode}\n` : ''}
${existingAnswer ? `Existing Answer:\n${existingAnswer}\n` : ''}

Please provide a comprehensive solution that includes:

1. **Problem Analysis**: Break down the problem and identify key requirements
2. **Approach**: Explain the algorithmic approach and strategy
3. **Step-by-Step Solution**: Provide a detailed walkthrough
4. **Optimized Code**: Write clean, efficient code with comments
5. **Time & Space Complexity**: Analyze the complexity
6. **Edge Cases**: Identify potential edge cases to consider
7. **Alternative Solutions**: Suggest alternative approaches if applicable
8. **Interview Tips**: Provide tips for discussing this problem in an interview

Format your response in clear sections with headers. Make the code production-ready and well-commented.
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

    const generatedSolution = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ solution: generatedSolution }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-solution function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
