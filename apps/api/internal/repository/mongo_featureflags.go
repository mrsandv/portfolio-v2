package repository

import (
	"context"

	"github.com/mrsan/portfolio-api/internal/domain/featureflags"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoFeatureFlagRepo struct {
	col *mongo.Collection
}

func NewMongoFeatureFlagRepo(db *mongo.Database) *MongoFeatureFlagRepo {
	return &MongoFeatureFlagRepo{col: db.Collection("feature_flags")}
}

func (r *MongoFeatureFlagRepo) GetAll(ctx context.Context) ([]featureflags.FeatureFlag, error) {
	cursor, err := r.col.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var flags []featureflags.FeatureFlag
	if err := cursor.All(ctx, &flags); err != nil {
		return nil, err
	}
	return flags, nil
}

func (r *MongoFeatureFlagRepo) GetByKey(ctx context.Context, key string) (*featureflags.FeatureFlag, error) {
	var flag featureflags.FeatureFlag
	err := r.col.FindOne(ctx, bson.D{{Key: "key", Value: key}}).Decode(&flag)
	if err != nil {
		return nil, err
	}
	return &flag, nil
}

func (r *MongoFeatureFlagRepo) Upsert(ctx context.Context, flag *featureflags.FeatureFlag) error {
	filter := bson.D{{Key: "key", Value: flag.Key}}
	update := bson.D{{Key: "$set", Value: bson.D{
		{Key: "key", Value: flag.Key},
		{Key: "enabled", Value: flag.Enabled},
	}}}
	opts := options.UpdateOne().SetUpsert(true)
	_, err := r.col.UpdateOne(ctx, filter, update, opts)
	return err
}
