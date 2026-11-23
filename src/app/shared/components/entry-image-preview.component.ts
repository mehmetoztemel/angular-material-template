import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface PreviewImage {
  image: string;
  title?: string;
}

@Component({
  selector: 'app-entry-image-preview',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <header>
      <div>
        <h2 id="image-preview-title">
          {{ current.title || 'Görsel önizleme' }}
        </h2>
        <p aria-live="polite">{{ index + 1 }} / {{ data.images.length }}</p>
      </div>
      <button
        mat-icon-button
        type="button"
        mat-dialog-close
        aria-label="Önizlemeyi kapat"
      >
        <mat-icon>close</mat-icon>
      </button>
    </header>
    <div class="preview-stage">
      @if (failed) {
        <p role="status">Görsel yüklenemedi.</p>
      }
      <img
        [src]="current.image"
        [alt]="current.title || 'Görsel ' + (index + 1)"
        [hidden]="failed"
        (error)="failed = true"
      />
    </div>
    @if (data.images.length > 1) {
      <footer>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="move(-1)"
          [disabled]="index === 0"
        >
          <mat-icon>chevron_left</mat-icon>Önceki
        </button>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="move(1)"
          [disabled]="index === data.images.length - 1"
        >
          Sonraki<mat-icon iconPositionEnd>chevron_right</mat-icon>
        </button>
      </footer>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      max-height: 92dvh;
      background: var(--app-card-bg);
      color: var(--app-text-primary);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--app-border);
    }
    header > div {
      min-width: 0;
    }
    h2 {
      margin: 0;
      font-size: 16px;
      overflow-wrap: anywhere;
    }
    p {
      margin: 6px 0 0;
      font-size: 12px;
      color: var(--app-text-secondary);
    }
    header button {
      flex-shrink: 0;
    }
    .preview-stage {
      display: grid;
      place-items: center;
      min-height: 200px;
      min-width: 0;
      overflow: auto;
      padding: 16px;
      background: var(--app-surface);
    }
    img {
      display: block;
      max-width: 100%;
      max-height: 68dvh;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    img[hidden] {
      display: none;
    }
    footer {
      display: flex;
      justify-content: space-between;
      padding: 12px 20px;
      gap: 12px;
    }
    footer button {
      min-height: 44px;
    }
    @media (max-width: 600px) {
      header {
        padding: 12px;
      }
      .preview-stage {
        padding: 8px;
      }
      footer {
        padding: 12px;
      }
    }
  `,
})
export class EntryImagePreviewComponent {
  readonly data = inject<{ images: readonly PreviewImage[]; index: number }>(
    MAT_DIALOG_DATA,
  );
  index = this.data.index;
  failed = false;
  get current(): PreviewImage {
    return this.data.images[this.index];
  }
  move(direction: number): void {
    const next = this.index + direction;
    if (next >= 0 && next < this.data.images.length) {
      this.index = next;
      this.failed = false;
    }
  }
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }
}
