
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface AIInterview {
  id: string;
  user_id: string;
  title: string;
  technology: string;
  experience_level: string;
  difficulty_level: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewMessage {
  id: string;
  interview_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const useAIInterviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all interviews
  const { data: interviews = [], isLoading: loading } = useQuery({
    queryKey: ['ai-interviews'],
    queryFn: async (): Promise<AIInterview[]> => {
      const { data, error } = await supabase
        .from('ai_interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interviews:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Create interview mutation
  const createInterviewMutation = useMutation({
    mutationFn: async (interviewData: {
      title: string;
      technology: string;
      experience_level: string;
      difficulty_level: string;
    }): Promise<AIInterview> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ai_interviews')
        .insert([{
          ...interviewData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating interview:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-interviews'] });
      toast({
        title: "Interview Created",
        description: "Your AI interview has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Create interview error:', error);
      toast({
        title: "Error",
        description: "Failed to create interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update interview mutation
  const updateInterviewMutation = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Omit<AIInterview, 'id' | 'user_id' | 'created_at'>>
    }): Promise<AIInterview> => {
      const { data, error } = await supabase
        .from('ai_interviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating interview:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-interviews'] });
    },
    onError: (error) => {
      console.error('Update interview error:', error);
      toast({
        title: "Error",
        description: "Failed to update interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete interview mutation
  const deleteInterviewMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('ai_interviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting interview:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-interviews'] });
      toast({
        title: "Interview Deleted",
        description: "The interview has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Delete interview error:', error);
      toast({
        title: "Error",
        description: "Failed to delete interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    interviews,
    loading,
    createInterview: createInterviewMutation.mutateAsync,
    updateInterview: updateInterviewMutation.mutateAsync,
    deleteInterview: deleteInterviewMutation.mutateAsync,
    isCreating: createInterviewMutation.isPending,
    isUpdating: updateInterviewMutation.isPending,
    isDeleting: deleteInterviewMutation.isPending,
  };
};

// Hook for managing a single interview
export const useAIInterview = (interviewId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch single interview
  const { data: interview, isLoading: interviewLoading } = useQuery({
    queryKey: ['ai-interview', interviewId],
    queryFn: async (): Promise<AIInterview | null> => {
      const { data, error } = await supabase
        .from('ai_interviews')
        .select('*')
        .eq('id', interviewId)
        .single();

      if (error) {
        console.error('Error fetching interview:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user && !!interviewId,
  });

  // Fetch interview messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['interview-messages', interviewId],
    queryFn: async (): Promise<InterviewMessage[]> => {
      const { data, error } = await supabase
        .from('interview_messages')
        .select('*')
        .eq('interview_id', interviewId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user && !!interviewId,
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: async (messageData: {
      role: 'user' | 'assistant';
      content: string;
    }): Promise<InterviewMessage> => {
      const { data, error } = await supabase
        .from('interview_messages')
        .insert([{
          interview_id: interviewId,
          ...messageData,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-messages', interviewId] });
    },
    onError: (error) => {
      console.error('Add message error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    interview,
    messages,
    loading: interviewLoading || messagesLoading,
    addMessage: addMessageMutation.mutateAsync,
    isAddingMessage: addMessageMutation.isPending,
  };
};
