package usecase

import (
	"regexp"

	"github.com/azrilpramudia/go-api-keygen/internal/domain"
)

var prefixRe = regexp.MustCompile(`^[a-zA-Z0-9_-]{0,32}$`)

type GenerateInput struct {
	Bits   int
	Format domain.Format
	Prefix string
	Count  int
}

type GenerateUseCase struct {
	encoders map[domain.Format]domain.Encoder
}

func NewGenerateUseCase(encoders map[domain.Format]domain.Encoder) *GenerateUseCase {
	return &GenerateUseCase{encoders: encoders}
}

func (u *GenerateUseCase) Execute(in GenerateInput) ([]domain.Key, error) {
	if !domain.IsValidBits(in.Bits) {
		return nil, domain.ErrInvalidBits
	}
	enc, ok := u.encoders[in.Format]
	if !ok {
		return nil, domain.ErrInvalidFormat
	}
	if in.Format == domain.FormatUUID && in.Bits != 128 {
		return nil, domain.ErrUUIDRequires128
	}
	if !prefixRe.MatchString(in.Prefix) {
		return nil, domain.ErrInvalidPrefix
	}
	if in.Count < 1 || in.Count > 10 {
		return nil, domain.ErrInvalidCount
	}

	keys := make([]domain.Key, 0, in.Count)
	for i := 0; i < in.Count; i++ {
		v, err := enc.Generate(in.Bits)
		if err != nil {
			return nil, err
		}
		keys = append(keys, domain.Key{
			Value:  in.Prefix + v,
			Bits:   in.Bits,
			Format: in.Format,
			Level:  domain.LevelFor(in.Bits),
		})
	}
	return keys, nil
}
