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

-- Thêm dữ liệu nguồn tham khảo (sources) cho các bài học
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(10, 'Scarleteen - Quickies: Sexual Consent Basics', 'https://www.scarleteen.com/read/sex-sexuality/quickies-sexual-consent-basics', 'website'),
(10, 'Scarleteen - Age of Consent: What is it, exactly?', 'https://www.scarleteen.com/read/culture/age-consent-what-exactly', 'website'),
(11, 'Scarleteen - I Know Consent is Awesome, but Rejection is Not', 'https://www.scarleteen.com/read/sex-sexuality/i-know-consent-awesome-rejection-not', 'website');