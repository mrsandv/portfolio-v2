package snippets

import (
	"context"
	"regexp"
	"strings"
	"time"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll(ctx context.Context) ([]Snippet, error) {
	return s.repo.GetAll(ctx)
}

func (s *Service) GetBySlug(ctx context.Context, slug string) (*Snippet, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *Service) GetByCategory(ctx context.Context, category string) ([]Snippet, error) {
	return s.repo.GetByCategory(ctx, category)
}

func (s *Service) GetCategories(ctx context.Context) ([]string, error) {
	return s.repo.GetCategories(ctx)
}

func (s *Service) Create(ctx context.Context, snippet *Snippet) error {
	now := time.Now()
	snippet.CreatedAt = now
	snippet.UpdatedAt = now
	if snippet.Slug == "" {
		snippet.Slug = slugify(snippet.Title)
	}
	if snippet.Tags == nil {
		snippet.Tags = []string{}
	}
	if snippet.LikedIPs == nil {
		snippet.LikedIPs = []string{}
	}
	return s.repo.Create(ctx, snippet)
}

func (s *Service) Update(ctx context.Context, slug string, snippet *Snippet) error {
	snippet.UpdatedAt = time.Now()
	return s.repo.Update(ctx, slug, snippet)
}

func (s *Service) Delete(ctx context.Context, slug string) error {
	return s.repo.Delete(ctx, slug)
}

func (s *Service) ToggleLike(ctx context.Context, slug string, ip string) (bool, int, error) {
	return s.repo.ToggleLike(ctx, slug, ip)
}

func (s *Service) GetTopLiked(ctx context.Context, limit int) ([]Snippet, error) {
	return s.repo.GetTopLiked(ctx, limit)
}

var nonAlphaNum = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(title string) string {
	s := strings.ToLower(strings.TrimSpace(title))
	s = nonAlphaNum.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}
