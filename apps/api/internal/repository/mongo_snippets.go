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

	// Check if IP already liked
	hasLiked := r.col.FindOne(ctx, bson.D{
		{Key: "slug", Value: slug},
		{Key: "likedIPs", Value: ip},
	})

	var update bson.D
	var liked bool
	if hasLiked.Err() == mongo.ErrNoDocuments {
		// Add like
		update = bson.D{
			{Key: "$addToSet", Value: bson.D{{Key: "likedIPs", Value: ip}}},
			{Key: "$inc", Value: bson.D{{Key: "likes", Value: 1}}},
		}
		liked = true
	} else {
		// Remove like
		update = bson.D{
			{Key: "$pull", Value: bson.D{{Key: "likedIPs", Value: ip}}},
			{Key: "$inc", Value: bson.D{{Key: "likes", Value: -1}}},
		}
		liked = false
	}

	_, err := r.col.UpdateOne(ctx, filter, update)
	if err != nil {
		return false, 0, err
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
