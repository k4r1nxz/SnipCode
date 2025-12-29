package models
import "gorm.io/gorm"
type User struct {
	gorm.Model
	Username      string `gorm:"uniqueIndex;not null"`
	Email         string `gorm:"uniqueIndex;not null"`
	PasswordHash  string `gorm:"not null"`
	Role          string `gorm:"type:varchar(20);default:'user'"`
	Bio           string
	ProfilePicURL string
	Snippets []Snippet `gorm:"foreignKey:AuthorID"`
	Comments []Comment
	Likes    []Like
}
