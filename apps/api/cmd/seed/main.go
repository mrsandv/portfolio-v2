package main

import (
	"context"
	"fmt"
	"os"

	"github.com/mrsan/portfolio-api/internal/config"
	"github.com/mrsan/portfolio-api/internal/domain/admin"
	"github.com/mrsan/portfolio-api/internal/domain/featureflags"
	"github.com/mrsan/portfolio-api/internal/domain/snippets"
	"github.com/mrsan/portfolio-api/internal/repository"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	client, err := mongo.Connect(options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to connect to MongoDB: %v\n", err)
		os.Exit(1)
	}
	defer client.Disconnect(ctx)

	if err := client.Ping(ctx, nil); err != nil {
		fmt.Fprintf(os.Stderr, "failed to ping MongoDB: %v\n", err)
		os.Exit(1)
	}

	db := client.Database(cfg.MongoDB)

	// Seed admin user
	adminRepo := repository.NewMongoAdminRepo(db)
	adminSvc := admin.NewService(adminRepo)

	username := envOr("ADMIN_USERNAME", "admin")
	password := envOr("ADMIN_PASSWORD", "admin123")

	_, err = adminSvc.CreateUser(ctx, username, password)
	if err != nil {
		fmt.Printf("⚠ admin user: %v (may already exist)\n", err)
	} else {
		fmt.Printf("✓ admin user created: %s\n", username)
	}

	// Seed feature flags
	flagRepo := repository.NewMongoFeatureFlagRepo(db)
	flagSvc := featureflags.NewService(flagRepo)

	flags := []struct {
		key     string
		enabled bool
	}{
		{"chatbot", true},
		{"kofi_widget", true},
	}

	for _, f := range flags {
		if err := flagSvc.Toggle(ctx, f.key, f.enabled); err != nil {
			fmt.Printf("⚠ flag %s: %v\n", f.key, err)
		} else {
			fmt.Printf("✓ flag seeded: %s = %v\n", f.key, f.enabled)
		}
	}

	// Seed sample snippets
	snippetRepo := repository.NewMongoSnippetRepo(db)
	snippetSvc := snippets.NewService(snippetRepo)

	sampleSnippets := []snippets.Snippet{
		{
			Title:       "Hello World en Go",
			Code:        "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, World!\")\n}",
			Language:    "go",
			Description: "El clasico Hello World en Go.",
			Tags:        []string{"go", "basics"},
		},
		{
			Title:       "React useState Hook",
			Code:        "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Clicks: {count}\n    </button>\n  );\n}",
			Language:    "typescript",
			Description: "Ejemplo basico del hook useState en React.",
			Tags:        []string{"react", "hooks", "typescript"},
		},
	}

	for _, s := range sampleSnippets {
		if err := snippetSvc.Create(ctx, &s); err != nil {
			fmt.Printf("⚠ snippet \"%s\": %v\n", s.Title, err)
		} else {
			fmt.Printf("✓ snippet created: %s (%s)\n", s.Title, s.Slug)
		}
	}

	fmt.Println("\n✓ seed complete")
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
