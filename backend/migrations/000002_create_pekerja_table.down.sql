ALTER TABLE workers 
DROP CONSTRAINT worker_public_id_unique,
DROP CONSTRAINT worker_fk_observer;
DROP TABLE workers;

DROP type gender;