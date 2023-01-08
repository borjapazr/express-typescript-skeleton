# Base image stage
FROM node:18-slim as node

LABEL maintainer "Borja Paz Rodríguez (@borjapazr)"

ARG PORT=5000
ENV PORT $PORT
EXPOSE $PORT

RUN apt-get update
RUN apt-get install -y openssl

RUN npm i npm@latest -g

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait


# Builder stage
FROM node AS builder

WORKDIR /code

COPY package*.json ./
COPY ./src/infrastructure/shared/persistence/prisma/schema.prisma ./prisma/schema.prisma

RUN npm install --omit=optional --ignore-scripts && npm cache clean --force
RUN npx -y prisma generate --schema ./prisma/schema.prisma

ENV PATH /code/node_modules/.bin:$PATH

WORKDIR /code/app

COPY . ./

RUN npm run build


# Prod stage
FROM node as prod

ENV NODE_ENV=production
ENV FORCE_COLOR=1

WORKDIR /home/node/app
RUN mkdir dist logs

RUN chown -R node:node /home/node/app
RUN npm install -g pm2

USER node

COPY --chown=node:node package*.json ./docker/pm2/process.json ./
COPY --chown=node:node ./src/infrastructure/shared/persistence/prisma/schema.prisma ./prisma/schema.prisma

# This is done in this way to avoid problems with Argon2
RUN npm pkg delete scripts.prepare

RUN npm ci --omit=dev && npm cache clean --force
RUN npx -y prisma generate --schema ./prisma/schema.prisma

ENV PATH /home/node/app/node_modules/.bin:$PATH

COPY --chown=node:node --from=builder /code/app/dist ./dist

HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 CMD node ./dist/healthcheck.js

CMD /wait && pm2-runtime ./process.json
