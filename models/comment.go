package models
import "gorm.io/gorm"
type Comment struct {
	gorm.Model
	Content   string `gorm:"not null"`
	UserID    uint
	SnippetID uint
	User      User
	Snippet   Snippet
}
