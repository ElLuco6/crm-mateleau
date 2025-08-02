import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Diver } from '../../models/Diver';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiverServiceService {

  constructor(private http: HttpClient) { }

   getAll() {
      return this.http.get<Diver[]>(`${environment.apiDiver}`,{
        withCredentials: true
      });
    }

    create(diver: Diver) {
      return this.http.post<Diver>(`${environment.apiDiver}`, diver, {
        withCredentials: true
      });
    }

    update(diver: Diver) {
      console.log(`Updating diver with ID: ${diver._id}`, diver);

      return this.http.put<Diver>(`${environment.apiDiver}/${diver._id}`, diver, {
        withCredentials: true
      });
    }
  
    delete(diverId: string) {
      return this.http.delete(`${environment.apiDiver}/${diverId}`, {
        withCredentials: true
      });
    }
}
