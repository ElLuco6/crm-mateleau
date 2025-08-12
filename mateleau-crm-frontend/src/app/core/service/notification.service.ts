import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

   constructor(private snackBar: MatSnackBar,
              private http: HttpClient
   ) {}

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message, type },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['rounded-md', 'shadow-lg']
    });
  }

  sendRemindEmailToDivers(id:string){
    return this.http.post(`${environment.apiDives}/${id}/remind-divers`, {
      withCredentials: true
    });
  }
}
