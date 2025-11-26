package routes

import (
	"Parasat/handlers"
	"Parasat/middleware"
	"net/http"
)

func RegisterRoutes() {
	//http.HandleFunc("/", handlers.HomePage)
	http.HandleFunc("/users", handlers.CreateUser)
	http.HandleFunc("/users/get", handlers.GetUser)
	http.HandleFunc("/users/update", handlers.UpdateUser)
	http.HandleFunc("/users/delete", handlers.DeleteUser)
	http.HandleFunc("/loginuser", handlers.LoginCustomer)
	http.HandleFunc("/profile", handlers.Profile)
	http.HandleFunc("/edit-profile", middleware.AuthRequired(handlers.EditProfile))

}

func RegisterAuthRoutes() {
	logoutHandler := middleware.AuthRequired(http.HandlerFunc(handlers.LogoutCustomer))
	http.Handle("/logout", logoutHandler)
}
