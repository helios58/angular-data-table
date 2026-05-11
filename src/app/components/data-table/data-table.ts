import { Component, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CellRendererComponent } from '../cell-renderer/cell-renderer';
import { PaginationComponent } from '../pagination/pagination';
import { SortHeaderComponent } from '../sort-header/sort-header';
import { InputSearchComponent } from '../input-search/input-search';
import { TableUtilsService } from '../../services/table-utils.service';
import { TableColumn } from '../../interfaces/data-table.interface';
import { SortState } from '../../interfaces/sort.interface';

import { SortStore } from '../../stores/sort.store';
import { PaginationStore } from '../../stores/pagination.store';
import { SearchStore } from '../../stores/search.store';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, CellRendererComponent, PaginationComponent, SortHeaderComponent, InputSearchComponent],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss']
})
export class DataTableComponent<T extends object> {
  // inputs
  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);
  title = input<string>('');
  loading = input<boolean>(false);
  emptyMessage = input<string>('No data to display.');

  // stores
  protected sortStore: SortStore<T>;
  protected paginationStore: PaginationStore;
  protected searchStore: SearchStore<T>;

  constructor(private utils: TableUtilsService) {
    this.sortStore = new SortStore<T>(utils);
    this.paginationStore = new PaginationStore();
    this.searchStore = new SearchStore<T>(utils);

    effect(() => this.paginationStore.clampPage(this.totalPages()));
  }

  // chain: data → filtered → sorted → paginated
  filteredData = computed(() =>
    this.searchStore.filterData(this.data(), this.columns())
  );

  // sorting is applied to the filtered data, so pagination reflects the current search results
  sortedData = computed(() =>
    this.sortStore.sortData(this.filteredData()) 
  );

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedData().length / this.paginationStore.pageSize()))
  );

  paginatedData = computed(() => {
    const safePage = Math.min(this.paginationStore.page(), this.totalPages());
    const start = (safePage - 1) * this.paginationStore.pageSize();
    return this.sortedData().slice(start, start + this.paginationStore.pageSize());
  });

  // ui state
  isLoading = computed(() => this.loading());
  isEmpty = computed(() => !this.loading() && this.data().length === 0);
  showTable = computed(() => !this.loading() && this.data().length > 0);
  noResults = computed(() => !this.loading() && this.data().length > 0 && this.sortedData().length === 0);

  // template bindings
  protected get page() { return this.paginationStore.page; }
  protected get pageSize() { return this.paginationStore.pageSize; }
  protected get searchTerm() { return this.searchStore.searchTerm; }

  // search resets to page 1 to avoid empty page after filtering
  protected onSearchChange(term: string): void {
    this.searchStore.onSearchChange(term);
    this.paginationStore.onPageChange(1);
  }
  //event handlers for sorting and pagination
  onSort(field: keyof T): void { this.sortStore.onSort(field); }
  getSortState(field: keyof T): SortState<T> { return this.sortStore.getSortState(field); }
  onPageChange(page: number): void { this.paginationStore.onPageChange(page); }
  onPageSizeChange(size: number): void { this.paginationStore.onPageSizeChange(size); }
}