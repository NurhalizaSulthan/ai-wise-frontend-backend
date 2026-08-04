ALTER TABLE pekerjas
DROP CONSTRAINT pekerja_public_id_unique,
DROP CONSTRAINT pekerja_fk_observer;
DROP TABLE pekerjas;

DROP type gender;
