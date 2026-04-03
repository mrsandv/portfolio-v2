package repository

import (
	"context"

	"github.com/mrsan/portfolio-api/internal/domain/admin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type MongoAdminRepo struct {
	col *mongo.Collection
}

func NewMongoAdminRepo(db *mongo.Database) *MongoAdminRepo {
	col := db.Collection("admin_users")

	col.Indexes().CreateOne(context.Background(), mongo.IndexModel{
		Keys:    bson.D{{Key: "username", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	return &MongoAdminRepo{col: col}
}

func (r *MongoAdminRepo) GetByUsername(ctx context.Context, username string) (*admin.User, error) {
	var user admin.User
	err := r.col.FindOne(ctx, bson.D{{Key: "username", Value: username}}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *MongoAdminRepo) Create(ctx context.Context, user *admin.User) error {
	_, err := r.col.InsertOne(ctx, user)
	return err
}

func (r *MongoAdminRepo) UpdatePassword(ctx context.Context, username, passwordHash string) error {
	filter := bson.D{{Key: "username", Value: username}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "passwordhash", Value: passwordHash}}}}
	_, err := r.col.UpdateOne(ctx, filter, update)
	return err
}
