export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      Admin: {
        Row: {
          createdAt: string
          email: string
          id: number
          passwordHash: string
          role: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: number
          passwordHash: string
          role?: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: number
          passwordHash?: string
          role?: string
        }
        Relationships: []
      }
      Banner: {
        Row: {
          id: number
          imageUrl: string
          isActive: boolean
          linkUrl: string | null
          orderIndex: number
          subtitle: string | null
          title: string | null
        }
        Insert: {
          id?: number
          imageUrl: string
          isActive?: boolean
          linkUrl?: string | null
          orderIndex?: number
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          id?: number
          imageUrl?: string
          isActive?: boolean
          linkUrl?: string | null
          orderIndex?: number
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      Category: {
        Row: {
          id: number
          imageUrl: string | null
          name: string
          slug: string
        }
        Insert: {
          id?: number
          imageUrl?: string | null
          name: string
          slug: string
        }
        Update: {
          id?: number
          imageUrl?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      Product: {
        Row: {
          categoryId: number
          createdAt: string
          description: string
          discountPrice: number | null
          id: number
          isFeatured: boolean
          name: string
          price: number
          slug: string
          status: string
          storeId: number
          updatedAt: string
        }
        Insert: {
          categoryId: number
          createdAt?: string
          description: string
          discountPrice?: number | null
          id?: number
          isFeatured?: boolean
          name: string
          price: number
          slug: string
          status?: string
          storeId?: number
          updatedAt?: string
        }
        Update: {
          categoryId?: number
          createdAt?: string
          description?: string
          discountPrice?: number | null
          id?: number
          isFeatured?: boolean
          name?: string
          price?: number
          slug?: string
          status?: string
          storeId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Product_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
        ]
      }
      ProductImage: {
        Row: {
          id: number
          imageUrl: string
          isWatermarked: boolean
          orderIndex: number
          productId: number
        }
        Insert: {
          id?: number
          imageUrl: string
          isWatermarked?: boolean
          orderIndex?: number
          productId: number
        }
        Update: {
          id?: number
          imageUrl?: string
          isWatermarked?: boolean
          orderIndex?: number
          productId?: number
        }
        Relationships: [
          {
            foreignKeyName: "ProductImage_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      ProductVariant: {
        Row: {
          id: number
          productId: number
          stock: number
          variantName: string
        }
        Insert: {
          id?: number
          productId: number
          stock?: number
          variantName: string
        }
        Update: {
          id?: number
          productId?: number
          stock?: number
          variantName?: string
        }
        Relationships: [
          {
            foreignKeyName: "ProductVariant_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      StoreSettings: {
        Row: {
          address: string | null
          id: number
          logoUrl: string | null
          operationalHours: string | null
          socialLinks: string | null
          storeName: string
          tagline: string | null
          themeColor: string
          updatedAt: string
          waMessageTemplate: string
          whatsappNumber: string
        }
        Insert: {
          address?: string | null
          id?: number
          logoUrl?: string | null
          operationalHours?: string | null
          socialLinks?: string | null
          storeName?: string
          tagline?: string | null
          themeColor?: string
          updatedAt?: string
          waMessageTemplate?: string
          whatsappNumber?: string
        }
        Update: {
          address?: string | null
          id?: number
          logoUrl?: string | null
          operationalHours?: string | null
          socialLinks?: string | null
          storeName?: string
          tagline?: string | null
          themeColor?: string
          updatedAt?: string
          waMessageTemplate?: string
          whatsappNumber?: string
        }
        Relationships: []
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
