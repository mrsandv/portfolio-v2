package snippets

import "context"

type Repository interface {
	GetAll(ctx context.Context) ([]Snippet, error)
	GetBySlug(ctx context.Context, slug string) (*Snippet, error)
	GetTopLiked(ctx context.Context, limit int) ([]Snippet, error)
	Create(ctx context.Context, s *Snippet) error
	Update(ctx context.Context, slug string, s *Snippet) error
	Delete(ctx context.Context, slug string) error
	ToggleLike(ctx context.Context, slug string, ip string) (liked bool, likes int, err error)
}
