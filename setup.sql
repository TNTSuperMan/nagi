CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle VARCHAR(256) UNIQUE NOT NULL,
    displayName VARCHAR(256) NOT NULL,
    handle_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    bio VARCHAR(1024) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    icon BYTEA,

    password_hash TEXT,
    totp_secret TEXT
);

CREATE TABLE webauthn_credentials (
    credential_id TEXT PRIMARY KEY,
    user_handle UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    credential JSONB
);
