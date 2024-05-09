import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsonParse' })
export class JsonParsePipe implements PipeTransform {
  transform(value: string): any {
    debugger
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return null;
    }
  }
}
