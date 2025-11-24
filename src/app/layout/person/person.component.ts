import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomDialogComponent } from '../../shared/components/custom-dialog/custom-dialog.component';
import { IColumns } from '../../shared/models/components/columns';
import { IDialogDataModel } from '../../shared/models/components/dialogDataModel';
import { IDropdownOption } from '../../shared/models/components/dropdownOption';
import { ColumnType } from '../../shared/models/components/enums/columnTypeEnum';
import { IPerson } from '../../shared/models/person';
import { PERSONS } from '../../shared/models/person-dummy-data';
import { Utility } from '../../shared/utilities/Utility';
import { PersonDetailComponent } from './person-detail/person-detail.component';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
  standalone: false
})
export class PersonComponent implements OnInit {
  cols: IColumns[];
  displayedColumns: string[]
  data: IPerson[] = [];
  symbolOpt: IDropdownOption[] = [];
  constructor(private personDetailDialog: MatDialog) { }
  ngOnInit(): void {
    this.setTableCols();
  }

  setTableCols() {
    this.data = PERSONS;

    this.symbolOpt = Utility.getUniqueOptionsByProperty(this.data, 'firstName');

    this.cols = [
      { field: 'firstName', header: 'First Name', type: ColumnType.text, style: '20%', filter: ColumnType.dropDown },
      { field: 'lastName', header: 'Last Name', type: ColumnType.text, style: '20%', filter: ColumnType.dropDown },
      { field: 'email', header: 'EMail', type: ColumnType.text, style: '20%', filter: ColumnType.text },
      { field: 'phone', header: 'Phone', type: ColumnType.text, style: '20%', filter: ColumnType.text },
      { field: 'birthDate', header: 'Birth Date', type: ColumnType.date, style: '20%', filter: ColumnType.date },
      { field: 'Actions', header: 'Detail', buttonLabel: '', icon: "menu", type: ColumnType.button, style: '5%', color: "primary", click: this.openDetailDialog.bind(this) },
      { field: 'Actions1', header: 'Delete', buttonLabel: '', icon: "delete", type: ColumnType.button, style: '5%', color: "warn", click: this.deletePersonDialog.bind(this) }
    ];

    //#region Option GroupBy
    // const uniqueSymbols = Array.from(new Set(this.data.map(element => element.symbol)));y
    // uniqueSymbols.forEach(symbol => {
    //   this.symbolOpt.push({ viewValue: symbol, value: symbol });
    // });
    //#endregion
    this.displayedColumns = this.cols.map(x => x.field);
  }

  openDetailDialog(e: any) {
    let header = e == null ? "Create" : "Detail";
    const dialog = this.personDetailDialog.open(CustomDialogComponent, {
      autoFocus: false,
      disableClose: true,
      hasBackdrop: true,
      data: <IDialogDataModel>{
        component: PersonDetailComponent,
        componentData: e,
        header: header
      }
    });
    dialog.afterClosed().subscribe(result => { });
  }

  deletePersonDialog(e: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.data = <IDialogDataModel>{
      label: "Do you confirm that the record will be deleted?",
      button1: "Yes",
      button2: "No"
    };
    let dialogRef = this.personDetailDialog.open(CustomDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == true) {
        console.log(result);
      }
    });
  }
}
