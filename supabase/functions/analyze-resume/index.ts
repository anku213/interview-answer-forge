
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from 'npm:resend@2.0.0';

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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found - email functionality will be disabled');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { analysisId, jobRole, experienceLevel } = await req.json();

    console.log('Starting analysis for ID:', analysisId);

    // Get analysis record to get user email
    const { data: analysisRecord, error: fetchError } = await supabase
      .from('resume_analyses')
      .select('user_email, resume_file_name, resume_file_url')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysisRecord) {
      console.error('Analysis record fetch error:', fetchError);
      throw new Error('Analysis record not found');
    }

    console.log('Found analysis record for email:', analysisRecord.user_email);

    // Update status to processing
    await supabase
      .from('resume_analyses')
      .update({ status: 'processing' })
      .eq('id', analysisId);

    // Download and analyze the resume file
    let resumeContent = '';
    if (analysisRecord.resume_file_url) {
      try {
        const fileResponse = await fetch(analysisRecord.resume_file_url);
        if (fileResponse.ok) {
          resumeContent = await fileResponse.text();
        } else {
          console.warn('Could not download resume file for analysis');
        }
      } catch (error) {
        console.warn('Error downloading resume file:', error);
      }
    }

    // Enhanced prompt for structured JSON response
    const analysisPrompt = `You are an expert resume reviewer and career coach. Please analyze this resume for a ${jobRole} position${experienceLevel ? ` at ${experienceLevel} level` : ''}.

${resumeContent ? `Resume Content: ${resumeContent.substring(0, 3000)}` : 'Resume file could not be processed for content analysis.'}

IMPORTANT: Respond with a valid JSON object in exactly this structure:

{
  "overall_score": <number between 1-100>,
  "feedback": {
    "formatting_and_design": [
      "specific point about visual design",
      "point about layout quality", 
      "ATS compatibility note"
    ],
    "keywords_and_skills": [
      "relevant technical skills feedback",
      "industry terminology assessment",
      "missing keywords suggestion"
    ],
    "structure_and_organization": [
      "section organization feedback",
      "information hierarchy assessment", 
      "professional summary effectiveness"
    ],
    "improvement_recommendations": [
      "specific actionable recommendation",
      "content gap to address",
      "quantification suggestion"
    ]
  },
  "strengths": [
    "key strength 1",
    "key strength 2"
  ],
  "priority_improvements": [
    "most important improvement",
    "second priority improvement"
  ]
}

Score the resume from 1-100 based on:
- Formatting and visual appeal (25%)
- Keyword optimization for ${jobRole} (25%) 
- Content structure and organization (25%)
- Relevance to target role (25%)

Provide 3-4 specific, actionable points in each feedback category. Focus on concrete improvements for ${jobRole} positions${experienceLevel ? ` at ${experienceLevel} level` : ''}.

Respond ONLY with the JSON object, no additional text.`;

    console.log('Calling Gemini API for analysis...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: analysisPrompt
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
      console.error('Gemini API error:', response.status, await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    console.log('Gemini API response received');

    // Parse JSON response
    let structuredFeedback;
    let overallScore = 75; // default fallback

    try {
      // Clean the response to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        structuredFeedback = JSON.parse(jsonMatch[0]);
        overallScore = structuredFeedback.overall_score || 75;
        console.log('Successfully parsed structured feedback with score:', overallScore);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.log('Failed to parse structured response, using fallback:', parseError);
      // Fallback structure
      structuredFeedback = {
        feedback: {
          formatting_and_design: [generatedText.substring(0, 200) + '...'],
          keywords_and_skills: ['Analysis completed with basic feedback'],
          structure_and_organization: ['Standard resume structure assessed'],
          improvement_recommendations: ['Please review the detailed analysis']
        },
        strengths: ['Resume uploaded successfully'],
        priority_improvements: ['Review AI feedback for detailed suggestions']
      };
    }

    // Update the analysis record with results
    const { error: updateError } = await supabase
      .from('resume_analyses')
      .update({
        structured_feedback: structuredFeedback,
        overall_score: overallScore,
        status: 'completed'
      })
      .eq('id', analysisId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to update analysis: ${updateError.message}`);
    }

    console.log('Analysis updated in database successfully');

    // Send email if Resend API key is available
    if (resendApiKey && analysisRecord.user_email) {
      try {
        console.log('Attempting to send email to:', analysisRecord.user_email);
        const resend = new Resend(resendApiKey);
        
        const emailHtml = generateEmailHtml({
          fileName: analysisRecord.resume_file_name,
          jobRole,
          experienceLevel,
          overallScore,
          structuredFeedback,
          analysisId
        });

        const emailResult = await resend.emails.send({
          from: 'Resume Analyzer <onboarding@resend.dev>',
          to: [analysisRecord.user_email],
          subject: `Your Resume Analysis Results - ${overallScore}/100 Score`,
          html: emailHtml,
        });

        console.log('Resend API response:', emailResult);

        if (emailResult.error) {
          console.error('Resend API error:', emailResult.error);
          throw emailResult.error;
        }

        // Mark email as sent
        await supabase
          .from('resume_analyses')
          .update({ 
            email_sent: true, 
            email_sent_at: new Date().toISOString() 
          })
          .eq('id', analysisId);

        console.log('Email sent successfully to:', analysisRecord.user_email);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the whole analysis if email fails, but log the error
        await supabase
          .from('resume_analyses')
          .update({ 
            email_sent: false,
            email_sent_at: null
          })
          .eq('id', analysisId);
      }
    } else {
      console.log('Email sending skipped - missing RESEND_API_KEY or user email');
    }

    console.log('Successfully completed resume analysis:', analysisId);

    return new Response(JSON.stringify({ 
      success: true, 
      analysisId,
      message: 'Resume analysis completed successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    
    // Try to update status to failed if we have the analysisId
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const body = await req.json().catch(() => ({}));
      if (body.analysisId) {
        await supabase
          .from('resume_analyses')
          .update({ status: 'failed' })
          .eq('id', body.analysisId);
      }
    } catch (updateError) {
      console.error('Failed to update status to failed:', updateError);
    }

    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze resume' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateEmailHtml({ fileName, jobRole, experienceLevel, overallScore, structuredFeedback, analysisId }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#059669'; // green
    if (score >= 60) return '#D97706'; // amber
    return '#DC2626'; // red
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume Analysis Results</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #f0f0f0;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Resume Analysis Complete</h1>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">AI-powered insights for your career success</p>
      </div>

      <!-- Score Card -->
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; border: 1px solid #e2e8f0;">
        <h2 style="margin: 0 0 15px 0; color: #1f2937;">Overall Score</h2>
        <div style="font-size: 48px; font-weight: bold; color: ${getScoreColor(overallScore)}; margin: 10px 0;">
          ${overallScore}/100
        </div>
        <div style="background: ${getScoreColor(overallScore)}; color: white; padding: 6px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 500;">
          ${getScoreStatus(overallScore)}
        </div>
      </div>

      <!-- Analysis Details -->
      <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Analysis Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Resume:</td>
            <td style="padding: 8px 0; color: #111827;">${fileName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Target Role:</td>
            <td style="padding: 8px 0; color: #111827;">${jobRole}</td>
          </tr>
          ${experienceLevel ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Experience Level:</td>
            <td style="padding: 8px 0; color: #111827;">${experienceLevel}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- Key Strengths -->
      ${structuredFeedback.strengths ? `
      <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">✨ Key Strengths</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${structuredFeedback.strengths.map(strength => `
            <li style="margin-bottom: 8px; color: #0f172a;">${strength}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Priority Improvements -->
      ${structuredFeedback.priority_improvements ? `
      <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🎯 Priority Improvements</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${structuredFeedback.priority_improvements.map(improvement => `
            <li style="margin-bottom: 8px; color: #0f172a;">${improvement}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Detailed Feedback Sections -->
      ${Object.entries(structuredFeedback.feedback || {}).map(([category, points]) => {
        const categoryTitles = {
          'formatting_and_design': '🎨 Formatting & Design',
          'keywords_and_skills': '🔑 Keywords & Skills',
          'structure_and_organization': '📋 Structure & Organization',
          'improvement_recommendations': '💡 Improvement Recommendations'
        };
        
        return `
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">${categoryTitles[category] || category}</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${points.map(point => `
              <li style="margin-bottom: 10px; color: #4b5563; line-height: 1.5;">${point}</li>
            `).join('')}
          </ul>
        </div>
        `;
      }).join('')}

      <!-- Footer -->
      <div style="text-align: center; padding: 30px 0; border-top: 1px solid #e5e7eb; margin-top: 40px;">
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          This analysis was generated by AI and provides general guidance.<br>
          Consider consulting with career professionals for personalized advice.
        </p>
        <p style="color: #9ca3af; margin: 15px 0 0 0; font-size: 12px;">
          Analysis ID: ${analysisId}
        </p>
      </div>

    </body>
    </html>
  `;
}
