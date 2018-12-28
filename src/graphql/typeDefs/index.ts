import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import distributor from './distributor';
import harvest from './harvest';
import location from './location';
import produce from './produce';
import purchase from './purchase';
import supplier from './supplier';
import user from './user';
import workspace from './workspace';

const coreTypeDefs: DocumentNode = gql`
  """
  Generic success message type used for when we must send nothing but a string of text
  from the server to the client
  """
  type SuccessMessage {
    message: String
  }

  type Mutation {
    #Distributor
    """
    Allows for archiving a distributor.
    """
    archiveDistributor(id: ID!): SuccessMessage
    """
    Allows the creating of a new distributor.
    """
    createDistributor(data: DistributorUpdateInput): Distributor
    """
    Allows for updating an existing distributor.
    """
    updateDistributor(data: DistributorUpdateInput!, id: ID!): Distributor

    # Supplier
    archiveSupplier(id: ID!): SuccessMessage
    createLocationForSupplier(id: ID, data: LocationUpdateInput): Location
    createSupplier(data: SupplierUpdateInput): Supplier
    updateLocationForSupplier(supplierId: ID!, locationId: ID!, data: LocationUpdateInput): Location
    updateSupplier(data: SupplierUpdateInput!, id: ID!): Supplier
    # Produce
    archiveProduce(id: ID!): SuccessMessage
    createProduce(data: ProduceUpdateInput): Produce
    updateProduce(data: ProduceUpdateInput!, id: ID!): Produce
    # Harvest
    createHarvest(
      distributorId: ID!
      locationId: ID!
      supplierId: ID!
      produceId: ID!
      data: HarvestUpdateInput
    ): Harvest

    # User
    """
    Allows for editing information about the current user.
    """
    editCurrentUser(data: UpdateUserInput): User
    """
    Allows an existing user to add new user's to their workspace.
    Subsequent workspace users will be invitation only at first. Signing up for a new account and
    into an existing workspace "on your own" will be an upcoming feature (maybe similarly to how slack
    does it with invitation links).
    """
    createUserInWorkspace(data: UpdateUserInput): User
    """
    Authenticate a user and set a session cookie for them
    """
    signIn(
      """
      The user's email. Also used as their username in the application.
      """
      email: String!
      """
      A one-way hashed string equivalent to the password supplied by the user.
      """
      password: String!
    ): User
    """
    Remove the user's authentication session cookie, logging them out of the application
    """
    signOut: SuccessMessage
    """
    Creates a new user account on our application
    """
    signUp(data: SignUpUserInput): User
  }

  type Query {
    """
    Fetches information about the currently authenticated user
    """
    distributorList: [Distributor]
    getCurrentUser: User
    getHarvest(code: String!): Harvest
    getSupplier(id: ID!): Supplier
    produceList: [Produce]
    harvestList: [Harvest]
    purchaseList: [Purchase]
    supplierList: [Supplier]
    getWorkspaceMetaInfo: WorkspaceMetaInfo
  }
`;

export default [coreTypeDefs, distributor, harvest, location, produce, purchase, supplier, user, workspace];
