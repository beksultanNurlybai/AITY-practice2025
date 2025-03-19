CREATE TABLE users (
    id SERIAL PRIMARY KEY,               -- Unique ID for each user (auto-incremented)
    first_name VARCHAR(100) NOT NULL,    -- First Name (Required)
    last_name VARCHAR(100) NOT NULL,     -- Last Name (Required)
    patronymic VARCHAR(100),             -- Patronymic (Optional, since not all have one)
    position VARCHAR(255),               -- Job Position (Optional, can be NULL)
    email VARCHAR(255) UNIQUE NOT NULL,  -- Unique Email (Required)
    phone_number VARCHAR(20) UNIQUE,     -- Unique Phone Number (Optional)
    employee_number VARCHAR(50) UNIQUE,  -- Employee ID (Can be alphanumeric, optional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Track when the record was created
);

CREATE TABLE pending_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),
    position VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    employee_number VARCHAR(50) UNIQUE,
    verification_code VARCHAR(10),      -- Code sent via SMS
    registration_token VARCHAR(100),    -- Token sent via email
    expires_at TIMESTAMP,               -- Expiry time for verification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
