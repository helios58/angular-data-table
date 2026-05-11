export interface TableColumn<T> {
  field: keyof T;    
  label: string;
  render?: (row: T) => string | { text: string; class: string };
}