
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AnalyzeResumeParams {
  file: File;
  jobRole: string;
  experienceLevel?: string;
  userEmail?: string;
}

export const useResumeAnalyzer = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const analyzeResume = async (params: AnalyzeResumeParams) => {
    const { file, jobRole, experienceLevel, userEmail } = params;
    
    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user?.id || 'anonymous'}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    // Create initial analysis record
    const { data: analysisData, error: insertError } = await supabase
      .from('resume_analyses')
      .insert([{
        user_id: user?.id || null,
        user_email: userEmail || user?.email || null,
        resume_file_name: file.name,
        resume_file_url: publicUrl,
        job_role: jobRole,
        experience_level: experienceLevel,
        status: 'processing'
      }])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // Start AI analysis
    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          analysisId: analysisData.id,
          fileUrl: publicUrl,
          fileName: file.name,
          jobRole,
          experienceLevel
        }
      });

      if (error) {
        throw new Error(`AI analysis failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      // Update status to failed if AI analysis fails
      await supabase
        .from('resume_analyses')
        .update({ status: 'failed' })
        .eq('id', analysisData.id);
      
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-analyses'] });
    },
  });

  return {
    analyzeResume: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
};

export const useResumeAnalyses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['resume-analyses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch analyses: ${error.message}`);
      }

      return data;
    },
    enabled: !!user,
  });
};
