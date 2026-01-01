-- =========================
-- 1) products.likes 컬럼 제거
-- =========================
alter table ec.products
drop
column if exists likes;

-- =========================
-- 2) 상품 좋아요 테이블 생성 (유저-상품 관계)
-- =========================
create table if not exists ec.product_likes
(
    product_id
    bigint
    not
    null
    references
    ec
    .
    products
(
    id
) on delete cascade,
    user_id uuid not null references auth.users
(
    id
)
  on delete cascade,
    created_at timestamptz not null default now
(
),
    primary key
(
    product_id,
    user_id
)
    );

comment
on table ec.product_likes is '상품 좋아요(찜) 테이블. 유저가 특정 상품에 좋아요를 눌렀는지 저장한다.';
comment
on column ec.product_likes.product_id is '좋아요 대상 상품 ID';
comment
on column ec.product_likes.user_id is '좋아요를 누른 유저 ID(auth.users.id)';
comment
on column ec.product_likes.created_at is '좋아요를 누른 시각';

-- 조회/집계 최적화 인덱스
create index if not exists idx_product_likes_product_id on ec.product_likes(product_id);
create index if not exists idx_product_likes_user_id on ec.product_likes(user_id);

-- =========================
-- 3) RLS (Supabase 권장)
-- =========================
alter table ec.product_likes enable row level security;

create
policy "select product likes for all"
on ec.product_likes
for
select
    to public
    using (true);

-- 로그인 유저만, 자기 user_id로만 insert
create
policy "insert my like"
on ec.product_likes
for insert
to authenticated
with check (auth.uid() = user_id);

-- 로그인 유저만, 자기 좋아요만 delete(좋아요 취소)
create
policy "delete my like"
on ec.product_likes
for delete
to authenticated
using (auth.uid() = user_id);
