import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

import connectDB from './server/config/db';

import { schema } from './server/schema/schema';

const port = process.env.PORT || 5000;

const app: Express = express();

console.log('Hello');

// connect to database
connectDB();

// Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `)

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => {
//   },

// }

app.use(cors<Request>());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    // graphiql: process.env.NODE_ENV === 'development'
  })
);

app.get('/test', (req: Request, res: Response, next) => {
  console.log('request fired!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server 7 is running at http://localhost:${port} !`);
});
