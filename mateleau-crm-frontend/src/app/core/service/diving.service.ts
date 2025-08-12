import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Dive } from '../../models/Dive';
import { DiveDetail } from '../../shared/types/dive-detail';

@Injectable({
  providedIn: 'root'
})
export class DivingService {

  constructor(private http : HttpClient) { }

  getAllDiving() :Observable<Dive[]>{
    return this.http.get<Dive[]>(`${environment.apiDives}`,{
      withCredentials: true
    });
  }
  createDivingGroup(payload: any): Observable<any> {
    return this.http.post(`${environment.apiDivingGroup}`, payload, {
      withCredentials: true
    });

  }

  delete(id: string):Observable<void>{
    return this.http.delete<void>(`${environment.apiDives}/${id}`, {
      withCredentials: true
    });
  }

  getDiveById(id: string): Observable<Dive> {
    return this.http.get<Dive>(`${environment.apiDives}/${id}`, {
      withCredentials: true
    });
  }
  getDiveDetailById(id: string): Observable<DiveDetail> {
    return this.http.get<DiveDetail>(`${environment.apiDives}/${id}/detail`, {
      withCredentials: true
    });
  }

  updateDive(id: string, payload: any): Observable<Dive> {
    return this.http.put<Dive>(`${environment.apiDives}/${id}`, payload, {
      withCredentials: true
    });
  }

}
