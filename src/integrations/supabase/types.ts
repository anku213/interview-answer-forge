export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_interviews: {
        Row: {
          created_at: string
          difficulty_level: string
          experience_level: string
          id: string
          status: string
          technology: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty_level: string
          experience_level: string
          id?: string
          status?: string
          technology: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty_level?: string
          experience_level?: string
          id?: string
          status?: string
          technology?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      challenge_solutions: {
        Row: {
          author_name: string | null
          challenge_id: string | null
          content: string
          created_at: string
          id: string
          language: string | null
          title: string
          upvotes: number | null
        }
        Insert: {
          author_name?: string | null
          challenge_id?: string | null
          content: string
          created_at?: string
          id?: string
          language?: string | null
          title: string
          upvotes?: number | null
        }
        Update: {
          author_name?: string | null
          challenge_id?: string | null
          content?: string
          created_at?: string
          id?: string
          language?: string | null
          title?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_solutions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_questions: {
        Row: {
          ai_explanation: string | null
          ai_hint: string | null
          company_id: string
          content: string
          created_at: string
          difficulty: string
          id: string
          question_type: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_explanation?: string | null
          ai_hint?: string | null
          company_id: string
          content: string
          created_at?: string
          difficulty: string
          id?: string
          question_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_explanation?: string | null
          ai_hint?: string | null
          company_id?: string
          content?: string
          created_at?: string
          difficulty?: string
          id?: string
          question_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_questions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cron_configurations: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean
          job_name: string
          last_run_at: string | null
          next_run_at: string | null
          schedule: string
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          job_name: string
          last_run_at?: string | null
          next_run_at?: string | null
          schedule: string
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          job_name?: string
          last_run_at?: string | null
          next_run_at?: string | null
          schedule?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          ai_hint: string | null
          challenge_date: string
          content: string
          created_at: string
          difficulty: string
          id: string
          question_type: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_hint?: string | null
          challenge_date: string
          content: string
          created_at?: string
          difficulty: string
          id?: string
          question_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_hint?: string | null
          challenge_date?: string
          content?: string
          created_at?: string
          difficulty?: string
          id?: string
          question_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      interview_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          interview_id: string
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          interview_id: string
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          interview_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_messages_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "ai_interviews"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          answer: string
          category: string
          code: string
          created_at: string
          id: string
          language: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          category?: string
          code?: string
          created_at?: string
          id?: string
          language?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          category?: string
          code?: string
          created_at?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_analyses: {
        Row: {
          ai_feedback_formatting: string | null
          ai_feedback_keywords: string | null
          ai_feedback_structure: string | null
          created_at: string
          email_sent: boolean | null
          email_sent_at: string | null
          experience_level: string | null
          id: string
          improvement_suggestions: string | null
          job_role: string
          overall_score: number | null
          resume_file_name: string
          resume_file_url: string | null
          status: string | null
          structured_feedback: Json | null
          updated_at: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          ai_feedback_formatting?: string | null
          ai_feedback_keywords?: string | null
          ai_feedback_structure?: string | null
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          experience_level?: string | null
          id?: string
          improvement_suggestions?: string | null
          job_role: string
          overall_score?: number | null
          resume_file_name: string
          resume_file_url?: string | null
          status?: string | null
          structured_feedback?: Json | null
          updated_at?: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          ai_feedback_formatting?: string | null
          ai_feedback_keywords?: string | null
          ai_feedback_structure?: string | null
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          experience_level?: string | null
          id?: string
          improvement_suggestions?: string | null
          job_role?: string
          overall_score?: number | null
          resume_file_name?: string
          resume_file_url?: string | null
          status?: string | null
          structured_feedback?: Json | null
          updated_at?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string
          gemini_api_key: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gemini_api_key?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gemini_api_key?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_challenge_stats: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_completion_date: string | null
          longest_streak: number | null
          total_completed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_completion_date?: string | null
          longest_streak?: number | null
          total_completed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_completion_date?: string | null
          longest_streak?: number | null
          total_completed?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_challenge_submissions: {
        Row: {
          answer: string
          bookmarked: boolean | null
          challenge_id: string | null
          id: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          answer: string
          bookmarked?: boolean | null
          challenge_id?: string | null
          id?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          bookmarked?: boolean | null
          challenge_id?: string | null
          id?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          bookmarked: boolean | null
          created_at: string
          id: string
          notes: string | null
          question_id: string
          solved: boolean | null
          updated_at: string
          user_answer: string | null
          user_id: string
        }
        Insert: {
          bookmarked?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          question_id: string
          solved?: boolean | null
          updated_at?: string
          user_answer?: string | null
          user_id: string
        }
        Update: {
          bookmarked?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          question_id?: string
          solved?: boolean | null
          updated_at?: string
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "company_questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
