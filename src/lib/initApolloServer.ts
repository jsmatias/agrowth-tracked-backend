import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express, { Request } from 'express';
import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/typeDefs';
import { generateContext } from './generateContext';

export interface IRequestWithMiddleware extends Request {
  cookies: { [key: string]: any };
  userId?: string;
}

/**
 * Configures, initialise and start the Apollo Server to be used by our app.
 *
 * @returns {Promise<{server: ApolloServer, app: Express.Application}>} An Apollo Server instance.
 */
const initApolloServer = async () => {
  // Creates our express server
  const app = express();

  /** Enable the parsing of HTTP cookies, adding the cookies object to our {@type Express.Request} object used across the app. */
  app.use(cookieParser());

  /*
   * It turns out CORS is a massive bitch and in order to allow credentials to be 
   * sent from the client we need to pass in the correct values using this `cors` package.
   * 
   * In our case we need to enable a number of origins that are allowed to interact with our server
   * and exchange credentials, that is what the allowList array below is for.
   */
  const allowList = [
    undefined,
    'http://10.10.0.8:3000', // Leo's usual IP on his home network, required for testing the site on mobile
    'http://10.10.0.8:4000', // Leo's usual IP on his home network, required for testing the site on mobile
    'http://10.10.0.8:5000', // Leo's usual IP on his home network, required for testing the site on mobile
    'http://localhost:3000', // localhost access from our dev machines
    'http://localhost:4000', // localhost access from our dev machines
    'http://localhost:5000', // localhost access from our dev machines
    'https://www.agrowth.app', // Live main website
    'https://agrowth-tracked.netlify.com', // Netlify's temporary URL
    'https://agrowth-api.herokuapp.com' // Allow Heroku app to access itself
  ];

  /**
   * Configure the Apollo Server. This is the part responsible for receiving network
   * requests under `/graphql` and resolving them.
   */
  const server = new ApolloServer({
    context: generateContext,
    schema: makeExecutableSchema({ typeDefs, resolvers })
  });

  // Add the Apollo Server middleware to our express server
  server.applyMiddleware({
    app,
    // cors: true
    cors: {
      credentials: true,
      origin(origin, callback) {
        if (allowList.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    }
  });

  /**
   * Not totally sure this is at all needed but leaving it here for now
   * @todo potentially remove this
   */
  return { app, server };
};

export default initApolloServer;
