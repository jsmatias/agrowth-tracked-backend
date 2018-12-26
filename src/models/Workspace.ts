import mongoose, { Model } from 'mongoose';
import { ICustomDocument } from './index';

export interface IWorkspaceDocument extends ICustomDocument {
  created: Date | number;
  id: string;
  updated: Date | number;
}

const WorkspaceSchema = new mongoose.Schema({
  created: {
    default: Date.now,
    type: Date
  },
  updated: {
    type: Date
  }
});

WorkspaceSchema.pre<IWorkspaceDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
  }
  next();
});

const Workspace: Model<IWorkspaceDocument> = mongoose.model('Workspace', WorkspaceSchema);
export { Workspace };
