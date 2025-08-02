import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/User';
import { UsersServiceService } from '../../../core/service/users-service.service';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { userFields } from '../../../shared/form/form-config';
import { MatDialog } from '@angular/material/dialog';
import { GenericFormDialogComponent } from '../../../shared/generic-form-dialog/generic-form-dialog.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-crud-users',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './crud-users.component.html',
  styleUrl: './crud-users.component.scss'
})
export class CrudUsersComponent implements OnInit {
  users: User[] = [];
  columnsToDisplay = ['name', 'email', 'role', 'actions'];

  constructor(private userService: UsersServiceService,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
  }

   openForm(user?: User) {
    const fields = userFields(!!user);

    this.dialog.open(GenericFormDialogComponent, {
      width: '400px',
      data: {
        title: user ? 'Modifier un utilisateur' : 'Créer un utilisateur',
        fields,
        values: user
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const action = user
          ? this.userService.update(result)
          : this.userService.create(result);

        action.subscribe(() => this.loadUsers());
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.userService.delete(id).subscribe(() => this.loadUsers());
    }
  }
  editUser(user: User) {
    this.openForm(user);
  }
}
