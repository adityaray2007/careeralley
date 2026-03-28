package routes

import (
	"careeralley/controllers"
	"careeralley/middleware"

	"github.com/gin-gonic/gin"
)

func AssistantRoutes(router *gin.Engine) {
	router.POST("/assistant/chat", middleware.JWTAuthMiddleware(), controllers.AssistantChat)
	router.POST("/assistant/generate-roadmap", middleware.JWTAuthMiddleware(), controllers.AssistantGenerateRoadmap)
}
