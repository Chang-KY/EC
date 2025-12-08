-- admins: 관리자 정보이니 authenticated만 쓰기 허용
GRANT INSERT, UPDATE, DELETE ON TABLE ec.admins TO authenticated;

-- 카테고리/역할
GRANT INSERT, UPDATE, DELETE ON TABLE ec.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.category_roles TO anon, authenticated;

-- 쿠폰 관련
GRANT INSERT, UPDATE, DELETE ON TABLE ec.coupon_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.coupon_products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.coupons TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.user_coupons TO anon, authenticated;

-- 찜/즐겨찾기
GRANT INSERT, UPDATE, DELETE ON TABLE ec.favorites TO authenticated;

-- 주문/주문 아이템
GRANT INSERT, UPDATE, DELETE ON TABLE ec.orders TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.order_items TO anon, authenticated;

-- 상품/카테고리/태그
GRANT INSERT, UPDATE, DELETE ON TABLE ec.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.product_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.tags TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.product_tags TO authenticated;

-- 상품 이미지/댓글/댓글 이미지/대댓글
GRANT INSERT, UPDATE, DELETE ON TABLE ec.product_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.product_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.product_comment_images TO anon,authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE ec.product_comment_replies TO anon, authenticated;

-- 프로필
GRANT INSERT, UPDATE, DELETE ON TABLE ec.profiles TO authenticated;
