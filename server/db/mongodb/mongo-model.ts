import { Observable } from 'rxjs/Observable';
import { Schema, Model, Document, Connection, ModelPopulateOptions, DocumentQuery } from 'mongoose';
import { DbModel } from '../types/db-model';
import { MongoDocumentTransformer } from './mongo-document-transformer';

import '../../vendor';
import * as _ from 'lodash';

export class MongoModel<T, M extends Document> implements DbModel<T> {
  /**
   * Private
   */
  private model: Model<M>;

  /**
   * Constructor
   */
  constructor(
    private connection: Connection,
    private collection: string,
    private schema: Schema,
    private transformer?: MongoDocumentTransformer<T, M>) {
    if (!this.transformer) {
      this.transformer = new MongoDocumentTransformer<T, M>();
    }
    this.model = this.connection.model<M>(this.collection, this.schema);
  }

  /**
   */
  create(doc: T): Observable<T> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.create(this.transformer.preCreate(doc))).map((result: M) => this.transformer.postLoad(result)));
  }

  /**
   */
  count(conditions: Object): Observable<number> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.count(this.transformer.conditions(conditions)).exec()));
  }

  /**
   */
  find(conditions: Object): Observable<T[]> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.find(this.transformer.conditions(conditions)).exec()))
      .map((results: M[]) => {
        const transformedResults: T[] = _.map(results, (result) => this.transformer.postLoad(result));
        return transformedResults;
      });
  }

  /**
   */
  findById(id: Object | string | number): Observable<T> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.findById(id).exec()).map((result: M) => this.transformer.postLoad(result)));
  }

  /**
   */
  findOne(conditions: Object): Observable<T> {
    const promise: Promise<M> =
      (conditions as any).id ?
      this.model.findById((conditions as any).id).exec() :
      this.model.findOne(this.transformer.conditions(conditions)).exec();
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(promise).map((result: M) => this.transformer.postLoad(result)));
  }

  /**
   * Find a document by conditions and remote it.
   * @param conditions selector
   */
  findOneAndRemove(conditions: Object): Observable<T> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.findOne(this.transformer.conditions(conditions)).exec()).map((result: M) => this.transformer.postLoad(result)));
  }

  /** 
   * Find a document and update it.
   */
  findOneAndUpdate(conditions: Object, doc: T): Observable<T> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.findOneAndUpdate(this.transformer.conditions(conditions), this.transformer.preUpdate(doc), {new: true})))
      .map((result: M) => this.transformer.postLoad(result));
  }

  /**
   */
  populate(doc: T, path: string): Observable<T>;
  populate(doc: T, path: string, names: string): Observable<T>;
  populate(doc: T, path: string, names?: string): Observable<T> {
    const options: ModelPopulateOptions = { path: path, select: names };
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.populate<M>(doc, options)))
      .map((result: M) => {
        result[path] = this.transformer.postLoad(result[path]);
        return (result as any) as T;
      });
    }

  /** 
   * Removes a document by conditions.
   */
  remove(conditions: Object): Observable<any> {
    return Observable.of(true) // start with basic observable so promise doesn't fire right away
      .switchMap(() => Observable.fromPromise(this.model.remove(this.transformer.conditions(conditions)).exec()));
  }
}