package handlers

import (
	"Parasat/database"
	"Parasat/models"
	"Parasat/sessions"
	"bytes"
	"context"
	"html/template"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func Profile(c *gin.Context) {
	session, err := sessions.Get(c.Request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve session"})
		return
	}

	userID, ok := session.Values["user_id"].(string)
	if !ok || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	collection := database.UserCollection
	if collection == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User collection not initialized"})
		return
	}

	var user models.User
	if err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user); err != nil {
		_ = sessions.ClearSession(c.Writer, c.Request)
		c.Redirect(http.StatusSeeOther, "/login?error=session_expired")
		return
	}

	tmpl, err := template.ParseFiles("templates/profile.html")
	if err != nil {
		log.Printf("template parse error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load template"})
		return
	}

	data := struct {
		Name      string
		Email     string
		ID        string
		CreatedAt string
		UpdatedAt string
	}{
		Name:      user.Name,
		Email:     user.Email,
		ID:        userID,
		CreatedAt: user.CreatedAt.Format("January 2, 2006 15:04:05"),
		UpdatedAt: user.UpdatedAt.Format("January 2, 2006 15:04:05"),
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		log.Printf("template execute error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to render page"})
		return
	}

	c.Data(http.StatusOK, "text/html; charset=utf-8", buf.Bytes())
}
