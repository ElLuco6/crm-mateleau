import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Dive } from '../../models/Dive';

@Injectable({
  providedIn: 'root'
})
export class DivingService {

  constructor(private http : HttpClient) { }

  getAllDiving() :Observable<Dive[]>{
    return this.http.get<Dive[]>(`${environment.apiDives}`);
  }
  createDivingGroup(payload: any): Observable<any> {
    return this.http.post(`${environment.apiDivingGroup}`, payload, {
      withCredentials: true
    });

  }

}
