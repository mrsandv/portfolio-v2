package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/mrsan/portfolio-api/internal/config"
	"github.com/mrsan/portfolio-api/internal/domain/admin"
	"github.com/mrsan/portfolio-api/internal/domain/contact"
	"github.com/mrsan/portfolio-api/internal/domain/featureflags"
	"github.com/mrsan/portfolio-api/internal/domain/profile"
	"github.com/mrsan/portfolio-api/internal/domain/snippets"
	"github.com/mrsan/portfolio-api/internal/handler"
	"github.com/mrsan/portfolio-api/internal/repository"
	"github.com/mrsan/portfolio-api/pkg/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	cfg := config.Load()

	// MongoDB connection
	client, err := mongo.Connect(options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to MongoDB")
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Error().Err(err).Msg("failed to disconnect from MongoDB")
		}
	}()

	if err := client.Ping(context.Background(), nil); err != nil {
		log.Fatal().Err(err).Msg("failed to ping MongoDB")
	}
	log.Info().Msg("connected to MongoDB")

	db := client.Database(cfg.MongoDB)

	// DI: repository -> service -> handler
	flagRepo := repository.NewMongoFeatureFlagRepo(db)
	flagSvc := featureflags.NewService(flagRepo)
	flagHandler := handler.NewFeatureFlagHandler(flagSvc)

	snippetRepo := repository.NewMongoSnippetRepo(db)
	snippetSvc := snippets.NewService(snippetRepo)
	snippetHandler := handler.NewSnippetHandler(snippetSvc)

	profileRepo := repository.NewMongoProfileRepo(db)
	profileSvc := profile.NewService(profileRepo)
	profileHandler := handler.NewProfileHandler(profileSvc)

	contactRepo := repository.NewMongoContactRepo(db)
	contactSvc := contact.NewService(contactRepo)
	contactHandler := handler.NewContactHandler(contactSvc, cfg.TurnstileSecret, cfg.TelegramBotToken, cfg.TelegramChatID)

	adminRepo := repository.NewMongoAdminRepo(db)
	adminSvc := admin.NewService(adminRepo)
	adminHandler := handler.NewAdminHandler(adminSvc, cfg.JWTSecret)

	// Router
	r := gin.Default()
	r.Use(middleware.CORS(cfg.AllowedOrigins))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		api.GET("/flags", flagHandler.GetAll)
		api.PUT("/flags", middleware.APIKey(cfg.APIKey), flagHandler.Toggle)

		api.GET("/profile", profileHandler.Get)
		api.POST("/contact", contactHandler.Submit)

		api.GET("/snippets", snippetHandler.GetAll)
		api.GET("/snippets/top", snippetHandler.GetTopLiked)
		api.GET("/snippets/categories", snippetHandler.GetCategories)
		api.GET("/snippets/category/:category", snippetHandler.GetByCategory)
		api.GET("/snippets/:slug", snippetHandler.GetBySlug)
		api.POST("/snippets", middleware.APIKey(cfg.APIKey), snippetHandler.Create)
		api.POST("/snippets/:slug/like", snippetHandler.ToggleLike)
		api.PUT("/snippets/:slug", middleware.APIKey(cfg.APIKey), snippetHandler.Update)
		api.DELETE("/snippets/:slug", middleware.APIKey(cfg.APIKey), snippetHandler.Delete)
	}

	// Admin routes (API key + JWT-protected)
	adminAPI := api.Group("/admin")
	adminAPI.Use(middleware.APIKey(cfg.APIKey))
	{
		adminAPI.POST("/login", adminHandler.Login)
		adminAPI.POST("/logout", adminHandler.Logout)

		protected := adminAPI.Group("")
		protected.Use(middleware.JWTAuth(cfg.JWTSecret))
		{
			protected.GET("/me", adminHandler.Me)
			protected.PUT("/profile", profileHandler.Upsert)
			protected.GET("/contact", contactHandler.GetAll)
			protected.PUT("/contact/:id/read", contactHandler.MarkRead)
			protected.PUT("/password", adminHandler.ChangePassword)
			protected.GET("/flags", flagHandler.GetAll)
			protected.PUT("/flags", flagHandler.Toggle)
			protected.GET("/snippets", snippetHandler.GetAll)
			protected.POST("/snippets", snippetHandler.Create)
			protected.PUT("/snippets/:slug", snippetHandler.Update)
			protected.DELETE("/snippets/:slug", snippetHandler.Delete)
		}
	}

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Info().Str("addr", addr).Msg("starting API server")
	if err := r.Run(addr); err != nil {
		log.Fatal().Err(err).Msg("server failed")
	}
}
