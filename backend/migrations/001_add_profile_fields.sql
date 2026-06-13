-- ============================================================
-- Migration 001: Add user profile fields
-- Run once against the SkillAddis MySQL database:
--   mysql -u <user> -p <database> < backend/migrations/001_add_profile_fields.sql
--
-- Each statement is independent. If a column already exists MySQL will
-- report "Duplicate column name" for that line only — safe to ignore.
-- ============================================================

ALTER TABLE users ADD COLUMN profile_picture_url VARCHAR(512) NULL;
ALTER TABLE users ADD COLUMN headline VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN bio TEXT NULL;
ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL;
ALTER TABLE users ADD COLUMN location VARCHAR(255) NULL;

-- If your users table does NOT already track a creation timestamp, this adds one.
-- If it already exists, ignore the "Duplicate column name 'created_at'" error.
ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
