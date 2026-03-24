package featureflags

import "context"

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll(ctx context.Context) ([]FeatureFlag, error) {
	return s.repo.GetAll(ctx)
}

func (s *Service) GetByKey(ctx context.Context, key string) (*FeatureFlag, error) {
	return s.repo.GetByKey(ctx, key)
}

func (s *Service) Toggle(ctx context.Context, key string, enabled bool) error {
	flag := &FeatureFlag{Key: key, Enabled: enabled}
	return s.repo.Upsert(ctx, flag)
}
