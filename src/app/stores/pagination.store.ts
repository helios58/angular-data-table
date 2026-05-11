import { signal, computed, Signal } from '@angular/core';

export class PaginationStore {
  page = signal(1);
  pageSize = signal(10);

  totalPages(totalItems: Signal<number>) {
    return computed(() =>
      Math.max(1, Math.ceil(totalItems() / this.pageSize()))
    );
  }

  paginate<T>(data: Signal<T[]>, totalPages: Signal<number>): Signal<T[]> {
    return computed(() => {
      const safePage = Math.min(this.page(), totalPages());
      const start = (safePage - 1) * this.pageSize();
      return data().slice(start, start + this.pageSize());
    });
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  clampPage(totalPages: number): void {
    if (this.page() > totalPages) {
      this.page.set(totalPages);
    }
  }
}