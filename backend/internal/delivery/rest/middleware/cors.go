package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORS(allowedOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" && origin == allowedOrigin {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Methods", "POST, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type")
			c.Header("Access-Control-Max-Age", "600")
			c.Header("Access-Control-Expose-Headers", "Retry-After, X-RateLimit-Remaining")
		}
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
