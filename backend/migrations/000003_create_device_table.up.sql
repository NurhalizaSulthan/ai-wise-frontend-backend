CREATE TABLE devices
(
    internal_id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL DEFAULT gen_random_uuid(),
    pekerja_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT      device_public_id_unique  UNIQUE(public_id),
    CONSTRAINT      device_fk_worker   FOREIGN KEY (pekerja_id) REFERENCES workers(internal_id)
);