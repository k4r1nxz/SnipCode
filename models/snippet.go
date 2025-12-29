package models
import (
	"gorm.io/gorm"
)
type Snippet struct {
	gorm.Model
	Slug        string `gorm:"uniqueIndex;not null"`
	Title       string `gorm:"not null"`
	Code        string `gorm:"not null"`
	Language    string `gorm:"not null"`
	Filename    string `gorm:"not null"`
	AuthorID    uint
	Author      User
	Views       uint `gorm:"default:0"`
	Likes       []Like
	Comments    []Comment
}
