import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiveWizardService {

  private payload: any = {};
  constructor(private http: HttpClient) { }
private payloadSubject = new BehaviorSubject<any | null>(null);

 setPayload(payload: any) {
    this.payload = payload;
    this.payloadSubject.next(this.payload);
  }

  getPayload() {
    if (!this.payload || Object.keys(this.payload).length === 0) {
    console.warn('🟠 Payload vide ou non initialisé');
  }
  return this.payload || {};
  }

  onPayloadReady(): Observable<any> {
  return this.payloadSubject.asObservable().pipe(
    filter((p): p is any => !!p) // filtre les null
  );
}

sendFinalReservation(payload:any): Observable<any> {
  return this.http.post(`${environment.apiDives}`, payload,{
    withCredentials: true
  });
}

  submitWizard(payload: any): any {    
    this.sendFinalReservation(payload).subscribe({
    next: (res) => {
      console.log("✅ Enregistré avec succès", res);
      return res;
    },
    error: (err) => {
      console.error("❌ Erreur à l'envoi", err);
      throw err;
    }
  });
  }
}
