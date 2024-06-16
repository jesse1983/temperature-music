# Weather Music

The best playlists according to the weather.

Demo: https://temperature-music-production.up.railway.app/graphql
User: *demo*
Password: *demo*

## Table of Contents

- [Overview](#overview) 
- [Technologies](#technologies) 
- [Best Practices](#best-practices) 
- [Installation](#installation) 
- [Tests](#tests) 
- [Contribution](#contribution)

## Overview

Fetches the best playlists according to your city's weather.

## Technologies

### Node

High scalability, asynchronous processing capability, and code sharing with frontend.

### TypeScript

Better error feedback, refactoring, and autocomplete, essential for team collaboration.

### NestJS

Focused on SOLID architecture, NestJS is an excellent choice for a scalable, modularized application with Convention-Over-Configuration.

### JWT

JSON Web Token is a Stateless Authentication better for scalable applications, where servers can avoid querying the database for user details on every request, improving performance.

### Eslint

Used to ensure code quality.

### Docker / Docker Compose

Used for containerizing the application, mitigating environment-related issues, and easing deployment.

### Bun

Written in zig, this runtime brings a significant performance boost. Despite being in its early stages, it shows promise for many projects.

### GraphQL

Used by major companies (Facebook, Airbnb, Shopify), GraphQL is an alternative to REST APIs, reducing transfer costs, offering faster response times, simplicity, and self-documentation.

### Jest (end-to-end tests)

Jest was used to ensure 100% test coverage.

### Github Actions

Used as platforms to manage the CI/CD process.

## Best Practices

- Modules and Inverse Dependency Injection
- Multi-Provider Adapters: Easily switch between providers like Spotify or OpenWeather by adding new providers
- Pre-commit stages: Ensuring code quality and 100% integrated test coverage
- Fully containerized (no need for additional installations to run the code)
- Memory cache or Redis, ready for other stores like Memcached, etc.

## Installation

### Using Docker

Prerequisites: Docker and Docker Compose

- Download the project
- Run `docker compose up`
- Access `http://localhost:3000/graphql` via browser or GraphQL client (e.g., Postman)

### Using Node

Prerequisites: Node 20+ and Bun

- Download the project
- Rename `.env.example` to `.env`
- Run `bun install`
- Run `bun run build`
- Run `bun run start`

## Tests

- Run `bun run test:e2e`

## Contribution

Example:

1. Open an issue describing your contribution
2. Fork the project
3. Create a branch with your feature: `git checkout -b feature-new`
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push your changes to your branch: `git push origin feature-new`
6. Submit a pull request to the `master` branch of the original project