CREATE TYPE pengawas_role_enum AS ENUM
(
	'admin',
	'pengawas'
);

CREATE TABLE observers
(
    internal_id     BIGSERIAL       PRIMARY KEY,
    public_id       UUID            NOT NULL DEFAULT gen_random_uuid(),
    nama            VARCHAR(100)    NOT NULL,
    pass_hash       VARCHAR(255)    NOT NULL,
    role            pengawas_role_enum       NOT NULL DEFAULT 'pengawas',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMPTZ     NULL,
    CONSTRAINT      observer_public_id_unique UNIQUE(public_id)
);