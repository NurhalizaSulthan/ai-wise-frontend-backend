ALTER TABLE devices
DROP CONSTRAINT device_public_id_unique,
DROP CONSTRAINT device_fk_worker;
DROP TABLE devices;