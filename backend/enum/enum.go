package enum

import (
	"database/sql/driver"
	"errors"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/constants"
)

func scanStringLike(dst *string, value interface{}) error {
	switch v := value.(type) {
	case []byte:
		*dst = string(v)
	case string:
		*dst = v
	case nil:
		*dst = ""
	default:
		return errors.New(constants.EnumParsingError)
	}

	return  nil
}

type JenisAlert string

const (
	Jatuh JenisAlert = "Jatuh"
	Postur	JenisAlert = "Postur Tubuh"
	Cuaca	JenisAlert	= "Cuaca Ekstrem"
)

func (j *JenisAlert) Scan(value interface{}) error {
	return scanStringLike((*string)(j), value)
} 

func (j JenisAlert) Value() (driver.Value, error) {
	return string(j), nil
}

type TingkatKeparahan string
const (
	Tinggi TingkatKeparahan = "Tinggi"
	Menengah	TingkatKeparahan = "Menengah"
	Rendah	TingkatKeparahan	= "Rendah"
)

func (t *TingkatKeparahan) Scan(value interface{}) error {
	return scanStringLike((*string)(t), value)
} 

func (t TingkatKeparahan) Value() (driver.Value, error) {
	return string(t), nil
}

type PengawasRole string
const (
	Admin PengawasRole = "Admin"
	Pengawas	PengawasRole = "Pengawas"
)

func (t *PengawasRole) Scan(value interface{}) error {
	return scanStringLike((*string)(t), value)
} 

func (t PengawasRole) Value() (driver.Value, error) {
	return string(t), nil
}