# Include .env file
include .env

# Root directory
ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
# Shell to use for running scripts
SHELL := $(shell which bash)

# Test if the dependencies we need to run this Makefile are installed
DOCKER := $(shell command -v docker)
DOCKER_COMPOSE := $(shell command -v docker-compose)
NPM := $(shell command -v npm)

deps:
ifndef DOCKER
	@echo "🐳 Docker is not available. Please install docker."
	@exit 1
endif
ifndef DOCKER_COMPOSE
	@echo "🐳🧩 docker-compose is not available. Please install docker-compose."
	@exit 1
endif
ifdef NPM
	@echo "📦🧩 npm is not available. Please install npm."
endif

.PHONY: default
default: start/dev

build/dev start/dev test/dev stop/dev clean/dev: ENVIRONMENT = dev

build/prod start/prod stop/prod clean/prod: ENVIRONMENT = prod

.PHONY: build/dev build/prod
build/dev build/prod:
	@echo "📦 Building project Docker image..."
	@docker build --build-arg PORT=$(PORT) --target $(ENVIRONMENT) -t $(APP_NAME):$(ENVIRONMENT) .

.PHONY: start/dev
start/dev:
	@echo "▶️ Starting app in development mode (Docker)..."
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml up --build

.PHONY: start/prod
start/prod:
	@echo "▶️ Starting app in production mode (Docker)..."
	@mkdir -p -m 755 ${LOGS_VOLUME}
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml up -d --build

.PHONY: start/db
start/db:
	@echo "▶️ Starting database (Docker)..."
	@docker-compose -f docker-compose.dev.yml up -d db adminer

PHONY: test/dev
test/dev: build/dev
	@echo "👨‍🔬 Testing project..."
	@docker run --rm $(APP_NAME):$(ENVIRONMENT) npm run test:coverage

.PHONY: stop/dev stop/prod
stop/dev stop/prod:
	@echo "🛑 Stopping app..."
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml down

.PHONY: stop/db
stop/db:
	@echo "🛑 Stopping database (Docker)..."
	@docker-compose -f docker-compose.dev.yml stop db adminer

.PHONY: clean/dev clean/prod
clean/dev clean/prod:
	@echo "🧼 Cleaning all resources..."
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml down --rmi local --volumes --remove-orphans

