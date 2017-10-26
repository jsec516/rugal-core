import { Observable } from 'rxjs/Observable';

export interface DbModel<T> {
  /** 
   * Creates a document.
   */
  create(doc: T): Observable<T>;

  /**
   * Count the number of documents.
   * @param conditions selector
   */
  count(conditions?: Object): Observable<number>;

  /**
   * Find one or more documents by conditions.
   * @param conditions selector
   */
  find(conditions: Object): Observable<T[]>;
  
  /**
   * Find a document by id.
   */
  findById(id: Object | string | number): Observable<T>;

  /**
   * Find a document by conditions.
   * @param conditions selector
   */
  findOne(conditions: Object): Observable<T>;

  /**
   * Find a document by conditions and remote it.
   * @param conditions selector
   */
  findOneAndRemove(conditions: Object): Observable<T>;

  /** 
   * Find a document and update it.
   */
  findOneAndUpdate(conditions: Object, doc: T): Observable<T>;

  /** 
   * Populates a path in a document.
   */
  populate(doc: T, path: string): Observable<T>;
  populate(doc: T, path: string, names: string): Observable<T>;

  /** 
   * Removes a document by conditions.
   */
  remove(conditions: Object): Observable<any>;
};
