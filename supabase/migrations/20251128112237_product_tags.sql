CREATE TABLE ec.product_tags
(
    product_id bigint NOT NULL,
    tag_id     bigint NOT NULL,
    created_at timestamptz DEFAULT now()
);

    -- =========================
-- ec.product_tags
-- =========================
    COMMENT ON COLUMN "ec"."product_tags"."product_id" IS
  '태그가 매핑된 상품 ID이다. products 테이블과 연결된다.';

COMMENT ON COLUMN "ec"."product_tags"."tag_id" IS
  '상품에 연결된 태그 ID이다. tags 테이블과 연결된다.';

COMMENT ON COLUMN "ec"."product_tags"."created_at" IS
  '상품과 태그 매핑이 생성된 일시이다.';

