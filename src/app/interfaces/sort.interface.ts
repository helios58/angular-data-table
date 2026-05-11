export type SortDirection = 'asc' | 'desc' | null;

export interface SortState<T> {
  field: keyof T | null;
  direction: SortDirection;
}

