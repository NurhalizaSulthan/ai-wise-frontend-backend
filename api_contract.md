# RIKUB AI-Wise — Sistem Monitoring Kesehatan dan Keselamatan Kerja (K3)
**Version 1**

**Base URL**
- Development: `http://192.168.1.101:5000`

**Authentication**
- HTTP Authorization, Schema: `Bearer`

---

## Auth

### POST `/v1/auth/login`

Login dan mendapatkan bearer token.

**Headers**

| Key | Value |
|---|---|
| Content-Type | application/json |

**Request Body**

```json
{
  "public_id": "string",
  "password": "string"
}
```

**Responses**

`200 OK`
```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": "bearer-token-string"
}
```

`401 Unauthorized`
```json
{
  "Status": "401 Unauthorized",
  "StatusCode": 401,
  "Message": "string",
  "Error": "string"
}
```

---

## Pengawas

**Object**
```json
{
  "public_id": "string",
  "nama": "string",
  "role": "string"
}
```

### GET `/api/v1/pengawas`

Mendapatkan daftar seluruh pengawas.

**Headers**

| Key | Value |
|---|---|
| Content-Type | application/json |
| Authorization | Bearer `<token>` |

**Responses**

`200 OK`
```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": [
    {
      "public_id": "string",
      "nama": "string",
      "role": "string"
    }
  ]
}
```

`400 Bad Request`
```json
{
  "Status": "400 Bad Request",
  "StatusCode": 400,
  "Message": "string",
  "Error": "string"
}
```

`401 Unauthorized`
```json
{
  "Status": "401 Unauthorized",
  "StatusCode": 401,
  "Message": "string",
  "Error": "string"
}
```

`404 Not Found`
```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```

---

## Pekerja

**Object**
```json
{
  "public_id": "string",
  "nama": "string",
  "tanggal_lahir": "timestampz",
  "gender": "L | P",
  "pengawas_id": 0
}
```

### GET `/api/v1/pekerja`

Mendapatkan daftar seluruh pekerja.

**Headers**

| Key | Value |
|---|---|
| Content-Type | application/json |
| Authorization | Bearer `<token>` |

**Responses**

`200 OK`
```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": [
    {
      "public_id": "string",
      "nama": "string",
      "tanggal_lahir": "timestampz",
      "gender": "L | P",
      "pengawas_id": 0
    }
  ]
}
```

`400 Bad Request`
```json
{
  "Status": "400 Bad Request",
  "StatusCode": 400,
  "Message": "string",
  "Error": "string"
}
```

`401 Unauthorized`
```json
{
  "Status": "401 Unauthorized",
  "StatusCode": 401,
  "Message": "string",
  "Error": "string"
}
```

`404 Not Found`
```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```

---

## Device

**Object**
```json
{
  "public_id": "string",
  "pekerja_id": 0
}
```

### GET `/api/v1/device`

Mendapatkan daftar seluruh device.

**Headers**

| Key | Value |
|---|---|
| Content-Type | application/json |
| Authorization | Bearer `<token>` |

**Responses**

`200 OK`
```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": [
    {
      "public_id": "string",
      "pekerja_id": 0
    }
  ]
}
```

`400 Bad Request`
```json
{
  "Status": "400 Bad Request",
  "StatusCode": 400,
  "Message": "string",
  "Error": "string"
}
```

`401 Unauthorized`
```json
{
  "Status": "401 Unauthorized",
  "StatusCode": 401,
  "Message": "string",
  "Error": "string"
}
```

`404 Not Found`
```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```

---

## Alert

**Object**
```json
{
  "public_id": "string",
  "device_id": 0,
  "jenis_alert": "Jatuh | Postur Tubuh | Cuaca Ekstrem",
  "tingkat_keparahan": "Tinggi | Menengah | Rendah"
}
```

### GET `/api/v1/alert`

Mendapatkan daftar seluruh alert.

**Headers**

| Key | Value |
|---|---|
| Content-Type | application/json |
| Authorization | Bearer `<token>` |

**Responses**

`200 OK`
```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": [
    {
      "public_id": "string",
      "device_id": 0,
      "jenis_alert": "Jatuh | Postur Tubuh | Cuaca Ekstrem",
      "tingkat_keparahan": "Tinggi | Menengah | Rendah"
    }
  ]
}
```

`400 Bad Request`
```json
{
  "Status": "400 Bad Request",
  "StatusCode": 400,
  "Message": "string",
  "Error": "string"
}
```

`401 Unauthorized`
```json
{
  "Status": "401 Unauthorized",
  "StatusCode": 401,
  "Message": "string",
  "Error": "string"
}
```

`404 Not Found`
```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```