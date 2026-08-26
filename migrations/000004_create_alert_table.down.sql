ALTER TABLE alerts
DROP CONSTRAINT alert_public_id_unique,
DROP CONSTRAINT alert_fk_device;

DROP TABLE alerts;

DROP TYPE jenis_resiko;

DROP TYPE tingkat_keparahan;