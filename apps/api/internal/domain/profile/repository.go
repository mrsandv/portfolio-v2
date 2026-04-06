package profile

import "context"

type Repository interface {
	Get(ctx context.Context) (*Profile, error)
	Upsert(ctx context.Context, p *Profile) error
}
