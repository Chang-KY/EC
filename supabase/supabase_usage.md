npx supabase start : Supabase 로컬(Postgres/Auth/Studio) 컨테이너 시작

supabase stop : 현재 프로젝트 로컬 Supabase 중지

supabase stop --project-id <프로젝트ID> : 특정 프로젝트 로컬 Supabase 중지

supabase migration new <이름> : 새 마이그레이션 SQL 파일 생성

supabase db reset : 로컬 DB 드랍 → 재생성 + 모든 마이그레이션 처음부터 재적용

supabase db push --local : 로컬 DB에 아직 안 올라간 마이그레이션만 순서대로 적용

supabase link : 로컬 프로젝트를 원격 Supabase 프로젝트와 연결

supabase db push : 원격 Supabase(DB 본서버)에 마이그레이션 적용

supabase db pull : 원격 DB 스키마를 로컬로 끌어와서 마이그레이션 생성(특수 상황)

supabase migration repair --status reverted <버전> : 마이그레이션 히스토리 수동 정정

net stop winnat : 로컬 포트 충돌 심할 때 Windows NAT 서비스 중지 (⚠ 정말 필요할 때만)

supabase gen types typescript --local > app-admin/src/supabase.types.ts

supabase migration up