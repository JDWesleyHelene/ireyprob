-- ============================================================
-- IREY PROD — MySQL Table Setup
-- 
-- IMPORTANT: Click "ireyprod_ireyprod" in the LEFT SIDEBAR 
-- first, THEN import this file. Do NOT import from a table.
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_val TEXT,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
    id          VARCHAR(50)  PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    slug        VARCHAR(200) NOT NULL UNIQUE,
    genre       VARCHAR(100),
    origin      VARCHAR(100),
    bio         TEXT,
    image       TEXT,
    image_alt   VARCHAR(300),
    tags        JSON,
    featured    TINYINT(1) DEFAULT 0,
    sort_order  INT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id          VARCHAR(50)  PRIMARY KEY,
    title       VARCHAR(300) NOT NULL,
    slug        VARCHAR(300) NOT NULL UNIQUE,
    event_date  DATETIME,
    venue       VARCHAR(200),
    city        VARCHAR(100),
    country     VARCHAR(100) DEFAULT 'Mauritius',
    genre       VARCHAR(100),
    image       TEXT,
    image_alt   VARCHAR(300),
    description TEXT,
    artists     JSON,
    featured    TINYINT(1) DEFAULT 0,
    sold_out    TINYINT(1) DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
    id              VARCHAR(50)  PRIMARY KEY,
    title           VARCHAR(300) NOT NULL,
    slug            VARCHAR(300) NOT NULL UNIQUE,
    excerpt         TEXT,
    content         LONGTEXT,
    cover_image     TEXT,
    cover_image_alt VARCHAR(300),
    author          VARCHAR(100) DEFAULT 'IREY PROD',
    status          ENUM('draft','published') DEFAULT 'draft',
    published_at    DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking_submissions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    artist_name VARCHAR(200),
    full_name   VARCHAR(200) NOT NULL,
    email       VARCHAR(200) NOT NULL,
    address     TEXT,
    date_time   DATETIME,
    message     TEXT,
    status      ENUM('new','read','replied','archived') DEFAULT 'new',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    email       VARCHAR(200) NOT NULL,
    budget      VARCHAR(100),
    timeframe   VARCHAR(100),
    project     TEXT,
    status      ENUM('new','read','replied','archived') DEFAULT 'new',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    action      VARCHAR(50) NOT NULL,
    resource    VARCHAR(100),
    details     TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO settings (setting_key, setting_val) VALUES
('hero_headline_1', 'Your Gateway to'),
('hero_headline_2', 'Unforgettable Experiences.'),
('hero_subtext',    'IREY PROD — A dynamic agency specialising in Digital Marketing, Stage & Artist Management, and Event Coordination. Based in Mauritius Island.'),
('contact_email',   'booking@ireyprod.com'),
('phone',           '+230 5 788 20 14'),
('office_hours',    'Mon – Fri, 10am – 5pm'),
('location',        'Mauritius Island, Indian Ocean'),
('instagram',       'https://www.instagram.com/ireyprod/'),
('facebook',        'https://www.facebook.com/IreyProd'),
('youtube',         'https://www.youtube.com/@IreyProd'),
('tiktok',          'https://www.tiktok.com/@ireyprod'),
('site_title',      'IREY PROD — Booking Agency & Event Production | Mauritius Island'),
('site_description','IREY PROD is a dynamic booking agency and event production company based in Mauritius Island.');
