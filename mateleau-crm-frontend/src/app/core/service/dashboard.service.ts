import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../../models/Task';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardToday() {
  return this.http.get<any>(`${environment.apiDashboard}`,{
    withCredentials: true
  });
}

getDashboardWeek() {
  return this.http.get<any>(`${environment.apiDashboard}/week`,{
    withCredentials: true
  });
}
getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiTasks}`, {
      withCredentials: true
    });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${environment.apiTasks}`, task, {
      withCredentials: true
    });
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${environment.apiTasks}/${id}`, task, {
      withCredentials: true
    });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiTasks}/${id}`, {
      withCredentials: true
    });
  }



}
