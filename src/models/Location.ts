import mongoose, { Model } from 'mongoose';
import { ICustomDocument, IWorkspaceDocument } from './index';

export const LocationSchema = new mongoose.Schema({
  address: {
    required: false,
    type: String
  },
  coordinates: [
    {
      required: 'Please provide coordinates',
      type: Number
    }
  ],
  created: {
    default: Date.now,
    type: Date
  },
  name: {
    required: 'Please provide a name',
    type: String
  },
  notes: {
    required: false,
    type: String
  },
  supplier: {
    ref: 'Supplier',
    required: 'You must supply a Supplier',
    type: mongoose.Schema.Types.ObjectId
  },
  type: {
    default: 'Point',
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

LocationSchema.pre<ILocationDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
    this.type = 'Point';
  }
  next();
});

const Location: Model<ILocationDocument> = mongoose.model('Location', LocationSchema);

export { Location };

export interface ILocationDocument extends ICustomDocument {
  // System fields
  created: Date | number;
  updated: Date | number;
  id: string;
  type: 'Point';
  // Custom fields
  name: string;
  address: string;
  notes: string;
  coordinates: [number, number];
  workspace: string | IWorkspaceDocument;
}
