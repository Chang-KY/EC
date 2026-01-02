export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  ec: {
    Tables: {
      admins: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          last_login: string | null
          level: number
          name: string | null
          phone: string | null
          role: Database["ec"]["Enums"]["user_role"]
          status: Database["ec"]["Enums"]["admin_status"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          last_login?: string | null
          level?: number
          name?: string | null
          phone?: string | null
          role?: Database["ec"]["Enums"]["user_role"]
          status?: Database["ec"]["Enums"]["admin_status"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          level?: number
          name?: string | null
          phone?: string | null
          role?: Database["ec"]["Enums"]["user_role"]
          status?: Database["ec"]["Enums"]["admin_status"]
        }
        Relationships: []
      }
      categories: {
        Row: {
          depth: number | null
          id: number
          name: string
          parent_id: number | null
          path: unknown
          selectable: boolean | null
          slug: string
        }
        Insert: {
          depth?: number | null
          id?: number
          name: string
          parent_id?: number | null
          path?: unknown
          selectable?: boolean | null
          slug: string
        }
        Update: {
          depth?: number | null
          id?: number
          name?: string
          parent_id?: number | null
          path?: unknown
          selectable?: boolean | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_roles: {
        Row: {
          code: string
          label: string
        }
        Insert: {
          code: string
          label: string
        }
        Update: {
          code?: string
          label?: string
        }
        Relationships: []
      }
      coupon_categories: {
        Row: {
          category_id: number
          coupon_id: number
          created_at: string
        }
        Insert: {
          category_id: number
          coupon_id: number
          created_at?: string
        }
        Update: {
          category_id?: number
          coupon_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_categories_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_products: {
        Row: {
          coupon_id: number
          created_at: string
          product_id: number
        }
        Insert: {
          coupon_id: number
          created_at?: string
          product_id: number
        }
        Update: {
          coupon_id?: number
          created_at?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupon_products_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          category_mode: Database["ec"]["Enums"]["apply_mode"] | null
          coupon_code: string | null
          coupon_kind: Database["ec"]["Enums"]["coupon_kind"]
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: Database["ec"]["Enums"]["discount_type"]
          discount_value: number
          ends_at: string | null
          id: number
          is_active: boolean
          max_discount: number | null
          max_issue: number | null
          max_per_user: number
          max_redemptions: number | null
          min_order_amount: number | null
          name: string
          notes: string | null
          product_mode: Database["ec"]["Enums"]["apply_mode"]
          stackable: boolean
          starts_at: string | null
        }
        Insert: {
          category_mode?: Database["ec"]["Enums"]["apply_mode"] | null
          coupon_code?: string | null
          coupon_kind: Database["ec"]["Enums"]["coupon_kind"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type: Database["ec"]["Enums"]["discount_type"]
          discount_value: number
          ends_at?: string | null
          id?: number
          is_active?: boolean
          max_discount?: number | null
          max_issue?: number | null
          max_per_user?: number
          max_redemptions?: number | null
          min_order_amount?: number | null
          name: string
          notes?: string | null
          product_mode: Database["ec"]["Enums"]["apply_mode"]
          stackable?: boolean
          starts_at?: string | null
        }
        Update: {
          category_mode?: Database["ec"]["Enums"]["apply_mode"] | null
          coupon_code?: string | null
          coupon_kind?: Database["ec"]["Enums"]["coupon_kind"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: Database["ec"]["Enums"]["discount_type"]
          discount_value?: number
          ends_at?: string | null
          id?: number
          is_active?: boolean
          max_discount?: number | null
          max_issue?: number | null
          max_per_user?: number
          max_redemptions?: number | null
          min_order_amount?: number | null
          name?: string
          notes?: string | null
          product_mode?: Database["ec"]["Enums"]["apply_mode"]
          stackable?: boolean
          starts_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          price: number
          product_id: number | null
          quantity: number
        }
        Insert: {
          id?: number
          order_id?: number | null
          price: number
          product_id?: number | null
          quantity: number
        }
        Update: {
          id?: number
          order_id?: number | null
          price?: number
          product_id?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: number
          status: string | null
          total_price: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string | null
          total_price: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string | null
          total_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: number
          product_id: number
          role_code: string
          sort_order: number
        }
        Insert: {
          category_id: number
          product_id: number
          role_code?: string
          sort_order?: number
        }
        Update: {
          category_id?: number
          product_id?: number
          role_code?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_role_code_fkey"
            columns: ["role_code"]
            isOneToOne: false
            referencedRelation: "category_roles"
            referencedColumns: ["code"]
          },
        ]
      }
      product_comment_images: {
        Row: {
          created_at: string | null
          id: number
          product_comment_id: number
          sort_order: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          product_comment_id: number
          sort_order?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: never
          product_comment_id?: number
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comment_images_product_comment_id_fkey"
            columns: ["product_comment_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comment_replies: {
        Row: {
          content: string
          created_at: string | null
          id: number
          product_comment_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          product_comment_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          product_comment_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comment_replies_product_comment_id_fkey"
            columns: ["product_comment_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comment_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comments: {
        Row: {
          content: string
          created_at: string | null
          id: number
          is_hidden: boolean | null
          product_id: number
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          is_hidden?: boolean | null
          product_id: number
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          is_hidden?: boolean | null
          product_id?: number
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          height: number | null
          id: number
          mime_type: string | null
          product_id: number
          role: Database["ec"]["Enums"]["product_image_role"]
          sort_order: number
          storage_path: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          created_at?: string
          height?: number | null
          id?: number
          mime_type?: string | null
          product_id: number
          role: Database["ec"]["Enums"]["product_image_role"]
          sort_order?: number
          storage_path: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          created_at?: string
          height?: number | null
          id?: number
          mime_type?: string | null
          product_id?: number
          role?: Database["ec"]["Enums"]["product_image_role"]
          sort_order?: number
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_likes: {
        Row: {
          created_at: string
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string | null
          product_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string | null
          product_id: number
          tag_id: number
        }
        Update: {
          created_at?: string | null
          product_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          discount_type: Database["ec"]["Enums"]["discount_type"]
          id: number
          name: string
          price: number
          sale_price: number | null
          sale_rate: number | null
          status: Database["ec"]["Enums"]["product_status"] | null
          stock: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_type?: Database["ec"]["Enums"]["discount_type"]
          id?: number
          name: string
          price: number
          sale_price?: number | null
          sale_rate?: number | null
          status?: Database["ec"]["Enums"]["product_status"] | null
          stock?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_type?: Database["ec"]["Enums"]["discount_type"]
          id?: number
          name?: string
          price?: number
          sale_price?: number | null
          sale_rate?: number | null
          status?: Database["ec"]["Enums"]["product_status"] | null
          stock?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          id: string
          links: Json | null
          name: string | null
          phone: string | null
          phone_verified: boolean | null
          settings: Json | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          id: string
          links?: Json | null
          name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          settings?: Json | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          id?: string
          links?: Json | null
          name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          settings?: Json | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_coupons: {
        Row: {
          coupon_id: number
          id: number
          is_used: boolean
          issued_at: string
          order_id: number | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id: number
          id?: number
          is_used?: boolean
          issued_at?: string
          order_id?: number | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: number
          id?: number
          is_used?: boolean
          issued_at?: string
          order_id?: number | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coupons_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coupons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_product_detail: { Args: { p_id: number }; Returns: Json }
    }
    Enums: {
      admin_status: "active" | "suspended" | "revoked"
      apply_mode: "exclude" | "include" | "all"
      coupon_kind: "general" | "code"
      discount_type: "rate" | "fixed" | "none"
      order_status:
        | "pending"
        | "paid"
        | "preparing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refund_requested"
        | "refunded"
        | "payment_failed"
      product_category_role_code: "primary" | "secondary"
      product_image_role: "thumbnail" | "gallery" | "description"
      product_status: "active" | "hidden" | "sold_out"
      user_role: "admin" | "super_admin" | "viewer" | "manager"
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
  ec: {
    Enums: {
      admin_status: ["active", "suspended", "revoked"],
      apply_mode: ["exclude", "include", "all"],
      coupon_kind: ["general", "code"],
      discount_type: ["rate", "fixed", "none"],
      order_status: [
        "pending",
        "paid",
        "preparing",
        "shipped",
        "delivered",
        "cancelled",
        "refund_requested",
        "refunded",
        "payment_failed",
      ],
      product_category_role_code: ["primary", "secondary"],
      product_image_role: ["thumbnail", "gallery", "description"],
      product_status: ["active", "hidden", "sold_out"],
      user_role: ["admin", "super_admin", "viewer", "manager"],
    },
  },
} as const

