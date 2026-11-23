import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AppConfig } from '../../../app.config';
import { IDialogDataModel } from '../../../shared/models/components/dialogDataModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPerson } from '../../../shared/models/person';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PersonDetailComponent implements OnInit {
  person: IPerson;
  personDetailForm: FormGroup;
  constructor(
    public appConfig: AppConfig,
    @Inject(MAT_DIALOG_DATA) public dialogData: IDialogDataModel,
    private personDetailDialog: MatDialogRef<PersonDetailComponent>,
  ) {}

  ngOnInit() {
    if (this.dialogData?.componentData) {
      this.person = this.dialogData.componentData;
    }
    this.setFormDefault();
  }

  get form() {
    return this.personDetailForm.controls;
  }
  setFormDefault() {
    this.personDetailForm = new FormGroup({
      firstName: new FormControl(this.person?.firstName, [Validators.required]),
      lastName: new FormControl(this.person?.lastName, [Validators.required]),
      email: new FormControl(this.person?.email, [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(this.person?.phone, [Validators.required]),
      birthDate: new FormControl(this.person?.birthDate, [Validators.required]),
    });
  }

  savePerson() {
    if (this.personDetailForm.invalid) return;
    this.personDetailDialog.close({
      ...this.person,
      ...this.personDetailForm.getRawValue(),
    });
  }
}
