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
NPM := $(shell command -v npm)

.PHONY: help
help: ## Show this help
	@egrep -h '^[a-zA-Z_\/-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -d | awk 'BEGIN {FS = ":.*?## "; printf "Usage: make \033[0;34mTARGET\033[0m \033[0;35m[ARGUMENTS]\033[0m\n\n"; printf "Targets:\n"}; {printf "  \033[33m%-25s\033[0m \033[0;32m%s\033[0m\n", $$1, $$2}'

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

## Target specific variables
%/dev: ENVIRONMENT = dev
%/prod: ENVIRONMENT = prod
build/%: TAG ?= $(ENVIRONMENT)

.PHONY: build/dev build/prod
build/dev: ## Build development environment
build/prod: ## Build production environment
build/dev build/prod:
	@echo "📦 Building project Docker image..."
	@docker build --build-arg PORT=$(PORT) --target $(ENVIRONMENT) -t $(APP_NAME):$(TAG) -f ./docker/Dockerfile .

.PHONY: start/dev
start/dev: ## Start application in development mode
	@echo "▶️ Starting app in development mode (Docker)..."
	@docker-compose -f ./docker/docker-compose.$(ENVIRONMENT).yml up --build

.PHONY: start/prod
start/prod: ## Start application in production mode
	@echo "▶️ Starting app in production mode (Docker)..."
	@mkdir -p -m 755 ${LOGS_VOLUME}
	@docker-compose -f ./docker/docker-compose.$(ENVIRONMENT).yml up -d --build

.PHONY: start/db
start/db: ## Start database container
	@echo "▶️ Starting database (Docker)..."
	@docker-compose -f ./docker/docker-compose.dev.yml up -d db adminer

PHONY: test/dev
test/dev: build/dev ## Run tests in development mode
	@echo "👨‍🔬 Testing project..."
	@docker run --rm $(APP_NAME):$(ENVIRONMENT) npm run test:coverage

.PHONY: stop/dev stop/prod
stop/dev: ## Stop development environment
stop/prod: ## Stop production environment
stop/dev stop/prod:
	@echo "🛑 Stopping app..."
	@docker-compose -f ./docker/docker-compose.$(ENVIRONMENT).yml down

.PHONY: stop/db
stop/db: ## Stop database container
	@echo "🛑 Stopping database (Docker)..."
	@docker-compose -f ./docker/docker-compose.dev.yml stop db adminer

.PHONY: clean/dev clean/prod
clean/dev: ## Clean development environment
clean/prod: ## Clean production environment
clean/dev clean/prod:
	@echo "🧼 Cleaning all resources..."
	@docker-compose -f ./docker/docker-compose.$(ENVIRONMENT).yml down --rmi local --volumes --remove-orphans

