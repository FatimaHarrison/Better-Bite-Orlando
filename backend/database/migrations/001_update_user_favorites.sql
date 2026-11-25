-- Better Bite Orlando
-- Issue #86 / PR #127
-- Update user_favorites to support external API items.
--
-- Prerequisites:
-- Back up the database before executing.
-- Verify that user_favorites contains no existing records.
-- Do not execute against a populated favorites table.

ALTER TABLE user_favorites
    MODIFY COLUMN item_type
        ENUM('grocery', 'restaurant', 'recipe') NOT NULL,
    DROP COLUMN item_id,
    ADD COLUMN item_subtype VARCHAR(50) NULL AFTER item_type,
    ADD COLUMN source_provider VARCHAR(50) NOT NULL AFTER item_subtype,
    ADD COLUMN external_item_id VARCHAR(255) NOT NULL AFTER source_provider,
    ADD COLUMN item_name VARCHAR(255) NOT NULL AFTER external_item_id,
    ADD COLUMN address VARCHAR(255) NULL AFTER item_name,
    ADD COLUMN latitude DECIMAL(10,7) NULL AFTER address,
    ADD COLUMN longitude DECIMAL(10,7) NULL AFTER latitude,
    ADD COLUMN image_url VARCHAR(500) NULL AFTER longitude,
    ADD UNIQUE KEY user_favorites_unique_item
        (user_id, item_type, source_provider, external_item_id);
