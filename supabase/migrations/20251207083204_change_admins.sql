-- level 값이 1~6 범위 밖인 레코드가 있으면 안전하게 1로 맞춰두기
UPDATE ec.admins
SET level = 1
WHERE level < 1
   OR level > 6;

-- ec.admins.level 기본값 + 1~6 범위 CHECK 제약 추가
ALTER TABLE ec.admins
    ALTER COLUMN level SET DEFAULT 1;

ALTER TABLE ec.admins
    ADD CONSTRAINT admins_level_range_chk CHECK (level BETWEEN 1 AND 6);
