import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sizeFormat' })
export class SizeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const size = value.trim();
    const parts = size.split(/[×x]/).map((part: string) => part.trim());
    const formattedSize = parts.join(' x ');

    return formattedSize;
  }
}
