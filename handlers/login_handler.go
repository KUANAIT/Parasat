package handlers

import (
	"Parasat/database"
	"Parasat/models"
	"Parasat/sessions"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func LoginCustomer(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	collection := database.UserCollection
	if collection == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User collection not initialized"})
		return
	}

	var user models.User
	ctx := c.Request.Context()
	err := collection.FindOne(ctx, bson.M{"email": credentials.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !user.CheckPassword(credentials.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	userID := user.ID.Hex()

	if err := sessions.SetUserSession(c.Writer, c.Request, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}
