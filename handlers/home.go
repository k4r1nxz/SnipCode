package handlers
import (
    "backend/database"
    "backend/models"
    "net/http"
    "github.com/gin-gonic/gin"
)
func GetHomePageData(c *gin.Context) {
    searchQuery := c.Query("search")
    languageFilter := c.Query("lang")
    query := database.DB.Model(&models.Snippet{}).Preload("Author")
    if searchQuery != "" {
        query = query.Where("title LIKE ?", "%"+searchQuery+"%")
    }
    if languageFilter != "" {
        query = query.Where("language = ?", languageFilter)
    }
    var snippets []models.Snippet
    if err := query.Order("created_at desc").Limit(20).Find(&snippets).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch snippets"})
        return
    }
    var popularSnippets []models.Snippet
    if err := database.DB.Model(&models.Snippet{}).Preload("Author").Order("views desc").Limit(10).Find(&popularSnippets).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch popular snippets"})
        return
    }
    var popularLanguages []models.Language
    if err := database.DB.Order("total_usage desc").Limit(10).Find(&popularLanguages).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch popular languages"})
        return
    }
    c.JSON(http.StatusOK, gin.H{
        "latest_snippets":   snippets,
        "popular_snippets":  popularSnippets,
        "popular_languages": popularLanguages,
    })
}
