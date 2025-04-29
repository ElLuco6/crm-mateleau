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


  addBoat(boat: Boat): Observable<any> {
    return this.http.post(`${environment.apiBoats}`, boat)
  }

}
