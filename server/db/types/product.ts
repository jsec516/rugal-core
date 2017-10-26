import { Document, Schema } from 'mongoose';
import { Category } from './category';
import { DbDocument } from './db-document';
import { MongoDocumentTransformer } from '../mongodb/mongo-document-transformer'

export interface Image {
    url: string;
    isFeatured: boolean;
}

export interface Owner {
    name: string;
    email: string;
    phone?: string;
}

export interface MongoProduct extends Product, Document {}

export interface Product extends DbDocument {
  owner: Owner;
  category: string | Category;
  name: string;
  description: string;
  slug: string;
  images: Array<Image>
  likes?: number;
  dislikes?: number;
  isArchived?: boolean;
};

export const mongoProductSchema: Schema = new Schema({
  createdAt: Date,
  updatedAt: Date,
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  description: String,
  slug: String,
  images: Schema.Types.Mixed,
  likes: Number,
  dislikes: Number,
  isArchived: Boolean,
}, { minimize: false });

export class MongoProductTransformer extends MongoDocumentTransformer<Product, MongoProduct> {
  preCreate(doc: Product): Product {
    doc = super.preCreate(doc);
    return doc;
  }

  preUpdate(doc: Product): Product {
    doc = super.preUpdate(doc);
    return doc;
  }
}