package database
import (
	"log"
	"backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)
var DB *gorm.DB
func InitDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect database:", err)
	}
	err = DB.AutoMigrate(
		&models.User{},
		&models.Snippet{},
		&models.Comment{},
		&models.Like{},
	)
	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}
	log.Println("✅ Database connected & migrated")
}
