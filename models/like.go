package models
import "gorm.io/gorm"
type Like struct {
	gorm.Model
	UserID    uint
	SnippetID uint
	User      User
	Snippet   Snippet
}
