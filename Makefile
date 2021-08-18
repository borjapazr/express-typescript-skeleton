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

.PHONY = default deps install

default: install

install:
	@echo "📦 Installing dependencies locally..."
	@npm install

local/dev:
	@echo "▶️ Starting app in development mode (local)..."
	@npm run dev

start/dev stop/dev clean/dev: ENVIRONMENT = dev

start/prod stop/prod clean/prod: ENVIRONMENT = prod

start/dev:
	@echo "▶️ Starting app in development mode (Docker)..."
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml up --build

start/prod:
	@echo "▶️ Starting app in production mode (Docker)..."
	@mkdir -p -m 755 ${LOGS_VOLUME}
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml up -d --build

start/db:
	@echo "▶️ Starting database (Docker)..."
	@docker-compose -f docker-compose.dev.yml up -d db adminer

stop/dev stop/prod:
	@echo "🛑 Stopping app..."
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml down

stop/db:
	@echo "🛑 Stopping database (Docker)..."
	@docker-compose -f docker-compose.dev.yml stop db adminer

clean/dev clean/prod:
	@echo "🧼 Cleaning all resources..."
	@docker-compose -f docker-compose.$(ENVIRONMENT).yml down --rmi local --volumes --remove-orphans

