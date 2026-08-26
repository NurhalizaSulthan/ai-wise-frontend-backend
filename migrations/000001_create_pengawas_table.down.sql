ALTER TABLE IF EXISTS pengawas DROP CONSTRAINT IF EXISTS pengawas_public_id_unique;
DROP TABLE IF EXISTS pengawas;

DROP type pengawas_role_enum;
