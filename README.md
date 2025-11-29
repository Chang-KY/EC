# EC Monorepo 가이드

> **구성**
> - `customer-app` : 고객용 EC 프론트
> - `admin-app` : 관리자용 EC 프론트
> - `supabase/` : PostgreSQL + RLS + Function 등 DB 관련 모든 SQL 관리

루트 디렉토리: `./ec/*`

---

## 1. 루트 `package.json`

루트(`ec/`)의 `package.json`은 전체 모노레포와 Supabase CLI를 관리합니다.

```json
{
  "name": "ec",
  "version": "1.0.0",
  "private": true,
  "description": "EC monorepo (customer app + admin app + supabase)",
  "scripts": {
    "dev:customer": "npm run dev --prefix app-customer", // 고객 프로젝트 실행
    "dev:admin": "npm run dev --prefix app-admin", // 어드민 프로젝트 실행

    "dev": "npm run dev:customer", // 기본은 고객 프로젝트 npm run dev는 고객 프로젝트가 실행된다
    "dev:all": "npm run dev:customer && npm run dev:admin", // 전체 실행

    "supa:start": "supabase start",
    "supa:stop": "supabase stop",
    
    "supa:login": "npx supabase login",
    
    "supa:types": "npx supabase gen types typescript --project-id wpbwmdpwrmnucbkhtfnq --schema ec > src/types/supabase.ts", 
    "supa:link": "npx supabase link --project-ref wpbwmdpwrmnucbkhtfnq",

    "supa:init": "supabase init", // Supabase 로컬 프로젝트 초기 세팅. 밑의 폴더가 생성됨.
     ->  supabase/
          ├── config.toml
          ├── migrations/
          ├── seed.sql
    "supa:db:push": "supabase db push", // migrations 폴더 안의 SQL을 로컬 DB에 적용.
    "supa:db:push:origin": "supabase db push --linked",
    "supa:db:reset": "supabase db reset" // 로컬 Supabase DB 완전 초기화 + 모든 migrations 재실행
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "supabase": "^2.63.1"
  }
}
```
