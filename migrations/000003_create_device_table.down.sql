ALTER TABLE devices
DROP CONSTRAINT device_public_id_unique,
DROP CONSTRAINT device_fk_worker,
DROP CONSTRAINT device_mac_address_unique;

DROP TABLE devices;

DROP TABLE IF EXISTS device_status_idx;