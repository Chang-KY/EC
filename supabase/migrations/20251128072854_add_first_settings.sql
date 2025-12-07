SET
statement_timeout = 0;
SET
lock_timeout = 0;
SET
idle_in_transaction_session_timeout = 0;
SET
client_encoding = 'UTF8';
SET
standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET
check_function_bodies = false;
SET
xmloption = content;
SET
client_min_messages = warning;
SET
row_security = off;

CREATE SCHEMA IF NOT EXISTS "ec";
ALTER
SCHEMA "ec" OWNER TO "postgres";

-- 스키마 권한 부여
grant usage on schema
ec to anon, authenticated;

-- ltree 구비
    CREATE
EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;

-- =========================================
-- ENUM 타입 정의
-- =========================================

-- 관리자 상태
CREATE TYPE "ec"."admin_status" AS ENUM (
  'active',
  'suspended',
  'revoked'
);
ALTER TYPE "ec"."admin_status" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."admin_status" IS
  '관리자 계정의 상태를 나타내는 ENUM이다. active: 정상, suspended: 일시 정지, revoked: 영구 해지 상태를 의미한다.';

-- 적용 모드 (포함/제외/전체)
CREATE TYPE "ec"."apply_mode" AS ENUM (
  'exclude',
  'include',
  'all'
);
ALTER TYPE "ec"."apply_mode" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."apply_mode" IS
  '대상을 지정할 때 포함/제외/전체 적용 모드를 구분하기 위한 ENUM이다. include: 지정한 대상을 포함해서 적용, exclude: 지정한 대상을 제외하고 적용, all: 모든 대상을 대상으로 적용한다.';

-- 쿠폰 종류
CREATE TYPE "ec"."coupon_kind" AS ENUM (
  'general',
  'code'
);
ALTER TYPE "ec"."coupon_kind" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."coupon_kind" IS
  '쿠폰의 발급/사용 방식을 나타내는 ENUM이다. general: 일반 쿠폰(자동/일반 발급), code: 코드 입력형 쿠폰을 의미한다.';

-- 할인 타입
CREATE TYPE "ec"."discount_type" AS ENUM (
  'rate',
  'fixed',
  'none'
);
ALTER TYPE "ec"."discount_type" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."discount_type" IS
  '할인 방식 유형을 나타내는 ENUM이다. rate: 비율(%) 할인, fixed: 정액(고정 금액) 할인, none: 할인 없음.';

-- 상품-카테고리 역할 코드
CREATE TYPE "ec"."product_category_role_code" AS ENUM (
  'primary',
  'secondary'
);
ALTER TYPE "ec"."product_category_role_code" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."product_category_role_code" IS
  '상품과 카테고리의 관계에서 역할을 구분하기 위한 ENUM이다. primary: 대표(주) 카테고리, secondary: 보조(추가) 카테고리를 의미한다.';

-- 상품 이미지 역할
CREATE TYPE "ec"."product_image_role" AS ENUM (
  'thumbnail',
  'gallery',
  'description'
);
ALTER TYPE "ec"."product_image_role" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."product_image_role" IS
  '상품 이미지의 용도(역할)를 나타내는 ENUM이다. thumbnail: 리스트/대표 썸네일, gallery: 상세 이미지 갤러리, description: 상품 설명 영역에 사용되는 이미지.';

-- 상품 상태
CREATE TYPE "ec"."product_status" AS ENUM (
  'active',
  'hidden',
  'sold_out'
);
ALTER TYPE "ec"."product_status" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."product_status" IS
  '상품의 노출 및 판매 상태를 나타내는 ENUM이다. active: 판매 및 노출 중, hidden: 비노출(숨김) 상태, sold-out: 품절 상태를 의미한다.';

-- 유저 롤
CREATE TYPE "ec"."user_role" AS ENUM (
  'admin',
  'super_admin',
  'viewer',
  'manager'
);
ALTER TYPE "ec"."user_role" OWNER TO "postgres";
COMMENT
ON TYPE "ec"."user_role" IS
  '유저의 권한 및 역할을 나타내는 ENUM이다. admin: 관리자, super_admin: 최상위 관리자, viewer: 조회 전용 사용자, manager: 운영/관리 담당자를 의미한다.';

-- 주문 상태
CREATE TYPE "ec"."order_status" AS ENUM (
  'pending',           -- 주문 생성, 결제 대기/처리중
  'paid',              -- 결제 완료
  'preparing',         -- 상품 준비중
  'shipped',           -- 출고/배송중
  'delivered',         -- 배송 완료
  'cancelled',         -- 주문 취소 완료
  'refund_requested',  -- 환불/반품 요청 상태
  'refunded',          -- 환불 처리 완료
  'payment_failed'     -- 결제 실패
);

ALTER TYPE "ec"."order_status" OWNER TO "postgres";

COMMENT
ON TYPE "ec"."order_status" IS
  '주문의 전체 라이프사이클 상태를 나타내는 ENUM이다. pending(주문 생성/결제 대기), paid(결제 완료), preparing(상품 준비중), shipped(출고/배송중), delivered(배송 완료), cancelled(주문 취소), refund_requested(환불/반품 요청), refunded(환불 완료), payment_failed(결제 실패)를 의미한다.';
