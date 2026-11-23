import { FormGroup } from '@angular/forms';
import { IColumns } from './columns';
import { IFormComponent } from './formComponent';
import { Type } from '@angular/core';

export interface IDialogDataModel<T extends object = Record<string, unknown>> {
  header: string;
  icon?: string;
  description?: string;
  table?: T[];
  col?: IColumns<T>[];
  dspCol?: string[];
  formType?: IFormComponent[];
  formGroup?: FormGroup;
  button1?: string;
  button1Color?: 'primary' | 'accent' | 'warn';
  button2: string;
  card?: IDialogDataModel<T>;
  label: string;
  component?: Type<unknown>;
  componentData: any;
}
