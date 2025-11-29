CREATE TABLE ec.product_comment_images
(
    id                 bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    product_comment_id bigint                              NOT NULL,
    url                text                                NOT NULL,
    sort_order         integer     DEFAULT 0,
    created_at         timestamptz DEFAULT now()
);
    -- =========================
-- ec.product_comment_images
-- =========================
    COMMENT ON COLUMN "ec"."product_comment_images"."id" IS
  '상품 댓글 이미지의 고유 ID이다.';

COMMENT
ON COLUMN "ec"."product_comment_images"."product_comment_id" IS
  '이미지가 속한 상품 댓글의 ID이다. product_comments 테이블과 연결된다.';

COMMENT
ON COLUMN "ec"."product_comment_images"."url" IS
  '댓글에 첨부된 이미지의 URL 또는 스토리지 경로이다.';

COMMENT
ON COLUMN "ec"."product_comment_images"."sort_order" IS
  '해당 댓글 내에서 이미지가 보여지는 순서이다.';

COMMENT
ON COLUMN "ec"."product_comment_images"."created_at" IS
  '댓글 이미지가 등록된 일시이다.';

