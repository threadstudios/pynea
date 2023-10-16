# Pynea Test


## Initial Explanation

The test contained a number of things that were new to me, I appreciate and took the opportunity to learn some new things and use some new technologies.

My Application uses Nest.js as a framework with Fastify and then leans on both Mercurius and Prisma, I've not Fastify/Mercurius or Prisma before, nor have I set up a graphQL server, and I've really enjoyed the experience.

## Setup

- Run `npm install` at the root of the project.
- Run `docker-compose up` to create a postgres DB via Docker.
- Create a .env file (You should be able to clone .env.example)
- Run `npx prisma migrate dev` to run the Prisma migration.
- Run `npm run start` to start the application

## Documentation

I've generated static documentation with spectaQL - This will be available at the root of the application when launched:

`http://localhost:3000`

If you need to re-generate the documentation you can do so by running:

`npm run generate:docs`

## Using The GraphQL endpoint

The raw graphQL endpoint is available at:

`http://localhost:3000/graphql`

If you want to use the graphiql endpoint that is also available at:

`http://localhost:3000/graphiql`

## Testing

There is a small suite of unit tests available for the application - you can run these by:

`npm run test`

The end to end tests to cover the application are run via:

`npm run test:e2e`

### Issues

If you have any problems at all running my application please let me know - paul@threadstud.io



