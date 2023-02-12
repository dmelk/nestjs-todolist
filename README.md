# To-do list example

## Running the app

This app is using docker-compose. To start all you need to do is simply execute next

```docker-compose up -d```

Then app can be accessed from browser, like `http://localhost/` (your url might be different, 
depending on where you start it: local or remote machine)

It need some time to compile NestJS backend and React frontend, you can track starting progress by 
checking docker logs for containers `<running_dir>_nest_1` and `<running_dir>_react_1`.

### Troubleshooting

In case if both nest and react containers are working, but site still is unreachable, you might want
simply restart the nginx server:

```docker-compose restart nginx```

App uses docker-compose v3 file, and adding waiting for things to be started there is quite painful.

## API

This app is used GraphQL API, powered by Apollo infrastructure (client and server).

You can access GraphQL playground on this route:

```http://localhost/api/graphql```

You also can see the schema file in browser:

```http://localhost/backend/gql-schema.txt```

## Testing

There no tests on FE side. BE side provides e2e test, which can be executed from nest docker container.
To do this you don't need to start whole application at all. You can simply start cli version of nest container 
by running:

```./run_bash.sh nest```

If you are running test without nest app started at all, first you need to install node modules:

```npm install```

Then create database schema by executing all migrations:

```npm run typeorm migration:run```

And finally you can execute e2e test:

```npm run test:e2e```

## Project structure

`.docker` folder contains all required information about docker containers and their configuration to run the app.

`nest` folder contains backend NestJS code

`react` folder container frontend React code

## Tools used

For fronted MUI free examples were used:

https://github.com/mui/material-ui/tree/v5.11.8/docs/data/material/getting-started/templates/sign-in

https://github.com/mui/material-ui/tree/v5.11.8/docs/data/material/getting-started/templates/sign-up
