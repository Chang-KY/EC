CREATE TABLE ec.coupon_products (
  coupon_id bigint NOT NULL,
  product_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- =========================
-- ec.coupon_products
-- =========================
COMMENT ON COLUMN "ec"."coupon_products"."coupon_id" IS
  '상품에 적용되는 쿠폰의 ID이다. coupons 테이블과 연결된다.';

COMMENT ON COLUMN "ec"."coupon_products"."product_id" IS
  '쿠폰이 적용되거나 제외되는 상품의 ID이다. products 테이블과 연결된다.';

COMMENT ON COLUMN "ec"."coupon_products"."created_at" IS '쿠폰과 상품 매핑이 생성된 일시이다.';
