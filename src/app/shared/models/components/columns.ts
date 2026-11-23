/** The data and action column contracts share presentation options, not row fields. */
export type TableCellType =
  'text' | 'date' | 'datetime' | 'time' | 'num0' | 'num2' | 'num5';
export type TableFilterType =
  'text' | 'numericText' | 'date' | 'dropDown' | 'multiSelect';
export type TableScalar = string | number | boolean;
export type TableFilterValue = TableScalar | readonly TableScalar[];
export type TableFilters = Readonly<Record<string, TableFilterValue>>;
export interface TableFilterOption {
  value: TableScalar;
  viewValue: string;
}

interface ColumnPresentation<T> {
  header: string;
  style?: string;
  align?: 'left' | 'center' | 'right';
  hideColumn?: boolean;
  sortable?: boolean;
  filter?: TableFilterType;
  opt?: readonly TableFilterOption[];
  valueAccessor?: (row: T) => unknown;
  sortAccessor?: (row: T) => string | number;
}

export interface TableDataColumn<T> extends ColumnPresentation<T> {
  field: Extract<keyof T, string>;
  type: TableCellType;
}

export interface TableActionColumn<T> extends ColumnPresentation<T> {
  field: string;
  type: 'button';
  icon: string;
  color?: 'primary' | 'accent' | 'warn';
  buttonLabel?: string;
  click(row: T): void;
  disabled?: boolean | ((row: T) => boolean);
}

export type TableColumn<T = Record<string, unknown>> =
  TableDataColumn<T> | TableActionColumn<T>;
/** Existing name retained for page and dialog compatibility. */
export type IColumns<T = Record<string, unknown>> = TableColumn<T>;

export interface TableQuery {
  pageIndex: number;
  pageSize: number;
  sort: { active: string; direction: 'asc' | 'desc' | '' };
  filters: TableFilters;
}
