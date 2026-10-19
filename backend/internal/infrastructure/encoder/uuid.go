package encoder

import (
	"crypto/rand"
	"fmt"

	"github.com/azrilpramudia/go-api-keygen/internal/domain"
)

type UUIDv4 struct{}

func (UUIDv4) Generate(bits int) (string, error) {
	if bits != 128 {
		return "", domain.ErrUUIDRequires128
	}
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		return "", err
	}
	b[6] = (b[6] & 0x0f) | 0x40 // version 4
	b[8] = (b[8] & 0x3f) | 0x80 // variant RFC 4122
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:]), nil
}
