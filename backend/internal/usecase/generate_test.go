package usecase_test

import (
	"testing"

	"github.com/azrilpramudia/go-api-keygen/internal/domain"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/encoder"
	"github.com/azrilpramudia/go-api-keygen/internal/usecase"
)

func newUC() *usecase.GenerateUseCase {
	return usecase.NewGenerateUseCase(map[domain.Format]domain.Encoder{
		domain.FormatHex:    encoder.Hex{},
		domain.FormatBase62: encoder.Base62{},
		domain.FormatUUID:   encoder.UUIDv4{},
	})
}

func TestHexLength(t *testing.T) {
	want := map[int]int{16: 4, 32: 8, 48: 12, 64: 16, 128: 32, 256: 64}
	for bits, n := range want {
		keys, err := newUC().Execute(usecase.GenerateInput{
			Bits: bits, Format: domain.FormatHex, Count: 1,
		})
		if err != nil || len(keys[0].Value) != n {
			t.Fatalf("bits=%d: err=%v len=%d want=%d", bits, err, len(keys[0].Value), n)
		}
	}
}

func TestRejectsInvalid(t *testing.T) {
	cases := []usecase.GenerateInput{
		{Bits: 8, Format: domain.FormatHex, Count: 1},
		{Bits: 64, Format: domain.FormatUUID, Count: 1},
		{Bits: 64, Format: domain.FormatHex, Prefix: "a\nb", Count: 1},
		{Bits: 64, Format: domain.FormatHex, Count: 99},
	}
	for _, c := range cases {
		if _, err := newUC().Execute(c); err == nil {
			t.Errorf("expected error for %+v", c)
		}
	}
}

func TestNoDuplicates(t *testing.T) {
	seen := map[string]struct{}{}
	for i := 0; i < 10000; i++ {
		k, _ := newUC().Execute(usecase.GenerateInput{Bits: 64, Format: domain.FormatBase62, Count: 1})
		if _, dup := seen[k[0].Value]; dup {
			t.Fatal("duplicate key")
		}
		seen[k[0].Value] = struct{}{}
	}
}
