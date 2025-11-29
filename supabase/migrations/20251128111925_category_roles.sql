CREATE TABLE ec.category_roles
(
    code  text NOT NULL,
    label text NOT NULL
);
    -- =========================
-- ec.category_roles
-- =========================
    COMMENT ON COLUMN "ec"."category_roles"."code" IS
  '카테고리 역할 코드이다. 예를 들어 primary, secondary 등의 코드 값을 가진다.';

COMMENT
ON COLUMN "ec"."category_roles"."label" IS
  '카테고리 역할 코드에 대응하는 표시 이름이다.';
