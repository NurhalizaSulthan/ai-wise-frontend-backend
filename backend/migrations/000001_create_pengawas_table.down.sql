ALTER TABLE observers DROP CONSTRAINT observer_public_id_unique;
DROP TABLE IF EXISTS observers;

DROP type pengawas_role_enum;