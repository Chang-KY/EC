CREATE TABLE ec.favorites
(
    user_id    uuid   NOT NULL,
    product_id bigint NOT NULL,
    created_at timestamptz DEFAULT now()
);
    -- =========================
-- ec.favorites
-- =========================
    COMMENT ON COLUMN "ec"."favorites"."user_id" IS
  '즐겨찾기(찜)을 등록한 사용자 ID이다.';

COMMENT
ON COLUMN "ec"."favorites"."product_id" IS
  '사용자가 즐겨찾기에 추가한 상품 ID이다.';

COMMENT
ON COLUMN "ec"."favorites"."created_at" IS
  '즐겨찾기(찜) 등록 일시이다.';

