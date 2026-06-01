
USE educare;

-- =====================================================
-- 1. CREATE COURSES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    thumbnail VARCHAR(255),

    color_theme VARCHAR(50),

    course_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. ALTER LESSONS TABLE
-- lessons hiện tại là container cho micro lessons
-- =====================================================

ALTER TABLE lessons

ADD COLUMN course_id BIGINT NULL AFTER id,

ADD COLUMN xp_reward INT NOT NULL DEFAULT 50 AFTER is_free,

ADD COLUMN estimated_minutes INT NOT NULL DEFAULT 5 AFTER xp_reward,

ADD CONSTRAINT fk_lessons_course
FOREIGN KEY (course_id)
REFERENCES courses(id)
ON DELETE CASCADE;

-- =====================================================
-- 3. CREATE MICRO LESSONS TABLE
-- Đây là:
-- "Im lặng có phải đồng ý?"
-- "Consent phải tự nguyện"
-- =====================================================

CREATE TABLE IF NOT EXISTS micro_lessons (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    lesson_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,

    micro_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_micro_lessons_lesson
    FOREIGN KEY (lesson_id)
    REFERENCES lessons(id)
    ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. DROP OLD micro_lesson_blocks
-- nếu đã tạo sai structure trước đó
-- =====================================================

DROP TABLE IF EXISTS micro_lesson_blocks;

-- =====================================================
-- 5. CREATE NEW micro_lesson_blocks
-- Mỗi row = 1 card UI
-- =====================================================

CREATE TABLE micro_lesson_blocks (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    micro_lesson_id BIGINT NOT NULL,

    -- hook
    -- explanation
    -- scenario
    -- interaction
    -- reflection
    -- takeaway
    block_type VARCHAR(50) NOT NULL,

    -- JSON dynamic content
    content_json JSON NOT NULL,

    order_index INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_micro_lesson_blocks_micro_lesson
    FOREIGN KEY (micro_lesson_id)
    REFERENCES micro_lessons(id)
    ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. ALTER lesson_progress
-- =====================================================

ALTER TABLE lesson_progress

ADD COLUMN progress_percent INT NOT NULL DEFAULT 0 AFTER xp_awarded,

ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP;

-- =====================================================
-- 7. CREATE micro_lesson_progress
-- tracking từng micro lesson
-- =====================================================

CREATE TABLE IF NOT EXISTS micro_lesson_progress (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id VARCHAR(36) NOT NULL,

    micro_lesson_id BIGINT NOT NULL,

    completed BOOLEAN DEFAULT FALSE,

    completed_at TIMESTAMP NULL,

    CONSTRAINT fk_micro_progress_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_micro_progress_ml
    FOREIGN KEY (micro_lesson_id)
    REFERENCES micro_lessons(id)
    ON DELETE CASCADE

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

