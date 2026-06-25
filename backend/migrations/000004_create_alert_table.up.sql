CREATE TYPE tingkat_keparahan AS ENUM (
	'Tinggi',
	'Rendah',
	'Menengah'
);

CREATE TYPE jenis_resiko AS ENUM (
	'Jatuh',
	'Postur Tubuh',
	'Cuaca Ekstrem'
);

CREATE TABLE alerts(
    internal_id     BIGSERIAL           PRIMARY KEY,
    public_id       UUID                NOT NULL DEFAULT gen_random_uuid(),  
    device_id       BIGINT              NOT NULL,  
    jenis_alert     jenis_resiko        NOT NUll,
    tingkat_alert   tingkat_keparahan   NOT NULL,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMPTZ         NULL,
    CONSTRAINT      alert_public_id_unique UNIQUE (public_id),
    CONSTRAINT      alert_fk_device     FOREIGN KEY (device_id) REFERENCES devices(internal_id)
);