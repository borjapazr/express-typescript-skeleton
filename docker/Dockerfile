# Base image stage
FROM node:16-alpine as node

ARG PORT=5000
ENV PORT $PORT
EXPOSE $PORT

RUN apk --no-cache -U upgrade
RUN apk update
RUN npm i npm@latest -g

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

# Builder stage
FROM node AS builder

WORKDIR /code
COPY package*.json ./
RUN npm install --ignore-scripts --no-optional && npm cache clean --force
ENV PATH /code/node_modules/.bin:$PATH
WORKDIR /code/app
COPY . ./
RUN npm run build

# Dev stage
FROM builder as dev
ENV NODE_ENV=development
ENV FORCE_COLOR=1
CMD /wait && npm run dev

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
RUN npm ci --production --ignore-scripts
ENV PATH /home/node/app/node_modules/.bin:$PATH
COPY --chown=node:node --from=builder /code/app/dist ./dist
HEALTHCHECK --interval=30s --timeout=60s --start-period=10s --retries=3 CMD node ./dist/healthcheck.js
CMD /wait && pm2-runtime ./process.json
