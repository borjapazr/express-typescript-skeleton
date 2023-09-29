<div align="center">
 <img
  width="500"
 alt="Node.js, Typescript and Express template"
 src="https://i.imgur.com/bpnghuI.png">
<br>
<br>

![GitHub package.json version](https://img.shields.io/github/package-json/v/borjapazr/express-typescript-skeleton?style=flat-square)
![GitHub CI Workflow Status](https://img.shields.io/github/actions/workflow/status/borjapazr/express-typescript-skeleton/ci.yml?branch=main&style=flat-square&logo=github&label=CI)
![GitHub CD Workflow Status](https://img.shields.io/github/actions/workflow/status/borjapazr/express-typescript-skeleton/cd.yml?branch=main&style=flat-square&logo=github&label=CD)
![GitHub LICENSE](https://img.shields.io/github/license/borjapazr/express-typescript-skeleton?style=flat-square)

<h4>
  🔰🦸 Production-ready template for backends created with Node.js, Typescript and Express
</h4>

<a href="#ℹ️-about">ℹ️ About</a> •
<a href="#-features">📋 Features</a> •
<a href="#-contributing"> 🤝 Contributing</a> •
<a href="#️-roadmap"> 🛣️ Roadmap</a> •
<a href="#-credits">🎯 Credits</a> •
<a href="#-license">🚩 License</a>

</div>

---

## ℹ️ About

The main goal of this project is to provide a base template for the generation of a production-ready REST API made with `Node.js`, `Express` and `Typescript`. The idea is to avoid having to configure all the tools involved in a project every time it is started and thus be able to focus on the definition and implementation of the business logic.

> 📣 This is an opinionated template. The architecture of the code base and the configuration of the different tools used has been based on best practices and personal preferences.

### 🚀 Quick start

- Install dependencies:

  ```bash
  npm install
  # or
  make install
  ```

- Start database container:

  ```bash
  make start/db
  ```

- Start cache container:

  ```bash
  make start/cache
  ```

- Generate Prisma Client:

  ```bash
  npm run prisma:generate
  ```

- Start project in development mode:

  ```bash
  npm run dev
  ```

- Start project in production mode:

  ```bash
  npm run start
  ```

- Open the following URL to interact with the API using Swagger UI:

  ```bash
  http://localhost:5000/api/docs
  # Sample username and password: janedoe / 123456
  ```

## 📋 Features

- Built using [Typescript](https://github.com/microsoft/TypeScript)
- Built using [Express Framework](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework for node.
- Built using [Prisma](https://www.prisma.io/): Next-generation ORM for Node.js & TypeScript | PostgreSQL, MySQL, MariaDB, SQL Server, SQLite & MongoDB
- Built using [Ts.ED](https://tsed.io/): Ts.ED is a Node.js Framework on top of Express/Koa.js. Written in Typescript, it helps you build your server-side application easily and quickly. If you want to start a complete out-of-the-box project or fully customize it yourself, Ts.ED will guide you there!
- JWT authentication and role based authorization using custom middleware
- OpenAPI definition
- Fully configured logger with [Pino](https://github.com/pinojs/pino)
- Unit, Integration and E2E tests using [Jest](https://github.com/facebook/jest) and [Supertest](https://github.com/visionmedia/supertest)
- Linting with [ESLint](https://github.com/eslint/eslint)
- Formatting with [Prettier](https://github.com/prettier/prettier)
- [Spell check](https://github.com/streetsidesoftware/cspell)
- Git hooks with [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- Containerised using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Path aliases support
- Commit messages must meet conventional commits format
- GitHub Actions
- Makefile as project entrypoint
- [PostgreSQL](https://www.postgresql.org/) as database
- [Redis](https://redis.io/) as cache engine
- A lot of emojis 🛸

### 🐐 Makefile rules

The main actions on this project are managed using a [Makefile](Makefile) as an entrypoint.

```bash
Usage: make TARGET [ARGUMENTS]

Targets:
  build/docker              Build Docker image of the application
  clean/docker              Clean all container resources
  help                      Show this help
  install                   Install the project
  logs                      Show logs for all or c=<name> containers
  requirements              Check if the requirements are satisfied
  start                     Start application in development mode
  start/docker              Start application in a Docker container
  start/docker/cache        Start cache container
  start/docker/db           Start database container
  stop/docker               Stop application running in a Docker container
  stop/docker/cache         Stop cache container
  stop/docker/db            Stop database container
```

### ⚡ Scripts

[package.json](package.json) scripts:

- `dev`: Start project in development mode
- `build`: Build project and generate final build
- `start`: Start project in production mode
- `check:types`: Check if project types are correct
- `check:format`: Check if project is formatted correctly
- `check:lint`: Check if project is linted correctly
- `check:packagejson`: Check if project package.json is correct
- `check:markdown`: Check if markdown files are correct
- `check:spelling`: Check if project is spelled correctly
- `fix:format`: Fix project format issues
- `fix:lint`: Fix project lint issues
- `fix:staged`: Check and fix staged files
- `test`: Run all tests
- `test:unit`: Run unit tests
- `test:int`: Run integration tests
- `test:e2e`: Run e2e tests
- `test:watch`: Run tests in watch mode
- `test:coverage`: Run tests with coverage
- `coverage:view`: Show coverage information
- `commit`: Help to commit changes using conventional commits
- `version`: Generate new project version
- `reset-hard`: Reset git repository to a clean state
- `prepare-release`: Prepare the project for a release and generates a new release
- `update-deps`: Update the project dependencies

## 🤝 Contributing

Just fork and open a pull request. All contributions are welcome 🤗

## 🛣️ Roadmap

Please, check [TODO](TODO.md) for the current roadmap.

## 🎯 Credits

To implement this project I have based myself on many similar projects. There were countless of them and I gave them all a star.

🙏 Thank you very much for these wonderful creations.

### ⭐ Stargazers

[![Stargazers repo roster for @borjapazr/express-typescript-skeleton](https://reporoster.com/stars/borjapazr/express-typescript-skeleton)](https://github.com/borjapazr/express-typescript-skeleton/stargazers)

## 🚩 License

MIT @ [borjapazr](https://bpaz.dev). Please see [License](LICENSE) for more information.
