create table if not exists ec.audit_logs (
                                             id bigserial primary key,

    -- 누가 했는지(행위자)
                                             actor_id uuid null references auth.users(id) on delete set null,
    actor_type text not null default 'admin',     -- 'admin' | 'system' 등
    actor_email text null,                        -- 스냅샷(선택)

-- 무엇에 대해(대상)
    entity_type text not null,                    -- 'profile' | 'order' | 'product' ...
    entity_id text not null,                      -- 대상 PK (uuid/int 모두 수용)
    entity_label text null,                       -- 사람이 보기 좋은 라벨(선택) ex) email, name, order_no

-- 무엇을 했는지
    action text not null,                         -- 'update' | 'create' | 'delete' | 'verify_email' ...
    changes jsonb not null default '{}'::jsonb,    -- {"field":{"from":...,"to":...}}
    reason text null,                             -- 사유(운영 기록)

-- 추적(선택)
    request_id uuid null,                         -- 요청 단위 트래킹용(서버에서 주입 추천)
    ip inet null,
    user_agent text null,

    created_at timestamptz not null default now()
    );

-- 조회 최적화 인덱스
create index if not exists audit_logs_entity_idx
    on ec.audit_logs(entity_type, entity_id);

create index if not exists audit_logs_actor_id_idx
    on ec.audit_logs(actor_id);

create index if not exists audit_logs_created_at_idx
    on ec.audit_logs(created_at desc);

create index if not exists audit_logs_action_idx
    on ec.audit_logs(action);

-- 설명(코멘트)
comment on table ec.audit_logs is
  '관리자/시스템 조치 및 데이터 변경 이력을 남기는 범용 Audit Log. actor(누가), entity(무엇을), action/changes(무엇을 어떻게), reason(왜)을 기록한다.';

comment on column ec.audit_logs.actor_id is
  '행위자 ID(보통 관리자). auth.users(id) 참조. 삭제되면 null 처리(set null).';

comment on column ec.audit_logs.actor_type is
  '행위자 타입. 기본 admin. 시스템 자동 작업이면 system 등으로 구분.';

comment on column ec.audit_logs.actor_email is
  '행위자 식별용 이메일 스냅샷(선택). 나중에 auth/users 상태가 바뀌어도 로그 가독성을 위해 저장할 수 있음.';

comment on column ec.audit_logs.entity_type is
  '대상 엔티티 타입. 예: profile, admin, order, product, coupon 등.';

comment on column ec.audit_logs.entity_id is
  '대상 엔티티의 PK. 다양한 타입(uuid/int)을 수용하기 위해 text 권장.';

comment on column ec.audit_logs.entity_label is
  '대상 라벨(선택). 예: profile email, order_no 등 화면 표시용.';

comment on column ec.audit_logs.action is
  '행위 종류. 예: update/create/delete/verify_email/suspend 등.';

comment on column ec.audit_logs.changes is
  '변경 상세(JSON). 권장 형태: {"field":{"from":old,"to":new}}. 여러 필드 변경을 한 번에 저장.';

comment on column ec.audit_logs.reason is
  '변경/조치 사유(운영 기록).';

comment on column ec.audit_logs.request_id is
  '요청 단위 추적 ID(선택). 한 요청에서 여러 변경이 나가면 같은 request_id로 묶기 좋음.';

comment on column ec.audit_logs.ip is
  '요청 IP(선택).';

comment on column ec.audit_logs.user_agent is
  '요청 User-Agent(선택).';

comment on column ec.audit_logs.created_at is
  '로그 생성 시각.';