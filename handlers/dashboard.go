package handlers
import (
    "backend/database"
    "backend/models"
    "net/http"
    "github.com/gin-gonic/gin"
)
func GetDashboardData(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }
    var snippets []models.Snippet
    database.DB.Where("author_id = ?", userID).Order("created_at desc").Find(&snippets)
    var totalLikes int64
    database.DB.Model(&models.Like{}).Joins("JOIN snippets ON snippets.id = likes.snippet_id").Where("snippets.author_id = ?", userID).Count(&totalLikes)
    var totalComments int64
    database.DB.Model(&models.Comment{}).Joins("JOIN snippets ON snippets.id = comments.snippet_id").Where("snippets.author_id = ?", userID).Count(&totalComments)
    c.JSON(http.StatusOK, gin.H{
        "total_likes":    totalLikes,
        "total_codes":    len(snippets),
        "total_comments": totalComments,
        "snippets":       snippets,
    })
}
