import { Database } from '@/supabase.types'

type EC = Database['ec']

export type AdminStatus = EC['Enums']['admin_status']

export type ApplyMode = EC['Enums']['apply_mode']

export type CouponKind = EC['Enums']['coupon_kind']

export type DiscountType = EC['Enums']['discount_type']

export type OrderStatus = EC['Enums']['order_status']

export type ProductCategoryRoleCode = EC['Enums']['product_category_role_code']

export type ProductImageRole = EC['Enums']['product_image_role']

export type ProductStatus = EC['Enums']['product_status']

export type UserRole = EC['Enums']['user_role']
