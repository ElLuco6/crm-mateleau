import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {

  constructor(public http: HttpClient) { }


  getAll() {
    return this.http.get<User[]>(`${environment.apiUsers}`,{
      withCredentials: true
    });
  }

  create(user: User) {
    return this.http.post<User>(`${environment.apiUsers}`, user, {
      withCredentials: true
    });
  }

  update(user: User) {
    return this.http.put<User>(`${environment.apiUsers}/${user._id}`, user, {
      withCredentials: true
    });
  }

  delete(userId: string) {
    return this.http.delete(`${environment.apiUsers}/${userId}`, {
      withCredentials: true
    });
  }
}
