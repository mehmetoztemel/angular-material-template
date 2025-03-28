import { FormGroup } from "@angular/forms";
import { IColumns } from "./columns";
import { Type } from "@angular/core";

export interface IDialogDataModel {
    header: string, 
    table?: any[], 
    col?: IColumns[],
    dspCol?: string[],
    formGroup?:FormGroup,
    button1?:string,
    button2:string,
    card?:IDialogDataModel,
    label: string,
    component?: Type<unknown>;
    componentData : any;
}