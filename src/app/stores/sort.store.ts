import { signal } from '@angular/core';
import { SortState } from '../interfaces/sort.interface';
import { TableUtilsService } from '../services/table-utils.service';

export class SortStore<T extends object> {
  private sort = signal<SortState<T>>({ field: null, direction: null });

  constructor(private utils: TableUtilsService) {}
  // retrieves the current sort state for a given field, returning null if the field is not currently sorted
  getSortState(field: keyof T): SortState<T> {
    const current = this.sort();
    return current.field === field ? current : { field: null, direction: null };
  }
  // toggles the sort state for a given field between ascending, descending, and unsorted when the user clicks on a sortable column header
  onSort(field: keyof T): void {
    this.sort.update(current => this.nextState(current, field));
  }
  // sorts the data array based on the current sort state, returning a new sorted array without mutating the original data
  sortData(data: T[]): T[] {
    const { field, direction } = this.sort();
    if (!field || !direction) return data;

    return [...data].sort((previous, next) =>
      this.utils.compareValues(previous[field], next[field], direction)
    );
  }
  //  determines the next sort state based on the current state and the field being sorted, implementing a toggle between ascending, descending, and unsorted states
  private nextState(current: SortState<T>, field: keyof T): SortState<T> {
    if (current.field !== field) return { field, direction: 'asc' };
    if (current.direction === 'asc') return { field, direction: 'desc' };
    return { field: null, direction: null };
  }
}