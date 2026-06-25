CREATE type gender AS ENUM (
    'L',
    'P'
);

CREATE TABLE workers
(
    internal_id     BIGSERIAL       PRIMARY KEY,
    public_id       UUID            NOT NULL DEFAULT gen_random_uuid(),
    nama            VARCHAR(100)    NOT NULL,
    tanggal_lahir   DATE            NOT NULL,
    jenis_kelamin   gender          NOT NULL,
    pengawas_id     BIGINT          NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMPTZ     NULL,
    CONSTRAINT      worker_public_id_unique     UNIQUE(public_id),
    CONSTRAINT      worker_fk_observer          FOREIGN KEY      (pengawas_id)   REFERENCES observers(internal_id)
);