package utils

import (
	"encoding/base64"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
)

func DecodeCursor(cursorString string) (*uuid.UUID, *time.Time, error) {
	decodedString, err := base64.StdEncoding.DecodeString(cursorString)
	if err != nil {
		return nil, nil, errors.New("cursor tidak valid")
	}

	values := strings.SplitN(string(decodedString), ",", 2)

	if len(values) != 2 {
		return nil, nil, errors.New("cursor tidak valid")
	}

	uid, err := uuid.Parse(values[0])
	if err != nil {
		return nil, nil, errors.New("cursor tidak valid: UID tidak valid")
	}

	timestamp, err := time.Parse(time.RFC3339Nano, values[1])
	if err != nil {
		return nil, nil, errors.New("cursor tidak valid: waktu tidak valid")
	}

	return &uid, &timestamp, nil
}

func EncodeCursor(publicID uuid.UUID, creationTime time.Time) string {
	combined := publicID.String() + "," + creationTime.Format(time.RFC3339Nano)

	return base64.StdEncoding.EncodeToString([]byte(combined))
}
