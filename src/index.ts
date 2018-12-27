import dotenv from 'dotenv';
import createDBConnection from './lib/createDBConnection';
import initApolloServer from './lib/initApolloServer';

// Pull data from .env file and node process and make it available at run time
dotenv.config();
const { DB_USER, DB_PASS, DB_URL } = process.env;
const URI = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}`;

// Ensures database connections start without any issues
createDBConnection(URI)
  .catch(err => {
    // tslint:disable no-console
    console.error('An error was encountered when trying to start the server:');
    console.error(err);
    // tslint:enable no-console
  })
  /**
   * Now that the server is set up and our database is connected, let's initialise
   * Apollo and start our web server
   */
  .then(async () => {
    // Now that all of Apollo's and Express' setup is finished, let's start listening for requests, ie actually start the server
    const { app, server } = await initApolloServer();

    const port = process.env.PORT || 4000;
    await new Promise(resolve => {
      app.listen({ port }, resolve);
    });

    if (process.env.NODE_ENV !== 'production') {
      // tslint:disable-next-line no-console
      console.log(`🚀  Server ready at http://localhost:${port}${server.graphqlPath}`);
    }
  });
