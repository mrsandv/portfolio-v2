package middleware

import (
	"crypto/subtle"
	"net/http"

	"github.com/gin-gonic/gin"
)

func APIKey(key string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if key == "" {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "API key not configured"})
			return
		}

		provided := c.GetHeader("X-API-Key")
		if subtle.ConstantTimeCompare([]byte(provided), []byte(key)) != 1 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid API key"})
			return
		}

		c.Next()
	}
}
