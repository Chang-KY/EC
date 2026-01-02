# Supabase CLI Commands

## Supabase 로컬 스택 실행
- 로컬(Postgres/Auth/Studio 등) 컨테이너를 시작해서 개발 환경을 띄움.
```bash
npx supabase start
```

## Supabase 로컬 스택 중지
- 현재 프로젝트의 로컬 Supabase 컨테이너를 내림.
```bash
supabase stop
```

## 특정 프로젝트 로컬 스택 중지
- 여러 프로젝트를 굴릴 때, 지정한 프로젝트만 골라서 중지.
```bash
supabase stop --project-id <프로젝트ID>
```

## 새 마이그레이션 파일 생성
- `supabase/migrations/` 아래에 새 SQL 마이그레이션 파일을 생성(파일명은 타임스탬프+이름).
```bash
supabase migration new add_
```

## 로컬 DB 초기화(드랍 후 재구성)
- 로컬 DB를 드랍 → 다시 만들고 → 모든 마이그레이션을 처음부터 순서대로 재적용.
```bash
supabase db reset
```

## 로컬에 마이그레이션 적용(미적용분만)
- 로컬 DB에 아직 적용되지 않은 마이그레이션만 순서대로 적용.
```bash
supabase db push --local
```

## 원격 프로젝트 연결
- 현재 로컬 폴더(프로젝트)를 Supabase 원격 프로젝트(ref)와 연결.
```bash
supabase link
```

## 원격 DB에 마이그레이션 적용
- 로컬의 마이그레이션을 원격 Supabase DB에 적용.
```bash
supabase db push
```

## 원격 스키마를 로컬로 끌어오기
- 원격 DB의 스키마를 기준으로 로컬 마이그레이션을 생성/동기화할 때 사용(충돌/역수정 위험 있어서 “특수 상황”에만).
```bash
supabase db pull
```

## 마이그레이션 히스토리 수동 정정
- 마이그레이션 파일 자체를 다시 실행하는 게 아니라, 마이그레이션 히스토리 상태를 수동으로 맞출 때 사용.
```bash
supabase migration repair --status reverted <버전>
```

## Windows NAT 서비스 중지
- 윈도우에서 포트 바인딩/NAT 관련 충돌이 심할 때 최후의 수단으로 중지(네트워크 기능에 영향 가능).
```bash
net stop winnat
```

## 로컬 기준 TypeScript 타입 생성
- 로컬 DB 스키마 기준으로 TS 타입을 생성해서 지정 경로로 저장.
```bash
supabase gen types typescript --local > app-admin/src/supabase.types.ts
```

## 마이그레이션 업 실행
- 마이그레이션을 “위로(up)” 적용하는 명령(주로 특정 타겟/단계 적용에 활용).
```bash
supabase migration up
```
