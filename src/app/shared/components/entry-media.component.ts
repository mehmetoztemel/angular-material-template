import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntryImagePreviewComponent } from './entry-image-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface EntryImage {
  image: string;
  title?: string;
}

@Component({
  selector: 'app-entry-media',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="upload-area">
      <mat-icon>add_photo_alternate</mat-icon>
      <div class="upload-area-copy">
        <strong>İçeriğe görsel ekleyin</strong>
        <p>JPG, JPEG veya PNG · Birden fazla dosya seçebilirsiniz.</p>
      </div>
      <input
        #fileInput
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        hidden
        (change)="filesSelected.emit($event)"
      />
      <button
        mat-stroked-button
        color="primary"
        type="button"
        (click)="fileInput.click()"
      >
        <mat-icon>upload</mat-icon>Görsel seç
      </button>
    </div>
    @if (images.length) {
      <div class="entry-gallery">
        @for (image of images; track $index) {
          <figure>
            <button
              type="button"
              class="image-preview-trigger"
              [attr.aria-label]="
                (image.title || 'Görsel ' + ($index + 1)) + ' büyüt'
              "
              (click)="preview($index)"
            >
              <img
                [src]="image.image"
                [alt]="image.title || 'İçerik görseli ' + ($index + 1)"
                loading="lazy"
              />
            </button>
            <figcaption>
              <span [title]="image.title || 'Görsel ' + ($index + 1)">{{
                image.title || 'Görsel ' + ($index + 1)
              }}</span>
              <button
                mat-icon-button
                type="button"
                class="remove-image"
                [attr.aria-label]="'Görsel ' + ($index + 1) + ' kaldır'"
                (click)="imageRemoved.emit($index)"
              >
                <mat-icon>delete_outline</mat-icon>
              </button>
            </figcaption>
          </figure>
        }
      </div>
    }
  `,
})
export class EntryMediaComponent {
  private readonly dialog = inject(MatDialog);
  @Input() images: readonly EntryImage[] = [];
  @Output() filesSelected = new EventEmitter<Event>();
  @Output() imageRemoved = new EventEmitter<number>();
  preview(index: number): void {
    if (!this.images[index]) return;
    this.dialog.open(EntryImagePreviewComponent, {
      width: '1100px',
      maxHeight: '92dvh',
      ariaLabelledBy: 'image-preview-title',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      data: { images: this.images.map((image) => ({ ...image })), index },
    });
  }
}
