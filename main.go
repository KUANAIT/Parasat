package main

import (
	"Parasat/database"
	"Parasat/routes"
	"Parasat/sessions"
	"Parasat/web"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	sessionKey := []byte("your-32-byte-secret-key-here")
	sessions.Initialize(sessionKey)

	if err := database.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := database.DisconnectDB(); err != nil {
			log.Printf("Error disconnecting from database: %v", err)
		}
	}()

	database.Connect_DB()

	router := gin.Default()
	routes.RegisterRoutes(router)
	web.SetupTemplates(router)

	log.Println("Server started on :3001")
	if err := router.Run(":3001"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
