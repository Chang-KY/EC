create table if not exists ec.profile_memos (
                                                id bigserial primary key,
                                                profile_id uuid not null references ec.profiles(id) on delete cascade,
    admin_id uuid null references auth.users(id) on delete set null,
    memo text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz null
    );

create index if not exists profile_memos_profile_id_idx
    on ec.profile_memos(profile_id);

create index if not exists profile_memos_created_at_idx
    on ec.profile_memos(created_at desc);