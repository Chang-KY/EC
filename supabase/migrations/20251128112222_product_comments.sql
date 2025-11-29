CREATE TABLE ec.product_comments
(
    id         bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    product_id bigint                              NOT NULL,
    user_id    uuid                                NOT NULL,
    content    text                                NOT NULL,
    rating     integer,
    is_hidden  boolean     DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);
    -- =========================
-- ec.product_comments
-- =========================
    COMMENT ON COLUMN "ec"."product_comments"."id" IS
  '상품 댓글의 고유 ID이다.';

COMMENT
ON COLUMN "ec"."product_comments"."product_id" IS
  '댓글이 달린 상품의 ID이다. products 테이블과 연결된다.';

COMMENT
ON COLUMN "ec"."product_comments"."user_id" IS
  '댓글을 작성한 사용자 ID이다.';

COMMENT
ON COLUMN "ec"."product_comments"."content" IS
  '댓글의 본문 내용이다.';

COMMENT
ON COLUMN "ec"."product_comments"."rating" IS
  '상품에 대한 평점이다. 1~5 사이의 정수 값이다.';

COMMENT
ON COLUMN "ec"."product_comments"."is_hidden" IS
  '댓글이 관리자에 의해 숨김 처리되었는지 여부이다. true면 사용자 화면에 노출되지 않는다.';

COMMENT
ON COLUMN "ec"."product_comments"."created_at" IS
  '댓글이 작성된 일시이다.';

COMMENT
ON COLUMN "ec"."product_comments"."updated_at" IS
  '댓글이 수정된 마지막 일시이다.';

