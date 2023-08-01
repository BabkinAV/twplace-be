import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

import connectDB from './server/config/db';

import { schema } from './graphql/schema/schema';
import { getErrorCode } from './helpers/getErrorCode';
import { errorNameType } from './constants/ErrorTypes';
import auth from './middleware/auth';

declare module "express-serve-static-core" {
  export interface Request {
    isAuth?: boolean;
		userId?: string;
  }
}



const port = process.env.PORT || 5000;

const app: Express = express();


// connect to database
connectDB();

app.use(cors<Request>());

app.use(auth)


app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,

		// context: request.isAuth,
		
		customFormatErrorFn(err) {
			// Inspired by https://stackoverflow.com/a/57387596/12246209
    

			const isErrorTypeEnum = (message: string): message is errorNameType => {
				return Object.values(errorNameType).includes(message as errorNameType);
			};
			if (isErrorTypeEnum(err.message)) {
				const error = getErrorCode(err.message);

				return {
					message :error.message,
					status: error.statusCode
				};

			}

			return {
				message: err.message || 'Server error',
				status: '500'
			}
    },
    // graphiql: process.env.NODE_ENV === 'development'
  })
);

app.get('/test', (req: Request, res: Response, next) => {
  console.log('request fired!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server 3 is running at http://localhost:${port} !`);
});
