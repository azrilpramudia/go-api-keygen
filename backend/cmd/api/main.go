package main

import (
	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest"
	"github.com/azrilpramudia/go-api-keygen/internal/domain"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/encoder"
	"github.com/azrilpramudia/go-api-keygen/internal/usecase"
)

func main() {
	uc := usecase.NewGenerateUseCase(map[domain.Format]domain.Encoder{
		domain.FormatHex:    encoder.Hex{},
		domain.FormatBase64: encoder.Base64{},
		domain.FormatBase62: encoder.Base62{},
		domain.FormatUUID:   encoder.UUIDv4{},
	})

	r := rest.NewRouter(rest.NewKeyHandler(uc), "http://localhost:5173")
	_ = r.Run(":3000")
}
