import mongoose, { Model } from 'mongoose';
import { ICustomDocument, ILocationDocument, IWorkspaceDocument } from '.';

export const SupplierSchema = new mongoose.Schema({
  active: {
    default: true,
    type: Boolean
  },
  created: {
    default: Date.now,
    type: Date
  },
  email: {
    required: false,
    type: String
  },
  idNumber: {
    required: 'Insert a valid document ID!',
    type: String
  },
  idType: {
    required: 'You must supply a valid document ID type!',
    type: String
  },
  name: {
    required: "Insert supplier's first name!",
    type: String
  },
  // nickname or company name
  nickname: {
    required: "You must supply the producer's nickname or his company's name!",
    type: String
  },
  phoneNumber: {
    required: false,
    type: String
  },
  // purchase: [PurchaseSchema],
  surname: {
    required: "Insert supplier's last name!",
    type: String
  },
  updated: {
    default: Date.now,
    type: Date
  },
  workspace: {
    ref: 'Workspace',
    required: 'You must supply a Workspace!',
    type: mongoose.Schema.Types.ObjectId
  }
});

// find locations where the supplier _id property === location supplier property
SupplierSchema.virtual('locations', {
  foreignField: 'supplier', // which field on the review?
  localField: '_id', // which field on the store?
  ref: 'Location' // what model to link?
});

SupplierSchema.pre<ISupplierDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
  }
  next();
});

const Supplier: Model<ISupplierDocument> = mongoose.model('Supplier', SupplierSchema);

export { Supplier };

export interface ISupplierDocument extends ICustomDocument {
  active: boolean;
  created: Date | number;
  email: string;
  id: string;
  idNumber: string;
  idType: string;
  locations: (string | ILocationDocument)[];
  name: string;
  nickname: string;
  phoneNumber: string;
  surname: string;
  updated: Date | number;
  // locations: Types.DocumentArray<ILocationDocument>;
  // purchase: Types.DocumentArray<IPurchaseDocument>;
  workspace: string | IWorkspaceDocument;
}
