import mongoose from 'mongoose';

// Options to remove deprecated functions from mongoose (which result in warnings thrown in our console)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
/**
 * Configure Mongoose database connection and connect to DB server
 *
 * @param {URL} String The address where the database resides
 * @requires mongoose
 * @returns Promise<mongoose>
 */
const createDBConnection = async (URI = '') => {
  /**
   * Defines which type of Promise interface Mongoose should use.
   * Because node supports promises natively now, we can use the global Promise object.
   *
   * You can find a crash course on promises here:
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises}
   */
  mongoose.Promise = global.Promise;

  if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
  }

  // Connect Mongoose to our database server (the one defined in .env)
  return mongoose.connect(
    URI,
    {
      useNewUrlParser: true
    }
  );
};

export default createDBConnection;
