INSERT INTO devices (pekerja_id, nama, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Fakhri Rasyad'), 'Device 1', 'd5:23:6a:16:fb:82');

INSERT INTO devices (pekerja_id, nama, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Leonardo Aliyamin Nifinluri'), 'Device 2' ,'d5:8c:68:5d:5c:2f');

INSERT INTO devices (pekerja_id, nama, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Siti Nurhaliza'), 'Device 3' ,'64:00:01:8b:8e:8e');

INSERT INTO devices (pekerja_id, nama, mac_address)
VALUES ((SELECT internal_id from pekerjas WHERE nama='Nurfadillah Umar'),'Device 4','9c:be:eb:a9:f1:d0');
