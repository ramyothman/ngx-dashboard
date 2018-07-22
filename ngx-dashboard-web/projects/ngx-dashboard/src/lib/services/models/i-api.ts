import { Observable } from 'rxjs';

export interface IApi<T> {
  /**
   * API End Point Url
   */
  API_ENDPOINT: string;
  /**
   * Controller End Point
   */
  endPoint: string;

  /**
   * Get EntityList
   * Returns the EntityList
   */
  get(): Observable<T[]>;

  /**
   * Get entity by key.
   * Returns the entity with the key
   * @param id key
   */
  getById(id: any): Observable<T>;

 /**
  * Delete entity in EntityList
  * @param id key
  */
  delete(id: any): Observable<{}>;

  /**
   * Save entity in EntityList
   * @param item entity to Save
   */
  save(item?: T): Observable<T>;
}
