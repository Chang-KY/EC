import { Database } from '@/supabase.types'

type EC = Database['ec']

export type COUPONS_TABLE = EC['Tables']['coupons']

export type ADMINS_TABLE = EC['Tables']['admins']

export type CATEGORIES_TABLE = EC['Tables']['categories']

export type CATEGORY_ROLES_TABLE = EC['Tables']['category_roles']

export type COUPON_CATEGORIES_TABLE = EC['Tables']['coupon_categories']

export type COUPON_PRODUCTS_TABLE = EC['Tables']['coupon_products']

export type FAVORITES_TABLE = EC['Tables']['favorites']

export type ORDER_ITEMS_TABLE = EC['Tables']['order_items']

export type ORDERS_TABLE = EC['Tables']['orders']

export type PRODUCT_CATEGORIES_TABLE = EC['Tables']['product_categories']

export type PRODUCT_COMMENT_IMAGES_TABLE = EC['Tables']['product_comment_images']

export type PRODUCT_COMMENT_REPLIES_TABLE = EC['Tables']['product_comment_replies']

export type PRODUCT_COMMENTS_TABLE = EC['Tables']['product_comments']

export type PRODUCT_IMAGES_TABLE = EC['Tables']['product_images']

export type PRODUCT_TAGS_TABLE = EC['Tables']['product_tags']

export type PRODUCTS_TABLE = EC['Tables']['products']

export type PROFILES_TABLE = EC['Tables']['profiles']

export type TAGS_TABLE = EC['Tables']['tags']

export type USER_COUPONS_TABLE = EC['Tables']['user_coupons']
