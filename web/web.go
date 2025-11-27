package web

import "github.com/gin-gonic/gin"

func SetupTemplates(router *gin.Engine) {
	router.Static("/static", "./static")

	router.GET("/register", func(c *gin.Context) {
		c.File("./templates/register.html")
	})

	router.GET("/login", func(c *gin.Context) {
		c.File("./templates/login.html")
	})
}
