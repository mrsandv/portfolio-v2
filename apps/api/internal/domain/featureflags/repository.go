package featureflags

import "context"

type Repository interface {
	GetAll(ctx context.Context) ([]FeatureFlag, error)
	GetByKey(ctx context.Context, key string) (*FeatureFlag, error)
	Upsert(ctx context.Context, flag *FeatureFlag) error
}
