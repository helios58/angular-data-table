import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableColumn } from '../../interfaces/data-table.interface';
import { CellRendered } from '../../interfaces/cell-rendered.interface';

@Component({
  selector: 'app-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell-renderer.html',
  styleUrls: ['./cell-renderer.scss']
})
export class CellRendererComponent<T extends object> {

  @Input({ required: true })
  row!: T;

  @Input({ required: true })
  col!: TableColumn<T>;

  get value(): CellRendered {

    if (this.col.render) {
      return this.col.render(this.row);
    }

    return String(
      this.row[this.col.field] ?? '—'
    );
  }

  isObject(
    value: CellRendered
  ): value is { text: string; class: string } {

    return (
      typeof value === 'object' &&
      value !== null &&
      'text' in value &&
      'class' in value
    );
  }
}