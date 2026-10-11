INSERT INTO pekerjas (nama, tanggal_lahir, jenis_kelamin, pengawas_id)
VALUES ('Fakhri Rasyad', '1999-09-09', 'L', (SELECT internal_id FROM pengawas WHERE nama = 'admin'));

INSERT INTO pekerjas (nama, tanggal_lahir, jenis_kelamin, pengawas_id)
VALUES ('Leonardo Aliyamin Nifinluri', '1999-09-09', 'L', (SELECT internal_id FROM pengawas WHERE nama = 'admin'));

INSERT INTO pekerjas (nama, tanggal_lahir, jenis_kelamin, pengawas_id)
VALUES ('Siti Nurhaliza', '1999-09-09', 'P', (SELECT internal_id FROM pengawas WHERE nama = 'admin'));

INSERT INTO pekerjas (nama, tanggal_lahir, jenis_kelamin, pengawas_id)
VALUES ('Nurfadillah Umar', '1999-09-09', 'P', (SELECT internal_id FROM pengawas WHERE nama = 'admin'));