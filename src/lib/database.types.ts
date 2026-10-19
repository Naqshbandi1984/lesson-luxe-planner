// INTERIM: generated from the throwaway test project (lbquzzkmyxebcjfjihlo),
// not the live learnerdriver-academy project — the address/dashboard
// migration hasn't been merged to production yet. The throwaway's schema is
// the exact target shape (same migration file), so this is accurate for
// local dev/typecheck now. Regenerate from the real project once
// supabase/migrations/20261018_address_fields_and_admin_dashboard.sql is
// approved and merged to production.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admins: {
        Row: {
          user_id: string;
        };
        Insert: {
          user_id: string;
        };
        Update: {
          user_id?: string;
        };
        Relationships: [];
      };
      availability: {
        Row: {
          created_at: string;
          date: string;
          end_time: string | null;
          id: string;
          reason: string | null;
          start_time: string | null;
        };
        Insert: {
          created_at?: string;
          date: string;
          end_time?: string | null;
          id?: string;
          reason?: string | null;
          start_time?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string;
          end_time?: string | null;
          id?: string;
          reason?: string | null;
          start_time?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          address_line1: string | null;
          calendar_event_id: string | null;
          cancelled_at: string | null;
          created_at: string;
          date: string;
          end_time: string;
          id: string;
          lesson_type_slug: string;
          notes: string | null;
          payment_method: string | null;
          postcode: string | null;
          price: number;
          start_time: string;
          status: string;
          student_id: string;
          town: string | null;
          updated_at: string;
        };
        Insert: {
          address_line1?: string | null;
          calendar_event_id?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          date: string;
          end_time: string;
          id?: string;
          lesson_type_slug: string;
          notes?: string | null;
          payment_method?: string | null;
          postcode?: string | null;
          price: number;
          start_time: string;
          status?: string;
          student_id: string;
          town?: string | null;
          updated_at?: string;
        };
        Update: {
          address_line1?: string | null;
          calendar_event_id?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          date?: string;
          end_time?: string;
          id?: string;
          lesson_type_slug?: string;
          notes?: string | null;
          payment_method?: string | null;
          postcode?: string | null;
          price?: number;
          start_time?: string;
          status?: string;
          student_id?: string;
          town?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_lesson_type_slug_fkey";
            columns: ["lesson_type_slug"];
            isOneToOne: false;
            referencedRelation: "lesson_types";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "bookings_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_types: {
        Row: {
          active: boolean;
          blurb: string;
          bullets: string[];
          created_at: string;
          duration_minutes: number;
          name: string;
          short: string;
          slug: string;
        };
        Insert: {
          active?: boolean;
          blurb: string;
          bullets?: string[];
          created_at?: string;
          duration_minutes?: number;
          name: string;
          short: string;
          slug: string;
        };
        Update: {
          active?: boolean;
          blurb?: string;
          bullets?: string[];
          created_at?: string;
          duration_minutes?: number;
          name?: string;
          short?: string;
          slug?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          address_line1: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          notes: string | null;
          phone: string;
          postcode: string | null;
          town: string | null;
          updated_at: string;
        };
        Insert: {
          address_line1?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          phone: string;
          postcode?: string | null;
          town?: string | null;
          updated_at?: string;
        };
        Update: {
          address_line1?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          phone?: string;
          postcode?: string | null;
          town?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      book_lesson: {
        Args: {
          p_address_line1?: string;
          p_date: string;
          p_email?: string;
          p_end_time: string;
          p_lesson_type_slug: string;
          p_name: string;
          p_notes?: string;
          p_phone: string;
          p_postcode?: string;
          p_price: number;
          p_start_time: string;
          p_town?: string;
        };
        Returns: string;
      };
      cancel_booking: { Args: { p_booking_id: string }; Returns: string };
      confirm_bank_transfer: {
        Args: { p_booking_id: string };
        Returns: undefined;
      };
      create_bank_transfer_booking: {
        Args: {
          p_address_line1?: string;
          p_date: string;
          p_email?: string;
          p_end_time: string;
          p_lesson_type_slug: string;
          p_name: string;
          p_notes?: string;
          p_phone: string;
          p_postcode?: string;
          p_price: number;
          p_start_time: string;
          p_town?: string;
        };
        Returns: string;
      };
      get_booking_for_notification: {
        Args: { p_booking_id: string };
        Returns: {
          address_line1: string;
          booking_id: string;
          date: string;
          end_time: string;
          lesson_type_name: string;
          lesson_type_slug: string;
          payment_method: string;
          postcode: string;
          price: number;
          start_time: string;
          status: string;
          student_email: string;
          student_name: string;
          student_phone: string;
          town: string;
        }[];
      };
      get_taken_slots: {
        Args: { p_from: string; p_to: string };
        Returns: {
          date: string;
          end_time: string;
          start_time: string;
        }[];
      };
      is_admin: { Args: never; Returns: boolean };
      list_all_bookings: {
        Args: never;
        Returns: {
          booking_id: string;
          created_at: string;
          date: string;
          end_time: string;
          lesson_type_slug: string;
          notes: string;
          payment_method: string;
          price: number;
          start_time: string;
          status: string;
          student_email: string;
          student_name: string;
          student_phone: string;
        }[];
      };
      list_bookings_admin: {
        Args: {
          p_from?: string;
          p_limit?: number;
          p_offset?: number;
          p_status?: string;
          p_to?: string;
        };
        Returns: {
          address_line1: string;
          booking_id: string;
          calendar_event_id: string;
          cancelled_at: string;
          created_at: string;
          date: string;
          end_time: string;
          lesson_type_slug: string;
          notes: string;
          payment_method: string;
          postcode: string;
          price: number;
          start_time: string;
          status: string;
          student_email: string;
          student_id: string;
          student_name: string;
          student_phone: string;
          total_count: number;
          town: string;
        }[];
      };
      list_bookings_for_student: {
        Args: { p_student_id: string };
        Returns: {
          address_line1: string;
          booking_id: string;
          calendar_event_id: string;
          cancelled_at: string;
          created_at: string;
          date: string;
          end_time: string;
          lesson_type_slug: string;
          notes: string;
          payment_method: string;
          postcode: string;
          price: number;
          start_time: string;
          status: string;
          town: string;
        }[];
      };
      list_pending_bank_transfer_bookings: {
        Args: never;
        Returns: {
          booking_id: string;
          created_at: string;
          date: string;
          end_time: string;
          lesson_type_slug: string;
          notes: string;
          price: number;
          slot_taken_elsewhere: boolean;
          start_time: string;
          student_email: string;
          student_name: string;
          student_phone: string;
        }[];
      };
      list_students_admin: {
        Args: { p_search?: string };
        Returns: {
          address_line1: string;
          email: string;
          last_lesson_date: string;
          name: string;
          next_lesson_date: string;
          phone: string;
          postcode: string;
          student_id: string;
          total_lessons: number;
          town: string;
        }[];
      };
      list_upcoming_lessons_for_phone: {
        Args: { p_phone: string };
        Returns: {
          date: string;
          end_time: string;
          lesson_type_slug: string;
          start_time: string;
          status: string;
        }[];
      };
      set_booking_calendar_event_id: {
        Args: { p_booking_id: string; p_calendar_event_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
