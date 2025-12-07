do
$$
declare
v_user_id uuid;
  v_now
timestamptz := now();
begin
  -- 1) auth.users 에서 admin@ec.com 찾기
select id
into v_user_id
from auth.users
where email = 'admin@ec.com';

-- 2) 없으면 새로 생성
if
v_user_id is null then
    v_user_id := gen_random_uuid();

insert into auth.users (instance_id,
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
                        recovery_token)
values ('00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated',
        'authenticated',
        'admin@ec.com',
        crypt('1', gen_salt('bf')), -- 비번 "1" (테스트용)
        v_now,
        '{"provider":"email","providers":["email"]}',
        '{}'::jsonb,
        false,
        v_now,
        v_now,
        v_now,
        '',
        '',
        '',
        '');

insert into auth.identities (id,
                             user_id,
                             provider,
                             provider_id,
                             identity_data,
                             last_sign_in_at,
                             created_at,
                             updated_at)
values (gen_random_uuid(),
        v_user_id,
        'email',
        v_user_id::text, -- email/phone 경우 users.id 를 문자열로
        jsonb_build_object(
                'sub', v_user_id::text,
                'email', 'admin@ec.com'
        ),
        v_now,
        v_now,
        v_now);
end if;

  -- 3) ec.admins 에 최고권한 row 없으면 생성
  if
not exists (
    select 1
    from ec.admins
    where id = v_user_id
  ) then
    insert into ec.admins (
      id,
      email,
      name,
      avatar_url,
      phone,
      status,
      last_login,
      created_at,
      role,
      level
    )
    values (
      v_user_id,
      'admin@ec.com',
      'Super Admin',
      null,
      null,
      'active',
      null,
      v_now,
      'super_admin',
      1
    );
end if;
end
$$
language plpgsql;
