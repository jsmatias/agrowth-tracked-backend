// tslint:disable-next-line:no-implicit-dependencies
import { Context } from 'apollo-server-core';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument, User } from '../models';
import { IRequestWithMiddleware } from './initApolloServer';

export interface IParsedJWT {
  userId?: string;
  uuid?: string;
}

export interface IApolloCustomContext extends Context {
  currentUser: IUserDocument | null;
  res: Response;
}

/**
 * Make Mongoose models available to our Apollo server through
 * the context argument in resolvers. This way we don't need to keep importing
 * model objects on every resolver
 *
 * @returns Promise<IApolloCustomContext> - The object to be used as Context by the Apollo server
 */
export const generateContext = async ({
  req,
  res
}: {
  req: IRequestWithMiddleware;
  res: Response;
}): Promise<IApolloCustomContext> => {
  //#region Attempt to find an authenticated user to attach to our context
  let currentUser: IUserDocument | null = null;
  let uuid: string | undefined = undefined;
  // Extract the token from client sent cookies
  const { token } = req.cookies;
  // Grab our JTW app secret from our environment (this should be unique to each env we use).
  const { APP_SECRET } = process.env;
  if (token && APP_SECRET) {
    // Decode the JWT and store the recovered userId and uuid values on our const variables.
    const parsedJWT = jwt.verify(token, APP_SECRET) as IParsedJWT;
    const { userId } = parsedJWT;
    uuid = parsedJWT.uuid;
    // If we have a userId and uuid, let's try to fetch a user object from the database using them.
    if (userId && uuid) {
      currentUser = await User.findOne({ 'sessions.uuid': uuid, _id: userId }).exec();
    }
  }
  //#endregion

  return {
    /*
     * If there's a user logged in, we'll have its data available under this key
     * in the context of our resolvers
     */
    currentUser,
    /* 
     * Let's send the response object as part of the context too, it will be 
     * useful for when we're dealing with user related logic
     */
    res,
    /*
     * The unique identifier of this session for the current user.
     */
    uuid
  };
};
