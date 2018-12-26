import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const userTypeDef: DocumentNode = gql`
  """
  Object used to identify the devices a user is currently logged in at.
  Allowing users to optionally define a friendly name for them.
  """
  type Session {
    id: ID!
    name: String
  }
  """
  A user of our application. Used to ensure the client trying to fetch data
  from our server or perform mutations has the required permissions to do so.
  """
  type User {
    """
    The user's database \`id\` field
    """
    id: ID!
    created: String
    updated: String
    """
    The user's email. Also used as their username in the application.
    """
    email: String!
    """
    A human-friendly name tied to the user object. Used in comms and as a way to let users of the app identify themselves and each other
    """
    name: String!
    """
    A one-way hashed string equivalent to the password supplied by the user.
    """
    password: String!
    """
    The user's active sessions (ie, devices they're logged in)
    """
    sessions: [Session]
  }

  """
  input type used to create or update information about a given user.
  """
  input UpdateUserInput {
    """
    The user's email. Also used as their username in the application.
    """
    email: String!
    """
    A human-friendly name tied to the user object. Used in comms and as a way to let users of the app identify themselves and each other
    """
    name: String!
    """
    A plain text string that will be hashed and set as the user's password on our
    system must match password.
    """
    password: String
    """
    A plain text string that will be hashed and set as the user's password on our
    system must match password.
    """
    passwordConfirm: String
  }

  """
  input type used to create brand new user accounts on our system.
  """
  input SignUpUserInput {
    """
    The user's email. Also used as their username in the application.
    """
    email: String!
    """
    A human-friendly name tied to the user object. Used in comms and as a way to let users of the app identify themselves and each other
    """
    name: String!
    """
    A plain text string that will be hashed and set as the user's password on our
    system must match passwordConfirm.
    """
    password: String!
    """
    A plain text string that will be hashed and set as the user's password on our
    system must match password.
    """
    passwordConfirm: String!
    """
    A boolean value indicating that the user has agreed to our terms and conditions
    """
    termsAgreed: Boolean!
  }
`;

export default userTypeDef;
