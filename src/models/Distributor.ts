import mongoose, { Model } from 'mongoose';
import { ICustomDocument, IWorkspaceDocument } from '.';

export const DistributorSchema = new mongoose.Schema({
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
  name: {
    required: "Insert distributor's first name!",
    type: String
  },
  nickname: {
    required: false,
    type: String
  },
  phoneNumber: {
    required: false,
    type: String
  },
  surname: {
    required: "Insert distributor's last name!",
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

// find locations where the distributor _id property === location distributor property
// DistributorSchema.virtual('locations', {
//   ref: 'Location', // what model to link?
//   localField: '_id', // which field on the store?
//   foreignField: 'distributor' // which field on the review?
// });

DistributorSchema.pre<IDistributorDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
  }
  next();
});

const Distributor: Model<IDistributorDocument> = mongoose.model('Distributor', DistributorSchema);

export { Distributor };

export interface IDistributorDocument extends ICustomDocument {
  active: boolean;
  created: Date | number;
  email: string;
  id: string;
  idNumber: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  surname: string;
  updated: Date | number;
  workspace: string | IWorkspaceDocument;
}
