# Supabase 마이그레이션 운영 가이드 (권장 FLOW)

이 문서는 **Supabase + Postgres** 환경에서  
`supabase/migrations` 폴더를 기준으로 스키마를 관리하는 **권장 플로우** 정리다.

핵심 아이디어는 딱 하나:

> **“DB를 직접 만지지 말고, 마이그레이션 파일을 소스 코드처럼 관리하자.”**  
> → SQL 파일 → 로컬 DB → 테스트 → 본 서버(DB) 순으로만 흘러가게.

---

## 0. 구성 요소 정리

실제로는 아래 3가지가 있다고 보면 된다.

1. **Git + `supabase/migrations` 폴더**
    - 스키마/함수/RLS 정의의 “소스 코드”
    - 진짜 Source of Truth

2. **로컬 Supabase DB**
    - `supabase/db` 아래 도커 기반 개발용 DB
    - `supabase db reset`, `supabase db push --local` 대상

3. **본 서버(호스팅) Supabase 프로젝트 DB**
    - 실제 서비스가 바라보는 프로덕션(or 스테이징) DB
    - `supabase db push` (※ `--local` 없음) 대상

우리가 원하는 것은:

> **1 → 2 → (테스트) → 3**  
> 이 플로우를 항상 **마이그레이션 파일 기준으로** 유지하는 것.

---

## 1. 새 기능/변경을 추가할 때의 권장 FLOW

### 1단계) 새 마이그레이션 파일 만들기

예: `ec.create_coupon` 함수/테이블을 수정하거나 추가하고 싶을 때.

```bash
supabase migration new 20251129_add_coupon_function
```
위 명령을 실행하면:

supabase/migrations/20251129xxxx_add_coupon_function.sql
형태의 파일이 생성된다.

이 파일 안에 직접 SQL을 작성한다:

> 💡 Supabase Studio SQL Editor는 “초안 테스트용” 정도로만 쓰고,
최종본은 반드시 이 마이그레이션 파일에 옮겨 적는다고 생각하는 것이 안전하다.

### 2단계) 로컬 DB에 적용 (개발/테스트용)
전체 리셋 후 다시 적용하고 싶을 때
```bash
supabase db reset
```
로컬 DB를 드랍 후 재생성한다.

supabase/migrations에 있는 모든 마이그레이션 파일을 0부터 순서대로 다시 적용한다.
---

초기화 없이 변경분만 적용하고 싶을 때
```bash
supabase db push --local
```
로컬 DB 상태와 supabase/migrations를 비교해
아직 적용되지 않은 마이그레이션들을 순서대로 적용한다.

이 단계까지 끝나면:

로컬 Supabase(Postgres 컨테이너)에
방금 작성한 SQL을 포함한 전체 스키마가 들어가고,

Next.js admin-app, customer-app을 로컬에서 띄워

새 테이블/함수/RLS가 제대로 동작하는지,
앱에서 에러 없이 잘 붙는지 테스트할 수 있다.

### 3단계) Git에 커밋
마이그레이션이 정상 작동하는 것이 확인되면, 해당 파일을 Git에 커밋한다.
```bash
git add supabase/migrations/20251129xxxx_add_coupon_function.sql
git commit -m "feat(db): add ec.create_coupon function"
```
이제 이 마이그레이션 파일은:
팀원들, 다른 환경, 미래의 나까지 포함해서
공통 기준이 되는 DB 변경 이력이 된다.

### 4단계) 본 서버 Supabase에 배포
로컬에서 충분히 테스트했고,
“이제 프로덕션(또는 스테이징) DB에도 적용하겠다”라고 결정하면:

먼저 프로젝트가 올바른 원격 프로젝트에 link 되어 있는지 확인한다.

```bash
npm run supa:login
npm run supa:link

supabase db push
#  ↑ 여기에는 --local 붙이지 않는다!
#    이 명령이 호스팅 Supabase(본 서버)로 들어가는 것
```
위의 명령어를 차례대로 해나간다.


이 과정을 거치면:

로컬 DB와 본 서버 DB 모두
Git에 있는 동일한 마이그레이션 세트를 기준으로 동작한다.

> 나중에 문제 발생 시
“어느 마이그레이션 버전에서 깨졌는지”를 기준으로 추적할 수 있다.


# Supabase Studio 사용 시 원칙
Studio(SQL Editor, Table Editor 등)는 **“실험용/초안 작성용”**으로만 사용.

최종적으로는 항상: 마이그레이션 파일에 SQL 작성

supabase db reset / supabase db push --local로 재적용
문제 없으면 Git 커밋

supabase db push로 본 서버 적용
이 루틴을 유지하면:
“본 서버에서 직접 테이블/컬럼/함수 수정해버리고,
나중에 로컬과 마이그레이션이 꼬이는 상황”을 막을 수 있다.

DB 스키마가 커져도,
변경 이력을 마이그레이션 파일 + Git 로그로 깔끔하게 추적 가능.
