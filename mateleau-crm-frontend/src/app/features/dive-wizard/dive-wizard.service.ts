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
    console.log('Payload récupéré:', this.payload);
    return this.payload;
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
    
    console.log("🟢 Envoi de la réservation avec les données du wizard", payload);
    
    
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
