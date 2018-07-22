import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private translateService: TranslateService) { }

  transform(items: any[], field: string, value: string): any {
    if (!items || !field || !value) {
      return items;
    }
    if (items === null || items.length <= 0) {
      return items;
    }
    if (items[0][field] === undefined) {
      return [];
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(it => this.filter(it, field, value));
  }

  filter(it, field, value) {
    if (typeof value.toLowerCase === undefined || typeof value.toLowerCase === 'undefined') {
      return it[field] === value;
    }
    if ((typeof (it[field].toLowerCase)) === undefined || (typeof (it[field].toLowerCase)) !== 'function') {
      return false;
    }

    const result = it[field].toLowerCase().indexOf(value.toLowerCase()) !== -1;
    return result;
  }
}
