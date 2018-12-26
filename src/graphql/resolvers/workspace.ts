import { IApolloCustomContext } from '../../lib/generateContext';
import { Produce, Supplier, User } from '../../models';

/**
 * Resolver used to gather and return meta information about the user's Workspace.
 *
 * @param {*} any N/A
 * @param {*} any N/A
 * @param {IApolloCustomContext} { currentUser } Context information for the query
 * @returns {Promise<IWorkspaceMetaInfo>} An object containing all the meta information for the workspace
 */
export const getWorkspaceMetaInfo = async (
  {} = {},
  {  }: any,
  { currentUser }: IApolloCustomContext
): Promise<IWorkspaceMetaInfo> => {
  // If for some reason this mutation is called in an unsuitable or unrecognised way. Let's break execution here.
  if (!currentUser || !currentUser.workspace) {
    throw new Error('A valid user with a valid workspace is required for this operation');
  }

  /*
   * Do all the database queries that we need to fetch the meta information. This is not a very effective 
   * way of calculating this data but it's currently the only one we have.
   */
  const users = await User.find({ workspace: currentUser.workspace });
  const produce = await Produce.find({ workspace: currentUser.workspace });
  const suppliers = await Supplier.find({ workspace: currentUser.workspace });

  return {
    counts: {
      produce: produce.length,
      suppliers: suppliers.length,
      users: users.length
    }
  };
};

export interface IWorkspaceMetaInfo {
  counts: {
    produce: number;
    suppliers: number;
    users: number;
  };
}
