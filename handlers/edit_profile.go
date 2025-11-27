package handlers

import (
	"Parasat/auth"
	"Parasat/database"
	"Parasat/models"
	"Parasat/sessions"
	"context"
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func EditProfile(c *gin.Context) {
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

	switch c.Request.Method {
	case http.MethodGet:
		var user models.User
		if err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user); err != nil {
			_ = sessions.ClearSession(c.Writer, c.Request)
			c.Redirect(http.StatusSeeOther, "/login?error=session_expired")
			return
		}

		tmpl, err := template.ParseFiles("templates/edit_profile.html")
		if err != nil {
			log.Printf("template parse error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load template"})
			return
		}

		data := struct {
			Name  string
			Email string
			ID    string
		}{
			Name:  user.Name,
			Email: user.Email,
			ID:    userID,
		}

		c.Header("Content-Type", "text/html; charset=utf-8")
		if err := tmpl.Execute(c.Writer, data); err != nil {
			log.Printf("template execute error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to render page"})
			return
		}

	case http.MethodPost:
		if err := c.Request.ParseForm(); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
			return
		}

		name := c.PostForm("name")
		email := c.PostForm("email")
		newPassword := c.PostForm("password")
		currentPassword := c.PostForm("current_password")

		updateFields := bson.M{}

		if name != "" {
			updateFields["name"] = name
		}
		if email != "" {
			updateFields["email"] = email
		}
		if newPassword != "" {
			if currentPassword == "" {
				c.Redirect(http.StatusSeeOther, "/edit-profile?error=required_current_password")
				return
			}
			var user models.User
			err := collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&user)
			if err != nil {
				_ = sessions.ClearSession(c.Writer, c.Request)
				c.Redirect(http.StatusSeeOther, "/login?error=session_expired")
				return
			}
			if !user.CheckPassword(currentPassword) {
				c.Redirect(http.StatusSeeOther, "/edit-profile?error=incorrect_password")
				return
			}
			hashed, err := auth.HashPassword(newPassword)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
				return
			}
			updateFields["password"] = hashed
		}

		if len(updateFields) == 0 {
			c.Redirect(http.StatusSeeOther, "/profile")
			return
		}

		updateFields["updated_at"] = time.Now()

		if _, err := collection.UpdateOne(c.Request.Context(), bson.M{"_id": objID}, bson.M{"$set": updateFields}); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
			return
		}

		c.Redirect(http.StatusSeeOther, "/profile")
	default:
		c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Method not allowed"})
	}
}
