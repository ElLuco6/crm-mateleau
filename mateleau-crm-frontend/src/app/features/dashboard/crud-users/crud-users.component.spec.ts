import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrudUsersComponent } from './crud-users.component';
import { UsersServiceService } from '../../../core/service/users-service.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { User } from '../../../models/User';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CrudUsersComponent', () => {
  let component: CrudUsersComponent;
  let fixture: ComponentFixture<CrudUsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UsersServiceService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockUsers: User[] = [
    {
      _id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      password: '',
      role: 'admin',
      divingLvl: 2
    },
    {
      _id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      password: '',
      role: 'manager',
      divingLvl: 3
    }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UsersServiceService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CrudUsersComponent, MatTableModule, MatButtonModule, MatIconModule, BrowserAnimationsModule],
      providers: [
        { provide: UsersServiceService, useValue: userServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrudUsersComponent);
    component = fixture.componentInstance;

    userServiceSpy.getAll.and.returnValue(of(mockUsers));
    fixture.detectChanges();
  });

  it('should load users on init', () => {
    expect(userServiceSpy.getAll).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should open dialog and create user', fakeAsync(() => {
    const result: User = {
      _id: '3',
      name: 'Charlie',
      email: 'charlie@example.com',
      password: '',
      role: 'staff',
      divingLvl: 1
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(result)
    } as any);

    userServiceSpy.create.and.returnValue(of(result));
    userServiceSpy.getAll.and.returnValue(of([...mockUsers, result]));

    component.openForm();
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(userServiceSpy.create).toHaveBeenCalledWith(result);
  }));

  it('should open dialog and update user', fakeAsync(() => {
    const userToEdit = mockUsers[0];
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(userToEdit)
    } as any);

    userServiceSpy.update.and.returnValue(of(userToEdit));
    component.openForm(userToEdit);
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(userServiceSpy.update).toHaveBeenCalledWith(userToEdit);
  }));

  it('should delete user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceSpy.delete.and.returnValue(of({}));
    component.deleteUser('1');
    expect(userServiceSpy.delete).toHaveBeenCalledWith('1');
  });
});
