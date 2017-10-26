import * as mongoose from 'mongoose';
import { Connection as MongooseConnection, Model as MongooseModel, createConnection as mongooseCreateConnection } from 'mongoose';
import * as BluebirdPromise from 'bluebird';
import { IProvider } from "../iprovider";
import { MongoModel } from './mongo-model';
import { Product, MongoProduct, mongoProductSchema, MongoProductTransformer } from '../types/product';
import { Category, MongoCategory, mongoCategorySchema, MongoCategoryTransformer } from '../types/category';

export interface DbServiceOptions {
  uri?: string;
}

export function init(options) {
    return new MongoClient(options);
}

export class MongoClient implements IProvider {

    private mongodbUrl: string;
    private mongooseConnection: any;
    private product: MongoModel<Product, MongoProduct>;
    private category: MongoModel<Category, MongoCategory>;
    constructor(private options: DbServiceOptions) {
        mongoose.Promise = BluebirdPromise;
        this.mongodbUrl = options.uri || process.env.MONGODB_URL;
        this.mongooseConnection = mongooseCreateConnection(this.mongodbUrl);
        this.loadSchemas();
    }

    loadSchemas() {
        this.product = new MongoModel<Product, MongoProduct>(
            this.mongooseConnection,
            'Product',
            mongoProductSchema,
            new MongoProductTransformer());

        this.category = new MongoModel<Category, MongoCategory>(
            this.mongooseConnection,
            'Category',
            mongoCategorySchema,
            new MongoCategoryTransformer());
    }

    ok() {
        return this.category.findOne({name: 'test'});
    }
}