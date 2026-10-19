package encoder

import (
	"crypto/rand"
	"encoding/base64"
)

type Base64 struct{}

func (Base64) Generate(bits int) (string, error) {
	b := make([]byte, bits/8)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
