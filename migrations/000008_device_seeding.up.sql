INSERT INTO devices (pekerja_id, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Fakhri Rasyad'), 'd5:23:6a:16:fb:82');

INSERT INTO devices (pekerja_id, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Leonardo Aliyamin Nifinluri'), 'd5:8c:68:5d:5c:2f');

INSERT INTO devices (pekerja_id, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Siti Nurhaliza'), '64:00:01:8b:8e:8e');

INSERT INTO devices (pekerja_id, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Nurfadillah Umar'),'9c:be:eb:a9:f1:d0');
