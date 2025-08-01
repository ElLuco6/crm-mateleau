import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UsersServiceService } from '../../../core/service/users-service.service';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-crud-users',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './crud-users.component.html',
  styleUrl: './crud-users.component.scss'
})
export class CrudUsersComponent implements OnInit {
  users: User[] = [];
  columnsToDisplay = ['name', 'email', 'role', 'actions'];

  constructor(private userService: UsersServiceService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
  }

  openForm() {
    // Ouvre un mat-dialog ou une section inline
  }

  editUser(user: User) {
    // Préremplit le formulaire
  }

  deleteUser(userId: string) {
    this.userService.delete(userId).subscribe(() => {
      this.loadUsers();
    });
  }
}
