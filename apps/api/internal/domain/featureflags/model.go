package featureflags

import "go.mongodb.org/mongo-driver/v2/bson"

type FeatureFlag struct {
	ID      bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Key     string        `bson:"key" json:"key"`
	Enabled bool          `bson:"enabled" json:"enabled"`
}
