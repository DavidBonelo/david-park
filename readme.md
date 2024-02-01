> Note: this branch is a snapshot of the project until the deadline of the challenge. I will continue the development and submit changes to the [main branch](https://github.com/DavidBonelo/salitre-park/tree/main)

# Salitre park API

A RESTful api of a amusement park game.

## Requirements

- NodeJS version 16.20.1 or above
- A MongoDB database version 3.6 or above ([Atlas](https://www.mongodb.com/docs/atlas/) also works)

## Building

- Find or create your [database connection string](https://www.mongodb.com/docs/manual/reference/connection-string/)

- Create a `.env` file in the root folder and populate it with the same keys as in the provided [.env.example](./.env.example)

- Run the following command to build the project.

```sh
npm install
npm run build
```

The transpiled code will be located in the `/dist` folder.

- To start the api run the following command:

```sh
npm run start
```

It will print a message with the base url for the api and the result of the database connection.

- For development, you can instead run the project with live reloading:

```sh
npm run dev
```
