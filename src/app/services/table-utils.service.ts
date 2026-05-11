import { Injectable } from '@angular/core';
import { TableColumn } from '../interfaces/data-table.interface';
import { SortDirection } from '../interfaces/sort.interface';
import { CellRendered } from '../interfaces/cell-rendered.interface';

@Injectable({
  providedIn: 'root'
})
export class TableUtilsService {
  // Type guard to check if a CellRendered value is an object with text and class properties
  isObject(value: CellRendered): value is { text: string; class: string } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'text' in value &&
      'class' in value
    );
  }
  // Retrieves the string value for searching from a table cell, using the render function if available
  getSearchValue<T extends object>(row: T, column: TableColumn<T>): string {
    if (column.render) {
      const rendered = column.render(row);
      if (typeof rendered === 'string') return rendered;
      if (this.isObject(rendered))      return rendered.text;
    }

    return row[column.field]?.toString() ?? '';
  }
  // Compares two values for sorting based on the specified direction (ascending or descending)
  compareValues(previous: unknown, next: unknown, direction: SortDirection): number {
    if (previous === next) return 0;
    if (previous == null)  return -1;
    if (next == null)      return 1;

    const result = previous > next ? 1 : -1;
    return direction === 'asc' ? result : -result;
  }
}