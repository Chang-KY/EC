ALTER TABLE ec.products
    ALTER COLUMN discount_value DROP NOT NULL,
ALTER COLUMN discount_value DROP DEFAULT;