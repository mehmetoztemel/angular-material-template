import { A11yModule } from '@angular/cdk/a11y';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import {
  TableFilterOption,
  TableFilterValue,
  TableScalar,
} from '../../models/components/columns';
import { normalizeText } from './table-utils';

/** Draft selections live here until Apply; closing the panel leaves the table unchanged. */
@Component({
  selector: 'mo-table-select-filter',
  imports: [
    A11yModule,
    OverlayModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      class="filter-trigger"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      #trigger
      [attr.aria-label]="label + ' filtresi'"
      [attr.aria-expanded]="open"
      aria-haspopup="dialog"
      (click)="show()"
      (keydown.arrowdown)="$event.preventDefault(); show()"
    >
      <span>{{ selectedLabel }}</span><mat-icon>expand_more</mat-icon>
    </button>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayPush]="true"
      [cdkConnectedOverlayViewportMargin]="12"
      (backdropClick)="close()"
      (overlayKeydown)="onOverlayKey($event)"
    >
      <section
        class="filter-panel"
        role="dialog"
        [attr.aria-label]="label + ' filtresi'"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
      >
        <div class="panel-search">
          <mat-icon>search</mat-icon>
          <input
            #searchInput
            type="search"
            placeholder="Seçeneklerde ara..."
            [attr.aria-label]="label + ' seçeneklerinde ara'"
            [value]="search"
            (input)="search = searchInput.value"
            cdkFocusInitial
          />
        </div>
        <mat-selection-list
          [multiple]="multiple"
          [attr.aria-label]="label + ' seçenekleri'"
          (selectionChange)="select($event)"
        >
          @for (option of visibleOptions; track option.value) {
            <mat-list-option
              [value]="option.value"
              [selected]="draft.includes(option.value)"
              >{{ option.viewValue }}</mat-list-option
            >
          }
        </mat-selection-list>
        @if (!visibleOptions.length) {
          <p class="empty-options" role="status">Seçenek bulunamadı</p>
        }
        <footer>
          <button
            mat-stroked-button
            color="warn"
            type="button"
            (click)="clear()"
          >
            Temizle
          </button>
          @if (multiple) {
            <button
              mat-raised-button
              color="primary"
              type="button"
              (click)="apply()"
            >
              Uygula
            </button>
          }
        </footer>
      </section>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-width: 110px;
      }
      .filter-trigger {
        box-sizing: border-box;
        width: 100%;
        min-height: 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 8px;
        border: 1px solid var(--app-border);
        border-radius: 6px;
        background: var(--app-card-bg);
        color: var(--app-text-primary);
        cursor: pointer;
        font: inherit;
        font-weight: 400;
      }
      .filter-trigger span {
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .filter-trigger mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }
      .filter-panel {
        box-sizing: border-box;
        width: 300px;
        max-width: calc(100vw - 24px);
        max-height: calc(100dvh - 24px);
        overflow: auto;
        background: var(--app-card-bg);
        color: var(--app-text-primary);
        border: 1px solid var(--app-border);
        border-radius: 10px;
        box-shadow: 0 8px 30px #0003;
        padding: 8px;
      }
      .panel-search {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border: 1px solid var(--app-border);
        border-radius: 6px;
      }
      .panel-search input {
        width: 100%;
        min-width: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        padding: 4px 0;
      }
      .panel-search mat-icon {
        color: var(--app-text-secondary);
      }
      mat-selection-list {
        display: block;
        max-height: 240px;
        overflow: auto;
      }
      footer {
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        padding-top: 8px;
        border-top: 1px solid var(--app-border);
      }
      .empty-options {
        padding: 16px;
        color: var(--app-text-secondary);
      }
      @media (max-width: 600px) {
        .filter-trigger {
          min-height: 44px;
        }
        footer button {
          min-height: 44px;
        }
      }
    `,
  ],
})
export class TableSelectFilterComponent {
  readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];
  @Input() label = '';
  @Input() multiple = false;
  @Input() options: readonly TableFilterOption[] = [];
  @Input() value: TableFilterValue | null = null;
  @Output() valueChange = new EventEmitter<TableFilterValue | null>();
  @ViewChild('trigger') trigger?: ElementRef<HTMLButtonElement>;
  open = false;
  search = '';
  draft: TableScalar[] = [];
  get selectedLabel(): string {
    const values = Array.isArray(this.value)
      ? this.value
      : this.value == null
        ? []
        : [this.value];
    return values.length
      ? values
          .map(
            (value) =>
              this.options.find((option) => Object.is(option.value, value))
                ?.viewValue ?? String(value),
          )
          .join(', ')
      : 'Tümü';
  }
  get visibleOptions(): readonly TableFilterOption[] {
    const search = normalizeText(this.search);
    return this.options.filter((option) =>
      normalizeText(option.viewValue).includes(search),
    );
  }
  show(): void {
    this.draft = Array.isArray(this.value)
      ? [...this.value]
      : this.value == null
        ? []
        : [this.value as TableScalar];
    this.search = '';
    this.open = true;
  }
  close(): void {
    this.open = false;
    this.trigger?.nativeElement.focus();
  }
  onOverlayKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  }
  select(event: MatSelectionListChange): void {
    // Only changed options are considered: searching must preserve hidden selections.
    for (const option of event.options) {
      const value = option.value as TableScalar;
      this.draft = this.multiple
        ? this.draft.filter((item) => !Object.is(item, value))
        : [];
      if (option.selected) this.draft.push(value);
    }
    if (!this.multiple) this.apply();
  }
  apply(): void {
    this.valueChange.emit(
      this.multiple ? [...this.draft] : (this.draft[0] ?? null),
    );
    this.close();
  }
  clear(): void {
    this.valueChange.emit(null);
    this.close();
  }
}
