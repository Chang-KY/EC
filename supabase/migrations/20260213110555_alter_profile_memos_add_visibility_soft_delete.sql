-- =========================================================
-- alter_profile_memos_add_visibility_soft_delete.sql
-- (기존 ec.profile_memos 테이블에 컬럼/제약/FK/트리거 추가)
-- =========================================================

do
$$
begin
  if
not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'ec' and t.typname = 'memo_visibility'
  ) then
create type ec.memo_visibility as enum ('public', 'private');
end if;
end $$;

-- 1) visibility 컬럼 추가
alter table ec.profile_memos
    add column if not exists visibility ec.memo_visibility not null default 'public';

-- 2) 소프트 삭제 컬럼 추가
alter table ec.profile_memos
    add column if not exists is_deleted boolean not null default false,
    add column if not exists deleted_at timestamptz null,
    add column if not exists deleted_by uuid null;

-- 3) deleted_by FK는 auth.users가 아니라 ec.admins(id)로
alter table ec.profile_memos
drop
constraint if exists profile_memos_deleted_by_fkey;

alter table ec.profile_memos
    add constraint profile_memos_deleted_by_fkey
        foreign key (deleted_by) references ec.admins (id) on delete set null;

-- 4) 삭제 정합성 체크 (true면 deleted_at 필수 / false면 deleted_* 비어있어야)
alter table ec.profile_memos
drop
constraint if exists profile_memos_deleted_consistency_chk;

alter table ec.profile_memos
    add constraint profile_memos_deleted_consistency_chk
        check (
            (is_deleted = false and deleted_at is null and deleted_by is null)
                or
            (is_deleted = true and deleted_at is not null and deleted_by is not null)
            );

-- 안 삭제된 것만 빠르게 가져오기 위한 partial index
create index if not exists profile_memos_not_deleted_idx
    on ec.profile_memos(profile_id, created_at desc)
    where is_deleted = false;
