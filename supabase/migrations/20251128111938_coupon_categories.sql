CREATE TABLE ec.coupon_categories
(
    coupon_id   bigint      NOT NULL,
    category_id bigint      NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

    -- =========================
-- ec.coupon_categories
-- =========================
    COMMENT ON COLUMN "ec"."coupon_categories"."coupon_id" IS
  '카테고리에 적용되는 쿠폰의 ID이다. coupons 테이블과 연결된다.';

COMMENT
ON COLUMN "ec"."coupon_categories"."category_id" IS
  '쿠폰이 적용되거나 제외되는 카테고리의 ID이다. categories 테이블과 연결된다.';


COMMENT
ON COLUMN "ec"."coupon_categories"."created_at" IS
  '쿠폰과 카테고리 매핑이 생성된 일시이다.';

