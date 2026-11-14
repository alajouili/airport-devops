import { Pipe, PipeTransform } from '@angular/core';

/**
 * Displays a 1-5 rating as stars:  {{ 4 | stars }}  ->  "★★★★☆"
 * A pipe transforms a value for display in a template, without changing the data.
 */
@Pipe({ name: 'stars' })
export class StarsPipe implements PipeTransform {
  transform(note: number | null | undefined, max = 5): string {
    const value = Math.max(0, Math.min(max, Math.round(note ?? 0)));
    return '★'.repeat(value) + '☆'.repeat(max - value);
  }
}
