ALTER TABLE ec.admins
    ADD CONSTRAINT admins_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.admins
    ADD CONSTRAINT admins_email_key
        UNIQUE (email);

ALTER TABLE ec.admins
    ADD CONSTRAINT admins_id_fkey
        FOREIGN KEY (id)
            REFERENCES auth.users (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.categories
    ADD CONSTRAINT categories_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.categories
    ADD CONSTRAINT categories_name_key
        UNIQUE (name);

ALTER TABLE ec.categories
    ADD CONSTRAINT categories_slug_key
        UNIQUE (slug);

ALTER TABLE ec.categories
    ADD CONSTRAINT categories_parent_id_fkey
        FOREIGN KEY (parent_id)
            REFERENCES ec.categories (id)
            ON DELETE CASCADE;

ALTER TABLE ec.categories
    ADD CONSTRAINT path_not_null
        CHECK (path IS NOT NULL);

---------------------------------------------------------------------

ALTER TABLE ec.category_roles
    ADD CONSTRAINT category_roles_pkey
        PRIMARY KEY (code);

---------------------------------------------------------------------

ALTER TABLE ec.coupons
    ADD CONSTRAINT coupons_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.coupons
    ADD CONSTRAINT coupons_coupon_code_key
        UNIQUE (coupon_code);

ALTER TABLE ec.coupons
    ADD CONSTRAINT coupons_discount_value_pos_chk
        CHECK (discount_value > 0);

ALTER TABLE ec.coupons
    ADD CONSTRAINT coupons_max_discount_nonneg_chk
        CHECK (
            max_discount IS NULL
                OR max_discount >= 0
            );

ALTER TABLE ec.coupons
    ADD CONSTRAINT coupons_min_order_nonneg_chk
        CHECK (
            min_order_amount IS NULL
                OR min_order_amount >= 0
            );

ALTER TABLE ec.coupons
    ADD CONSTRAINT coupons_period_order_chk
        CHECK (
            starts_at IS NULL
                OR ends_at IS NULL
                OR starts_at <= ends_at
            );

---------------------------------------------------------------------

ALTER TABLE ec.products
    ADD CONSTRAINT products_pkey
        PRIMARY KEY (id);

---------------------------------------------------------------------

ALTER TABLE ec.profiles
    ADD CONSTRAINT profiles_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.profiles
    ADD CONSTRAINT profiles_email_key
        UNIQUE (email);

ALTER TABLE ec.profiles
    ADD CONSTRAINT profiles_id_fkey
        FOREIGN KEY (id)
            REFERENCES auth.users (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.tags
    ADD CONSTRAINT tags_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.tags
    ADD CONSTRAINT tags_slug_key
        UNIQUE (slug);

---------------------------------------------------------------------

ALTER TABLE ec.orders
    ADD CONSTRAINT orders_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.orders
    ADD CONSTRAINT orders_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES ec.profiles (id)
            ON DELETE CASCADE;

ALTER TABLE ec.orders
    ADD CONSTRAINT orders_status_check
        CHECK (
            status = ANY (ARRAY['PENDING'::text, 'PAID'::text, 'CANCELLED'::text])
            );

---------------------------------------------------------------------

ALTER TABLE ec.product_comments
    ADD CONSTRAINT product_comments_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.product_comments
    ADD CONSTRAINT product_comments_product_id_user_id_key
        UNIQUE (product_id, user_id);

ALTER TABLE ec.product_comments
    ADD CONSTRAINT product_comments_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON DELETE CASCADE;

ALTER TABLE ec.product_comments
    ADD CONSTRAINT product_comments_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES ec.profiles (id);

ALTER TABLE ec.product_comments
    ADD CONSTRAINT product_comments_rating_check
        CHECK (
            rating >= 1
                AND rating <= 5
            );

---------------------------------------------------------------------

ALTER TABLE ec.coupon_categories
    ADD CONSTRAINT coupon_categories_pkey
        PRIMARY KEY (coupon_id, category_id);

ALTER TABLE ec.coupon_categories
    ADD CONSTRAINT coupon_categories_category_id_fkey
        FOREIGN KEY (category_id)
            REFERENCES ec.categories (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;

ALTER TABLE ec.coupon_categories
    ADD CONSTRAINT coupon_categories_coupon_id_fkey
        FOREIGN KEY (coupon_id)
            REFERENCES ec.coupons (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.coupon_products
    ADD CONSTRAINT coupon_products_pkey
        PRIMARY KEY (coupon_id, product_id);

ALTER TABLE ec.coupon_products
    ADD CONSTRAINT coupon_products_coupon_id_fkey
        FOREIGN KEY (coupon_id)
            REFERENCES ec.coupons (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;

ALTER TABLE ec.coupon_products
    ADD CONSTRAINT coupon_products_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.favorites
    ADD CONSTRAINT favorites_pkey
        PRIMARY KEY (user_id, product_id);

ALTER TABLE ec.favorites
    ADD CONSTRAINT favorites_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON DELETE CASCADE;

ALTER TABLE ec.favorites
    ADD CONSTRAINT favorites_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES ec.profiles (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.product_categories
    ADD CONSTRAINT product_categories_pkey
        PRIMARY KEY (product_id, category_id);

ALTER TABLE ec.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey
        FOREIGN KEY (category_id)
            REFERENCES ec.categories (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;

ALTER TABLE ec.product_categories
    ADD CONSTRAINT product_categories_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;

ALTER TABLE ec.product_categories
    ADD CONSTRAINT product_categories_role_code_fkey
        FOREIGN KEY (role_code)
            REFERENCES ec.category_roles (code);

---------------------------------------------------------------------

ALTER TABLE ec.product_comment_images
    ADD CONSTRAINT product_comment_images_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.product_comment_images
    ADD CONSTRAINT product_comment_images_product_comment_id_fkey
        FOREIGN KEY (product_comment_id)
            REFERENCES ec.product_comments (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.product_comment_replies
    ADD CONSTRAINT product_comment_replies_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.product_comment_replies
    ADD CONSTRAINT product_comment_replies_product_comment_id_fkey
        FOREIGN KEY (product_comment_id)
            REFERENCES ec.product_comments (id)
            ON DELETE CASCADE;

ALTER TABLE ec.product_comment_replies
    ADD CONSTRAINT product_comment_replies_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES ec.profiles (id);

---------------------------------------------------------------------

ALTER TABLE ec.product_images
    ADD CONSTRAINT product_images_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.product_images
    ADD CONSTRAINT product_images_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.product_tags
    ADD CONSTRAINT product_tags_pkey
        PRIMARY KEY (product_id, tag_id);

ALTER TABLE ec.product_tags
    ADD CONSTRAINT product_tags_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON DELETE CASCADE;

ALTER TABLE ec.product_tags
    ADD CONSTRAINT product_tags_tag_id_fkey
        FOREIGN KEY (tag_id)
            REFERENCES ec.tags (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.order_items
    ADD CONSTRAINT order_items_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.order_items
    ADD CONSTRAINT order_items_order_id_fkey
        FOREIGN KEY (order_id)
            REFERENCES ec.orders (id)
            ON DELETE CASCADE;

ALTER TABLE ec.order_items
    ADD CONSTRAINT order_items_product_id_fkey
        FOREIGN KEY (product_id)
            REFERENCES ec.products (id)
            ON DELETE CASCADE;

---------------------------------------------------------------------

ALTER TABLE ec.user_coupons
    ADD CONSTRAINT user_coupons_pkey
        PRIMARY KEY (id);

ALTER TABLE ec.user_coupons
    ADD CONSTRAINT user_coupons_one_per_user
        UNIQUE (user_id, coupon_id);

ALTER TABLE ec.user_coupons
    ADD CONSTRAINT user_coupons_coupon_id_fkey
        FOREIGN KEY (coupon_id)
            REFERENCES ec.coupons (id)
            ON DELETE CASCADE;

ALTER TABLE ec.user_coupons
    ADD CONSTRAINT user_coupons_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES ec.profiles (id)
            ON DELETE CASCADE;
