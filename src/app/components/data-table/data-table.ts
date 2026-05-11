import {
  Component,
  input,
  computed,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { TableColumn } from '../../interfaces/data-table.interface';


@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss']
})
export class DataTableComponent<T extends object> {

  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);
  title = input<string>('');
  loading = input<boolean>(false);

  emptyMessage = input<string>(
    'No data to display.'
  );


  hasData = computed(() =>
    this.data().length > 0
  );

  isLoading = computed(() =>
    this.loading()
  );

  isEmpty = computed(() =>
    !this.loading() &&
    !this.hasData()
  );

  showTable = computed(() =>
    !this.loading()
  );
}