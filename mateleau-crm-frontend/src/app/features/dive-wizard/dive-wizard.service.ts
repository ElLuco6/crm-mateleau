import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiveWizardService {

  constructor() { }


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
