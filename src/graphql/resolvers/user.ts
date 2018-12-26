import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { ISessionDocument } from 'src/models/User';
import uuidV4 from 'uuid/v4';
import { IApolloCustomContext } from '../../lib/generateContext';
import { IUserDocument, User, Workspace } from '../../models';

export const createUserInWorkspace = async (
  {} = {},
  { data }: ISignUpData | any,
  { currentUser }: IApolloCustomContext
): Promise<IUserDocument | null> => {
  // If for some reason this mutation is called in an unsuitable or unrecognised way. Let's break execution here.
  if (!currentUser || !currentUser.workspace) {
    throw new Error('A valid user with a valid workspace is required for this operation');
  }

  // Create the salt and workspace properties to be used in this new user creation
  const salt = await bcrypt.genSalt();
  const workspace = currentUser.workspace;
  const user = new User({
    ...data,
    salt,
    workspace,
    // tslint:disable-next-line:object-literal-sort-keys
    password: await bcrypt.hash(data.password, salt)
  });
  // Save the user we created to the DB
  await user.save();

  return user;
};

export const editCurrentUser = async ({} = {}, { data }: ISignUpData | any, { currentUser }: IApolloCustomContext) => {
  // If for some reason this mutation is called in an unsuitable or unrecognised way. Let's break execution here.
  if (!currentUser || !currentUser.workspace) {
    throw new Error('A valid user with a valid workspace is required for this operation');
  }

  if (data.name) {
    currentUser.name = data.name;
  }
  if (data.email) {
    currentUser.email = data.email;
  }
  if (data.password && data.passwordConfirm && data.password === data.passwordConfirm) {
    currentUser.password = data.password;
  }

  if (currentUser.isModified) {
    await currentUser.save();
  }

  return currentUser;
};

/**
 * Simple resolver to allow us to return data about the currently logged in user on our application.
 *
 * @param {*} {} Data provided by the parent query of this mutation. N/A for this resolver
 * @param {*} {} Data passed in from the mutation. N/A for this resolver
 * @param {IApolloCustomContext} { currentUser } Apollo Server's context. See {@link generateContext}
 * @returns {(Promise<IUserDocument | null>)}
 */
export const getCurrentUser = async (
  {} = {},
  {} = {},
  { currentUser }: IApolloCustomContext
): Promise<IUserDocument | null> => {
  // If the currentUser object is null or invalid, GraphQL will ensure it throws an error in the response
  // so all we need to do is return the current user object
  return currentUser;
};

/**
 * Allows a user to authenticate themselves using a mutation on our Apollo Server.
 *
 * @throws {Error} Throws error if no user with that email is found or if the
 *                  password does not match the one from the user with the email we found
 * @param {*} [{}={}]
 * @param {(ISignInData | any)} { email, password }
 * @param {IApolloCustomContext} { res } Apollo Server's context. See {@link generateContext}
 * @returns {(Promise<IUserDocument | null>)} the user object matching the auth details sent (if one is found)
 */
export const signIn = async (
  {} = {},
  { email, password }: ISignInData | any,
  { res }: IApolloCustomContext
): Promise<IUserDocument | null> => {
  // Try to find a user with the provided email on our DB throw error if we can't find a user
  const user = await User.findOne({ email: email.toLowerCase() }).exec();
  if (!user) {
    // We throw the same error in both places to not allow for ill-intended users of our application
    // to list which emails do and don't have an account with us. It's called security by obfuscation.
    throw new Error('Email and password combination is invalid.');
  }

  // Check if the user we got from that email has the same password as the one supplied to us
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // We throw the same error in both places to not allow for ill-intended users of our application
    // to list which emails do and don't have an account with us. It's called security by obfuscation.
    throw new Error('Email and password combination is invalid.');
  }

  // For added security let's tie this successful sign in attempt to a session object on our DB.
  const uuid = uuidV4();
  const session = { uuid, name: new Date().toString() } as ISessionDocument;
  // The sessions.slice call here ensure that we only ever get 3 sessions for a given user at a time
  user.sessions = [session, ...user.sessions.slice(0, 2)] as Types.DocumentArray<ISessionDocument>;
  await user.save();

  // As we got a user and it's a valid one. Let's set our JWT with that user's ID
  const token = jwt.sign({ uuid, userId: user.id }, process.env.APP_SECRET as string);
  // Now we set the JWT as a cookie so that the client can send it back to us on subsequent requests
  console.log({ user, uuid, userId: user.id });
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });

  // All is well, let's send the user information back to the client
  return user;
};

/**
 * Allow end users to sign out of our application by clearing their token cookie.
 *
 * @param {*} {} Data provided by the parent query of this mutation. N/A for this resolver
 * @param {*} {} Data passed in from the mutation. N/A for this resolver
 * @param {IApolloCustomContext} { res } Apollo Server's context. See {@link generateContext}
 * @returns {Promise<{ message: string }>}
 */
export const signOut = async (
  {} = {},
  {} = {},
  { currentUser, res, uuid }: IApolloCustomContext
): Promise<{ message: string }> => {
  res.clearCookie('token');
  if (currentUser) {
    const session = currentUser.sessions.filter(session => session.uuid === uuid)[0];
    if (session) {
      currentUser.sessions.id(session.id).remove();
      await currentUser.save();
    }
  }

  return { message: 'ciao' };
};

/**
 * Handles the creation of new app users through a GraphQL mutation on our Apollo Server.
 * On successful user creations it should also sign the user into our application by
 * setting the token cookie in the HTTP response sent back.
 *
 * @param {null} Parent Information about the parent query in the GraphQL resolver stack. N/A here
 * @param {(ISignUpData | any)} { data } Data provided to register a new user
 * @param {IApolloCustomContext} { res } Apollo Server's context. See {@link generateContext}
 * @returns {(Promise<IUserDocument | null>)} The new user created with this method
 */
export const signUp = async (
  {} = {},
  { data }: ISignUpData | any,
  { res }: IApolloCustomContext
): Promise<IUserDocument | null> => {
  // Ensure the user's email is always lower cased
  const email = data.email.toLowerCase();

  // Perform basic validation before attempting to create a user's account
  if (!data.password || !data.passwordConfirm || data.password !== data.passwordConfirm) {
    throw new Error('Passwords do not match.');
  }
  if (!data.termsAgreed) {
    throw new Error('You must agree to the terms before signing up for an account.');
  }
  const duplicateUser = await User.findOne({ email });
  if (duplicateUser) {
    throw new Error(`A user with the email address ${data.email} already exists`);
  }

  // Create the new workspace that will be used by this new user
  const workspace = new Workspace();
  await workspace.save();

  const salt = await bcrypt.genSalt();
  const user = new User({
    email,
    salt,
    workspace,
    // tslint:disable-next-line:object-literal-sort-keys
    name: data.name,
    password: await bcrypt.hash(data.password, salt)
  });
  // Save the user we created to the DB
  await user.save();

  // We created our new user, it must be a valid one so let's sign them in.
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET as string);
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });

  return user;
};

export interface ISignUpData {
  data: {
    email: string;
    name: string;
    password: string;
    passwordConfirm?: string;
    termsAgreed?: boolean;
  };
}

export interface ISignInData {
  email: string;
  password: string;
}
