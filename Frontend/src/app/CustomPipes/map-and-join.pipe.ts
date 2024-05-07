import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinWithCommaSeparated'
})
export class JoinWithCommaSeparatedPipe<T> implements PipeTransform {
  transform(list: T[], key: keyof T): string {

    if (!list || list.length === 0) {
      return '';
    }
    return list.map(item => item[key]).join(', ');
  }
}
