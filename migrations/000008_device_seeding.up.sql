INSERT INTO devices (pekerja_id)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Fakhri Rasyad'));

INSERT INTO devices (pekerja_id)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Leonardo Aliyamin Nifinluri'));

INSERT INTO devices (pekerja_id)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Siti Nurhaliza'));

INSERT INTO devices (pekerja_id)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Nurfadillah Umar'));
