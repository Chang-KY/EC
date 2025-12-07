CREATE TABLE ec.admins
(
    id         uuid            NOT NULL,
    email      text            NOT NULL,
    name       text,
    avatar_url text,
    phone      text,
    status     ec.admin_status NOT NULL DEFAULT 'active'::ec.admin_status,
    last_login timestamptz,
    created_at timestamptz     NOT NULL DEFAULT now(),
    role       ec.user_role    NOT NULL DEFAULT 'manager'::ec.user_role,
    level      smallint        NOT NULL DEFAULT 1
);
-- =========================
-- ec.admins
-- =========================
COMMENT
ON COLUMN "ec"."admins"."id" IS
  '관리자 계정의 고유 ID이다. 일반적으로 auth.users의 ID와 매핑되는 UUID이다.';

COMMENT
ON COLUMN "ec"."admins"."email" IS
  '관리자 계정의 이메일 주소이다. 로그인 ID로 사용된다.';

COMMENT
ON COLUMN "ec"."admins"."name" IS
  '관리자 이름 또는 표시 이름이다.';

COMMENT
ON COLUMN "ec"."admins"."avatar_url" IS
  '관리자 프로필 이미지 URL 또는 스토리지 경로이다.';

COMMENT
ON COLUMN "ec"."admins"."phone" IS
  '관리자 연락처 전화번호이다.';

COMMENT
ON COLUMN "ec"."admins"."status" IS
  '관리자 계정 상태이다. active, suspended, revoked 등으로 활성/정지/해지 상태를 구분한다.';

COMMENT
ON COLUMN "ec"."admins"."last_login" IS
  '관리자가 마지막으로 로그인한 일시이다.';

COMMENT
ON COLUMN "ec"."admins"."created_at" IS
  '관리자 계정이 생성된 일시이다.';

COMMENT
ON COLUMN "ec"."admins"."role" IS
  '관리자의 역할을 나타내는 필드이다. viewer, manager, admin, super_admin 등 user_role ENUM을 사용한다.';

COMMENT
ON COLUMN "ec"."admins"."level" IS
  '관리자 등급 또는 레벨이다. 권한 수준을 숫자로 관리할 때 사용한다.';

