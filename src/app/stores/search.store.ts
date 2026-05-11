import { signal } from '@angular/core';
import { TableColumn } from '../interfaces/data-table.interface';
import { TableUtilsService } from '../services/table-utils.service';

export class SearchStore<T extends object> {
  searchTerm = signal('');

  constructor(private utils: TableUtilsService) {}
 // filters the data array based on the current search term and the specified columns, returning only rows that match the search criteria
  filterData(data: T[], columns: TableColumn<T>[]): T[] {
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return data;

    return data.filter(row =>
      columns.some(column => {
        const value = this.utils.getSearchValue(row, column);
        return value.toLowerCase().includes(term);
      })
    );
  }
  // updates the search term signal with the new value, triggering reactive updates to any computed properties that depend on it
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
  // resets the search term to an empty string, effectively clearing the search filter
  reset(): void {
    this.searchTerm.set('');
  }
}