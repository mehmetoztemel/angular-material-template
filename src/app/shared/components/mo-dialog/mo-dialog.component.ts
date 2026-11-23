import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Inject,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MoTableComponent } from '../mo-table/mo-table.component';

@Component({
  selector: 'mo-dialog',
  templateUrl: './mo-dialog.component.html',
  styleUrls: ['./mo-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MoTableComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MoDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  @ViewChild('componentHost', { read: ViewContainerRef, static: false })
  container: ViewContainerRef;
  componentRef: ComponentRef<unknown>;
  ngOnInit(): void {}

  ngAfterViewInit() {
    const component = this.data.component ?? this.data.card?.component;
    if (component && this.container) {
      this.componentRef = this.container.createComponent(
        component as Type<unknown>,
      );
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  closeDialog(result: boolean = false) {
    this.dialogRef.close(result);
  }

  onSave() {
    if (this.data.formGroup) {
      this.dialogRef.close(this.data.formGroup.value);
    } else if (this.data.card?.formGroup) {
      this.dialogRef.close(this.data.card.formGroup.value);
    } else if (this.data.label) {
      this.dialogRef.close(true);
    } else if (this.data.card?.label) {
      this.dialogRef.close(true);
    }
  }
}
