import express, { Express, Request, Response } from 'express';
import 'dotenv/config'

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

import connectDB from './server/config/db';


const port = process.env.PORT  || 5000;

const app: Express = express();

// connect to database
connectDB();



// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return "Hello world!!!"
  },

}



app.use("/graphql",
graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true,
}));

app.get('/test', (req: Request, res: Response, next) => {
	console.log('request fired!');

})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} !!!`);
});