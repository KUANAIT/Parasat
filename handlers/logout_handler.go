package handlers

import (
	"Parasat/sessions"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LogoutCustomer(c *gin.Context) {
	if err := sessions.ClearSession(c.Writer, c.Request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear session"})
		return
	}

	c.Redirect(http.StatusSeeOther, "/")
}
