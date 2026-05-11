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

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get startItem(): number {
    if (!this.totalItems) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.totalItems, this.currentPage * this.pageSize);
  }

  goToPage(page: number): void {
    const validPage = Math.min(this.totalPages, Math.max(1, page));
    if (validPage !== this.currentPage) {
      this.pageChange.emit(validPage);
    }
  }

  onPageSizeChange(value: string): void {
    const pageSize = Number(value);
    if (pageSize && pageSize !== this.pageSize) {
      this.pageSizeChange.emit(pageSize);
    }
  }
}
