import genBatchCode from '../../lib/genBatchCode';
import { IApolloCustomContext } from '../../lib/generateContext';
import { Distributor, Harvest, IHarvestDocument, Location, Produce, Supplier } from '../../models';

// To do:
//  edit and archive harvests
//  change it to embedded

export const createHarvest = async (
  {} = {},
  { distributorId, locationId, produceId, supplierId, data }: any,
  { currentUser }: IApolloCustomContext
): Promise<IHarvestDocument> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const uuidPromise = genBatchCode();
  const supplierPromise = Supplier.findById(supplierId).exec();
  const locationPromise = Location.findById(locationId).exec();
  const producePromise = Produce.findById(produceId).exec();
  const distributorPromise = Distributor.findById(distributorId).exec();
  const [uuid, supplier, location, produce, distributor] = await Promise.all([
    uuidPromise,
    supplierPromise,
    locationPromise,
    producePromise,
    distributorPromise
  ]);
  if (supplier && location && produce && distributor) {
    const harvest = new Harvest({
      ...data,
      uuid,
      location,
      produce,
      supplier: supplier._id,
      workspace: currentUser.workspace
    });
    // push the distributor as an embedded doc
    harvest.distributor.push(distributor);
    await harvest.save().catch(err => {
      // tslint:disable-next-line:no-console
      console.error(err.message);
    });
    return harvest;
  }
  throw new Error(`Data validation failed.`);
};

/**
 * Performs a look up for ONE harvest object based on supplied code and return it if found.
 *
 * @todo implement security measures for this query (that won't limit public access).
 *
 * @param {*} {} n/a
 * @param {({code:string} | any)} {code} object containing the code to be used to filter harvests by
 * @returns {(Promise<IHarvestDocument | null>)} a Harvest object if one is found otherwise null.
 */
export const getHarvest = async ({} = {}, { code }: { code: string } | any = {}): Promise<IHarvestDocument | null> => {
  const harvest = await Harvest.findOne({ _id: code }).populate(['supplier', 'produce']);
  // const harvest = await Harvest.findOne({ _id: code }).populate(['supplier', 'location', 'produce']);

  return harvest;
};

export const harvestList = async (
  {} = {},
  {} = {},
  { currentUser }: IApolloCustomContext
): Promise<IHarvestDocument[]> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  return Harvest.find({ workspace: currentUser.workspace }).populate(['supplier', 'produce']);
  // return Harvest.find({ workspace: currentUser.workspace }).populate(['supplier', 'location', 'produce']);
};
