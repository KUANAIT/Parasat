package middleware

import (
	"Parasat/sessions"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		session, err := sessions.Get(c.Request)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
			c.Abort()
			return
		}

		if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		if userID, ok := session.Values["user_id"].(string); ok {
			c.Set("user_id", userID)
		}

		c.Next()
	}
}

func NoAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		session, err := sessions.Get(c.Request)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
			c.Abort()
			return
		}

		if auth, ok := session.Values["authenticated"].(bool); ok && auth {
			c.JSON(http.StatusForbidden, gin.H{"error": "Already authenticated"})
			c.Abort()
			return
		}

		c.Next()
	}
}
