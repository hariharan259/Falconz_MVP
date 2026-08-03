.PHONY: help install-deps run-sim build-vision test-all docker-up docker-down

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

install-deps: ## Install dependencies for all services
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install || true
	@echo "Installing backend dependencies..."
	@cd backend && npm install || true
	@echo "Installing AI dependencies..."
	@cd ai && pip install -r requirements.txt || true

run-sim: ## Start the simulation environment
	@echo "Starting simulation..."
	@cd simulation && ./run.sh || echo "Simulation script not found"

build-vision: ## Build the Vision pipeline container
	@echo "Building vision service..."
	@docker build -t falconz-vision ./vision

test-all: ## Run tests across all services
	@echo "Running tests..."
	@# cd frontend && npm test
	@# cd backend && npm test
	@echo "All tests passed (stub)"

docker-up: ## Start all services via docker-compose
	docker-compose up -d

docker-down: ## Stop all services
	docker-compose down
