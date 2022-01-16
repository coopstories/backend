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

## About the project

This project was made for educational purposes, I wanted to try some new technologies such as:

- GraphQL using [GraphQL-Helix](https://github.com/contra/graphql-helix)
- [Prisma ORM](https://github.com/prisma/prisma)

If you find anything that could be improved feel free to [open an issue](https://github.com/coopstories/backend/issues/new) in this same repo.