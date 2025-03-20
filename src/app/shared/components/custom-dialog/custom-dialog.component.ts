import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ComponentRef, Inject, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomTableComponent } from "../custom-table/custom-table.component";

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CustomTableComponent
],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CustomDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  componentRef: ComponentRef<any>;
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.data.component && this.container) {
      this.container.clear(); // Önceki bileşenleri temizler
      this.componentRef = this.container.createComponent(this.data.component as Type<any>);
    }
  }

  closeDialog() {
    this.dialogRef.close(true);
    if (this.componentRef) {
      this.componentRef.destroy();
    }

  }

  onSave() {
    if (this.data.formGroup) {
      console.log("1");
      this.dialogRef.close(this.data.formGroup.value);
    }
    else if (this.data.card?.formGroup) {
      console.log('2');
      this.dialogRef.close(this.data.card.formGroup.value);
    }
    else if (this.data.label) {
      console.log("3");
      this.dialogRef.close(true);
    }
    else if (this.data.card?.label) {
      console.log("4");
      this.dialogRef.close(true);
    }
  }
}
