import { Injectable } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { environment } from '../environments/environment';

@Injectable()
export class AppConfig {
  public Server = environment.serverUrl;
  public Api: string = environment.apiPath;
  public ApiUrl = this.Server + this.Api;
  public isMobile: boolean = false;
  public dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const day = cellDate.getDay();
      return day === 6 || day === 0 ? 'set-weekends' : '';
    }
    return '';
  };
}

export const PagePermissions: string[] = [];
