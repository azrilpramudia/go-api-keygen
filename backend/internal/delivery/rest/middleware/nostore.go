package middleware

import "github.com/gin-gonic/gin"

func NoStore() func(c *gin.Context) {
	return func(c *gin.Context) {
		c.Header("Cache-Control", "no-store")
		c.Header("Pragma", "no-cache")
		c.Next()
	}
}
