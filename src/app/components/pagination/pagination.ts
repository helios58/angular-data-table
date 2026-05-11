import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss']
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() itemsPerPageOptions: number[] = [10, 25, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  // getters for total pages and current item range
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }
  // gets the index of the first item on the current page (1-based)
  get startItem(): number {
    if (!this.totalItems) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  // gets the index of the last item on the current page
  get endItem(): number {
    return Math.min(this.totalItems, this.currentPage * this.pageSize);
  }
  // navigates to a specific page, ensuring it's within valid bounds
  goToPage(page: number): void {
    const validPage = Math.min(this.totalPages, Math.max(1, page));
    if (validPage !== this.currentPage) {
      this.pageChange.emit(validPage);
    }
  }
  // changes the page size and resets to the first page to avoid out-of-range issues
  onPageSizeChange(value: string): void {
    const pageSize = Number(value);
    if (pageSize && pageSize !== this.pageSize) {
      this.pageSizeChange.emit(pageSize);
    }
  }
}
