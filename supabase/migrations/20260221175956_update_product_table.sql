-- 컬럼 추가(일단 NULL 허용)
ALTER TABLE ec.products
    ADD COLUMN IF NOT EXISTS discount_value bigint;

-- 기존 데이터 정리 (none이면 0으로)
UPDATE ec.products
SET discount_value = 0
WHERE discount_value IS NULL
  AND discount_type = 'none';

ALTER TABLE ec.products
    ALTER COLUMN discount_value SET DEFAULT 0;

ALTER TABLE ec.products
    ALTER COLUMN discount_value SET NOT NULL;

-- 기존 sale 컬럼 제거
ALTER TABLE ec.products
DROP COLUMN IF EXISTS sale_price,
  DROP COLUMN IF EXISTS sale_rate;