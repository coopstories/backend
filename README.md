# CoopStories (backend)

Write stories with friends.

## Prerequisites

- NodeJS > v16.13.2
- Yarn
- PostgreSQL DB running

## Setup

```bash
# Install dependencies
yarn install

# Configure .env variables
cp .env.example .env

# Run DB migrations
yarn migrations:up

# Start server (dev mode)
yarn dev

# Open your browser on localhost:4000/graphql to access GraphQLi
```

## Deployment

This project is deployed with docker compose and requires you to have it installed locally. Before starting we should have a folder structure like the following one

```
/coopstories
  frontend
  backend
```

After ensuring the names and structure are the same we need to configure the env vars on [.env.dist](.env.dist).

Before running the stack customize the ports in which the app is going to be exposed, see [docker-compose.yml](docker-compose.yml). Once checked that we are ready to jump into the terminal.

```bash
# Check if the config is well formatted
docker compose -p coopstories --env-file .env.dist config

# Run our stack
docker compose -p coopstories --env-file .env.dist up -d

# Remove the stack
docker compose -p coopstories --env-file .env.dist down

# Rebuild stack's images (useful while developing)
docker compose -p coopstories --env-file .env.dist build
```

## About the project

This project was made for educational purposes, I wanted to try some new technologies such as:

- GraphQL using [GraphQL-Helix](https://github.com/contra/graphql-helix)
- [Prisma ORM](https://github.com/prisma/prisma)

If you find anything that could be improved feel free to [open an issue](https://github.com/coopstories/backend/issues/new) in this same repo.