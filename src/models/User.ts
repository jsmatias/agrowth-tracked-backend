import mongoose, { Model, Types } from 'mongoose';
import { ICustomDocument } from './index';
import { IWorkspaceDocument } from './Workspace';

const SessionSchema = new mongoose.Schema({
  name: String,
  uuid: {
    required: 'UUID is required when creating a session',
    type: String
  }
});

const UserSchema = new mongoose.Schema({
  created: {
    default: Date.now,
    type: Date
  },
  email: {
    lowercase: true,
    required: 'Email must be provided when signing up',
    type: String,
    unique: true
  },
  name: {
    required: 'Name must be provided when signing up',
    type: String
  },
  password: {
    required: 'Password property cannot be empty',
    type: String
  },
  resetToken: String,
  resetTokenExpiry: Number,
  salt: {
    required: 'Salt property cannot be empty',
    type: String
  },
  sessions: {
    type: [SessionSchema]
  },
  updated: {
    type: Date
  },
  workspace: {
    ref: 'Workspace',
    required: 'You must supply a Workspace!',
    type: mongoose.Schema.Types.ObjectId
  }
});

UserSchema.pre<IUserDocument>('save', function preSave(next): void {
  if (this.isModified()) {
    this.updated = Date.now();
  }
  next();
});

const User: Model<IUserDocument> = mongoose.model('User', UserSchema);
export { User };

/**
 * A Session model used to store a user's active session, ie a device in which they have logged in.
 * Sessions can optionally have a friendly name, which may default to the date and time at which the user logged in
 *
 * @export
 * @interface ISessionDocument
 */
export interface ISessionDocument extends ICustomDocument {
  name?: string;
  uuid: string;
}

/**
 * The model used to represent an app user, ie a user that will log in and interact with our application
 *
 * @export
 * @interface IUserDocument
 * @extends {ICustomDocument}
 */
export interface IUserDocument extends ICustomDocument {
  created: Date | number;
  email: string;
  id: string;
  name: string;
  password: string;
  resetToken: string;
  resetTokenExpiry: number;
  salt: string;
  sessions: Types.DocumentArray<ISessionDocument>;
  updated: Date | number;
  workspace: string | IWorkspaceDocument;
}
