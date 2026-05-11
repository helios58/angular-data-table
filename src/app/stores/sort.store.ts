import { signal } from '@angular/core';
import { SortState } from '../interfaces/sort.interface';
import { TableUtilsService } from '../services/table-utils.service';

export class SortStore<T extends object> {
  private sort = signal<SortState<T>>({ field: null, direction: null });

  constructor(private utils: TableUtilsService) {}

  getSortState(field: keyof T): SortState<T> {
    const current = this.sort();
    return current.field === field ? current : { field: null, direction: null };
  }

  onSort(field: keyof T): void {
    this.sort.update(current => this.nextState(current, field));
  }

  sortData(data: T[]): T[] {
    const { field, direction } = this.sort();
    if (!field || !direction) return data;

    return [...data].sort((previous, next) =>
      this.utils.compareValues(previous[field], next[field], direction)
    );
  }

  private nextState(current: SortState<T>, field: keyof T): SortState<T> {
    if (current.field !== field) return { field, direction: 'asc' };
    if (current.direction === 'asc') return { field, direction: 'desc' };
    return { field: null, direction: null };
  }
}