import { Injectable } from '@angular/core';
import { Spot } from '../../models/Spot';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpotService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Spot[]> {
    return this.http.get<Spot[]>(`${environment.apiSpots}`, {
      withCredentials: true, // Assurez-vous que les cookies ou JWT sont envoyés
    });
  }

  getById(id: string): Observable<Spot> {
    return this.http.get<Spot>(`${environment.apiSpots}/${id}`, {
      withCredentials: true,
    });
  }

  create(loc: Spot): Observable<Spot> {
    return this.http.post<Spot>(environment.apiSpots, loc, {
      withCredentials: true,
    });
  }

  update(id: string, loc: Partial<Spot>): Observable<Spot> {
    return this.http.put<Spot>(`${environment.apiSpots}/${id}`, loc, {
      withCredentials: true,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiSpots}/${id}`, {
      withCredentials: true,
    });
  }
}
