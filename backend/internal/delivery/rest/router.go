package rest

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/azrilpramudia/go-api-keygen/internal/delivery/rest/middleware"
)

func NewRouter(h *KeyHandler, corsOrigin string, apiMiddlewares ...gin.HandlerFunc) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), gin.Logger(), middleware.CORS(corsOrigin))

	_ = r.SetTrustedProxies(nil)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	mws := append([]gin.HandlerFunc{middleware.NoStore()}, apiMiddlewares...)
	v1 := r.Group("/api/v1", mws...)
	v1.POST("/keys", h.Generate)

	return r
}
