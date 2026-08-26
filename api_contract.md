# RIKUB AI-Wise — Sistem Monitoring Kesehatan dan Keselamatan Kerja (K3)

**Version 1**

**Base URL**

- Development: `http://192.168.1.101:4000`

**Authentication**

- HTTP Authorization, Schema: `Bearer`

---

## Auth

### POST `/v1/auth/login`

Login dan mendapatkan bearer token.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Request Body**

```json
{
  "nama": "string",
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

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

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

### POST `/api/v1/pengawas`

Mendaftarkan pengawas.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Request Body**

```json
{
  "nama": "string",
  "role": "string",
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

### GET `/api/v1/pengawas?public_id=`

Mendapatkan detail pengawas.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "nama": "string",
    "role": "string"
  }
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

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

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

### POST `/api/v1/pekerja`

Mendaftarkan pekerja.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Request Body**

```json
{
  "nama": "string",
  "tanggal_lahir": "00:00:0000T00:00Z",
  "jenis_kelamin": "string",
  "device_public_id": "string"
}
```

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
      "tanggal_lahir": "00:00:0000T00:00Z",
      "jenis_kelamin": "L | P"
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

### GET `/api/v1/pekerja?public_id=`

Mendapatkan detail pekerja

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "nama": "string",
    "tanggal_lahir": "00:00:0000T00:00Z",
    "jenis_kelamin": "L | P"
  }
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
  "pekerja_id": 0,
  "telemetry": [
    {
      "public_id": "string",
      "acc_x": 0.0,
      "acc_y": 0.0,
      "acc_z": 0.0,
      "gyro_x": 0.0,
      "gyro_y": 0.0,
      "gyro_z": 0.0,
      "roll": 0.0,
      "pitch": 0.0,
      "yaw": 0.0,
      "latitude": 0.0,
      "longitude": 0.0,
      "created_at": "00:00:0000T00:00Z"
    }
  ]
}
```

### GET `/api/v1/device`

Mendapatkan daftar seluruh device.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

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

### GET `/api/v1/device/detail?public_id=xxxxxxxxxxxxxx`

Mendapatkan detail sebuah device.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Query**
`public_id` ID Publik dari device

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "pekerja_id": 0,
    "telemetry": [
      {
        "public_id": "string",
        "acc_x": 0.0,
        "acc_y": 0.0,
        "acc_z": 0.0,
        "gyro_x": 0.0,
        "gyro_y": 0.0,
        "gyro_z": 0.0,
        "roll": 0.0,
        "pitch": 0.0,
        "yaw": 0.0,
        "latitude": 0.0,
        "longitude": 0.0,
        "created_at": "00:00:0000T00:00Z"
      }
    ]
  }
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

`500 Internal Server Error`

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

```base
{
  "public_id": "string",
  "device_id": 0,
  "jenis_alert": "Jatuh | Postur Tubuh | Cuaca Ekstrem",
  "tingkat_keparahan": "Tinggi | Menengah | Rendah"
}
```

```create
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

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

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

### GET `/api/v1/alert/detail?public_id=xxxxxxxxxxxxxx`

Mendapatkan detail sebuah alert.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Query**
`public_id` ID Publik dari alert

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "device_id": 0,
    "jenis_alert": "Jatuh | Postur Tubuh | Cuaca Ekstrem",
    "tingkat_keparahan": "Tinggi | Menengah | Rendah"
  }
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

`500 Internal Server Error`

```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```

### POST `/api/v1/alert/`

Menambahkan alert baru

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |
| Payload      | alert-create     |

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "device_id": 0,
    "jenis_alert": "Jatuh | Postur Tubuh | Cuaca Ekstrem",
    "tingkat_keparahan": "Tinggi | Menengah | Rendah"
  }
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

`500 Internal Server Error`

```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```

## Telemetry

**Object**

```base
{
  "public_id": "string",
  "acc_x" : 0.0,
  "acc_y" : 0.0,
  "acc_z" : 0.0,
  "gyro_x": 0.0,
  "gyro_y": 0.0,
  "gyro_z": 0.0,
  "roll"  : 0.0,
  "pitch" : 0.0,
  "yaw"   : 0.0,
  "latitude" : 0.0,
  "longitude" : 0.0,
  "created_at" : "00:00:0000T00:00Z"
}
```

```create
{
  "acc_x" : 0.0,
  "acc_y" : 0.0,
  "acc_z" : 0.0,
  "gyro_x": 0.0,
  "gyro_y": 0.0,
  "gyro_z": 0.0,
  "roll"  : 0.0,
  "pitch" : 0.0,
  "yaw"   : 0.0,
  "latitude" : 0.0,
  "longitude" : 0.0
}
```

### GET `/api/v1/telemetry`

Mendapatkan daftar seluruh alert.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

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
      "acc_x": 0.0,
      "acc_y": 0.0,
      "acc_z": 0.0,
      "gyro_x": 0.0,
      "gyro_y": 0.0,
      "gyro_z": 0.0,
      "roll": 0.0,
      "pitch": 0.0,
      "yaw": 0.0,
      "latitude": 0.0,
      "longitude": 0.0,
      "created_at": "00:00:0000T00:00Z"
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

### GET `/api/v1/telemetry/detail?public_id=xxxxxxxxxxxxxx`

Mendapatkan detail sebuah telemetry.

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |

**Query**
`public_id` ID Publik dari telemetry

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "acc_x": 0.0,
    "acc_y": 0.0,
    "acc_z": 0.0,
    "gyro_x": 0.0,
    "gyro_y": 0.0,
    "gyro_z": 0.0,
    "roll": 0.0,
    "pitch": 0.0,
    "yaw": 0.0,
    "latitude": 0.0,
    "longitude": 0.0,
    "created_at": "00:00:0000T00:00Z"
  }
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

`500 Internal Server Error`

```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```

### POST `/api/v1/telemetry`

Menambahkan telemetry baru

**Headers**

| Key          | Value            |
| ------------ | ---------------- |
| Content-Type | application/json |
| Payload      | telemetry-create |

**Responses**

`200 OK`

```json
{
  "Status": "200 Status OK",
  "StatusCode": 200,
  "Message": "string",
  "Data": {
    "public_id": "string",
    "acc_x": 0.0,
    "acc_y": 0.0,
    "acc_z": 0.0,
    "gyro_x": 0.0,
    "gyro_y": 0.0,
    "gyro_z": 0.0,
    "roll": 0.0,
    "pitch": 0.0,
    "yaw": 0.0,
    "latitude": 0.0,
    "longitude": 0.0,
    "created_at": "00:00:0000T00:00Z"
  }
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

`500 Internal Server Error`

```json
{
  "Status": "404 Not Found",
  "StatusCode": 404,
  "Message": "string",
  "Error": "string"
}
```
