<div align="center">
 <img
  width="500"
 alt="Node.js, Typescript and Express template"
 src="https://i.imgur.com/bpnghuI.png">
<br>
<br>

![GitHub package.json version](https://img.shields.io/github/package-json/v/borjapazr/express-typescript-skeleton?style=flat-square)
![GitHub CI Workflow Status](https://img.shields.io/github/workflow/status/borjapazr/express-typescript-skeleton/CI?style=flat-square&logo=github&label=CI)
![GitHub CD Workflow Status](https://img.shields.io/github/workflow/status/borjapazr/express-typescript-skeleton/CD?style=flat-square&logo=github&label=CD)
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

- Start project in development mode:

  ```bash
  npm run dev
  ```

- Start project in production mode:

  ```bash
  npm run start
  ```

## 📋 Features

- Built using [Typescript](https://github.com/microsoft/TypeScript)
- Built using [Express Framework](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework for node.
- Built using [TypeORM](https://typeorm.io/): ORM for TypeScript and JavaScript
- Built using [Routing Controllers](https://github.com/typestack/routing-controllers): Allows to create controller classes with methods as actions that handle requests
- JWT authentication and role based authorization using custom middleware
- OpenAPI definition
- Fully configured logger with [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan)
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
- A lot of emojis 🛸

### 🐐 Makefile rules

The main actions on this project are managed using a [Makefile](Makefile) as an entrypoint.

- `deps`: Validate if the project dependencies are installed
- `build/dev`: Build the project image for the development environment
- `build/prod`: Build the project image for the production environment
- `start/dev`: Start the project in development mode using Docker
- `start/prod`: Start the project in production mode using Docker
- `start/db`: Start database container
- `test/dev`: Run the project tests using Docker
- `stop/dev`: Stop dev application container
- `stop/prod`: Stop prod application container
- `stop/db`: Stop database container
- `clean/dev`: Removes dev application container and associated resources
- `clean/prod`: Removes prod application container and associated resources

### ⚡ Scripts

[package.json](package.json) scripts:

- `dev`: Start project in development mode
- `build`: Build project and generate final build
- `start`: Start project in production mode
- `check:types`: Check if project types are correct
- `check:format`: Check if project is formatted correctly
- `check:lint`: Check if project is linted correctly
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

## 🤝 Contributing

Just fork and open a pull request. All contributions are welcome 🤗

## 🛣️ Roadmap

Please, check [TODO](TODO.md) for the current roadmap.

## 🎯 Credits

To realise this project I have based myself on many similar projects. There were countless of them and I gave them all a star.

🙏 Thank you very much for these wonderful creations.

### ⭐ Stargazers

[![Stargazers repo roster for @borjapazr/express-typescript-skeleton](https://reporoster.com/stars/borjapazr/express-typescript-skeleton)](https://github.com/borjapazr/express-typescript-skeleton/stargazers)

## 🚩 License

MIT @ [borjapazr](https://me.marsmachine.space). Please see [License](LICENSE) for more information.
