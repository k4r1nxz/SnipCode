package handlers
import (
	"backend/database"
	"backend/models"
	"math/rand"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

func RandString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	rand.Seed(time.Now().UnixNano())
	s := make([]rune, n)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}

type SnippetInput struct {
	Title    string `json:"title" binding:"required"`
	Language string `json:"language" binding:"required"`
	Code     string `json:"code" binding:"required"`
	Filename string `json:"filename" binding:"required"`
}

func GetAllSnippets(c *gin.Context) {
	var snippets []models.Snippet
	if err := database.DB.Preload("Author").Order("created_at desc").Find(&snippets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": snippets})
}
func CreateSnippet(c *gin.Context) {
	var input SnippetInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak lengkap: " + err.Error()})
		return
	}
	userIDAny, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var userID uint
	switch v := userIDAny.(type) {
	case uint:
		userID = v
	case float64:
		userID = uint(v)
	}
	newSlug := slug.Make(input.Title)
	if newSlug == "" {
		newSlug = "code-" + RandString(6)
	}
	var count int64
	database.DB.Model(&models.Snippet{}).Where("slug = ?", newSlug).Count(&count)
	if count > 0 {
		newSlug = newSlug + "-" + RandString(4)
	}
	snippet := models.Snippet{
		Title:    input.Title,
		Language: input.Language,
		Code:     input.Code,
		Filename: input.Filename,
		Slug:     newSlug,
		AuthorID: userID,
	}
	if err := database.DB.Create(&snippet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal simpan ke database"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": snippet})
}
func EditSnippet(c *gin.Context) {
	slugParam := c.Param("slug")
	var snippet models.Snippet
	if err := database.DB.Where("slug = ?", slugParam).First(&snippet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Snippet tidak ditemukan"})
		return
	}
	userIDAny, _ := c.Get("userID")
	var currentUserID uint
	switch v := userIDAny.(type) {
	case uint: currentUserID = v
	case float64: currentUserID = uint(v)
	}
	if snippet.AuthorID != currentUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Bukan milikmu!"})
		return
	}
	var input SnippetInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	updateData := map[string]interface{}{
		"title":    input.Title,
		"language": input.Language,
		"code":     input.Code,
		"filename": input.Filename,
		"slug":     slug.Make(input.Title),
	}
	if err := database.DB.Model(&snippet).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": snippet})
}
func GetSnippetDetail(c *gin.Context) {
	slugParam := c.Param("slug")
	var snippet models.Snippet
	if err := database.DB.Preload("Author").Where("slug = ?", slugParam).First(&snippet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Snippet tidak ditemukan"})
		return
	}
	database.DB.Model(&snippet).UpdateColumn("views", gorm.Expr("views + ?", 1))
	c.JSON(http.StatusOK, gin.H{"data": snippet})
}
func DeleteSnippet(c *gin.Context) {
	slugParam := c.Param("slug")
	var snippet models.Snippet
	if err := database.DB.Where("slug = ?", slugParam).First(&snippet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	database.DB.Delete(&snippet)
	c.JSON(http.StatusOK, gin.H{"message": "Snippet berhasil dihapus"})
}
func GetRawSnippet(c *gin.Context) {
	slugParam := c.Param("slug")
	var snippet models.Snippet
	if err := database.DB.Where("slug = ?", slugParam).First(&snippet).Error; err != nil {
		c.String(http.StatusNotFound, "Not found")
		return
	}
	c.String(http.StatusOK, snippet.Code)
}
func DownloadSnippet(c *gin.Context) {
	slugParam := c.Param("slug")
	var snippet models.Snippet
	if err := database.DB.Where("slug = ?", slugParam).First(&snippet).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	c.Header("Content-Disposition", "attachment; filename="+snippet.Filename)
	c.Data(http.StatusOK, "application/octet-stream", []byte(snippet.Code))
}