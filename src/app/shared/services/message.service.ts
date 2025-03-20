import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, css: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: css
    });
  }
}
