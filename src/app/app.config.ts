import { Injectable } from "@angular/core";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";

@Injectable()
export class AppConfig {
  public Server = 'http://localhost:5604/';
  public Api: string = 'api/';
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
