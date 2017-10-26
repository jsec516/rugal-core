import { DbDocumentTransformer } from '../types/db-document-transformer';
import { DbDocument } from '../types/db-document';

import { Document } from 'mongoose';
import * as _ from 'lodash';

/**
 */
export class MongoDocumentTransformer<M extends DbDocument, D extends Document> implements DbDocumentTransformer<M, D> {
  preCreate(doc: M): M {
    const now = (new Date()).toISOString();
    doc = _.clone(doc) as M;
    doc.createdAt = now;
    doc.updatedAt = now;
    return doc;
  }

  preUpdate(doc: M): M {
    const now = (new Date()).toISOString();
    doc = _.clone(doc) as M;
    doc.updatedAt = now;
    return doc;
  }

  postLoad(doc: D): M {
    if (_.isNil(doc)) {
      return (doc as any) as M;
    }
    let model: any = doc.toObject ? doc.toObject() : doc;
    model.id = doc._id.toString();
    delete model._id;
    delete model.__v;
    return model as M;
  }

  conditions(conditions: Object): Object {
    if (_.isNil(conditions)) {
      return conditions;
    }
    const clone: any = _.clone(conditions);
    if (clone.id) {
      clone._id = _.isString(clone.id) ? clone.id : clone.id.toString();
      delete clone.id;
    }
    return clone
  }
}