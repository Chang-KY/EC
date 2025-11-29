CREATE TABLE ec.product_categories
(
    product_id  bigint  NOT NULL,
    category_id bigint  NOT NULL,
    role_code   text    NOT NULL DEFAULT 'secondary'::text,
    sort_order  integer NOT NULL DEFAULT 0
);
    -- =========================
-- ec.product_categories
-- =========================
    COMMENT ON COLUMN "ec"."product_categories"."product_id" IS
  '카테고리에 매핑되는 상품 ID이다. products 테이블과 연결된다.';

COMMENT
ON COLUMN "ec"."product_categories"."category_id" IS
  '상품이 속한 카테고리 ID이다. categories 테이블과 연결된다.';

COMMENT
ON COLUMN "ec"."product_categories"."role_code" IS
  '상품과 카테고리 관계에서의 역할 코드이다. 주 카테고리(primary) 또는 보조 카테고리(secondary) 등을 표현한다.';

COMMENT
ON COLUMN "ec"."product_categories"."sort_order" IS
  '상품이 해당 카테고리 내에서 표시되는 순서이다. 숫자가 작을수록 우선순위가 높다.';

