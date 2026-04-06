package config

import (
	"log"

	"careeralley/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {

	dsn := "host=localhost user=adityaray dbname=careeralley port=5432 sslmode=disable"

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database")
	}

	DB = database

	DB.AutoMigrate(
		&models.User{},
		&models.CareerCard{},
		&models.Roadmap{},
		&models.Topic{},
		&models.Subtopic{},
		&models.Resource{},
		&models.UserProgress{},
		&models.StudySession{},
		&models.StudySession{},
		&models.OnboardingQuestion{},
		&models.OnboardingOption{},
		&models.UserOnboardingAnswer{},
		&models.CardQuestion{},
		&models.CardOption{},
		&models.UserCardAnswer{},
		&models.ChatMessage{},
		&models.InterviewRequest{},
		&models.InterviewSession{},
		&models.InterviewQuestion{},
	)

	log.Println("Database connected successfully")

}
