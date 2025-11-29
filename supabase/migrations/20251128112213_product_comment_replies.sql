CREATE TABLE ec.product_comment_replies
(
    id                 bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    product_comment_id bigint                              NOT NULL,
    user_id            uuid                                NOT NULL,
    content            text                                NOT NULL,
    created_at         timestamptz DEFAULT now(),
    updated_at         timestamptz
);
    -- =========================
-- ec.product_comment_replies
-- =========================
    COMMENT ON COLUMN "ec"."product_comment_replies"."id" IS
  '댓글 답글의 고유 ID이다.';

COMMENT
ON COLUMN "ec"."product_comment_replies"."product_comment_id" IS
  '답글이 달린 원 댓글의 ID이다. product_comments 테이블과 연결된다.';

COMMENT
ON COLUMN "ec"."product_comment_replies"."user_id" IS
  '답글을 작성한 사용자 ID이다.';

COMMENT
ON COLUMN "ec"."product_comment_replies"."content" IS
  '답글의 본문 내용이다.';

COMMENT
ON COLUMN "ec"."product_comment_replies"."created_at" IS
  '답글이 작성된 일시이다.';

COMMENT
ON COLUMN "ec"."product_comment_replies"."updated_at" IS
  '답글이 수정된 마지막 일시이다.';

