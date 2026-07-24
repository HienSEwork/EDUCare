CREATE TABLE IF NOT EXISTS password_reset_otps (
  email VARCHAR(255) NOT NULL,
  code_hash VARCHAR(100) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  sent_at DATETIME(6) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
