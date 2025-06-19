import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  title: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  ai_hint: string | null;
  question_type: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeSolution {
  id: string;
  challenge_id: string;
  title: string;
  content: string;
  language: string;
  author_name: string | null;
  upvotes: number;
  created_at: string;
}

export interface UserSubmission {
  id: string;
  user_id: string;
  challenge_id: string;
  answer: string;
  submitted_at: string;
  bookmarked: boolean;
}

export interface UserStats {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_completed: number;
  last_completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useDailyChallenges = () => {
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);
  const [userSubmission, setUserSubmission] = useState<UserSubmission | null>(null);
  const [solutions, setSolutions] = useState<ChallengeSolution[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTodayChallenge = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today challenge:', error);
        return;
      }

      if (data) {
        // Type cast the difficulty field to ensure it matches our interface
        const typedChallenge: DailyChallenge = {
          ...data,
          difficulty: data.difficulty as 'Easy' | 'Medium' | 'Hard'
        };
        setTodayChallenge(typedChallenge);
        
        if (user) {
          await fetchUserSubmission(data.id);
        }
      }
    } catch (error) {
      console.error('Error fetching today challenge:', error);
    }
  };

  const fetchUserSubmission = async (challengeId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_challenge_submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user submission:', error);
        return;
      }

      setUserSubmission(data);
    } catch (error) {
      console.error('Error fetching user submission:', error);
    }
  };

  const fetchSolutions = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_solutions')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('upvotes', { ascending: false });

      if (error) {
        console.error('Error fetching solutions:', error);
        return;
      }

      setSolutions(data || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_challenge_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user stats:', error);
        return;
      }

      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!user || !todayChallenge) return;

    try {
      const { error } = await supabase
        .from('user_challenge_submissions')
        .insert([
          {
            user_id: user.id,
            challenge_id: todayChallenge.id,
            answer: answer
          }
        ]);

      if (error) {
        console.error('Error submitting answer:', error);
        toast({
          title: "Error",
          description: "Failed to submit your answer",
          variant: "destructive"
        });
        return;
      }

      await fetchUserSubmission(todayChallenge.id);
      await updateUserStats();
      
      toast({
        title: "Success",
        description: "Your answer has been submitted!"
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit your answer",
        variant: "destructive"
      });
    }
  };

  const updateUserStats = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current stats
      const { data: currentStats } = await supabase
        .from('user_challenge_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (currentStats) {
        // Update existing stats
        const newStreak = currentStats.last_completion_date === 
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
          ? currentStats.current_streak + 1 
          : 1;

        const { error } = await supabase
          .from('user_challenge_stats')
          .update({
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, currentStats.longest_streak),
            total_completed: currentStats.total_completed + 1,
            last_completion_date: today,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating user stats:', error);
        }
      } else {
        // Create new stats
        const { error } = await supabase
          .from('user_challenge_stats')
          .insert([
            {
              user_id: user.id,
              current_streak: 1,
              longest_streak: 1,
              total_completed: 1,
              last_completion_date: today
            }
          ]);

        if (error) {
          console.error('Error creating user stats:', error);
        }
      }

      await fetchUserStats();
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTodayChallenge();
      if (user) {
        await fetchUserStats();
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (todayChallenge) {
      fetchSolutions(todayChallenge.id);
    }
  }, [todayChallenge]);

  return {
    todayChallenge,
    userSubmission,
    solutions,
    userStats,
    loading,
    submitAnswer,
    fetchSolutions
  };
};
