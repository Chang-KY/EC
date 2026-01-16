COMMENT ON TABLE ec.admins IS
'관리자 계정 테이블. 백오피스 접근 권한 및 관리자 프로필/상태를 저장한다.';

COMMENT ON TABLE ec.categories IS
'상품 카테고리 트리 테이블. parent_id + ltree(path)로 계층 구조를 관리하며, depth는 path의 레벨로 계산된다.';

COMMENT ON TABLE ec.category_roles IS
'카테고리별 접근/노출 권한 매핑 테이블. 특정 역할(role)이 특정 카테고리를 관리/노출할 수 있는지 정의한다.';

COMMENT ON TABLE ec.coupons IS
'쿠폰 마스터 테이블. 쿠폰의 기본 정보(할인 방식/값, 유효기간, 중복 허용, 발급/사용 제한, 적용 범위 모드 등)를 저장한다.';

COMMENT ON TABLE ec.coupon_categories IS
'쿠폰-카테고리 적용 대상 매핑 테이블. coupon의 category_mode(apply/exclude)에 따라 대상/제외 카테고리를 연결한다.';

COMMENT ON TABLE ec.coupon_products IS
'쿠폰-상품 적용 대상 매핑 테이블. coupon의 product_mode(apply/exclude)에 따라 대상/제외 상품을 연결한다.';

COMMENT ON TABLE ec.favorites IS
'즐겨찾기(찜) 테이블. 사용자가 관심 항목(예: 상품/콘텐츠)을 즐겨찾기 했는지 저장한다.';

COMMENT ON TABLE ec.orders IS
'주문 마스터 테이블. 주문의 기본 상태/금액/주문자 등 핵심 정보를 저장한다.';

COMMENT ON TABLE ec.order_items IS
'주문 상세(라인아이템) 테이블. 주문에 포함된 상품/수량/금액 등 항목별 정보를 저장한다.';

COMMENT ON TABLE ec.products IS
'상품 마스터 테이블. 상품의 기본 정보(이름, 가격, 상태, 대표 정보 등)를 저장한다.';

COMMENT ON TABLE ec.product_categories IS
'상품-카테고리 매핑 테이블(N:M). 한 상품을 여러 카테고리에 연결하며, 대표 카테고리/정렬 정보를 둘 수 있다.';

COMMENT ON TABLE ec.product_images IS
'상품 이미지 테이블. 상품별 이미지(썸네일/상세) 메타데이터 및 스토리지 경로를 저장한다.';

COMMENT ON TABLE ec.product_comments IS
'상품 후기/댓글 테이블. 사용자 리뷰 본문, 평점, 작성자, 상태 등을 저장한다.';

COMMENT ON TABLE ec.product_comment_images IS
'상품 후기 이미지 테이블. 특정 후기(product_comments)에 첨부된 이미지 정보를 저장한다.';

COMMENT ON TABLE ec.product_comment_replies IS
'상품 후기 답글 테이블. 후기/댓글에 대한 답글(관리자/사용자)을 저장한다.';

COMMENT ON TABLE ec.product_likes IS
'상품 좋아요(찜) 테이블. 유저가 특정 상품에 좋아요를 눌렀는지 저장한다.';

COMMENT ON TABLE ec.product_tags IS
'상품-태그 매핑 테이블(N:M). 상품과 태그를 연결해 검색/필터링에 사용한다.';

COMMENT ON TABLE ec.tags IS
'태그 마스터 테이블. 상품 검색/분류를 위한 태그(이름, 슬러그, 상태 등)를 저장한다.';

COMMENT ON TABLE ec.profiles IS
'사용자 프로필 테이블. 사용자 기본 정보, 닉네임/이미지 등 프로필 데이터를 저장한다.';

COMMENT ON TABLE ec.user_coupons IS
'사용자 쿠폰 보유/발급 테이블. 특정 유저가 어떤 쿠폰을 언제 발급/보유/사용했는지 상태 및 이력을 관리한다.';
