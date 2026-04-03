package config

import "os"

type Config struct {
	Port           string
	MongoURI       string
	MongoDB        string
	APIKey         string
	JWTSecret      string
	AllowedOrigins string
}

func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "8080"),
		MongoURI:       getEnv("MONGO_URI", "mongodb://localhost:27017"),
		MongoDB:        getEnv("MONGO_DB", "portfolio"),
		APIKey:         getEnv("API_KEY", ""),
		JWTSecret:      getEnv("JWT_SECRET", "change-me-in-production"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
