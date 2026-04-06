package repository

import (
	"context"

	"github.com/mrsan/portfolio-api/internal/domain/snippets"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoSnippetRepo struct {
	col *mongo.Collection
}

func NewMongoSnippetRepo(db *mongo.Database) *MongoSnippetRepo {
	col := db.Collection("snippets")

	col.Indexes().CreateOne(context.Background(), mongo.IndexModel{
		Keys:    bson.D{{Key: "slug", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	return &MongoSnippetRepo{col: col}
}

func (r *MongoSnippetRepo) GetAll(ctx context.Context) ([]snippets.Snippet, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.col.Find(ctx, bson.D{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var result []snippets.Snippet
	if err := cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *MongoSnippetRepo) GetByCategory(ctx context.Context, category string) ([]snippets.Snippet, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	filter := bson.D{{Key: "category", Value: category}}
	cursor, err := r.col.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var result []snippets.Snippet
	if err := cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *MongoSnippetRepo) GetCategories(ctx context.Context) ([]string, error) {
	var categories []string
	result := r.col.Distinct(ctx, "category", bson.D{})
	if err := result.Decode(&categories); err != nil {
		return nil, err
	}
	// Filter out empty strings
	filtered := categories[:0]
	for _, c := range categories {
		if c != "" {
			filtered = append(filtered, c)
		}
	}
	return filtered, nil
}

func (r *MongoSnippetRepo) GetBySlug(ctx context.Context, slug string) (*snippets.Snippet, error) {
	var s snippets.Snippet
	err := r.col.FindOne(ctx, bson.D{{Key: "slug", Value: slug}}).Decode(&s)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *MongoSnippetRepo) Create(ctx context.Context, s *snippets.Snippet) error {
	_, err := r.col.InsertOne(ctx, s)
	return err
}

func (r *MongoSnippetRepo) Update(ctx context.Context, slug string, s *snippets.Snippet) error {
	filter := bson.D{{Key: "slug", Value: slug}}
	update := bson.D{{Key: "$set", Value: s}}
	_, err := r.col.UpdateOne(ctx, filter, update)
	return err
}

func (r *MongoSnippetRepo) Delete(ctx context.Context, slug string) error {
	_, err := r.col.DeleteOne(ctx, bson.D{{Key: "slug", Value: slug}})
	return err
}

func (r *MongoSnippetRepo) ToggleLike(ctx context.Context, slug string, ip string) (bool, int, error) {
	filter := bson.D{{Key: "slug", Value: slug}}

	// Ensure likedIPs is an array (fix null values from old records)
	r.col.UpdateOne(ctx, bson.D{
		{Key: "slug", Value: slug},
		{Key: "likedIPs", Value: nil},
	}, bson.D{
		{Key: "$set", Value: bson.D{{Key: "likedIPs", Value: bson.A{}}}},
	})

	// Try to add the like atomically: only matches if IP is NOT already in likedIPs
	addFilter := bson.D{
		{Key: "slug", Value: slug},
		{Key: "likedIPs", Value: bson.D{{Key: "$ne", Value: ip}}},
	}
	addUpdate := bson.D{
		{Key: "$addToSet", Value: bson.D{{Key: "likedIPs", Value: ip}}},
		{Key: "$inc", Value: bson.D{{Key: "likes", Value: 1}}},
	}

	res, err := r.col.UpdateOne(ctx, addFilter, addUpdate)
	if err != nil {
		return false, 0, err
	}

	liked := true
	if res.ModifiedCount == 0 {
		// IP already liked — remove it atomically
		liked = false
		removeFilter := bson.D{
			{Key: "slug", Value: slug},
			{Key: "likedIPs", Value: ip},
		}
		removeUpdate := bson.D{
			{Key: "$pull", Value: bson.D{{Key: "likedIPs", Value: ip}}},
			{Key: "$inc", Value: bson.D{{Key: "likes", Value: -1}}},
		}
		if _, err := r.col.UpdateOne(ctx, removeFilter, removeUpdate); err != nil {
			return false, 0, err
		}
	}

	// Get updated likes count
	var s snippets.Snippet
	if err := r.col.FindOne(ctx, filter).Decode(&s); err != nil {
		return false, 0, err
	}

	return liked, s.Likes, nil
}

func (r *MongoSnippetRepo) GetTopLiked(ctx context.Context, limit int) ([]snippets.Snippet, error) {
	opts := options.Find().SetSort(bson.D{{Key: "likes", Value: -1}}).SetLimit(int64(limit))
	cursor, err := r.col.Find(ctx, bson.D{{Key: "likes", Value: bson.D{{Key: "$gt", Value: 0}}}}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var result []snippets.Snippet
	if err := cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, nil
}
