  import { Component, Input, Output, EventEmitter } from '@angular/core';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-input-search',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input-search.html',
    styleUrls: ['./input-search.scss']
  })
  export class InputSearchComponent {
    @Input() placeholder = 'Search...';
    @Input() value = '';

    @Output() searchChange = new EventEmitter<string>();
    // Emits the new search term whenever the input value changes
    onInputChange(event: Event): void {
      const target = event.target as HTMLInputElement;
      this.value = target.value;
      this.searchChange.emit(this.value);
    }
    // Clears the search input and emits an empty string to reset the search
    clearSearch(): void {
      this.value = '';
      this.searchChange.emit('');
    }
  }
