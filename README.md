# Server

This is the backend repository for our project, currently titled CCN. This repository holds the businesss logic for how the database is created and how the provides a server that the web app will use to access the database and update its contents.

It is developed using [Apollo GraphQL](https://apollographql.com/), [MongoDB](https://www.mongodb.com/) with [mongoose](https://mongoosejs.com/) and has [Typescrypt](https://www.typescriptlang.org/) as it's programming language. We also require [Docker](https://www.docker.com/) to be set up on your development machine in order to create a database for Prisma.

## Development

### Getting Started

Before you start coding (or if a new package has been added to the project) run:

```sh
npm install
```

To start a development server run:

```sh
npm run develop
```

This will build the Typescript and start the Apollo graphql server in watch mode, ie monitoring changes to your files and rebuilding/restarting the server when anything changes.

### Extending the repo and adding functionality or schemas

Since this repository is composed of a few different tools, there are a number of steps required to ensure that your changes are fully implemented and made accessible from the GraphQL endpoint. You can find an overview of these steps below but please refer to files within the repository for more specific documentation of each case.

#### Adding a new field/object to the database

Most of the database architecture is defined within the `mongoose`'s models (see `/src/models`) directory in our repository. To define a new object or field for an existing object you can do the following:

- Add the relevant fields to the files in `src/models/`
  - For help on what field types and syntax for adding new fields to a mongoose model see [this link](https://mongoosejs.com/docs/guide.html).
- If you need to create a new model use the existing ones as a base.

#### Reflecting database changes to the node server (Apollo GraphQL)

Whenever changes to the business logic aspect of the application are required, you will most likely be working with Apollo server. This includes ensuring new database definitions are carried through to the GraphQL server as well as general application business logic such as user authentication, handling of graphql queries from the client, and so on.

Most of the files related to Apollo are located in the `src/graphql` directory. Apollo logic is divided in two main parts, the type definition and the resolvers. Type definitions are what make up the GraphQL serlf documenting definitions and will tell Apollo/GraphQL clients what kind of data or actions they have access to on this server. Resolvers on the other hand are responsible for handling the actions passed up by clients, eg fetching items from the database and filtering them out before returning the list of items to the client.
