import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Boat } from '../../models/Boat';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  constructor(private http: HttpClient) { }

  
    getAll() {
      return this.http.get<Boat[]>(`${environment.apiBoats}`,{
        withCredentials: true
      });
    }

    create(boat: Boat) {
      return this.http.post<Boat>(`${environment.apiBoats}`, boat, {
        withCredentials: true
      });
    }
  
    update(boat: Boat) {
      console.log(`Updating boat with ID: ${boat._id}`, boat);

      return this.http.put<Boat>(`${environment.apiBoats}/${boat._id}`, boat, {
        withCredentials: true
      });
    }

    delete(boatId: string) {
      return this.http.delete(`${environment.apiBoats}/${boatId}`, {
        withCredentials: true
      });
    }

}
