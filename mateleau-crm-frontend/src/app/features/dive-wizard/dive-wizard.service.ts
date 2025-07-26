import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiveWizardService {

  private payload: any = {};
  constructor() { }
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

  submitWizard(formData: any):Observable<any> {
    // Logique pour soumettre les données du wizard
    // Cela pourrait être un appel HTTP à votre backend pour enregistrer les données
    console.log('Données du wizard soumises:', formData);
    // return this.http.post('/api/dive-wizard', formData);
    return new Observable(observer => {
      observer.next(formData);
    })
  }



  
}
