import { IApolloCustomContext } from '../../lib/generateContext';
import { Distributor, IDistributorDocument } from '../../models';
import { createUserInWorkspace } from './user';

/**
 * Function used to handle distributor creation mutations on our GraphQL Server.
 *
 * @param {*} [{}={}] N/A
 * @param { { data: IDistributorUpdateInput } } { data } The data passed by the client when attempting to execute this mutation
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {Promise<IProduceDocument>} A promise that resolves to the Produce object created by the mutation
 */
export const createDistributor = async (
  {} = {},
  { data }: any,
  { currentUser }: IApolloCustomContext
): Promise<IDistributorDocument> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const distributor = new Distributor({
    ...data,
    workspace: currentUser.workspace
  });
  await distributor.save();
  return distributor;
};

/**
 * Function responsible for handling updateDistributor mutations on our GraphQL server
 *
 * @param {*} [{}={}] N/A
 * @param {{ data: IDistributorUpdateInput, id: string | number }} { id, data } The data passed by the client when attempting to execute this mutation
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {(Promise<IDistributorDocument | null>)} A promise that resolves to the updated instance of the produce object
 */
export const updateDistributor = async (
  {} = {},
  { id, data }: any,
  { currentUser }: IApolloCustomContext
): Promise<IDistributorDocument | null> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  await Distributor.update({ _id: id }, data).exec();
  const dbDistributor = await Distributor.findById(id).exec();
  return dbDistributor;
};

/**
 * Function responsible for handling the mutation that archives distributor objects on our GraphQL server
 *
 * @param {*} [{}={}] N/A
 * @param {*} { id } The data passed by the GraphQL client, containing the ID of the object to be archived
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {Promise<{ message: string }>} A promise that resolves to an object containing a success message (to indicate the mutation completely successfully)
 */
export const archiveDistributor = async (
  {} = {},
  { id }: any,
  { currentUser }: IApolloCustomContext
): Promise<{ message: string }> => {
  if (!currentUser || !createUserInWorkspace) {
    throw new Error('No logged in used identified');
  }
  await Distributor.updateOne({ _id: id, workspace: currentUser.workspace }, { active: false }).exec();
  return { message: 'Distributor successfully archived!' };
};

/**
 * Function responsible for handling the GraphQL query for listing distributor objects from our database
 * @param {*} [{}={}] n/a
 * @param {*} [{}={}] n/a
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {Promise<IDistributorDocument[]>} A promise that resolves to an array of distributor objects
 */
export const distributorList = async (
  {} = {},
  {} = {},
  { currentUser }: IApolloCustomContext
): // info: any
Promise<IDistributorDocument[]> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  return Distributor.find({ workspace: currentUser.workspace })
    .where('active')
    .equals(true);
};
