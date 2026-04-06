package contact

import (
	"context"
	"time"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Submit(ctx context.Context, r *Request) error {
	r.CreatedAt = time.Now()
	r.Read = false
	return s.repo.Create(ctx, r)
}

func (s *Service) GetAll(ctx context.Context) ([]Request, error) {
	return s.repo.GetAll(ctx)
}

func (s *Service) MarkRead(ctx context.Context, id string) error {
	return s.repo.MarkRead(ctx, id)
}
