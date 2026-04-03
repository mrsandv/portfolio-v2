package admin

import "context"

type Repository interface {
	GetByUsername(ctx context.Context, username string) (*User, error)
	Create(ctx context.Context, user *User) error
	UpdatePassword(ctx context.Context, username, passwordHash string) error
}
