do
$$
declare
v_user_id uuid;
  v_now timestamptz := now();
  v_email text := 'user@ec.com';  -- ✅ 여기 바꿔
  v_password text := '1';        -- ✅ 여기 바꿔 (테스트용)
begin
  -- 이미 있으면 그 id 재사용 (중복 생성 방지)
select id
into v_user_id
from auth.users
where email = v_email;

-- 없으면 auth.users + auth.identities 생성
if v_user_id is null then
    v_user_id := gen_random_uuid();

insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
values (
           '00000000-0000-0000-0000-000000000000',
           v_user_id,
           'authenticated',
           'authenticated',
           v_email,
           crypt(v_password, gen_salt('bf')),
           v_now, -- ✅ 이메일 인증까지 된 상태로 만들려면 now(), 인증 안된 상태면 null
           '{"provider":"email","providers":["email"]}',
           '{}'::jsonb,
           false,
           v_now,
           v_now,
           null,
           '',
           '',
           '',
           ''
       );

insert into auth.identities (
    id,
    user_id,
    provider,
    provider_id,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
)
values (
           gen_random_uuid(),
           v_user_id,
           'email',
           v_user_id::text,
           jsonb_build_object('sub', v_user_id::text, 'email', v_email),
           null,
           v_now,
           v_now
       );
end if;

  -- profiles도 같이 생성 (FK 때문에 auth.users 먼저 있어야 함)
insert into ec.profiles (
    id,
    email,
    created_at,
    email_verified
)
values (
           v_user_id,
           v_email,
           v_now,
           true
       )
    on conflict (id) do nothing;

raise notice 'seed user id = % (email=%)', v_user_id, v_email;
end
$$
language plpgsql;
