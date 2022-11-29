## Include .env file
include .env

## Root directory
ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

## Set 'bash' as default shell
SHELL := $(shell which bash)

## Set 'help' target as the default goal
.DEFAULT_GOAL := help

## Test if the dependencies we need to run this Makefile are installed
DOCKER := $(shell command -v docker)
DOCKER_COMPOSE := $(shell command -v docker-compose)
DOCKER_COMPOSE_FILE := $(ROOT_DIR)/docker/docker-compose.yml
NPM := $(shell command -v npm)

.PHONY: help
help: ## Show this help
	@egrep -h '^[a-zA-Z0-9_\/-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -d | awk 'BEGIN {FS = ":.*?## "; printf "Usage: make \033[0;34mTARGET\033[0m \033[0;35m[ARGUMENTS]\033[0m\n\n"; printf "Targets:\n"}; {printf "  \033[33m%-25s\033[0m \033[0;32m%s\033[0m\n", $$1, $$2}'

deps: ## Check if the dependencies are installed
ifndef DOCKER
	@echo "🐳 Docker is not available. Please install docker."
	@exit 1
endif
ifndef DOCKER_COMPOSE
	@echo "🐳🧩 docker-compose is not available. Please install docker-compose."
	@exit 1
endif
ifndef NPM
	@echo "📦🧩 npm is not available. Please install npm."
endif
	@echo "🆗 The necessary dependencies are already installed!"

TAG ?= prod

.PHONY: install
install: ## Install the project
	@echo "🍿 Installing dependencies..."
	@npm install
	@npm run prisma:generate

.PHONY: start
start: install ## Start application in development mode
	@echo "▶️ Starting app in development mode..."
	@npm run dev

.PHONY: start/db
start/db: ## Start database container
	@echo "▶️ Starting database (Docker)..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env up -d express-typescript-skeleton-db express-typescript-skeleton-adminer

.PHONY: stop/db
stop/db: ## Stop database container
	@echo "🛑 Stopping database (Docker)..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env stop express-typescript-skeleton-db express-typescript-skeleton-adminer

.PHONY: start/prod
start/prod: ## Start application in production mode
	@echo "▶️ Starting app in production mode (Docker)..."
	@mkdir -p -m 755 ${LOGS_VOLUME}
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env up -d --build

.PHONY: stop/prod
stop/prod: ## Stop production environment
	@echo "🛑 Stopping app..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env down

.PHONY: clean/prod
clean/prod: ## Clean production environment
	@echo "🧼 Cleaning all resources..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env down --rmi local --volumes --remove-orphans

.PHONY: build/prod
build/prod:  ## Build production environment
	@echo "📦 Building project Docker image..."
	@docker build --build-arg PORT=$(PORT) -t $(APP_NAME):$(TAG) -f ./docker/Dockerfile .

.PHONY: logs
logs: ## Show logs for all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env logs --tail=100 -f $(c)
