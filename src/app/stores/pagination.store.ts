import { signal, computed, Signal } from '@angular/core';

export class PaginationStore {
  page     = signal(1);
  pageSize = signal(10);
  // computes total pages based on total items and current page size
  totalPages(totalItems: Signal<number>) {
    return computed(() =>
      Math.max(1, Math.ceil(totalItems() / this.pageSize()))
    );
  }
  // returns a signal of the paginated data based on the current page and page size
  paginate<T>(data: Signal<T[]>, totalPages: Signal<number>): Signal<T[]> {
    return computed(() => {
      const safePage = Math.min(this.page(), totalPages());
      const start    = (safePage - 1) * this.pageSize();
      return data().slice(start, start + this.pageSize());
    });
  }
  // updates the current page, ensuring it's within valid bounds
  onPageChange(page: number): void {
    this.page.set(page);
  }
  // updates the page size and resets to the first page to avoid out-of-range issues
  onPageSizeChange(size: number): void {
    const safeSize = Math.max(1, size);  
    this.pageSize.set(safeSize);
    this.page.set(1);
  }
  // ensures the current page is not greater than total pages after data changes
  clampPage(totalPages: number): void {
    if (this.page() > totalPages) {
      this.page.set(totalPages);
    }
  }
}