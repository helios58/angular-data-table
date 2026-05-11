export interface TableColumn<T> {
  field: keyof T;    
  label: string;
}