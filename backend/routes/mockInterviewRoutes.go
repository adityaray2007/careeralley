package routes

import (
	"careeralley/controllers"
	"careeralley/middleware"

	"github.com/gin-gonic/gin"
)

func MockInterviewRoutes(router *gin.Engine) {
	protected := router.Group("/mock-interviews")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.GET("", controllers.GetInterviewRequests)
		protected.POST("", controllers.CreateInterviewRequest)
		protected.POST("/:id/join", controllers.JoinInterviewRequest)
		protected.DELETE("/:id", controllers.CancelInterviewRequest)
		protected.GET("/session/:room_code", controllers.GetSessionInfo)
	}

	// WebSocket — auth via query param
	router.GET("/mock-interviews/session/:room_code/ws", controllers.InterviewWebSocket)
}
