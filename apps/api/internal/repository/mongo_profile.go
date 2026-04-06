package repository

import (
	"context"

	"github.com/mrsan/portfolio-api/internal/domain/profile"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoProfileRepo struct {
	col *mongo.Collection
}

func NewMongoProfileRepo(db *mongo.Database) *MongoProfileRepo {
	return &MongoProfileRepo{col: db.Collection("profile")}
}

func (r *MongoProfileRepo) Get(ctx context.Context) (*profile.Profile, error) {
	var p profile.Profile
	err := r.col.FindOne(ctx, bson.D{}).Decode(&p)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (r *MongoProfileRepo) Upsert(ctx context.Context, p *profile.Profile) error {
	opts := options.UpdateOne().SetUpsert(true)
	filter := bson.D{}
	if !p.ID.IsZero() {
		filter = bson.D{{Key: "_id", Value: p.ID}}
	}
	update := bson.D{{Key: "$set", Value: p}}
	_, err := r.col.UpdateOne(ctx, filter, update, opts)
	return err
}
