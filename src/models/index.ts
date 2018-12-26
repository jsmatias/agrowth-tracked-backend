import { Document } from 'mongoose';

// Export models and interfaces from index.ts for easier importing elsewhere.
export { IDistributorDocument, Distributor, DistributorSchema } from './Distributor';
export { ILocationDocument, Location } from './Location';
export { IHarvestDocument, Harvest } from './Harvest';
export { IProduceDocument, Produce } from './Produce';
export { IPurchaseDocument, Purchase, PurchaseSchema } from './Purchase';
export { ISupplierDocument, Supplier } from './Supplier';
export { IUserDocument, User } from './User';
export { IWorkspaceDocument, Workspace } from './Workspace';
export interface ICustomDocument extends Document {
  id: string;
}
