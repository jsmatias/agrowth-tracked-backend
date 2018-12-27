import mongoose, { Model, Types } from 'mongoose';
import {
  DistributorSchema,
  ICustomDocument,
  IDistributorDocument,
  ILocationDocument,
  IProduceDocument,
  ISupplierDocument,
  IWorkspaceDocument,
  LocationSchema,
  // SupplierSchema,
  // ProduceSchema
} from '.';
import { ProduceSchema } from './Produce'
import { SupplierSchema } from './Supplier'
// Harvest schema defined
const HarvestSchema = new mongoose.Schema({
  active: {
    default: true,
    type: Boolean
  },
  created: {
    default: Date.now,
    type: Date
  },
  distributor: DistributorSchema,
  // probably we should change it to Date type
  emissionDate: {
    default: String(Date.now),
    required: 'You must provide a date of emission',
    type: String
  },
  location: LocationSchema, 
  produce: ProduceSchema, 
  quantity: {
    default: 0,
    required: 'You must supply a quantity of produces',
    type: Number
  },
  supplier: SupplierSchema,
  updated: {
    default: Date.now,
    type: Date
  },
  uuid: {
    dropDups: true,
    required: 'You must supply a BatchCode/UUID',
    unique: true,
    type: String
  },
  workspace: {
    ref: 'Workspace',
    required: 'You must supply a Workspace!',
    type: mongoose.Schema.Types.ObjectId
  }
});

// Updates the updated field in case a specific harvest was edited
HarvestSchema.pre<IHarvestDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
  }
  next();
});

const Harvest: Model<IHarvestDocument> = mongoose.model('Harvest', HarvestSchema);

export { Harvest };

// Interface defined. Workspace are taken as references
export interface IHarvestDocument extends ICustomDocument {
  id: string;
  active: boolean;
  created: Date | number;
  // distributor: string;
  distributor: IDistributorDocument;
  emissionDate: string;
  location: ILocationDocument;
  produce: IProduceDocument;
  quantity: number;
  supplier: ISupplierDocument;
  updated: Date | number;
  uuid: string;
  workspace: string | IWorkspaceDocument;
}
