.PHONY: dev dev-api dev-docker dev-docker-down prod-docker prod-docker-down docker-logs build lint seed

dev:
	pnpm --filter @portfolio/web dev

dev-api:
	cd apps/api && go run ./cmd/server/

dev-docker:
	docker compose -f docker-compose.dev.yml up --build

dev-docker-down:
	docker compose -f docker-compose.dev.yml down

prod-docker:
	docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d

prod-docker-down:
	docker compose down

docker-logs:
	docker compose -f docker-compose.dev.yml logs -f

build:
	pnpm --filter @portfolio/web build

lint:
	pnpm --filter @portfolio/web lint

seed:
	cd apps/api && go run ./cmd/seed/
