import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IColumns } from '../../models/components/columns';
import { IDropdownOption } from '../../models/components/dropdownOption';
import { ColumnType } from '../../models/components/enums/columnTypeEnum';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-custom-table',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatOptionModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  providers: [],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomTableComponent implements OnInit, OnDestroy {

  dropdownOptions: IDropdownOption[] = [];
  @Input() value: any[];
  @Input() columns: IColumns[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() isFiltered: boolean = true;
  @Input() showPaginator: boolean = true;
  @Input() showSorted: boolean = false;
  @Input() isNewActive: boolean = false;
  dataSource: MatTableDataSource<any>;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() dateInput: EventEmitter<MatDatepickerInputEvent<any>>
  @Output() onNewClick: EventEmitter<any> = new EventEmitter();
  dropDownOptionsMap: { [key: string]: IDropdownOption[] } = {};
  private dropDownOptionsMapOriginal: { [key: string]: IDropdownOption[] } = {};
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren(MatSelect) matSelects!: QueryList<MatSelect>;
  @ViewChildren('inpt') dateInputs!: QueryList<ElementRef<HTMLInputElement>>;
  filterState: { [key: string]: any } = {};
  private filterDebounce = new Subject<{ value: string, field: string }>();
  private destroy$ = new Subject<void>();

  constructor(
    public appConfig: AppConfig, 
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
  }
  
  ngOnInit(): void {
    this.setData();
    
    // Text filter debounce setup
    this.filterDebounce.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        prev.value === curr.value && prev.field === curr.field
      )
    ).subscribe(({ value, field }) => {
      if (value && value.trim()) {
        this.filterState[field] = value.trim().toLowerCase();
      } else {
        delete this.filterState[field];
      }
      this.applyFilters();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.filterDebounce.complete();
  }

  ngOnChanges() {
    this.setData();
  }

  onNew() {
    this.onNewClick.emit();
  }

  ngAfterViewInit() {
    if (this.showPaginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  setData(source?: any[], skipDropdownUpdate: boolean = false) {
    if (source == null) {
      this.dataSource = new MatTableDataSource(this.value);
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataSource = new MatTableDataSource(source);
      this.dataSource.sort = this.sort;
    }
    
    // Dropdown options'ı sadece gerektiğinde güncelle
    if (!skipDropdownUpdate) {
      this.updateDropdownOptions();
    }
    
    this.dataSource.paginator = this.paginator;
  }

  updateDropdownOptions() {
    if (this.columns != null) {
      this.columns.forEach(column => {
        if (column.filter === ColumnType.dropDown || column.filter === ColumnType.multiSelect) {
          let dropdownOptions: IDropdownOption[] = [];
          if (column.opt?.length > 0) {
            dropdownOptions = column.opt
              .filter(opt => this.dataSource.data.some((x: any) => x[column.field] === opt.value))
              .map(opt => ({
                viewValue: opt.value,
                value: opt.value
              }));
          }
          else {
            const uniqueValues = Array.from(
              new Set(this.dataSource.data.map((x: any) => x[column.field]))
            ).filter(value => value != null && value !== "");
            dropdownOptions = uniqueValues.map(option => ({
              viewValue: option,
              value: option
            }));
          }
          this.dropDownOptionsMap[column.field] = dropdownOptions;
          this.dropDownOptionsMapOriginal[column.field] = [...dropdownOptions];
        }
      });
    }
  }

  textFilter(event: Event, colName: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterDebounce.next({ value: filterValue, field: colName });
  }

  dateFilter(event: Date | null, colName: string) {
    if (event) {
      const filterValue = this.datePipe.transform(event, 'yyyy-MM-dd');
      if (filterValue) {
        this.filterState[colName] = filterValue;
      }
    } else {
      delete this.filterState[colName];
    }
    this.applyFilters();
  }

  clearDateFilter(input: HTMLInputElement, picker: MatDatepicker<any>, colName: string) {
    picker.select(null);
    input.value = '';
    delete this.filterState[colName];
    this.applyFilters();
  }

  dropDownFilterColumns(selectedValue: any, colName: string) {
    if (selectedValue !== '') {
      this.filterState[colName] = selectedValue;
    } else {
      delete this.filterState[colName];
    }
    this.applyFilters();
  }

  multiSelectFilterColumns(selectedValues: string[], colName: string) {
    if (selectedValues.length > 0) {
      this.filterState[colName] = selectedValues;
    }
    else {
      delete this.filterState[colName];
    }
  }

  applyFilters(matSelect?: MatSelect) {
    let filteredData = [...this.value];

    for (const colName in this.filterState) {
      const filterValue = this.filterState[colName];
      const column = this.columns.find(col => col.field === colName);
      
      if (Array.isArray(filterValue)) {
        // Çoklu seçim filtresi
        filteredData = filteredData.filter((item: any) => 
          filterValue.includes(item[colName])
        );
      } else if (column?.type === ColumnType.date) {
        // Tarih filtresi - daha güvenilir
        filteredData = filteredData.filter((item: any) => {
          const itemDate = this.datePipe.transform(item[colName], 'yyyy-MM-dd');
          return itemDate === filterValue;
        });
      } else {
        // Text veya dropdown filtresi
        filteredData = filteredData.filter((item: any) => {
          const itemValue = item[colName]?.toString().toLowerCase() || '';
          return itemValue.includes(filterValue.toLowerCase());
        });
      }
    }
    
    matSelect?.close();
    // Datayı güncelle VE dropdown seçeneklerini filtrelenmiş dataya göre yeniden hesapla
    this.setData(filteredData, false);
    this.onFilter.emit(filteredData);
  }
  clearDropDownSelection(matSelect: MatSelect, colName: string) {
    if (Array.isArray(matSelect.value)) {
      matSelect.value = [];
    }
    else {
      matSelect.value = null;
    }
    delete this.filterState[colName];
    this.applyFilters(matSelect);
  }

  dropDownSearch(event: Event, col: IColumns) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const originalOptions = this.dropDownOptionsMapOriginal[col.field] || [];
    
    if (filterValue.trim()) {
      this.dropDownOptionsMap[col.field] = originalOptions.filter(option => {
        const viewValue = option.viewValue ? option.viewValue.toString().toLowerCase() : '';
        return viewValue.includes(filterValue);
      });
    } else {
      this.dropDownOptionsMap[col.field] = [...originalOptions];
    }
  }
  
  clearAllFilters() {
    // Filter state'i temizle
    this.filterState = {};
    
    // Tüm mat-select'leri temizle
    if (this.matSelects) {
      this.matSelects.forEach(select => {
        select.value = Array.isArray(select.value) ? [] : null;
      });
    }
    
    // Tüm text inputları temizle (DOM'dan direkt erişerek - çok hızlı)
    const textInputs = document.querySelectorAll('.filterElement[type="text"]') as NodeListOf<HTMLInputElement>;
    textInputs.forEach(input => {
      input.value = '';
    });
    
    // Tüm date inputları temizle
    if (this.dateInputs) {
      this.dateInputs.forEach(input => {
        input.nativeElement.value = '';
      });
    }
    
    // Direkt dataSource'u güncelle (setData çağırmadan - en hızlı yöntem)
    this.dataSource.data = this.value;
    
    // Dropdown seçeneklerini tüm dataya göre yeniden hesapla
    this.updateDropdownOptions();
    
    // Change detection'u tetikle
    this.cdr.detectChanges();
    
    this.onFilter.emit(this.value);
  }
  
  getActiveFilterCount(): number {
    return Object.keys(this.filterState).length;
  }
}