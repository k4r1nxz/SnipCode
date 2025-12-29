package main
import (
	"backend/database"
	"backend/handlers"
	"backend/middleware"
	"backend/models"
	"log"
	"time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)
func main() {
	database.InitDatabase()
	seedAdminUsers()
	r := gin.Default()
	r.RedirectTrailingSlash = true
	r.RedirectFixedPath = true
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"https:",
			"http:",
			"http:",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	api := r.Group("/api")
	{
		api.GET("/", handlers.GetHomePageData)
		api.GET("/code", handlers.GetAllSnippets)
		api.GET("/code/:slug", handlers.GetSnippetDetail)
		api.GET("/raw/:slug", handlers.GetRawSnippet)
		api.GET("/download/:slug", handlers.DownloadSnippet)
		api.GET("/user/:username", handlers.GetAuthorInfo)
		api.POST("/login", handlers.Login)
		api.POST("/register", handlers.Register)
		auth := api.Group("")
		auth.Use(middleware.AuthMiddleware())
		{
			auth.GET("/dashboard", handlers.GetDashboardData)
			auth.POST("/code/create", handlers.CreateSnippet)
			auth.PUT("/code/edit/:slug", handlers.EditSnippet)
			auth.DELETE("/code/:slug", handlers.DeleteSnippet)
			auth.POST("/code/:slug/like", handlers.LikeSnippet)
			auth.POST("/code/:slug/comment", handlers.CreateComment)
		}
	}
	log.Println("🚀 Server running on :8080")
	r.Run(":8080")
}
func seedAdminUsers() {
    admins := []string{"admin", "admin2"}
    for _, username := range admins {
        var user models.User
        if err := database.DB.Where("username = ?", username).First(&user).Error; err == nil {
            continue
        }
        fixedPassword := "admin123" 
        hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(fixedPassword), bcrypt.DefaultCost)
        adminUser := models.User{
            Username:     username,
            Email:        username + "@admin.com",
            PasswordHash: string(hashedPassword),
            Bio:          "Admin User",
            Role:         "admin",
        }
        database.DB.Create(&adminUser)
        log.Printf("✅ Created admin '%s' | password: %s", username, fixedPassword)
    }
}
