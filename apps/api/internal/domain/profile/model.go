package profile

import "go.mongodb.org/mongo-driver/v2/bson"

type LocalizedText struct {
	Es string `bson:"es" json:"es"`
	En string `bson:"en" json:"en"`
}

type Skill struct {
	Name      string `bson:"name" json:"name"`
	Relevance int    `bson:"relevance" json:"relevance"` // 1-10, higher = more prominent
}

type ProcessStep struct {
	Icon        string        `bson:"icon" json:"icon"` // lucide icon name
	Title       LocalizedText `bson:"title" json:"title"`
	Description LocalizedText `bson:"description" json:"description"`
}

type Experience struct {
	Role    string        `bson:"role" json:"role"`
	Company string        `bson:"company" json:"company"`
	Period  string        `bson:"period" json:"period"`
	Details LocalizedText `bson:"details" json:"details"` // hidden in UI, kept for SEO
}

type Education struct {
	Degree LocalizedText `bson:"degree" json:"degree"`
	School string        `bson:"school" json:"school"`
	Period string        `bson:"period" json:"period"`
}

type Profile struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Bio         LocalizedText `bson:"bio" json:"bio"`
	BioPersonal LocalizedText `bson:"bioPersonal" json:"bioPersonal"`
	Location    LocalizedText `bson:"location" json:"location"`
	Skills      []Skill       `bson:"skills" json:"skills"`
	Process     []ProcessStep `bson:"process" json:"process"`
	Experience  []Experience  `bson:"experience" json:"experience"`
	Education   []Education   `bson:"education" json:"education"`
	Languages   []string      `bson:"languages" json:"languages"` // simple list like ["Spanish — Native", "English — B2"]
}
