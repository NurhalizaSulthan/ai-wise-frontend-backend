CREATE type gender AS ENUM (
    'L',
    'P'
);

CREATE TABLE pekerjas
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
    CONSTRAINT      pekerja_public_id_unique     UNIQUE(public_id),
    CONSTRAINT      pekerja_fk_observer          FOREIGN KEY      (pengawas_id)   REFERENCES pengawas(internal_id)
);
