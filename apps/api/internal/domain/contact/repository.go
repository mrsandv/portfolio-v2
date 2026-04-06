package contact

import "context"

type Repository interface {
	Create(ctx context.Context, r *Request) error
	GetAll(ctx context.Context) ([]Request, error)
	MarkRead(ctx context.Context, id string) error
}
