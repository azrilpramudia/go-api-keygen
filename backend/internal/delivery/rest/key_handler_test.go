package rest_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest"
	"github.com/azrilpramudia/go-api-keygen/internal/domain"
	"github.com/azrilpramudia/go-api-keygen/internal/infrastructure/encoder"
	"github.com/azrilpramudia/go-api-keygen/internal/usecase"
)

func TestGenerateHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	uc := usecase.NewGenerateUseCase(map[domain.Format]domain.Encoder{
		domain.FormatHex: encoder.Hex{},
	})
	r := rest.NewRouter(rest.NewKeyHandler(uc), "http://localhost:5173")

	tests := []struct {
		name string
		body string
		want int
	}{
		{"valid", `{"bits":128,"format":"hex","prefix":"sk_live_","count":2}`, http.StatusOK},
		{"unsupported bits", `{"bits":8,"format":"hex"}`, http.StatusBadRequest},
		{"unknown format", `{"bits":64,"format":"xyz"}`, http.StatusBadRequest},
		{"malformed JSON", `{bits:`, http.StatusBadRequest},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/v1/keys", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tt.want {
				t.Fatalf("status = %d, want %d, body = %s", w.Code, tt.want, w.Body.String())
			}
			if got := w.Header().Get("Cache-Control"); got != "no-store" {
				t.Fatalf("Cache-Control = %q, want no-store", got)
			}
		})
	}
}
