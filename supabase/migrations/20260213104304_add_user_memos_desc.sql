
-- 테이블/컬럼 설명(코멘트)
comment on table ec.profile_memos is
  '회원 프로필에 대한 관리자 메모 테이블. 상담/요청사항/주의사항 등을 누적 기록한다.';

comment on column ec.profile_memos.id is
  '메모 고유 ID (자동 증가).';

comment on column ec.profile_memos.profile_id is
  '대상 회원 프로필 ID. ec.profiles(id) 참조. 프로필 삭제 시 함께 삭제(cascade).';

comment on column ec.profile_memos.admin_id is
  '메모 작성 관리자(사용자) ID. auth.users(id) 참조. 관리자가 삭제되면 null 처리(set null).';

comment on column ec.profile_memos.memo is
  '메모 본문. 운영자가 남기는 자유 텍스트.';

comment on column ec.profile_memos.created_at is
  '메모 생성 시각.';

comment on column ec.profile_memos.updated_at is
  '메모 수정 시각(수정 시 갱신).';

comment on index ec.profile_memos_profile_id_idx is
  '특정 회원(profile_id)의 메모 목록 조회 성능 최적화.';

comment on index ec.profile_memos_created_at_idx is
  '최근 메모(created_at desc) 조회 성능 최적화.';