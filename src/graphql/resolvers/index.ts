import { archiveDistributor, createDistributor, distributorList, updateDistributor } from './distributor';
import { createHarvest, getHarvest, harvestList } from './harvest';
// import { harvestList } from './harvest';
import { archiveProduce, createProduce, produceList, updateProduce } from './produce';
import {
  archiveSupplier,
  createLocationForSupplier,
  createSupplier,
  getSupplier,
  supplierList,
  updateLocationForSupplier,
  updateSupplier
} from './supplier';
import { createUserInWorkspace, getCurrentUser, signIn, signOut, signUp } from './user';
import { getWorkspaceMetaInfo } from './workspace';

export default {
  /**
   * Second argument in the functions below must have union type any due to
   * a bug in GraphQL typings, see {@link https://github.com/apollographql/graphql-tools/issues/704}
   * and {@link https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21359}
   */
  Mutation: {
    archiveDistributor,
    archiveProduce,
    archiveSupplier,
    createDistributor,
    createHarvest,
    createLocationForSupplier,
    createProduce,
    createSupplier,
    createUserInWorkspace,
    signIn,
    signOut,
    signUp,
    updateDistributor,
    updateLocationForSupplier,
    updateProduce,
    updateSupplier
  },

  Query: {
    getCurrentUser,
    getHarvest,
    getSupplier,
    getWorkspaceMetaInfo,
    distributorList,
    harvestList,
    produceList,
    supplierList
    // suppliersLocationList
  }
};
