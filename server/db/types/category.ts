import { Document, Schema } from 'mongoose';
import { DbDocument } from './db-document';
import { MongoDocumentTransformer } from '../mongodb/mongo-document-transformer'

export interface Category extends DbDocument {
  name: string;
  description: string;
  slug: string;
  isArchived?: boolean;
};

export interface MongoCategory extends Category, Document {}

export const mongoCategorySchema: Schema = new Schema({
  createdAt: Date,
  updatedAt: Date,
  name: String,
  description: String,
  slug: String,
  isArchived: Boolean,
}, { minimize: false });

export class MongoCategoryTransformer extends MongoDocumentTransformer<Category, MongoCategory> {
  preCreate(doc: Category): Category {
    doc = super.preCreate(doc);
    return doc;
  }

  preUpdate(doc: Category): Category {
    doc = super.preUpdate(doc);
    return doc;
  }
}