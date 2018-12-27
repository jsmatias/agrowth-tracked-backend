import mongoose, { Model } from 'mongoose';
import { ICustomDocument, IWorkspaceDocument } from '.';

export const ProduceSchema = new mongoose.Schema({
  active: {
    default: true,
    type: Boolean
  },
  category:{
    required: false,
    type: String
  },
  created: {
    default: Date.now,
    type: Date
  },
  classification:{
    required: false,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  unit: {
    required: true,
    type: String
  },
  updated: {
    default: Date.now,
    type: Date
  },
  variety:{
    required: false,
    type: String
  },
  weightUnit:{
    required: false,
    type: String
  },
  workspace: {
    ref: 'Workspace',
    required: 'You must supply a Workspace!',
    type: mongoose.Schema.Types.ObjectId
  }
});

ProduceSchema.pre<IProduceDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
  }
  next();
});

const Produce: Model<IProduceDocument> = mongoose.model('Produce', ProduceSchema);

export { Produce };

export interface IProduceDocument extends ICustomDocument {
  active: boolean;
  created: Date | number;
  id: string;
  name: string;
  unit: string;
  updated: Date | number;
  workspace: string | IWorkspaceDocument;
  category: String;
  classification: String;
  variety: String;
  weightUnit: String;
}