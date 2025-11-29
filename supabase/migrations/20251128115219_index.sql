CREATE INDEX IF NOT EXISTS admins_created_at_idx
    ON ec.admins USING btree (created_at);

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_categories_path_gist
    ON ec.categories
    USING gist (path)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_categories_parent
    ON ec.categories
    USING btree (parent_id)
    TABLESPACE pg_default;

CREATE UNIQUE INDEX IF NOT EXISTS categories_parent_slug_uq
    ON ec.categories
    USING btree (parent_id, slug)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS categories_path_gist
    ON ec.categories
    USING gist (path)
    TABLESPACE pg_default;

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS coupons_active_idx
    ON ec.coupons
    USING btree (is_active)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS coupons_period_idx
    ON ec.coupons
    USING btree (starts_at, ends_at)
    TABLESPACE pg_default;

-------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS pc_primary_once
    ON ec.product_categories
    USING btree (product_id)
    TABLESPACE pg_default
    WHERE (role_code = 'primary'::text);

CREATE INDEX IF NOT EXISTS pc_category_idx
    ON ec.product_categories
    USING btree (category_id)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS pc_product_idx
    ON ec.product_categories
    USING btree (product_id)
    TABLESPACE pg_default;

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS product_comment_images_comment_idx
    ON ec.product_comment_images (product_comment_id);

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS product_images_product_role_idx
    ON ec.product_images
    USING btree (product_id, role, sort_order)
    TABLESPACE pg_default;

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_product_tags_product
    ON ec.product_tags
    USING btree (product_id)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_product_tags_tag
    ON ec.product_tags
    USING btree (tag_id)
    TABLESPACE pg_default;

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS profiles_created_at_idx
    ON ec.profiles
    USING btree (created_at)
    TABLESPACE pg_default;

-------------------------------------------------------

CREATE INDEX IF NOT EXISTS user_coupons_user_idx
    ON ec.user_coupons
    USING btree (user_id)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS user_coupons_coupon_idx
    ON ec.user_coupons
    USING btree (coupon_id)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS user_coupons_used_idx
    ON ec.user_coupons
    USING btree (is_used, used_at)
    TABLESPACE pg_default;

-------------------------------------------------------

