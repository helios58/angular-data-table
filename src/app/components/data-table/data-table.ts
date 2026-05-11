import { Component, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CellRendererComponent } from '../cell-renderer/cell-renderer';
import { PaginationComponent } from '../pagination/pagination';
import { SortHeaderComponent } from '../sort-header/sort-header';
import { TableUtilsService } from '../../services/table-utils.service';
import { TableColumn } from '../../interfaces/data-table.interface';
import { SortState } from '../../interfaces/sort.interface';

import { SortStore } from '../../stores/sort.store';
import { PaginationStore } from '../../stores/pagination.store';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, CellRendererComponent, PaginationComponent, SortHeaderComponent],
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
  protected paginationStore = new PaginationStore();

  // sort data
  sortedData = computed(() => this.sortStore.sortData(this.data()));

  // paginate sorted data
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedData().length / this.paginationStore.pageSize()))
  );

  //data for current page
  paginatedData = computed(() => {
    const safePage = Math.min(this.paginationStore.page(), this.totalPages());
    const start = (safePage - 1) * this.paginationStore.pageSize();
    return this.sortedData().slice(start, start + this.paginationStore.pageSize());
  });

  // ui state
  isLoading  = computed(() => this.loading());
  isEmpty    = computed(() => !this.loading() && this.data().length === 0);
  showTable  = computed(() => !this.loading() && this.sortedData().length > 0);

  // pagination proxies (template bindings)
  protected get page()     { return this.paginationStore.page; }
  protected get pageSize() { return this.paginationStore.pageSize; }

  constructor(private utils: TableUtilsService) {
    this.sortStore = new SortStore<T>(utils);

    effect(() => this.paginationStore.clampPage(this.totalPages()));
  }

  onSort(field: keyof T): void           { this.sortStore.onSort(field); }
  getSortState(field: keyof T): SortState<T> { return this.sortStore.getSortState(field); }
  onPageChange(page: number): void       { this.paginationStore.onPageChange(page); }
  onPageSizeChange(size: number): void   { this.paginationStore.onPageSizeChange(size); }
}