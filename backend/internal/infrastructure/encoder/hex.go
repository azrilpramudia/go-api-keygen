package encoder

import (
	"crypto/rand"
	"encoding/hex"
)

type Hex struct{}

func (Hex) Generate(bits int) (string, error) {
	b := make([]byte, bits/8)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
