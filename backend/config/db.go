package config

import (
	"log"
	"os"
	"time"

	"careeralley/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Warn,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=adityaray dbname=careeralley port=5432 sslmode=disable"
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

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
		&models.OnboardingQuestion{},
		&models.OnboardingOption{},
		&models.UserOnboardingAnswer{},
		&models.CardQuestion{},
		&models.CardOption{},
		&models.UserCardAnswer{},
		&models.ChatMessage{},
		&models.MockInterview{},
		&models.MockInterviewQuestion{},
		&models.MockInterviewResult{},
	)

	log.Println("Database connected successfully")

}
