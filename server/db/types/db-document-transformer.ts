import { Schema } from 'mongoose';
import { DbDocument } from './db-document';
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

/**
 * Generics:
 *   M - the model type
 *   D - the document type (can be database specific or can also be the same type as the model)
 */
export interface DbDocumentTransformer<M extends DbDocument, D> {
  preCreate(doc: M): M;
  preUpdate(doc: M): M;
  postLoad(doc: D): M;
  conditions(conditions: Object): Object;
}

export function transformToId(value: any): string {
  if (_.isString(value)) {
    return value; // a string
  } else if (value instanceof ObjectID) {
    return value.toString(); // a Mongo ObjectID
  } else if (value && value.__proto__ && _.isFunction(value.__proto__.toHexString)) {
    return value.toString(); // a Mongo ObjectID (fail safe check incase instanceof ObjectID doesn't catch it which for some reason it doesn't always?!?)
  } else if (_.isObject(value) && value.id) {
    return value.id.toString(); // an object with an id
  } else if (!_.isNil(value)) {
    return value.toString(); // something else
  } else {
    return undefined;
  }
}
