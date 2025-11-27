package routes

import (
	"Parasat/handlers"
	"Parasat/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.POST("/users", handlers.CreateUser)
	router.GET("/users/get", handlers.GetUser)
	router.GET("/users/get/:user_id", handlers.GetUser)
	router.POST("/users/get/:user_id", handlers.GetUser)
	router.PUT("/users/update", handlers.UpdateUser)
	router.DELETE("/users/delete", handlers.DeleteUser)

	router.POST("/loginuser", handlers.LoginCustomer)

	protected := router.Group("/", middleware.AuthRequired())
	protected.GET("/profile", handlers.Profile)
	protected.GET("/edit-profile", handlers.EditProfile)
	protected.POST("/edit-profile", handlers.EditProfile)
	protected.POST("/logout", handlers.LogoutCustomer)
}
