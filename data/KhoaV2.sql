CREATE TABLE lesson_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    lesson_id BIGINT NOT NULL,

    source_name VARCHAR(255) NOT NULL,

    source_url TEXT NOT NULL,

    source_type VARCHAR(50),

    FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
        ON DELETE CASCADE
);