CREATE
OR REPLACE FUNCTION ec.create_coupon(
  p_name             text,
  p_coupon_kind      ec.coupon_kind,
  p_coupon_code      varchar,
  p_description      text,
  p_discount_type    ec.discount_type,
  p_discount_value   integer,
  p_max_discount     integer,
  p_min_order_amount integer,
  p_is_active        boolean DEFAULT true,
  p_starts_at        timestamptz,
  p_ends_at          timestamptz,
  p_stackable        boolean DEFAULT false,
  p_max_issue        integer,
  p_max_redemptions  integer,
  p_max_per_user     integer DEFAULT 1,
  p_notes            text,
  p_product_ids      bigint[],
  p_product_mode     ec.apply_mode,
  p_category_ids     bigint[],
  p_category_mode    ec.apply_mode
)
RETURNS ec.coupons
LANGUAGE plpgsql
AS $$
DECLARE
v_coupon ec.coupons;
BEGIN
  -- 1) 쿠폰 생성
INSERT INTO ec.coupons (name,
                        coupon_kind,
                        coupon_code,
                        description,
                        discount_type,
                        discount_value,
                        max_discount,
                        min_order_amount,
                        is_active,
                        starts_at,
                        ends_at,
                        stackable,
                        max_issue,
                        max_redemptions,
                        max_per_user,
                        notes)
VALUES (p_name,
        p_coupon_kind,
        p_coupon_code,
        p_description,
        p_discount_type,
        p_discount_value,
        p_max_discount,
        p_min_order_amount,
        p_is_active,
        p_starts_at,
        p_ends_at,
        p_stackable,
        p_max_issue,
        p_max_redemptions,
        p_max_per_user,
        p_notes) RETURNING *
INTO v_coupon;

-- 2) 상품 관계: 배열이 비어 있지 않을 때만 insert
IF
array_length(p_product_ids, 1) IS NOT NULL THEN
    INSERT INTO ec.coupon_products (coupon_id, product_id, mode)
SELECT v_coupon.id, unnest(p_product_ids), p_product_mode;
END IF;

  -- 3) 카테고리 관계
  IF
array_length(p_category_ids, 1) IS NOT NULL THEN
    INSERT INTO ec.coupon_categories (coupon_id, category_id, mode)
SELECT v_coupon.id, unnest(p_category_ids), p_category_mode;
END IF;

RETURN v_coupon;
END;
$$;
