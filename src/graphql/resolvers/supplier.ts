import { IApolloCustomContext } from '../../lib/generateContext';
import { ILocationDocument, ISupplierDocument, Location, Supplier } from '../../models';

export const createLocationForSupplier = async (
  {} = {},
  { id, data }: any,
  { currentUser }: IApolloCustomContext
): Promise<ILocationDocument> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const supplier = await Supplier.findById(id).exec();
  if (supplier) {
    const location = new Location({
      ...data,
      supplier: supplier._id,
      workspace: currentUser.workspace
    });
    await location.save().catch(err => {
      // tslint:disable-next-line:no-console
      console.error(err.message);
    });
    return location;
  }
  throw new Error(`No valid supplier found from id ${id}`);
};

export const updateLocationForSupplier = async (
  {} = {},
  { supplierId, locationId, data }: any,
  { currentUser }: IApolloCustomContext
): Promise<ISupplierDocument | null> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const supplier = await Supplier.findOne({ id: supplierId, workspace: currentUser.workspace });
  if (supplier) {
    const location = await Location.findOne({
      _id: locationId,
      supplier: supplierId,
      workspace: currentUser.workspace
    });
    if (location) {
      Object.keys(data).forEach(key => {
        location[key as keyof ILocationDocument] = data[key];
      });
      await location.save();
      const dbSupplier = (await Supplier.findById(supplierId).exec()) as ISupplierDocument;
      return dbSupplier;
    }
    throw new Error(`No valid location found from id: ${locationId}`);
  }
  throw new Error(`No valid supplier found from id ${supplierId}`);
};

export const createSupplier = async (
  {} = {},
  { data }: any,
  { currentUser }: IApolloCustomContext
): Promise<ISupplierDocument> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  const supplier = new Supplier({
    ...data,
    workspace: currentUser.workspace
  });
  await supplier.save();
  return supplier;
};

export const updateSupplier = async (
  {} = {},
  { id, data }: any,
  { currentUser }: IApolloCustomContext
): Promise<ISupplierDocument | null> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }
  await Supplier.update({ _id: id }, data).exec();
  const dbSupplier = await Supplier.findById(id).exec();
  return dbSupplier;
};

export const archiveSupplier = async ({} = {}, { id }: any): Promise<{ message: string }> => {
  await Supplier.updateOne({ _id: id }, { active: false }).exec();
  return { message: 'Supplier successfully archived!' };
};

// getSupplier returns one supplier from its id
export const getSupplier = async (
  {} = {},
  { id }: any,
  { currentUser }: IApolloCustomContext,
  info: any
): Promise<ISupplierDocument | null> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }

  /*
   * Determines whether an extra DB query will be required to return the locations for the suppliers being queried
   * using the Query information variable passed through to the resolver.
   */
  const needsLocations =
    info.fieldNodes.filter((node: any) =>
      node.selectionSet.selections.some((selection: any) => selection.name.value === 'locations')
    ).length > 0;
  let supplier: ISupplierDocument | null;
  if (needsLocations) {
    // Must populate the locations virtual if we want to have access to the objects it holds
    supplier = await Supplier.findOne({ _id: id, workspace: currentUser.workspace })
      .where('active')
      .equals(true)
      .populate('locations');
  } else {
    supplier = await Supplier.findOne({ _id: id, workspace: currentUser.workspace })
      .where('active')
      .equals(true);
  }

  // console.log({info, needsLocations})
  return supplier;
};

export const supplierList = async (
  {} = {},
  {} = {},
  { currentUser }: IApolloCustomContext,
  info: any
): Promise<ISupplierDocument[]> => {
  if (!currentUser || !currentUser.workspace) {
    throw new Error('No logged in user identified');
  }

  /*
   * Determines whether an extra DB query will be required to return the locations for the suppliers being queried
   * using the Query information variable passed through to the resolver.
   */
  const needsLocations =
    info.fieldNodes.filter((node: any) =>
      node.selectionSet.selections.some((selection: any) => selection.name.value === 'locations')
    ).length > 0;
  let suppliers: ISupplierDocument[];
  if (needsLocations) {
    // Must populate the locations virtual if we want to have access to the objects it holds
    suppliers = await Supplier.find({ workspace: currentUser.workspace })
      .where('active')
      .equals(true)
      .populate('locations');
  } else {
    suppliers = await Supplier.find({ workspace: currentUser.workspace })
      .where('active')
      .equals(true);
  }

  console.log({ info, needsLocations });
  return suppliers;
};
