import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Boat } from '../../models/Boat';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dive } from '../../models/Dive';
import { User } from '../../models/User';
import { Diver } from '../../models/Diver';

@Injectable({
  providedIn: 'root',
})
export class AvailibilityService {
  constructor(private http: HttpClient) {}

  getAvailableBoat(date: string, duration: number): Observable<Boat[]> {
    return this.http.get<Boat[]>(
      `${environment.apiAviability}/boats?date=${date}&duration=${duration}`,
      { withCredentials: true }
    );
  }
  getAvailableUsers(date: Date, duration: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.apiAviability}/users?date=${date}&duration=${duration}`,
      { withCredentials: true }
    );
  }
  getAvailableDivers(date: Date, duration: number): Observable<Diver[]> {
    return this.http.get<Diver[]>(
      `${environment.apiAviability}/divers?date=${date}&duration=${duration}`,
      { withCredentials: true }
    );
  }
  getDiveMonth(date: Date): Observable<Dive[]> {
    return this.http.get<Dive[]>(
      `${environment.apiAviability}/dive/month?date=${date}`,
      { withCredentials: true }
    );
  }
}
