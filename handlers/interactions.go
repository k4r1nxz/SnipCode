package handlers
import (
    "backend/database"
    "backend/models"
    "net/http"
    "github.com/gin-gonic/gin"
)
func LikeSnippet(c *gin.Context) {
    slug := c.Param("slug")
    var snippet models.Snippet
    if err := database.DB.Where("slug = ?", slug).First(&snippet).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
        return
    }
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }
    var like models.Like
    if err := database.DB.Where("user_id = ? AND snippet_id = ?", userID, snippet.ID).First(&like).Error; err == nil {
        database.DB.Delete(&like)
        c.JSON(http.StatusOK, gin.H{"message": "Snippet unliked"})
        return
    }
    newLike := models.Like{
        UserID:    uint(userID.(float64)),
        SnippetID: snippet.ID,
    }
    if err := database.DB.Create(&newLike).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like snippet"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Snippet liked"})
}
type CommentInput struct {
    Content string `json:"content" binding:"required"`
}
func CreateComment(c *gin.Context) {
    slug := c.Param("slug")
    var snippet models.Snippet
    if err := database.DB.Where("slug = ?", slug).First(&snippet).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
        return
    }
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }
    var input CommentInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    comment := models.Comment{
        Content:   input.Content,
        UserID:    uint(userID.(float64)),
        SnippetID: snippet.ID,
    }
    if err := database.DB.Create(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"data": comment})
}
