import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatSort } from '@angular/material/sort';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectionList } from '@angular/material/list';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppConfig } from '../../../app.config';
import { IColumns, TableQuery } from '../../models/components/columns';
import { MoTableComponent } from './mo-table.component';
import { TableSelectFilterComponent } from './table-select-filter.component';

interface Row {
  Id: number;
  Name: string;
  Group: string;
  Age: number;
  When: string;
  Active: boolean;
}

describe('MoTableComponent', () => {
  let fixture: ComponentFixture<MoTableComponent<Row>>;
  let table: MoTableComponent<Row>;
  let action: jasmine.Spy;
  let rowClick: jasmine.Spy;
  let columns: IColumns<Row>[];
  const rows: Row[] = [
    {
      Id: 1,
      Name: 'Haber',
      Group: 'A',
      Age: 10,
      When: '2026-10-20T12:00:00',
      Active: true,
    },
    {
      Id: 2,
      Name: 'Duyuru',
      Group: 'B',
      Age: 2,
      When: '2026-10-21T14:00:00',
      Active: false,
    },
    {
      Id: 3,
      Name: 'Haber 2',
      Group: 'B',
      Age: 0,
      When: 'invalid',
      Active: true,
    },
  ];
  const type = (value: string, field = 'Name') =>
    table.textFilter(value, field);
  const names = () => table.dataSource.data.map((row) => row.Name);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoTableComponent],
      providers: [
        AppConfig,
        provideNoopAnimations(),
        provideNativeDateAdapter(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MoTableComponent<Row>);
    table = fixture.componentInstance;
    action = jasmine.createSpy('action');
    rowClick = jasmine.createSpy('rowClick');
    columns = [
      { field: 'Name', header: 'Başlık', type: 'text', filter: 'text' },
      { field: 'Group', header: 'Grup', type: 'text', filter: 'multiSelect' },
      { field: 'Age', header: 'Yaş', type: 'num0', filter: 'dropDown' },
      { field: 'When', header: 'Tarih', type: 'datetime', filter: 'date' },
      { field: 'Active', header: 'Aktif', type: 'text', filter: 'dropDown' },
      {
        field: 'Detail',
        header: 'Detay',
        type: 'button',
        icon: 'menu',
        color: 'primary',
        click: action,
      },
    ];
    fixture.componentRef.setInput('value', rows);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('showSorted', true);
    fixture.componentRef.setInput('pageSize', 2);
    table.rowClick.subscribe(rowClick);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.inject(OverlayContainer).getContainerElement().innerHTML = '';
  });

  it('renders a labelled raised action without firing the row action', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Detay"]',
    );
    expect(button.classList.contains('mat-mdc-raised-button')).toBeTrue();
    expect(button.querySelector('mat-icon').textContent.trim()).toBe('menu');
    button.click();
    expect(action).toHaveBeenCalledOnceWith(rows[0]);
    expect(rowClick).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.table-summary')).toBeNull();
  });

  it('disables actions by row', () => {
    fixture.componentRef.setInput(
      'columns',
      columns.map((column) =>
        column.type === 'button'
          ? { ...column, disabled: (row: Row) => row.Id === 1 }
          : column,
      ),
    );
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Detay"]',
    );
    expect(button.disabled).toBeTrue();
    button.click();
    expect(action).not.toHaveBeenCalled();
  });

  it('uses the same filtered and paged rows in mobile view and keeps state on desktop', fakeAsync(() => {
    table.isMobile = true;
    table.mobileFiltersOpen = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.mobile-single-action').length,
    ).toBe(2);
    expect(
      fixture.nativeElement.querySelector('.mobile-actions-trigger'),
    ).toBeNull();
    expect(table.renderedColumnIds).not.toContain('Detail');
    expect(table.renderedColumnIds).toContain(table.mobileActionsId);
    type('Duyuru');
    tick(300);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.mobile-single-action').length,
    ).toBe(1);
    expect(
      fixture.nativeElement
        .querySelector('td[data-label="Başlık"]')
        .textContent.trim(),
    ).toBe('Duyuru');
    table.isMobile = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(table.renderedColumnIds).toContain(table.mobileActionsId);
    expect(table.filterState['Name']).toBe('Duyuru');
    expect(
      fixture.nativeElement.querySelector('button[aria-label="Detay"]'),
    ).not.toBeNull();
  }));

  it('runs a mobile menu action once without firing the row action', fakeAsync(() => {
    fixture.componentRef.setInput('columns', [
      ...columns,
      {
        field: 'Other',
        header: 'Diğer',
        type: 'button',
        icon: 'edit',
        color: 'warn',
        click: action,
      },
    ]);
    table.isMobile = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.mobile-actions-trigger').click();
    fixture.detectChanges();
    tick();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    expect(overlay.querySelectorAll('.mobile-menu-action').length).toBe(2);
    expect(
      overlay
        .querySelectorAll('.mobile-menu-action')[1]
        .getAttribute('data-color'),
    ).toBe('warn');
    expect(
      (overlay.querySelector('.mobile-menu-actions') as HTMLElement).style
        .width,
    ).toBe(
      fixture.nativeElement.querySelector('.mobile-actions-trigger')
        .offsetWidth + 'px',
    );
    (overlay.querySelector('[mat-menu-item]') as HTMLButtonElement).click();
    fixture.detectChanges();
    tick();
    expect(action).toHaveBeenCalledOnceWith(rows[0]);
    expect(rowClick).not.toHaveBeenCalled();
  }));

  it('preserves disabled actions in the mobile menu', fakeAsync(() => {
    table.isMobile = true;
    fixture.componentRef.setInput('columns', [
      ...columns.map((column) =>
        column.type === 'button' ? { ...column, disabled: true } : column,
      ),
      {
        field: 'Other',
        header: 'Diğer',
        type: 'button',
        icon: 'edit',
        click: action,
      },
    ]);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.mobile-actions-trigger').click();
    fixture.detectChanges();
    tick();
    const disabled = TestBed.inject(OverlayContainer)
      .getContainerElement()
      .querySelector('[mat-menu-item]') as HTMLButtonElement;
    expect(disabled.disabled).toBeTrue();
    disabled.click();
    expect(action).not.toHaveBeenCalled();
  }));

  it('keeps one datasource and active filters across API refreshes', fakeAsync(() => {
    const source = table.dataSource;
    type('Haber');
    tick(300);
    fixture.componentRef.setInput('value', [
      ...rows,
      { ...rows[0], Id: 4, Name: 'Yeni Haber' },
    ]);
    fixture.detectChanges();
    expect(table.dataSource).toBe(source);
    expect(names()).toEqual(['Haber', 'Haber 2', 'Yeni Haber']);
    expect(table.textValues['Name']).toBe('Haber');
  }));

  it('cancels pending text filters when all filters are cleared', fakeAsync(() => {
    table.selectionFilter(['A'], 'Group');
    type('Haber');
    tick(100);
    table.clearAllFilters();
    tick(300);
    expect(table.filterState).toEqual({});
    expect(table.dataSource.data.length).toBe(3);
  }));

  it('allows the same text after clear-all', fakeAsync(() => {
    type('Haber');
    tick(300);
    table.clearAllFilters();
    type('Haber');
    tick(300);
    expect(names()).toEqual(['Haber', 'Haber 2']);
  }));

  it('keeps text changes made to different columns inside the same debounce window', fakeAsync(() => {
    fixture.componentRef.setInput(
      'columns',
      columns.map((column) =>
        column.field === 'Group' ? { ...column, filter: 'text' } : column,
      ),
    );
    fixture.detectChanges();
    type('Haber');
    tick(100);
    type('B', 'Group');
    tick(300);
    expect(table.filterState['Name']).toBe('Haber');
    expect(table.filterState['Group']).toBe('B');
    expect(names()).toEqual(['Haber 2']);
  }));

  it('shows and clears the empty state', fakeAsync(() => {
    type('bulunmayan');
    tick(300);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Kayıt bulunamadı');
    table.clearAllFilters();
    fixture.detectChanges();
    expect(table.dataSource.data.length).toBe(3);
    expect(fixture.nativeElement.querySelector('.no-data-cell')).toBeNull();
  }));

  it('keeps alternative options in a filtered column', () => {
    table.selectionFilter(['A'], 'Group');
    expect(
      table.dropDownOptionsMap['Group'].map((option) => option.value),
    ).toEqual(['A', 'B']);
  });

  it('applies other column filters when building options and preserves selected values', fakeAsync(() => {
    table.selectionFilter(['A'], 'Group');
    type('Duyuru');
    tick(300);
    expect(
      table.dropDownOptionsMap['Group'].map((option) => option.value),
    ).toEqual(['B', 'A']);
  }));

  it('supports numeric zero and boolean false as exact dropdown filters', () => {
    table.selectionFilter(0, 'Age');
    expect(table.dataSource.data[0].Id).toBe(3);
    expect(table.hasFilter('Age')).toBeTrue();
    table.clearAllFilters();
    table.selectionFilter(false, 'Active');
    expect(table.dataSource.data[0].Id).toBe(2);
  });

  it('keeps configured option labels', () => {
    fixture.componentRef.setInput(
      'columns',
      columns.map((column) =>
        column.field === 'Age'
          ? { ...column, opt: [{ value: 0, viewValue: 'Sıfır' }] }
          : column,
      ),
    );
    fixture.detectChanges();
    expect(table.dropDownOptionsMap['Age']).toEqual([
      { value: 0, viewValue: 'Sıfır' },
    ]);
  });

  it('restores hidden columns without changing parent order or input arrays', () => {
    const order = ['Name', 'Group'];
    fixture.componentRef.setInput('displayedColumns', order);
    fixture.componentRef.setInput(
      'columns',
      columns.map((column) => ({
        ...column,
        hideColumn: column.field === 'Group',
      })),
    );
    fixture.detectChanges();
    expect(table.visibleColumnIds).toEqual(['Name']);
    expect(order).toEqual(['Name', 'Group']);
    fixture.componentRef.setInput('columns', columns);
    fixture.detectChanges();
    expect(table.visibleColumnIds).toEqual(order);
  });

  it('derives column order automatically and does not retain hidden-column filters', () => {
    expect(table.visibleColumnIds).toEqual(
      columns.map((column) => column.field),
    );
    table.selectionFilter(['A'], 'Group');
    fixture.componentRef.setInput(
      'columns',
      columns.map((column) => ({
        ...column,
        hideColumn: column.field === 'Group',
      })),
    );
    fixture.detectChanges();
    expect(table.hasFilter('Group')).toBeFalse();
    expect(table.dataSource.data.length).toBe(3);
  });

  it('filters datetime columns by the same calendar day shown to the user', () => {
    table.dateFilter(new Date(2026, 9, 20), 'When');
    expect(names()).toEqual(['Haber']);
    table.clearFilter('When');
    expect(table.dateValues['When']).toBeUndefined();
    expect(table.dataSource.data.length).toBe(3);
  });

  it('uses Turkish casing in text searches', fakeAsync(() => {
    fixture.componentRef.setInput('value', [{ ...rows[0], Name: 'İÇMELER' }]);
    fixture.detectChanges();
    type('içmeler');
    tick(300);
    expect(table.dataSource.data.length).toBe(1);
  }));

  it('resets pagination on filtering and preserves numeric sort after refresh', fakeAsync(() => {
    const sort = fixture.debugElement
      .query(By.directive(MatSort))
      .injector.get(MatSort);
    sort.sort({ id: 'Age', start: 'asc', disableClear: false });
    fixture.detectChanges();
    tick();
    expect(
      fixture.nativeElement.querySelector('tr.mat-mdc-row').textContent,
    ).toContain('Haber 2');
    table.paginator.nextPage();
    fixture.detectChanges();
    tick();
    type('Haber');
    tick(300);
    fixture.detectChanges();
    tick();
    expect(table.paginator.pageIndex).toBe(0);
    fixture.componentRef.setInput('value', [...rows]);
    fixture.detectChanges();
    tick();
    expect(
      fixture.nativeElement.querySelector('tr.mat-mdc-row').textContent,
    ).toContain('Haber 2');
  }));

  it('can turn pagination off and back on without recreating the datasource', () => {
    const source = table.dataSource;
    fixture.componentRef.setInput('showPaginator', false);
    fixture.detectChanges();
    expect(source.paginator).toBeNull();
    fixture.componentRef.setInput('showPaginator', true);
    fixture.detectChanges();
    expect(source.paginator).toBe(table.paginator);
  });

  it('accepts empty asynchronous inputs and exposes a loading state', () => {
    fixture.componentRef.setInput('value', null);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(table.dataSource.data).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Kayıtlar yükleniyor');
  });

  it('emits server queries without filtering or paginating the received page locally', () => {
    fixture.componentRef.setInput('mode', 'server');
    fixture.componentRef.setInput('totalRecords', 80);
    fixture.detectChanges();
    const queries: TableQuery[] = [];
    table.stateChange.subscribe((query) => queries.push(query));
    table.selectionFilter(['A'], 'Group');
    expect(table.dataSource.data.length).toBe(3);
    expect(table.dataSource.paginator).toBeNull();
    expect(table.paginator.length).toBe(80);
    expect(queries.length).toBe(1);
    expect(queries[0].filters).toEqual({ Group: ['A'] });
    table.pageChanged({ pageIndex: 2, pageSize: 10, length: 80 });
    expect(queries[1].pageIndex).toBe(2);
    expect(queries[1].pageSize).toBe(10);
    (queries[0].filters['Group'] as string[]).push('B');
    expect(table.filterState['Group']).toEqual(['A']);
  });

  it('keeps multi-select drafts separate until Apply and cancels on Escape', fakeAsync(() => {
    const filter = fixture.debugElement
      .queryAll(By.directive(TableSelectFilterComponent))
      .map((item) => item.componentInstance as TableSelectFilterComponent)
      .find((item) => item.label === 'Grup');
    filter.show();
    fixture.detectChanges();
    tick();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    expect(
      Array.from(overlay.querySelectorAll('footer button')).map((button) =>
        button.textContent.trim(),
      ),
    ).toEqual(['Temizle', 'Uygula']);
    const option = overlay.querySelector('mat-list-option') as HTMLElement;
    option.click();
    fixture.detectChanges();
    expect(filter.draft).toEqual(['A']);
    expect(table.filterState).toEqual({});
    filter.onOverlayKey(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    filter.show();
    fixture.detectChanges();
    tick();
    expect(filter.draft).toEqual([]);
    filter.draft = ['A'];
    filter.apply();
    fixture.detectChanges();
    expect(names()).toEqual(['Haber']);
  }));
});
