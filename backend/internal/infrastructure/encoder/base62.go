package encoder

import (
	"crypto/rand"
	"math"
)

const alphabet62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

type Base62 struct{}

func (Base62) Generate(bits int) (string, error) {
	length := int(math.Ceil(float64(bits) / math.Log2(62)))
	out := make([]byte, 0, length)
	buf := make([]byte, length*2)

	for len(out) < length {
		if _, err := rand.Read(buf); err != nil {
			return "", err
		}
		for _, b := range buf {
			if b >= 248 {
				continue
			}
			out = append(out, alphabet62[b%62])
			if len(out) == length {
				break
			}
		}
	}
	return string(out), nil
}
