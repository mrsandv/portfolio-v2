package contact

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Request struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string        `bson:"name" json:"name"`
	Email       string        `bson:"email" json:"email"`
	ProjectType string        `bson:"projectType" json:"projectType"`
	Maturity    string        `bson:"maturity" json:"maturity"`
	Timeline    string        `bson:"timeline" json:"timeline"`
	Message     string        `bson:"message" json:"message"`
	Read        bool          `bson:"read" json:"read"`
	CreatedAt   time.Time     `bson:"createdAt" json:"createdAt"`
}
