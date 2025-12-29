package handlers
import (
    "backend/database"
    "backend/models"
    "net/http"
    "github.com/gin-gonic/gin"
)
func GetAuthorInfo(c *gin.Context) {
    username := c.Param("username")
    var user models.User
    if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    var snippets []models.Snippet
    database.DB.Where("author_id = ?", user.ID).Order("created_at desc").Limit(10).Find(&snippets)
    var popularSnippets []models.Snippet
    database.DB.Where("author_id = ?", user.ID).Order("views desc").Limit(10).Find(&popularSnippets)
    var totalViews int64
    database.DB.Model(&models.Snippet{}).Where("author_id = ?", user.ID).Select("sum(views)").Row().Scan(&totalViews)
    c.JSON(http.StatusOK, gin.H{
        "user": gin.H{
            "username": user.Username,
            "bio": user.Bio,
            "profile_pic_url": user.ProfilePicURL,
            "total_views": totalViews,
        },
        "latest_snippets": snippets,
        "popular_snippets": popularSnippets,
    })
}
