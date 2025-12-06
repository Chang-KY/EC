export const MESSAGES = {
  // 공통 / 에러
  ERROR_GENERIC: '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  ERROR_NETWORK: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  ERROR_FORBIDDEN: '접근 권한이 없습니다.',
  ERROR_NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  ERROR_VALIDATION: '입력값을 다시 확인해주세요.',

  // 인증 / 권한
  AUTH_REQUIRED: '로그인이 필요한 페이지입니다.',
  AUTH_LOGIN_SUCCESS: '정상적으로 로그인되었습니다.',
  AUTH_LOGOUT_SUCCESS: '정상적으로 로그아웃되었습니다.',
  AUTH_SESSION_EXPIRED: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
  AUTH_ROLE_REQUIRED: '해당 기능을 사용할 권한이 없습니다.',

  // 대시보드 / 분석
  DASHBOARD_REFRESHED: '대시보드 데이터가 새로고침되었습니다.',
  ANALYTICS_REFRESHED: '분석 데이터가 새로고침되었습니다.',
  ANALYTICS_EXPORT_STARTED: '분석 리포트 다운로드를 시작했습니다.',
  ANALYTICS_EXPORT_COMPLETED: '분석 리포트가 준비되었습니다.',

  // 주문 관리
  ORDER_CREATED: '주문이 생성되었습니다.',
  ORDER_UPDATED: '주문 정보가 수정되었습니다.',
  ORDER_STATUS_UPDATED: '주문 상태가 변경되었습니다.',
  ORDER_CANCELLED: '주문이 취소되었습니다.',
  ORDER_BULK_UPDATED: '선택한 주문이 일괄 처리되었습니다.',
  ORDER_EXPORT_COMPLETED: '주문 내보내기가 완료되었습니다.',

  // 상품 관리
  PRODUCT_CREATED: '상품이 성공적으로 생성되었습니다.',
  PRODUCT_UPDATED: '상품 정보가 수정되었습니다.',
  PRODUCT_DELETED: '상품이 삭제되었습니다.',
  PRODUCT_PUBLISHED: '상품이 판매중으로 전환되었습니다.',
  PRODUCT_UNPUBLISHED: '상품이 판매중지 상태로 전환되었습니다.',
  PRODUCT_IMAGE_UPLOADED: '상품 이미지가 업로드되었습니다.',
  PRODUCT_IMAGE_DELETED: '상품 이미지가 삭제되었습니다.',
  PRODUCT_BULK_UPDATED: '선택한 상품 정보가 일괄 수정되었습니다.',

  // 카테고리
  CATEGORY_CREATED: '카테고리가 생성되었습니다.',
  CATEGORY_UPDATED: '카테고리 정보가 수정되었습니다.',
  CATEGORY_DELETED: '카테고리가 삭제되었습니다.',
  CATEGORY_ORDER_UPDATED: '카테고리 순서가 변경되었습니다.',

  // 쿠폰
  COUPON_CREATED: '쿠폰이 생성되었습니다.',
  COUPON_UPDATED: '쿠폰 정보가 수정되었습니다.',
  COUPON_DELETED: '쿠폰이 삭제되었습니다.',
  COUPON_ACTIVATED: '쿠폰이 활성화되었습니다.',
  COUPON_DEACTIVATED: '쿠폰이 비활성화되었습니다.',

  // 리뷰 관리
  REVIEW_APPROVED: '리뷰가 승인되었습니다.',
  REVIEW_REJECTED: '리뷰가 숨김 처리되었습니다.',
  REVIEW_DELETED: '리뷰가 삭제되었습니다.',
  REVIEW_REPLY_CREATED: '리뷰 답글이 등록되었습니다.',
  REVIEW_REPLY_UPDATED: '리뷰 답글이 수정되었습니다.',
  REVIEW_REPLY_DELETED: '리뷰 답글이 삭제되었습니다.',

  // 사용자 관리
  USER_CREATED: '사용자 계정이 생성되었습니다.',
  USER_UPDATED: '사용자 정보가 수정되었습니다.',
  USER_DELETED: '사용자 계정이 삭제되었습니다.',
  USER_ROLE_UPDATED: '사용자 권한이 변경되었습니다.',
  USER_STATUS_UPDATED: '사용자 상태가 변경되었습니다.',
  USER_PASSWORD_RESET_SENT: '비밀번호 재설정 이메일을 발송했습니다.',

  // 알림
  NOTIFICATION_SENT: '알림을 발송했습니다.',
  NOTIFICATION_SCHEDULED: '알림이 예약되었습니다.',
  NOTIFICATION_CANCELED: '예약된 알림이 취소되었습니다.',
  NOTIFICATION_TEST_SENT: '테스트 알림을 발송했습니다.',

  // 파일 관리
  FILE_UPLOADED: '파일이 업로드되었습니다.',
  FILE_DELETED: '파일이 삭제되었습니다.',
  FILE_RENAMED: '파일명이 변경되었습니다.',
  FILE_DOWNLOAD_STARTED: '파일 다운로드를 시작했습니다.',
  FILE_BULK_UPLOADED: '여러 파일이 업로드되었습니다.',

  // 어드민 / 시스템
  ADMIN_CREATED: '어드민 계정이 생성되었습니다.',
  ADMIN_UPDATED: '어드민 정보가 수정되었습니다.',
  ADMIN_DELETED: '어드민 계정이 삭제되었습니다.',
  ADMIN_ROLE_UPDATED: '어드민 권한이 변경되었습니다.',
  SETTINGS_SAVED: '설정이 저장되었습니다.',
  SETTINGS_UPDATED: '설정이 업데이트되었습니다.',
  SETTINGS_RESET: '설정이 초기화되었습니다.',

  // 폼 / 공통 액션
  FORM_SAVED: '변경 사항이 저장되었습니다.',
  FORM_RESET: '입력이 초기화되었습니다.',
  BULK_ACTION_COMPLETED: '선택한 항목이 일괄 처리되었습니다.',
  IMPORT_COMPLETED: '데이터 가져오기가 완료되었습니다.',
  EXPORT_COMPLETED: '데이터 내보내기가 완료되었습니다.',
} as const
