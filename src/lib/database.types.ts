// Generated from the live Supabase schema (learnerdriver-academy project).
// Regenerate after schema changes rather than hand-editing.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
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
          calendar_event_id: string | null;
          created_at: string;
          date: string;
          end_time: string;
          id: string;
          lesson_type_slug: string;
          notes: string | null;
          payment_method: string | null;
          price: number;
          start_time: string;
          status: string;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          calendar_event_id?: string | null;
          created_at?: string;
          date: string;
          end_time: string;
          id?: string;
          lesson_type_slug: string;
          notes?: string | null;
          payment_method?: string | null;
          price: number;
          start_time: string;
          status?: string;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          calendar_event_id?: string | null;
          created_at?: string;
          date?: string;
          end_time?: string;
          id?: string;
          lesson_type_slug?: string;
          notes?: string | null;
          payment_method?: string | null;
          price?: number;
          start_time?: string;
          status?: string;
          student_id?: string;
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
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          notes: string | null;
          phone: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          phone: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          phone?: string;
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
          p_date: string;
          p_email?: string;
          p_end_time: string;
          p_lesson_type_slug: string;
          p_name: string;
          p_notes?: string;
          p_phone: string;
          p_price: number;
          p_start_time: string;
        };
        Returns: string;
      };
      cancel_booking: {
        Args: { p_booking_id: string };
        Returns: string;
      };
      confirm_bank_transfer: {
        Args: { p_booking_id: string };
        Returns: undefined;
      };
      create_bank_transfer_booking: {
        Args: {
          p_date: string;
          p_email?: string;
          p_end_time: string;
          p_lesson_type_slug: string;
          p_name: string;
          p_notes?: string;
          p_phone: string;
          p_price: number;
          p_start_time: string;
        };
        Returns: string;
      };
      get_booking_for_notification: {
        Args: { p_booking_id: string };
        Returns: {
          booking_id: string;
          date: string;
          end_time: string;
          lesson_type_name: string;
          lesson_type_slug: string;
          payment_method: string;
          price: number;
          start_time: string;
          status: string;
          student_email: string;
          student_name: string;
          student_phone: string;
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
