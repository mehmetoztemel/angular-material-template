import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MoDialogComponent } from '../../shared/components/mo-dialog/mo-dialog.component';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PersonComponent implements OnInit {
  cols: IColumns<IPerson>[];
  displayedColumns: string[];
  data: IPerson[] = [];
  symbolOpt: IDropdownOption[] = [];
  constructor(private personDetailDialog: MatDialog) {}
  ngOnInit(): void {
    this.setTableCols();
  }

  setTableCols() {
    this.data = PERSONS.map((person) => ({ ...person }));

    this.symbolOpt = Utility.getUniqueOptionsByProperty(this.data, 'firstName');

    this.cols = [
      {
        field: 'firstName',
        header: 'Ad',
        type: ColumnType.text,
        style: '20%',
        filter: ColumnType.multiSelect,
      },
      {
        field: 'lastName',
        header: 'Soyad',
        type: ColumnType.text,
        style: '20%',
        filter: ColumnType.dropDown,
      },
      {
        field: 'email',
        header: 'E-posta',
        type: ColumnType.text,
        style: '20%',
        filter: ColumnType.text,
      },
      {
        field: 'phone',
        header: 'Telefon',
        type: ColumnType.text,
        style: '20%',
        filter: ColumnType.text,
      },
      {
        field: 'birthDate',
        header: 'Doğum tarihi',
        type: ColumnType.date,
        style: '20%',
        filter: ColumnType.date,
      },
      {
        field: 'Actions',
        header: 'Detay',
        buttonLabel: '',
        icon: 'menu',
        type: ColumnType.button,
        style: '5%',
        color: 'primary',
        click: this.openDetailDialog.bind(this),
      },
      {
        field: 'Actions1',
        header: 'Sil',
        buttonLabel: '',
        icon: 'delete',
        type: ColumnType.button,
        style: '5%',
        color: 'warn',
        click: this.deletePersonDialog.bind(this),
      },
    ];

    //#region Option GroupBy
    // const uniqueSymbols = Array.from(new Set(this.data.map(element => element.symbol)));y
    // uniqueSymbols.forEach(symbol => {
    //   this.symbolOpt.push({ viewValue: symbol, value: symbol });
    // });
    //#endregion
    this.displayedColumns = this.cols.map((x) => x.field);
  }

  openDetailDialog(e: any) {
    let header = e == null ? 'Kişi ekle' : 'Kişi düzenle';
    const dialog = this.personDetailDialog.open(MoDialogComponent, {
      width: '680px',
      autoFocus: false,
      disableClose: true,
      hasBackdrop: true,
      data: <IDialogDataModel<IPerson>>{
        component: PersonDetailComponent,
        componentData: e,
        header: header,
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (!result || typeof result !== 'object') return;
      this.data = e
        ? this.data.map((person) => (person.id === e.id ? result : person))
        : [
            ...this.data,
            {
              ...result,
              id: Math.max(0, ...this.data.map((person) => person.id)) + 1,
            },
          ];
    });
  }

  deletePersonDialog(e: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.data = <IDialogDataModel>{
      label: 'Bu kaydı silmek istediğinize emin misiniz?',
      button1: 'Sil',
      button1Color: 'warn',
      button2: 'Hayır',
    };
    let dialogRef = this.personDetailDialog.open(
      MoDialogComponent,
      dialogConfig,
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined && result == true) {
        this.data = this.data.filter((person) => person.id !== e.id);
      }
    });
  }
}
