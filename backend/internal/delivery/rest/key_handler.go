package rest

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/azrilpramudia/go-api-keygen/internal/domain"
	"github.com/azrilpramudia/go-api-keygen/internal/usecase"
)

type KeyHandler struct {
	uc *usecase.GenerateUseCase
}

func NewKeyHandler(uc *usecase.GenerateUseCase) *KeyHandler {
	return &KeyHandler{uc: uc}
}

func (h *KeyHandler) Generate(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 1<<10)

	var req GenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid request body"})
		return
	}
	if req.Count == 0 {
		req.Count = 1
	}

	keys, err := h.uc.Execute(usecase.GenerateInput{
		Bits:   req.Bits,
		Format: domain.Format(req.Format),
		Prefix: req.Prefix,
		Count:  req.Count,
	})
	if err != nil {
		writeError(c, err)
		return
	}

	res := GenerateResponse{Keys: make([]KeyResponse, 0, len(keys))}
	for _, k := range keys {
		res.Keys = append(res.Keys, KeyResponse{
			Value:  k.Value,
			Bits:   k.Bits,
			Format: string(k.Format),
			Level:  string(k.Level),
		})
	}
	c.JSON(http.StatusOK, res)
}

func writeError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, domain.ErrInvalidBits),
		errors.Is(err, domain.ErrInvalidFormat),
		errors.Is(err, domain.ErrInvalidPrefix),
		errors.Is(err, domain.ErrInvalidCount),
		errors.Is(err, domain.ErrUUIDRequires128):
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
	default:
		slog.Error("generate failed", "err", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "internal server error"})
	}
}
