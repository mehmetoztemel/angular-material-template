import { Component, OnInit } from '@angular/core';
import { IColumns } from '../../shared/models/components/columns';
import { IDropdownOption } from '../../shared/models/components/dropdownOption';
import { ColumnType } from '../../shared/models/components/enums/columnTypeEnum';
import { Utility } from '../../shared/utilities/Utility';
import { IPerson } from '../../shared/models/person';
import { CustomDialogComponent } from '../../shared/components/custom-dialog/custom-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IDialogDataModel } from '../../shared/models/components/dialogDataModel';
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
    this.data = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '555-123-4567',
        birthDate: new Date('1988-05-12')
      },
      {
        id: 2,
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.johnson@example.com',
        phone: '555-234-5678',
        birthDate: new Date('1995-08-21')
      },
      {
        id: 3,
        firstName: 'Michael',
        lastName: 'Williams',
        email: 'michael.williams@example.com',
        phone: '555-345-6789',
        birthDate: new Date('1982-11-30')
      },
      {
        id: 4,
        firstName: 'Emma',
        lastName: 'Brown',
        email: 'emma.brown@example.com',
        phone: '555-456-7890',
        birthDate: new Date('1994-02-15')
      },
      {
        id: 5,
        firstName: 'James',
        lastName: 'Jones',
        email: 'james.jones@example.com',
        phone: '555-567-8901',
        birthDate: new Date('1999-04-18')
      },
      {
        id: 6,
        firstName: 'Olivia',
        lastName: 'Garcia',
        email: 'olivia.garcia@example.com',
        phone: '555-678-9012',
        birthDate: new Date('1987-07-25')
      },
      {
        id: 7,
        firstName: 'William',
        lastName: 'Miller',
        email: 'william.miller@example.com',
        phone: '555-789-0123',
        birthDate: new Date('1980-09-10')
      },
      {
        id: 8,
        firstName: 'Sophia',
        lastName: 'Davis',
        email: 'sophia.davis@example.com',
        phone: '555-890-1234',
        birthDate: new Date('1996-11-05')
      },
      {
        id: 9,
        firstName: 'Alexander',
        lastName: 'Rodriguez',
        email: 'alexander.rodriguez@example.com',
        phone: '555-901-2345',
        birthDate: new Date('1992-01-27')
      },
      {
        id: 10,
        firstName: 'Isabella',
        lastName: 'Wilson',
        email: 'isabella.wilson@example.com',
        phone: '555-012-3456',
        birthDate: new Date('1998-06-14')
      }
    ];
    this.symbolOpt = Utility.getUniqueOptionsByProperty(this.data, 'firstName');

    this.cols = [
      { field: 'firstName', header: 'First Name', type: ColumnType.text, style: '20%', filter: ColumnType.dropDown },
      { field: 'lastName', header: 'Last Name', type: ColumnType.text, style: '20%', filter: ColumnType.dropDown },
      { field: 'email', header: 'EMail', type: ColumnType.text, style: '20%', filter: ColumnType.text },
      { field: 'phone', header: 'Phone', type: ColumnType.text, style: '20%', filter: ColumnType.text },
      { field: 'birthDate', header: 'Birth Date', type: ColumnType.date, style: '20%', filter: ColumnType.date },
      { field: 'Actions', header: 'Detail', buttonLabel: '', icon: "menu", type: ColumnType.button, style: '5%', color: "primary" ,click:this.openDetailDialog.bind(this)},
      { field: 'Actions1', header: 'Delete', buttonLabel: '', icon: "delete", type: ColumnType.button, style: '5%', color: "warn" ,click:this.deletePersonDialog.bind(this)}
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
      if (result) {
        console.log(result);
        
      }
    });
  }
}
