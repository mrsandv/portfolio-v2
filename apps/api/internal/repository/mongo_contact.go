package repository

import (
	"context"

	"github.com/mrsan/portfolio-api/internal/domain/contact"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoContactRepo struct {
	col *mongo.Collection
}

func NewMongoContactRepo(db *mongo.Database) *MongoContactRepo {
	return &MongoContactRepo{col: db.Collection("contact_requests")}
}

func (r *MongoContactRepo) Create(ctx context.Context, req *contact.Request) error {
	_, err := r.col.InsertOne(ctx, req)
	return err
}

func (r *MongoContactRepo) GetAll(ctx context.Context) ([]contact.Request, error) {
	opts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}})
	cursor, err := r.col.Find(ctx, bson.D{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var result []contact.Request
	if err := cursor.All(ctx, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *MongoContactRepo) MarkRead(ctx context.Context, id string) error {
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.D{{Key: "_id", Value: objID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "read", Value: true}}}}
	_, err = r.col.UpdateOne(ctx, filter, update)
	return err
}
