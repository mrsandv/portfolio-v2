package profile

import "context"

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Get(ctx context.Context) (*Profile, error) {
	return s.repo.Get(ctx)
}

func (s *Service) Upsert(ctx context.Context, p *Profile) error {
	return s.repo.Upsert(ctx, p)
}
