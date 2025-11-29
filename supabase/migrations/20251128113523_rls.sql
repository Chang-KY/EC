-- ============================================
-- Enable RLS on ec schema tables
-- ============================================

ALTER TABLE ec.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.category_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.coupon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.coupon_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec.user_coupons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ec.admins
-- ============================================

CREATE
POLICY "delete only super admin"
ON ec.admins
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = 'super_admin'::ec.user_role
  )
);

CREATE
POLICY "insert only super admin"
ON ec.admins
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = 'super_admin'::ec.user_role
  )
);

CREATE
POLICY "read admins"
ON ec.admins
FOR
SELECT
    TO public
    USING (
    id = auth.uid()
    );

CREATE
POLICY "update only super admin"
ON ec.admins
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.categories
-- ============================================

CREATE
POLICY "delete categories"
ON ec.categories
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert categories"
ON ec.categories
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read"
ON ec.categories
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update categories"
ON ec.categories
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.category_roles
-- ============================================

CREATE
POLICY "delete categories_roles"
ON ec.category_roles
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert categories_roles"
ON ec.category_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read categories_roles"
ON ec.category_roles
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update categories_roles"
ON ec.category_roles
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.coupon_categories
-- ============================================

CREATE
POLICY "delete coupon_categories"
ON ec.coupon_categories
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert coupon__categories"
ON ec.coupon_categories
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read coupon_categories"
ON ec.coupon_categories
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update coupon_categories"
ON ec.coupon_categories
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.coupon_products
-- ============================================

CREATE
POLICY "delete  coupon_products"
ON ec.coupon_products
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert coupon_products"
ON ec.coupon_products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read coupon_products"
ON ec.coupon_products
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update coupon_products"
ON ec.coupon_products
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.coupons
-- ============================================

CREATE
POLICY "delete coupons"
ON ec.coupons
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert coupons"
ON ec.coupons
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read coupons"
ON ec.coupons
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update coupons"
ON ec.coupons
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.favorites
-- ============================================

CREATE
POLICY "delete favorites"
ON ec.favorites
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);

CREATE
POLICY "insert favorites"
ON ec.favorites
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

CREATE
POLICY "public read favorites"
ON ec.favorites
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update favorites"
ON ec.favorites
FOR
UPDATE
    TO authenticated
    USING (
    user_id = auth.uid()
    )
WITH CHECK (
    user_id = auth.uid()
    );

-- ============================================
-- ec.order_items
-- ============================================

CREATE
POLICY "delete order_items"
ON ec.order_items
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert order_items"
ON ec.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  (
    order_id IN (
      SELECT o.id
      FROM ec.orders AS o
      WHERE o.user_id = auth.uid()
    )
  )
  OR
  (
    auth.uid() IN (
      SELECT a.id
      FROM ec.admins AS a
      WHERE a.role = ANY (ARRAY[
        'super_admin'::ec.user_role,
        'admin'::ec.user_role,
        'manager'::ec.user_role
      ])
    )
  )
);

CREATE
POLICY "public read order_items"
ON ec.order_items
FOR
SELECT
    TO authenticated
    USING (
    (
    order_id IN (
    SELECT o.id
    FROM ec.orders AS o
    WHERE o.user_id = auth.uid()
    )
    )
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

CREATE
POLICY "update order_items"
ON ec.order_items
FOR
UPDATE
    TO authenticated
    USING (
    (
    order_id IN (
    SELECT o.id
    FROM ec.orders AS o
    WHERE o.user_id = auth.uid()
    )
    )
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
    )
WITH CHECK (
    (
    order_id IN (
    SELECT o.id
    FROM ec.orders AS o
    WHERE o.user_id = auth.uid()
    )
    )
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

-- ============================================
-- ec.orders
-- ============================================

CREATE
POLICY "delete orders"
ON ec.orders
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert orders"
ON ec.orders
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

CREATE
POLICY "public read orders"
ON ec.orders
FOR
SELECT
    TO authenticated
    USING (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

CREATE
POLICY "update orders"
ON ec.orders
FOR
UPDATE
    TO authenticated
    USING (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
    )
WITH CHECK (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

-- ============================================
-- ec.product_categories
-- ============================================

CREATE
POLICY "delete product_categories"
ON ec.product_categories
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert product_categories"
ON ec.product_categories
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read product_categories"
ON ec.product_categories
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update product_categories"
ON ec.product_categories
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.product_images
-- ============================================

CREATE
POLICY "delete product_images"
ON ec.product_images
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert product_images"
ON ec.product_images
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read product_images"
ON ec.product_images
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update product_images"
ON ec.product_images
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.product_tags
-- ============================================

CREATE
POLICY "delete product_tags"
ON ec.product_tags
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert product_tags"
ON ec.product_tags
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read product_tags"
ON ec.product_tags
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update product_tags"
ON ec.product_tags
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.products
-- ============================================

CREATE
POLICY "delete products"
ON ec.products
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert products"
ON ec.products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read products"
ON ec.products
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update products"
ON ec.products
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.profiles
-- ============================================

CREATE
POLICY "delete profiles"
ON ec.profiles
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert profiles"
ON ec.profiles
FOR INSERT
TO public
WITH CHECK (true);

CREATE
POLICY "read profiles"
ON ec.profiles
FOR
SELECT
    TO authenticated
    USING (
    (id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

CREATE
POLICY "update profiles"
ON ec.profiles
FOR
UPDATE
    TO authenticated
    USING (
    (id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
    )
WITH CHECK (
    (id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

-- ============================================
-- ec.tags
-- ============================================

CREATE
POLICY "delete tags"
ON ec.tags
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "insert tags"
ON ec.tags
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

CREATE
POLICY "public read tags"
ON ec.tags
FOR
SELECT
    TO public
    USING (true);

CREATE
POLICY "update tags"
ON ec.tags
FOR
UPDATE
    TO authenticated
    USING (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
WITH CHECK (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    );

-- ============================================
-- ec.user_coupons
-- ============================================

CREATE
POLICY "delete user_coupons"
ON ec.user_coupons
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);

-- 주의: 원본에서 cmd = 'SELECT'인 정책 이름이 "insert user_coupons" 였음 (그대로 유지)
CREATE
POLICY "insert user_coupons"
ON ec.user_coupons
FOR
SELECT
    TO authenticated
    USING (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

CREATE
POLICY "read user_coupons"
ON ec.user_coupons
FOR
SELECT
    TO authenticated
    USING (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );

CREATE
POLICY "update user_coupons"
ON ec.user_coupons
FOR
UPDATE
    TO authenticated
    USING (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
    )
WITH CHECK (
    (user_id = auth.uid())
    OR
    (
    auth.uid() IN (
    SELECT a.id
    FROM ec.admins AS a
    WHERE a.role = ANY (ARRAY[
    'super_admin'::ec.user_role, 'admin'::ec.user_role, 'manager'::ec.user_role
    ])
    )
    )
    );
