package snippets

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Snippet struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string        `bson:"title" json:"title"`
	Slug        string        `bson:"slug" json:"slug"`
	Code        string        `bson:"code" json:"code"`
	Language    string        `bson:"language" json:"language"`
	Description string        `bson:"description" json:"description"`
	Tags        []string      `bson:"tags" json:"tags"`
	Likes       int           `bson:"likes" json:"likes"`
	LikedIPs    []string      `bson:"likedIPs" json:"-"`
	CreatedAt   time.Time     `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time     `bson:"updatedAt" json:"updatedAt"`
}
