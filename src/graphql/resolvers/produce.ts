import { IApolloCustomContext } from '../../lib/generateContext';
import { IProduceDocument, Produce } from '../../models';

/**
 * Function used to handle produce creation mutations on our GraphQL Server.
 *
 * @param {*} [{}={}] N/A
 * @param { { data: IProduceUpdateInput } } { data } The data passed by the client when attempting to execute this mutation
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {Promise<IProduceDocument>} A promise that resolves to the Produce object created by the mutation
 */
export const createProduce = async (
  {} = {},
  { data }: any | IProduceUpdateInput,
  { currentUser }: IApolloCustomContext
): Promise<IProduceDocument> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const produce = new Produce({
    ...data,
    workspace: currentUser.workspace
  });
  await produce.save();
  return produce;
};

/**
 * Function responsible for handling updateProduce mutations on our GraphQL server
 *
 * @param {*} [{}={}] N/A
 * @param {{ data: IProduceUpdateInput, id: string | number }} { id, data } The data passed by the client when attempting to execute this mutation
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {(Promise<IProduceDocument | null>)} A promise that resolves to the updated instance of the produce object
 */
export const updateProduce = async (
  {} = {},
  { id, data }: any,
  { currentUser }: IApolloCustomContext
): Promise<IProduceDocument | null> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const produce = Produce.findOneAndUpdate({ _id: id, workspace: currentUser.workspace }, data, { new: true }).exec();
  return produce;
};

/**
 * Function responsible for handling the mutation that archives produce objects on our GraphQL server
 *
 * @param {*} [{}={}] N/A
 * @param {*} { id } The data passed by the GraphQL client, containing the ID of the object to be archived
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {Promise<{ message: string }>} A promise that resolves to an object containing a success message (to indicate the mutation completely successfully)
 */
export const archiveProduce = async (
  {} = {},
  { id }: any,
  { currentUser }: IApolloCustomContext
): Promise<{ message: string }> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  await Produce.updateOne({ _id: id, workspace: currentUser.workspace }, { active: false }).exec();
  return { message: 'Done!' };
};

/**
 * Function responsible for handling the GraphQL query for listing produce objects from our database
 *
 * @param {*} [{}={}] n/a
 * @param {*} [{}={}] n/a
 * @param {IApolloCustomContext} { currentUser } The context set by request data sent by the client
 * @returns {Promise<IProduceDocument[]>} A promise that resolves to an array of produce objects
 */
export const produceList = async (
  {} = {},
  {} = {},
  { currentUser }: IApolloCustomContext
): Promise<IProduceDocument[]> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  return Produce.find({ workspace: currentUser.workspace })
    .where('active')
    .equals(true);
};

export interface IProduceUpdateInput {
  active: boolean;
  name: string;
  unit: string;
  comments: string;
}
