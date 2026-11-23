import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MoTableComponent } from '../../shared/components/mo-table/mo-table.component';
import { MoDialogComponent } from '../../shared/components/mo-dialog/mo-dialog.component';
import { IColumns } from '../../shared/models/components/columns';
import { DEMO_PAGES, DemoPage, DemoRow } from './demo-data';
import { DemoDetailComponent, DemoDetailData } from './demo-detail.component';

@Component({
  selector: 'app-demo-data',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, MoTableComponent],
  templateUrl: './demo-data.component.html',
  styleUrl: './demo-data.component.scss',
})
export class DemoDataComponent {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  page: DemoPage = DEMO_PAGES['products'];
  columns: IColumns<DemoRow>[] = [];
  displayedColumns: string[] = [];

  constructor() {
    inject(ActivatedRoute)
      .data.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.page = DEMO_PAGES[data['demoPage']] ?? DEMO_PAGES['products'];
        this.columns = [
          ...this.page.columns,
          {
            field: 'details',
            header: 'Detay',
            type: 'button',
            icon: 'visibility',
            color: 'primary',
            buttonLabel: 'İncele',
            click: (row) => this.openDetails(row),
          },
        ];
        this.displayedColumns = this.columns.map((column) => column.field);
      });
  }

  openDetails(row: DemoRow): void {
    const items = this.page.orderItems?.[String(row['code'])];
    const fields = this.page.columns
      .filter(
        (column) =>
          column.field !== 'status' &&
          !(
            items &&
            ['customer', 'product', 'quantity', 'total'].includes(column.field)
          ),
      )
      .map((column) => ({
        label: column.header,
        value:
          column.type === 'date' || column.type === 'datetime'
            ? new Date(String(row[column.field])).toLocaleString(
                'tr-TR',
                column.type === 'date'
                  ? { dateStyle: 'medium' }
                  : { dateStyle: 'medium', timeStyle: 'short' },
              )
            : column.type === 'num2'
              ? Number(row[column.field]).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })
              : row[column.field],
      }));
    const status = String(row['status']);
    const detail: DemoDetailData = {
      title: String(row['name'] ?? row['customer'] ?? row['action']),
      status,
      tone: ['Tükendi', 'İptal edildi', 'Başarısız'].includes(status)
        ? 'error'
        : ['Az stok', 'Uyarı'].includes(status)
          ? 'warning'
          : ['Stokta', 'Teslim edildi', 'Başarılı'].includes(status)
            ? 'success'
            : 'neutral',
      fields,
      items,
    };
    this.dialog.open(MoDialogComponent, {
      width: items ? '900px' : '640px',
      maxWidth: '95vw',
      data: {
        header: `${this.page.title} · ${row['code']}`,
        icon: this.page.icon,
        component: DemoDetailComponent,
        componentData: detail,
        button2: 'Kapat',
      },
    });
  }
}
