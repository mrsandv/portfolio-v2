package admin

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"golang.org/x/crypto/argon2"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

// Argon2id parameters (OWASP recommendations)
const (
	argonTime    = 3
	argonMemory  = 64 * 1024 // 64 MB
	argonThreads = 4
	argonKeyLen  = 32
	saltLen      = 16
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Login(ctx context.Context, username, password string) (*User, error) {
	user, err := s.repo.GetByUsername(ctx, username)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if !verifyPassword(password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	return user, nil
}

func (s *Service) ChangePassword(ctx context.Context, username, currentPassword, newPassword string) error {
	user, err := s.repo.GetByUsername(ctx, username)
	if err != nil {
		return ErrInvalidCredentials
	}

	if !verifyPassword(currentPassword, user.PasswordHash) {
		return ErrInvalidCredentials
	}

	hash, err := hashPassword(newPassword)
	if err != nil {
		return err
	}

	return s.repo.UpdatePassword(ctx, username, hash)
}

func (s *Service) CreateUser(ctx context.Context, username, password string) (*User, error) {
	hash, err := hashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &User{
		Username:     username,
		PasswordHash: hash,
		CreatedAt:    time.Now(),
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func hashPassword(password string) (string, error) {
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	key := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, argonKeyLen)

	return fmt.Sprintf(
		"$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
		argon2.Version, argonMemory, argonTime, argonThreads,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(key),
	), nil
}

func verifyPassword(password, encodedHash string) bool {
	var version int
	var memory, time uint32
	var threads uint8
	var saltB64, keyB64 string

	_, err := fmt.Sscanf(encodedHash, "$argon2id$v=%d$m=%d,t=%d,p=%d$%s", &version, &memory, &time, &threads, &saltB64)
	if err != nil {
		return false
	}

	// Split the last part to get salt and key
	parts := splitArgonHash(encodedHash)
	if len(parts) != 6 {
		return false
	}
	saltB64 = parts[4]
	keyB64 = parts[5]

	salt, err := base64.RawStdEncoding.DecodeString(saltB64)
	if err != nil {
		return false
	}

	expectedKey, err := base64.RawStdEncoding.DecodeString(keyB64)
	if err != nil {
		return false
	}

	computedKey := argon2.IDKey([]byte(password), salt, time, memory, threads, uint32(len(expectedKey)))

	return subtle.ConstantTimeCompare(computedKey, expectedKey) == 1
}

func splitArgonHash(hash string) []string {
	var parts []string
	current := ""
	for i := 0; i < len(hash); i++ {
		if hash[i] == '$' {
			parts = append(parts, current)
			current = ""
		} else {
			current += string(hash[i])
		}
	}
	parts = append(parts, current)
	return parts
}
