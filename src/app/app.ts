import { Component, signal } from '@angular/core';
import { DataTableComponent } from './components/data-table/data-table';
import { TableColumn } from './interfaces/data-table.interface';
import { Car } from './interfaces/car.interface';
import { CARS_MOCK } from './data/cars-mock';
@Component({
  selector: 'app-root',
  imports: [DataTableComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  carColumns: TableColumn<Car>[] = [
    { field: 'name', label: 'Car Name' },
    { field: 'brand', label: 'brand' },
    { field: 'color', label: 'Color' },
    { field: 'year', label: 'Year' },
    { field: 'price', label: 'Price' },
    { field: 'available', label: 'Available'},
  ];

  cars: Car[] = CARS_MOCK;
  protected readonly title = signal('angular-data-table');
}
