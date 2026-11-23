import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PERSONS } from '../../shared/models/person-dummy-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DashboardComponent {
  readonly metrics = [
    { label: 'Toplam kişi', icon: 'groups', value: PERSONS.length },
    {
      label: 'E-posta bilgisi',
      icon: 'mail_outline',
      value: PERSONS.filter((p) => !!p.email).length,
    },
    {
      label: 'Telefon bilgisi',
      icon: 'phone',
      value: PERSONS.filter((p) => !!p.phone).length,
    },
    {
      label: 'Doğum tarihi',
      icon: 'event',
      value: PERSONS.filter((p) => !!p.birthDate).length,
    },
    {
      label: 'Farklı soyadı',
      icon: 'person_outline',
      value: new Set(PERSONS.map((p) => p.lastName)).size,
    },
  ];
}
