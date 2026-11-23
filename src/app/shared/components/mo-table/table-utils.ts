import {
  IColumns,
  TableFilters,
  TableScalar,
} from '../../models/components/columns';

export function normalizeText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('tr-TR');
}

export function readCell<T extends object>(
  row: T,
  column: IColumns<T>,
): unknown {
  return column.valueAccessor
    ? column.valueAccessor(row)
    : (row as Record<string, unknown>)[column.field];
}

/** Matches the local calendar day used by the date pipe, including datetime cells. */
export function calendarDay(value: unknown): string | null {
  if (value == null || value === '') return null;
  const date =
    value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return null;
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function isScalar(value: unknown): value is TableScalar {
  return (
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  );
}

export function filterRows<T extends object>(
  rows: readonly T[],
  columns: readonly IColumns<T>[],
  filters: TableFilters,
  excludeField?: string,
): T[] {
  const fields = new Map(columns.map((column) => [column.field, column]));
  return rows.filter((row) =>
    Object.entries(filters).every(([field, filter]) => {
      const column = fields.get(field);
      if (
        field === excludeField ||
        !column ||
        column.hideColumn ||
        column.type === 'button'
      )
        return true;
      const value = readCell(row, column);
      switch (column.filter) {
        case 'multiSelect':
          return Array.isArray(filter) && filter.includes(value);
        case 'dropDown':
          return Object.is(value, filter);
        case 'date':
          return calendarDay(value) === filter;
        default:
          return normalizeText(value).includes(normalizeText(filter));
      }
    }),
  );
}
