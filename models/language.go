package models
import "gorm.io/gorm"
type Language struct {
	gorm.Model
	Name       string `gorm:"uniqueIndex;not null"`
	TotalUsage uint   `gorm:"default:0"`
}
