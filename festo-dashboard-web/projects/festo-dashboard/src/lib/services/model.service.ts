import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ModelService<T> {
  private originalItem: T;
  private currentItem: T;
  private tempItem: T;
  public get(): T {
    return this.currentItem;
  }

  public set(item: T) {
    this.originalItem = this.cloneDeep(item);
    this.tempItem = this.cloneDeep(item);
    this.currentItem = item;
  }

  // restore the original item helps in cancelling the changes on an object
  public restoreItem(): T {
    this.currentItem = this.cloneDeep(this.originalItem);
    return this.get();
  }

  // Compare the original and current items to know if values have been changed
  public isChanged(): boolean {
    return !_.isEqual(this.originalItem, this.currentItem);
  }

  // Compare the temp and current items to know if values have been changed
  public isChangedAccumulative(): boolean {
    const result = !_.isEqual(this.tempItem, this.currentItem);
    if (result) {
      this.tempItem = this.cloneDeep(this.currentItem);
    }
    return result;
  }


  // Exposes an object result from 3 array lists
  // different (properties which had different values)
  // missing properties from first object
  // missing properties from second object
  // In our case here there missing properties from first and second should always be empty
  public changedFields() {
    return this.compare(this.originalItem, this.currentItem);
  }

  public clone(item: T): T {
    return _.clone<T>(item);
  }

  public cloneDeep(item: T): T {
    return _.cloneDeep<T>(item);
  }

  /**** Helper Methods */
  private compare(a, b) {
    const that = this;
    let result = {
      different: [],
      missing_from_first: [],
      missing_from_second: []
    };

    _.reduce(a, function (result, value, key) {
      if (b.hasOwnProperty(key)) {
        if (_.isEqual(value, b[key])) {
          return result;
        } else {
          if (typeof (a[key]) !== typeof ({}) || typeof (b[key]) !== typeof ({})) {
            // dead end.
            result.different.push(key);
            return result;
          } else {
            const deeper = that.compare(a[key], b[key]);
            result.different = result.different.concat(_.map(deeper.different, (sub_path) => {
              return key + '.' + sub_path;
            }));

            result.missing_from_second = result.missing_from_second.concat(_.map(deeper.missing_from_second, (sub_path) => {
              return key + '.' + sub_path;
            }));

            result.missing_from_first = result.missing_from_first.concat(_.map(deeper.missing_from_first, (sub_path) => {
              return key + '.' + sub_path;
            }));
            return result;
          }
        }
      } else {
        result.missing_from_second.push(key);
        return result;
      }
    }, result);

    _.reduce(b, function (result, value, key) {
      if (a.hasOwnProperty(key)) {
        return result;
      } else {
        result.missing_from_first.push(key);
        return result;
      }
    }, result);

    return result;
  }
}
