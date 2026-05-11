import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableColumn } from '../../interfaces/data-table.interface';
import { CellRendered } from '../../interfaces/cell-rendered.interface';
import { TableUtilsService } from '../../services/table-utils.service';

@Component({
  selector: 'app-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell-renderer.html',
  styleUrls: ['./cell-renderer.scss']
})
export class CellRendererComponent<T extends object> {

  @Input({ required: true }) row!: T;
  @Input({ required: true }) col!: TableColumn<T>;

  constructor(private utils: TableUtilsService) {}
  //getter for the cell value that handles rendering logic, including using the column's render function if provided, and providing fallbacks for null, undefined, or object values
  get value(): CellRendered {
    try {
      if (this.col.render) return this.col.render(this.row);

      const raw = this.row[this.col.field];

      if (raw === null || raw === undefined) return 'N/A';

      if (typeof raw === 'object') return 'N/A';

      return String(raw);

    } catch {
      return 'N/A';  
    }
  }
  // Type guard to check if a CellRendered value is an object with text and class properties
  isObject(value: CellRendered): value is { text: string; class: string } {
    return this.utils.isObject(value);
  }
}