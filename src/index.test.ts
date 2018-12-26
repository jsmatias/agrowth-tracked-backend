// tslint:disable-next-line:no-implicit-dependencies
import { createApolloFetch } from 'apollo-fetch';
// tslint:disable-next-line:no-implicit-dependencies
import mongodbMemoryServer, { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createDBConnection from './lib/createDBConnection';
import initApolloServer from './lib/initApolloServer';

/**
 * Define the setup and teardown logic for our test.
 *
 * beforeAll will be run before any tests on this file and afterAll will run once the tests on this file are done running
 *
 */
let mongoServer: MongoMemoryServer;
beforeAll(async () => {
  mongoServer = new mongodbMemoryServer();
  const URI = await mongoServer.getConnectionString();
  await createDBConnection(URI);
});

afterAll(async done => {
  await mongoose.disconnect();
  await mongoServer.stop();
  done();
});

// On the off chance we run this file outside of a test environment, let's get a notification about it
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  throw new Error('🙅  Not in a test environment! 🙅');
}

/**
 * Actual tests' logic start here
 */

describe('DB Connection', async () => {
  test('Should be active', async () => {
    expect(mongoose.connection.readyState).toEqual(1);
  });
  test('Five data models should be available', async () => {
    const models = Object.keys(mongoose.connection.collections);
    expect(models.length).toEqual(5);
  });
});

describe('Apollo Server', async () => {
  let server: any;
  afterEach(async () => {
    await server.stop();
  });
  test('Apollo fetch should work', async () => {
    server = await initApolloServer();
    const { url: uri } = await server.listen({ port: 4000 });
    const apolloFetch = createApolloFetch({ uri });
    const result = await apolloFetch({ query: '{userList{id}}' });
    expect(result.errors).toBeUndefined();
  });
});
