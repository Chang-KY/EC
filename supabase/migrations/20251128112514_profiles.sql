CREATE TABLE ec.profiles
(
    id             uuid NOT NULL,
    email          text NOT NULL,
    name           text,
    created_at     timestamptz DEFAULT now(),
    avatar_url     text,
    phone          text,
    phone_verified boolean     DEFAULT false,
    bio            text,
    links          jsonb       DEFAULT '{}'::jsonb,
    settings       jsonb       DEFAULT '{}'::jsonb,
    email_verified boolean     DEFAULT false
);
    -- =========================
-- ec.profiles
-- =========================
    COMMENT ON COLUMN "ec"."profiles"."id" IS
  '사용자 프로필의 고유 ID이다. 일반적으로 auth.users의 ID와 매핑되는 UUID이다.';

COMMENT
ON COLUMN "ec"."profiles"."email" IS
  '사용자의 이메일 주소이다. 로그인 및 알림용으로 사용된다.';

COMMENT
ON COLUMN "ec"."profiles"."name" IS
  '사용자의 이름 또는 닉네임이다.';

COMMENT
ON COLUMN "ec"."profiles"."created_at" IS
  '프로필 레코드가 생성된 일시이다.';

COMMENT
ON COLUMN "ec"."profiles"."avatar_url" IS
  '사용자의 프로필 이미지 URL 또는 스토리지 경로이다.';

COMMENT
ON COLUMN "ec"."profiles"."phone" IS
  '사용자의 전화번호이다. SMS 인증이나 연락 용도로 사용될 수 있다.';

COMMENT
ON COLUMN "ec"."profiles"."phone_verified" IS
  '사용자의 전화번호가 인증되었는지 여부이다. true이면 인증 완료 상태이다.';

COMMENT
ON COLUMN "ec"."profiles"."bio" IS
  '사용자 소개 또는 한 줄 자기소개 텍스트이다.';

COMMENT
ON COLUMN "ec"."profiles"."links" IS
  '사용자의 외부 링크(개인 홈페이지, SNS 등)를 저장하는 JSON 필드이다.';

COMMENT
ON COLUMN "ec"."profiles"."settings" IS
  '사용자별 환경 설정 정보를 저장하는 JSON 필드이다. 알림 설정, 언어 설정 등의 데이터를 담을 수 있다.';

COMMENT
ON COLUMN "ec"."profiles"."email_verified" IS
  '사용자의 이메일 주소가 인증되었는지 여부이다. true이면 이메일 인증 완료 상태이다.';

