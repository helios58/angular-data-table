import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortDirection } from '../../interfaces/sort.interface';

@Component({
  selector: 'app-sort-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-header.html',
  styleUrls: ['./sort-header.scss']
})
export class SortHeaderComponent {
  @Input() label = '';
  @Input() active = false;
  @Input() direction: SortDirection = 'asc'; 

  @Output() sort = new EventEmitter<void>();

  readonly icons = {
    asc: '/icons/asc.svg',
    desc: '/icons/desc.svg',
  };

  get icon(): string {
    return this.direction === 'desc'
      ? this.icons.desc
      : this.icons.asc;
  }

  onClick(): void {
    this.sort.emit();
  }
}