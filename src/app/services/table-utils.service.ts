import { Injectable } from '@angular/core';
import { TableColumn } from '../interfaces/data-table.interface';
import { SortDirection } from '../interfaces/sort.interface';

@Injectable({
  providedIn: 'root'
})
export class TableUtilsService {

  /**
   * Compares two values for sorting
   */
  compareValues(
    leftValue: unknown,
    rightValue: unknown,
    direction: SortDirection
  ): number {

    if (leftValue === rightValue) {
      return 0;
    }

    if (leftValue == null) {
      return -1;
    }

    if (rightValue == null) {
      return 1;
    }

    const comparisonResult =
      leftValue > rightValue
        ? 1
        : -1;

    return direction === 'asc'
      ? comparisonResult
      : -comparisonResult;
  }
}
