export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      evidence_findings: {
        Row: {
          capability: string
          created_at: string
          evidence_reference: string | null
          explanation: string
          finding_status: Database["public"]["Enums"]["finding_status"]
          id: string
          profile_id: string
          sort_order: number
        }
        Insert: {
          capability: string
          created_at?: string
          evidence_reference?: string | null
          explanation: string
          finding_status: Database["public"]["Enums"]["finding_status"]
          id?: string
          profile_id: string
          sort_order: number
        }
        Update: {
          capability?: string
          created_at?: string
          evidence_reference?: string | null
          explanation?: string
          finding_status?: Database["public"]["Enums"]["finding_status"]
          id?: string
          profile_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "evidence_findings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "evidence_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_profiles: {
        Row: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        Insert: {
          confirmed_at?: string | null
          correction_message?: string | null
          correction_requested_at?: string | null
          created_at?: string
          delivered_at?: string | null
          evidence_context_snapshot: Json
          id?: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations?: Json
          review_version: number
          reviewed_at?: string | null
          submission_id: string
          supersedes_profile_id?: string | null
        }
        Update: {
          confirmed_at?: string | null
          correction_message?: string | null
          correction_requested_at?: string | null
          created_at?: string
          delivered_at?: string | null
          evidence_context_snapshot?: Json
          id?: string
          person_id?: string
          professional_intent_snapshot?: Json
          recommendations?: Json
          review_version?: number
          reviewed_at?: string | null
          submission_id?: string
          supersedes_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_profiles_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_profiles_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "evidence_review_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_profiles_submission_person_fkey"
            columns: ["submission_id", "person_id"]
            isOneToOne: false
            referencedRelation: "evidence_review_submissions"
            referencedColumns: ["id", "person_id"]
          },
          {
            foreignKeyName: "evidence_profiles_supersedes_profile_id_fkey"
            columns: ["supersedes_profile_id"]
            isOneToOne: false
            referencedRelation: "evidence_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_profiles_supersedes_submission_fkey"
            columns: ["supersedes_profile_id", "submission_id"]
            isOneToOne: false
            referencedRelation: "evidence_profiles"
            referencedColumns: ["id", "submission_id"]
          },
        ]
      }
      evidence_review_submissions: {
        Row: {
          campaign: string | null
          coherence_details: Json
          coherence_reviewed_at: string | null
          coherence_status: Database["public"]["Enums"]["coherence_status"]
          created_at: string
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          evidence_url: string | null
          id: string
          individual_contribution: string
          last_meaningful_activity_at: string | null
          opportunity_status: Database["public"]["Enums"]["opportunity_status"]
          person_id: string
          professional_context: string | null
          professional_intents: Database["public"]["Enums"]["professional_intent"][]
          review_consent_at: string
          review_consent_text: string
          review_consent_version: string
          review_state: Database["public"]["Enums"]["review_state"]
          reviewer_reference: string | null
          source: Database["public"]["Enums"]["attribution_source"]
          updated_at: string
        }
        Insert: {
          campaign?: string | null
          coherence_details?: Json
          coherence_reviewed_at?: string | null
          coherence_status?: Database["public"]["Enums"]["coherence_status"]
          created_at?: string
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          evidence_url?: string | null
          id?: string
          individual_contribution: string
          last_meaningful_activity_at?: string | null
          opportunity_status: Database["public"]["Enums"]["opportunity_status"]
          person_id: string
          professional_context?: string | null
          professional_intents?: Database["public"]["Enums"]["professional_intent"][]
          review_consent_at: string
          review_consent_text: string
          review_consent_version: string
          review_state?: Database["public"]["Enums"]["review_state"]
          reviewer_reference?: string | null
          source?: Database["public"]["Enums"]["attribution_source"]
          updated_at?: string
        }
        Update: {
          campaign?: string | null
          coherence_details?: Json
          coherence_reviewed_at?: string | null
          coherence_status?: Database["public"]["Enums"]["coherence_status"]
          created_at?: string
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          evidence_url?: string | null
          id?: string
          individual_contribution?: string
          last_meaningful_activity_at?: string | null
          opportunity_status?: Database["public"]["Enums"]["opportunity_status"]
          person_id?: string
          professional_context?: string | null
          professional_intents?: Database["public"]["Enums"]["professional_intent"][]
          review_consent_at?: string
          review_consent_text?: string
          review_consent_version?: string
          review_state?: Database["public"]["Enums"]["review_state"]
          reviewer_reference?: string | null
          source?: Database["public"]["Enums"]["attribution_source"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_review_submissions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          country: string
          created_at: string
          current_role: string
          email: string
          email_normalized: string | null
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          current_role: string
          email: string
          email_normalized?: string | null
          full_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          current_role?: string
          email?: string
          email_normalized?: string | null
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_access_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          last_used_at: string | null
          profile_id: string
          revoked_at: string | null
          token_hash: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          last_used_at?: string | null
          profile_id: string
          revoked_at?: string | null
          token_hash: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          last_used_at?: string | null
          profile_id?: string
          revoked_at?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_access_tokens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "evidence_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_opt_ins: {
        Row: {
          accepted_at: string | null
          created_at: string
          declined_at: string | null
          id: string
          network_consent_at: string | null
          network_consent_text: string | null
          network_consent_version: string | null
          offered_at: string | null
          opt_in_status: Database["public"]["Enums"]["opt_in_status"]
          person_id: string
          profile_id: string
          updated_at: string
          withdrawn_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          id?: string
          network_consent_at?: string | null
          network_consent_text?: string | null
          network_consent_version?: string | null
          offered_at?: string | null
          opt_in_status?: Database["public"]["Enums"]["opt_in_status"]
          person_id: string
          profile_id: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          id?: string
          network_consent_at?: string | null
          network_consent_text?: string | null
          network_consent_version?: string | null
          offered_at?: string | null
          opt_in_status?: Database["public"]["Enums"]["opt_in_status"]
          person_id?: string
          profile_id?: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talent_opt_ins_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_opt_ins_profile_person_fkey"
            columns: ["profile_id", "person_id"]
            isOneToOne: false
            referencedRelation: "evidence_profiles"
            referencedColumns: ["id", "person_id"]
          },
        ]
      }
      workflow_events: {
        Row: {
          actor_reference: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["workflow_entity_type"]
          event_type: Database["public"]["Enums"]["workflow_event_type"]
          id: string
          metadata: Json
          occurred_at: string
        }
        Insert: {
          actor_reference?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["workflow_entity_type"]
          event_type: Database["public"]["Enums"]["workflow_event_type"]
          id?: string
          metadata?: Json
          occurred_at?: string
        }
        Update: {
          actor_reference?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["workflow_entity_type"]
          event_type?: Database["public"]["Enums"]["workflow_event_type"]
          id?: string
          metadata?: Json
          occurred_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_evidence_profile: {
        Args: { p_actor_reference?: string; p_profile_id: string }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      confirm_evidence_profile_by_token: {
        Args: { p_token_hash: string }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_evidence_profile_revision: {
        Args: {
          p_actor_reference: string
          p_findings: Json
          p_recommendations: Json
          p_submission_id: string
        }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_evidence_profile_v1: {
        Args: {
          p_actor_reference: string
          p_findings: Json
          p_recommendations: Json
          p_submission_id: string
        }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_evidence_profile_version: {
        Args: {
          p_evidence_context_snapshot: Json
          p_professional_intent_snapshot: Json
          p_recommendations?: Json
          p_submission_id: string
        }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      deliver_evidence_profile: {
        Args: { p_actor_reference?: string; p_profile_id: string }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      deliver_evidence_profile_with_token: {
        Args: {
          p_actor_reference: string
          p_expires_at: string
          p_submission_id: string
          p_token_hash: string
        }
        Returns: {
          created_at: string
          expires_at: string
          id: string
          last_used_at: string | null
          profile_id: string
          revoked_at: string | null
          token_hash: string
        }
        SetofOptions: {
          from: "*"
          to: "profile_access_tokens"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_evidence_profile_notification: {
        Args: {
          p_actor_reference: string
          p_profile_id: string
          p_status: string
        }
        Returns: {
          actor_reference: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["workflow_entity_type"]
          event_type: Database["public"]["Enums"]["workflow_event_type"]
          id: string
          metadata: Json
          occurred_at: string
        }
        SetofOptions: {
          from: "*"
          to: "workflow_events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_evidence_review_coherence: {
        Args: {
          p_actor_reference: string
          p_clarification_required?: string
          p_decision: Database["public"]["Enums"]["review_state"]
          p_dimensions: Json
          p_operator_note: string
          p_submission_id: string
        }
        Returns: {
          campaign: string | null
          coherence_details: Json
          coherence_reviewed_at: string | null
          coherence_status: Database["public"]["Enums"]["coherence_status"]
          created_at: string
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          evidence_url: string | null
          id: string
          individual_contribution: string
          last_meaningful_activity_at: string | null
          opportunity_status: Database["public"]["Enums"]["opportunity_status"]
          person_id: string
          professional_context: string | null
          professional_intents: Database["public"]["Enums"]["professional_intent"][]
          review_consent_at: string
          review_consent_text: string
          review_consent_version: string
          review_state: Database["public"]["Enums"]["review_state"]
          reviewer_reference: string | null
          source: Database["public"]["Enums"]["attribution_source"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "evidence_review_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_evidence_review_work_time: {
        Args: {
          p_actor_reference: string
          p_category: string
          p_minutes: number
          p_occurred_at?: string
          p_submission_id: string
        }
        Returns: {
          actor_reference: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["workflow_entity_type"]
          event_type: Database["public"]["Enums"]["workflow_event_type"]
          id: string
          metadata: Json
          occurred_at: string
        }
        SetofOptions: {
          from: "*"
          to: "workflow_events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reissue_evidence_profile_access: {
        Args: {
          p_actor_reference: string
          p_expires_at: string
          p_submission_id: string
          p_token_hash: string
        }
        Returns: {
          created_at: string
          expires_at: string
          id: string
          last_used_at: string | null
          profile_id: string
          revoked_at: string | null
          token_hash: string
        }
        SetofOptions: {
          from: "*"
          to: "profile_access_tokens"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      request_evidence_profile_correction: {
        Args: {
          p_actor_reference?: string
          p_correction_message: string
          p_profile_id: string
        }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      request_evidence_profile_correction_by_token: {
        Args: { p_correction_message: string; p_token_hash: string }
        Returns: {
          confirmed_at: string | null
          correction_message: string | null
          correction_requested_at: string | null
          created_at: string
          delivered_at: string | null
          evidence_context_snapshot: Json
          id: string
          person_id: string
          professional_intent_snapshot: Json
          recommendations: Json
          review_version: number
          reviewed_at: string | null
          submission_id: string
          supersedes_profile_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "evidence_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      revoke_evidence_profile_access: {
        Args: { p_actor_reference: string; p_submission_id: string }
        Returns: number
      }
      transition_review_state: {
        Args: {
          p_actor_reference?: string
          p_submission_id: string
          p_to_state: Database["public"]["Enums"]["review_state"]
        }
        Returns: {
          campaign: string | null
          coherence_details: Json
          coherence_reviewed_at: string | null
          coherence_status: Database["public"]["Enums"]["coherence_status"]
          created_at: string
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          evidence_url: string | null
          id: string
          individual_contribution: string
          last_meaningful_activity_at: string | null
          opportunity_status: Database["public"]["Enums"]["opportunity_status"]
          person_id: string
          professional_context: string | null
          professional_intents: Database["public"]["Enums"]["professional_intent"][]
          review_consent_at: string
          review_consent_text: string
          review_consent_version: string
          review_state: Database["public"]["Enums"]["review_state"]
          reviewer_reference: string | null
          source: Database["public"]["Enums"]["attribution_source"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "evidence_review_submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      transition_talent_opt_in: {
        Args: {
          p_network_consent_at?: string
          p_network_consent_text?: string
          p_network_consent_version?: string
          p_opt_in_id: string
          p_to_state: Database["public"]["Enums"]["opt_in_status"]
        }
        Returns: {
          accepted_at: string | null
          created_at: string
          declined_at: string | null
          id: string
          network_consent_at: string | null
          network_consent_text: string | null
          network_consent_version: string | null
          offered_at: string | null
          opt_in_status: Database["public"]["Enums"]["opt_in_status"]
          person_id: string
          profile_id: string
          updated_at: string
          withdrawn_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "talent_opt_ins"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      attribution_source:
        | "linkedin_manual_discovery"
        | "pyar"
        | "python_colombia"
        | "linkedin_organic"
        | "referral"
        | "direct"
        | "github_discovery"
        | "huggingface_discovery"
      coherence_status:
        | "PENDING"
        | "READY"
        | "CLARIFICATION_NEEDED"
        | "NOT_ACTIONABLE_YET"
      evidence_type:
        | "PUBLIC_REPOSITORY"
        | "PERSONAL_PROJECT"
        | "PROFESSIONAL_PROJECT"
        | "OPEN_SOURCE_CONTRIBUTION"
        | "TECHNICAL_ARTIFACT"
        | "PRIVATE_PROFESSIONAL_EXPERIENCE"
        | "OTHER"
      finding_status:
        | "SUPPORTED"
        | "PARTIAL"
        | "UNKNOWN"
        | "NEEDS_CLARIFICATION"
      opportunity_status: "OPEN" | "REVIEW_ONLY" | "NOT_LOOKING"
      opt_in_status: "NOT_OFFERED" | "OFFERED" | "ACCEPTED" | "DECLINED"
      professional_intent: "FULL_TIME" | "FREELANCE" | "CONTRACT" | "PART_TIME"
      review_state:
        | "SUBMITTED"
        | "CLARIFICATION_NEEDED"
        | "NOT_ACTIONABLE_YET"
        | "READY_FOR_REVIEW"
        | "REVIEW_IN_PROGRESS"
        | "REVIEW_DELIVERED"
        | "CORRECTION_REQUESTED"
        | "REVIEW_CONFIRMED"
      workflow_entity_type:
        | "PERSON"
        | "SUBMISSION"
        | "PROFILE"
        | "OPT_IN"
        | "ACCESS_TOKEN"
      workflow_event_type:
        | "SUBMISSION_CREATED"
        | "REVIEW_STATE_CHANGED"
        | "COHERENCE_REVIEWED"
        | "PROFILE_VERSION_CREATED"
        | "PROFILE_DELIVERED"
        | "CORRECTION_REQUESTED"
        | "PROFILE_CONFIRMED"
        | "OPT_IN_OFFERED"
        | "OPT_IN_ACCEPTED"
        | "OPT_IN_DECLINED"
        | "ACCESS_TOKEN_CREATED"
        | "ACCESS_TOKEN_REVOKED"
        | "WORK_RECORDED"
        | "PROFILE_NOTIFICATION_RECORDED"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attribution_source: [
        "linkedin_manual_discovery",
        "pyar",
        "python_colombia",
        "linkedin_organic",
        "referral",
        "direct",
        "github_discovery",
        "huggingface_discovery",
      ],
      coherence_status: [
        "PENDING",
        "READY",
        "CLARIFICATION_NEEDED",
        "NOT_ACTIONABLE_YET",
      ],
      evidence_type: [
        "PUBLIC_REPOSITORY",
        "PERSONAL_PROJECT",
        "PROFESSIONAL_PROJECT",
        "OPEN_SOURCE_CONTRIBUTION",
        "TECHNICAL_ARTIFACT",
        "PRIVATE_PROFESSIONAL_EXPERIENCE",
        "OTHER",
      ],
      finding_status: [
        "SUPPORTED",
        "PARTIAL",
        "UNKNOWN",
        "NEEDS_CLARIFICATION",
      ],
      opportunity_status: ["OPEN", "REVIEW_ONLY", "NOT_LOOKING"],
      opt_in_status: ["NOT_OFFERED", "OFFERED", "ACCEPTED", "DECLINED"],
      professional_intent: ["FULL_TIME", "FREELANCE", "CONTRACT", "PART_TIME"],
      review_state: [
        "SUBMITTED",
        "CLARIFICATION_NEEDED",
        "NOT_ACTIONABLE_YET",
        "READY_FOR_REVIEW",
        "REVIEW_IN_PROGRESS",
        "REVIEW_DELIVERED",
        "CORRECTION_REQUESTED",
        "REVIEW_CONFIRMED",
      ],
      workflow_entity_type: [
        "PERSON",
        "SUBMISSION",
        "PROFILE",
        "OPT_IN",
        "ACCESS_TOKEN",
      ],
      workflow_event_type: [
        "SUBMISSION_CREATED",
        "REVIEW_STATE_CHANGED",
        "COHERENCE_REVIEWED",
        "PROFILE_VERSION_CREATED",
        "PROFILE_DELIVERED",
        "CORRECTION_REQUESTED",
        "PROFILE_CONFIRMED",
        "OPT_IN_OFFERED",
        "OPT_IN_ACCEPTED",
        "OPT_IN_DECLINED",
        "ACCESS_TOKEN_CREATED",
        "ACCESS_TOKEN_REVOKED",
        "WORK_RECORDED",
        "PROFILE_NOTIFICATION_RECORDED",
      ],
    },
  },
} as const

export type Person = Database["public"]["Tables"]["people"]["Row"]
export type EvidenceReviewSubmission =
  Database["public"]["Tables"]["evidence_review_submissions"]["Row"]
export type EvidenceProfile =
  Database["public"]["Tables"]["evidence_profiles"]["Row"]
export type EvidenceFinding =
  Database["public"]["Tables"]["evidence_findings"]["Row"]
export type TalentOptIn =
  Database["public"]["Tables"]["talent_opt_ins"]["Row"]
export type ProfileAccessToken =
  Database["public"]["Tables"]["profile_access_tokens"]["Row"]
export type WorkflowEvent =
  Database["public"]["Tables"]["workflow_events"]["Row"]
