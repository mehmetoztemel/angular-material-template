import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AppConfig } from '../../../app.config';
import {
  IColumns,
  TableActionColumn,
  TableFilterOption,
  TableFilterValue,
  TableQuery,
} from '../../models/components/columns';
import { calendarDay, filterRows, isScalar, readCell } from './table-utils';
import { TableSelectFilterComponent } from './table-select-filter.component';

@Component({
  selector: 'mo-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    TableSelectFilterComponent,
  ],
  templateUrl: './mo-table.component.html',
  styleUrl: './mo-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MoTableComponent<T extends object = Record<string, unknown>>
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() value: readonly T[] = [];
  @Input() columns: readonly IColumns<T>[] = [];
  /** Optional ordering/subset. Visibility is always calculated by the table. */
  @Input() displayedColumns: readonly string[] = [];
  @Input() isFiltered = true;
  @Input() showPaginator = true;
  @Input() showSorted = false;
  @Input() isNewActive = false;
  @Input() mode: 'client' | 'server' = 'client';
  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 50, 100];
  @Input() loading = false;
  @Output() onFilter = new EventEmitter<T[]>();
  @Output() onNewClick = new EventEmitter<void>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() stateChange = new EventEmitter<TableQuery>();

  readonly dataSource = new MatTableDataSource<T>([]);
  visibleColumnIds: string[] = [];
  filterState: Record<string, TableFilterValue> = {};
  textValues: Record<string, string> = {};
  dateValues: Record<string, Date | null> = {};
  dropDownOptionsMap: Record<string, TableFilterOption[]> = {};
  currentPageIndex = 0;
  currentPageSize = 10;
  isMobile = false;
  mobileFiltersOpen = false;
  actionMenuWidth = 0;
  prepareActionMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.actionMenuWidth = (
      event.currentTarget as HTMLButtonElement
    ).offsetWidth;
  }
  get visibleColumns(): IColumns<T>[] {
    return this.visibleColumnIds.map((field) =>
      this.columns.find((column) => column.field === field)!,
    );
  }
  get actionColumns(): TableActionColumn<T>[] {
    return this.visibleColumns.filter(
      (column): column is TableActionColumn<T> => column.type === 'button',
    );
  }
  get filterColumns(): IColumns<T>[] {
    return this.visibleColumns.filter(
      (column) => column.type !== 'button' && !!column.filter,
    );
  }
  get sortableColumns(): IColumns<T>[] {
    return this.visibleColumns.filter(
      (column) => column.type !== 'button' && column.sortable !== false,
    );
  }
  get mobileActionsId(): string {
    let field = '__mobileActions';
    while (this.columns.some((column) => column.field === field)) field += '_';
    return field;
  }
  get renderedColumnIds(): string[] {
    return [
      ...this.visibleColumns
        .filter((column) => column.type !== 'button')
        .map((column) => column.field),
      ...(this.actionColumns.length ? [this.mobileActionsId] : []),
    ];
  }
  get mobileSortValue(): string {
    return this.currentSort.direction
      ? `${this.currentSort.active}:${this.currentSort.direction}`
      : '';
  }
  mobileSortChanged(value: string): void {
    const split = value.lastIndexOf(':');
    const sort: Sort = value
      ? {
          active: value.slice(0, split),
          direction: value.slice(split + 1) as 'asc' | 'desc',
        }
      : { active: '', direction: '' };
    if (this.sortRef) {
      this.sortRef.active = sort.active;
      this.sortRef.direction = sort.direction;
      this.sortRef.sortChange.emit(sort);
    }
  }
  private currentSort: Sort = { active: '', direction: '' };
  private paginatorRef?: MatPaginator;
  private sortRef?: MatSort;
  private readonly pendingText = new Map<string, string>();
  private readonly textChanges = new Subject<void>();
  private readonly destroy$ = new Subject<void>();
  private readonly collator = new Intl.Collator('tr', {
    numeric: true,
    sensitivity: 'base',
  });

  @ViewChild(MatPaginator) set paginator(value: MatPaginator | undefined) {
    this.paginatorRef = value;
    this.attachControls();
  }
  get paginator(): MatPaginator | undefined {
    return this.paginatorRef;
  }
  @ViewChild(MatSort) set sort(value: MatSort | undefined) {
    this.sortRef = value;
    this.attachControls();
  }

  constructor(
    public appConfig: AppConfig,
    private readonly breakpoints: BreakpointObserver,
  ) {
    this.dataSource.sortData = (rows, sort) => this.sortRows(rows, sort);
  }

  ngOnInit(): void {
    this.breakpoints
      .observe('(max-width: 600px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => (this.isMobile = state.matches));
    this.textChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.pendingText.size) return;
        for (const [field, value] of this.pendingText)
          this.setFilter(field, value.trim() || null);
        this.pendingText.clear();
        this.commitFilters();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) this.currentPageSize = this.pageSize;
    const columns = this.columns ?? [];
    const available = new Map(columns.map((column) => [column.field, column]));
    const requested = this.displayedColumns?.length
      ? this.displayedColumns
      : columns.map((column) => column.field);
    this.visibleColumnIds = [...new Set(requested)].filter(
      (field) => available.has(field) && !available.get(field).hideColumn,
    );
    // Drop only filters whose column/filter contract actually changed.
    const previous = (changes['columns']?.previousValue ??
      []) as readonly IColumns<T>[];
    for (const field of new Set([
      ...Object.keys(this.filterState),
      ...Object.keys(this.textValues),
    ])) {
      const column = available.get(field);
      const old = previous.find((item) => item.field === field);
      if (
        !this.isFiltered ||
        !this.visibleColumnIds.includes(field) ||
        !column?.filter ||
        (old && old.filter !== column.filter)
      ) {
        this.clearFieldState(field);
      }
    }
    if (
      !this.showSorted ||
      !this.visibleColumnIds.includes(this.currentSort.active)
    ) {
      this.currentSort = { active: '', direction: '' };
      if (this.sortRef) {
        this.sortRef.active = '';
        this.sortRef.direction = '';
      }
    }
    this.refreshRows();
    this.attachControls();
  }

  ngAfterViewInit(): void {
    this.attachControls();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.textChanges.complete();
    this.dataSource.disconnect();
  }
  onNew(): void {
    this.onNewClick.emit();
  }

  private attachControls(): void {
    this.dataSource.sort =
      this.mode === 'client' && this.showSorted ? (this.sortRef ?? null) : null;
    this.dataSource.paginator =
      this.mode === 'client' && this.showPaginator
        ? (this.paginatorRef ?? null)
        : null;
  }

  private get source(): readonly T[] {
    return this.value ?? [];
  }
  private refreshRows(): void {
    const rows =
      this.mode === 'server'
        ? [...this.source]
        : filterRows(this.source, this.columns ?? [], this.filterState);
    if (this.mode === 'client') {
      this.currentPageIndex = Math.min(
        this.currentPageIndex,
        Math.max(0, Math.ceil(rows.length / this.currentPageSize) - 1),
      );
      if (this.paginatorRef)
        this.paginatorRef.pageIndex = this.currentPageIndex;
    }
    this.dataSource.data = rows;
    this.updateDropdownOptions();
  }
  private setFilter(field: string, value: TableFilterValue | null): void {
    const next = { ...this.filterState };
    if (
      value === null ||
      value === '' ||
      (Array.isArray(value) && !value.length)
    )
      delete next[field];
    else next[field] = Array.isArray(value) ? [...value] : value;
    this.filterState = next;
  }
  private clearFieldState(field: string): void {
    this.setFilter(field, null);
    this.pendingText.delete(field);
    delete this.textValues[field];
    delete this.dateValues[field];
  }
  private commitFilters(): void {
    this.currentPageIndex = 0;
    // Assign directly: firstPage() would emit a second server request.
    if (this.paginatorRef) this.paginatorRef.pageIndex = 0;
    this.refreshRows();
    if (this.mode === 'client') this.onFilter.emit([...this.dataSource.data]);
    this.emitQuery();
  }

  textFilter(value: string, field: string): void {
    this.textValues[field] = value;
    this.pendingText.set(field, value);
    this.textChanges.next();
  }
  dateFilter(value: Date | null, field: string): void {
    this.dateValues[field] = value;
    this.setFilter(field, calendarDay(value));
    this.commitFilters();
  }
  selectionFilter(value: TableFilterValue | null, field: string): void {
    this.setFilter(field, value);
    this.commitFilters();
  }
  clearFilter(field: string): void {
    this.clearFieldState(field);
    this.commitFilters();
  }
  clearAllFilters(): void {
    this.pendingText.clear();
    this.filterState = {};
    this.textValues = {};
    this.dateValues = {};
    this.commitFilters();
  }
  getActiveFilterCount(): number {
    return Object.keys(this.filterState).length;
  }

  updateDropdownOptions(): void {
    const options: Record<string, TableFilterOption[]> = {};
    for (const column of this.columns ?? []) {
      if (
        !this.visibleColumnIds.includes(column.field) ||
        !['dropDown', 'multiSelect'].includes(column.filter)
      )
        continue;
      const candidates =
        this.mode === 'server'
          ? this.source
          : filterRows(
              this.source,
              this.columns,
              this.filterState,
              column.field,
            );
      const selected = this.filterState[column.field];
      const selectedValues = Array.isArray(selected)
        ? selected
        : isScalar(selected)
          ? [selected]
          : [];
      const values = [
        ...candidates.map((row) => readCell(row, column)),
        ...selectedValues,
      ].filter(isScalar);
      const all = column.opt?.length
        ? [...column.opt]
        : [...new Set(values)]
            .filter((value) => value !== '')
            .map((value) => ({ value, viewValue: String(value) }));
      options[column.field] = all;
    }
    this.dropDownOptionsMap = options;
  }
  hasFilter(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.filterState, field);
  }

  sortChanged(sort: Sort): void {
    this.currentSort = { ...sort };
    this.currentPageIndex = 0;
    if (this.paginatorRef) this.paginatorRef.pageIndex = 0;
    this.emitQuery();
  }
  pageChanged(event: PageEvent): void {
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.emitQuery();
  }
  private emitQuery(): void {
    const filters: Record<string, TableFilterValue> = {};
    for (const [field, value] of Object.entries(this.filterState))
      filters[field] = Array.isArray(value) ? [...value] : value;
    this.stateChange.emit({
      pageIndex: this.currentPageIndex,
      pageSize: this.currentPageSize,
      sort: { ...this.currentSort },
      filters,
    });
  }

  textValue(row: T, column: IColumns<T>): string {
    return String(readCell(row, column) ?? '');
  }
  numberValue(row: T, column: IColumns<T>): number | null {
    const value = readCell(row, column);
    if (value == null || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  dateValue(row: T, column: IColumns<T>): Date | string | number | null {
    const value = readCell(row, column);
    return calendarDay(value) ? (value as Date | string | number) : null;
  }
  actionDisabled(column: TableActionColumn<T>, row: T): boolean {
    return typeof column.disabled === 'function'
      ? column.disabled(row)
      : !!column.disabled;
  }
  runAction(event: MouseEvent, column: TableActionColumn<T>, row: T): void {
    event.stopPropagation();
    if (!this.actionDisabled(column, row)) column.click(row);
  }
  private sortRows(rows: T[], sort: Sort): T[] {
    const column = (this.columns ?? []).find(
      (item) => item.field === sort.active,
    );
    if (
      !sort.direction ||
      !column ||
      column.type === 'button' ||
      column.sortable === false
    )
      return rows;
    const value = (row: T): unknown => {
      if (column.sortAccessor) return column.sortAccessor(row);
      const raw = readCell(row, column);
      if (column.type === 'date' || column.type === 'datetime')
        return calendarDay(raw)
          ? new Date(raw as string | number).getTime()
          : null;
      if (column.type.startsWith('num')) return this.numberValue(row, column);
      return raw;
    };
    return [...rows].sort((a, b) => {
      const left = value(a),
        right = value(b);
      if (left == null) return right == null ? 0 : 1;
      if (right == null) return -1;
      const compared =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : this.collator.compare(String(left), String(right));
      return compared * (sort.direction === 'asc' ? 1 : -1);
    });
  }
}
