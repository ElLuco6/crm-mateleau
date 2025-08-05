import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudBoatsComponent } from './crud-boats.component';
import { BoatService } from '../../../core/service/boat.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Boat } from '../../../models/Boat';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CrudBoatsComponent', () => {
  let component: CrudBoatsComponent;
  let fixture: ComponentFixture<CrudBoatsComponent>;
  let boatServiceSpy: jasmine.SpyObj<BoatService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockBoats: Boat[] = [
    { _id: '1', name: 'Titanic', numberMaxPlaces: 100, revisionDate: new Date() },
    { _id: '2', name: 'Black Pearl', numberMaxPlaces: 50, revisionDate: new Date() }
  ];

  beforeEach(async () => {
    boatServiceSpy = jasmine.createSpyObj('BoatService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CrudBoatsComponent],
      providers: [
        { provide: BoatService, useValue: boatServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore le HTML Angular Material
    }).compileComponents();

    fixture = TestBed.createComponent(CrudBoatsComponent);
    component = fixture.componentInstance;
  });

  it('should call loadBoats on init', () => {
    boatServiceSpy.getAll.and.returnValue(of(mockBoats));
    component.ngOnInit();
    expect(boatServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should load boats into the array', () => {
    boatServiceSpy.getAll.and.returnValue(of(mockBoats));
    component.loadBoats();
    expect(component.boats).toEqual(mockBoats);
  });

  it('should call create on boatService and reload boats on dialog close with result (create)', () => {
    const result = { name: 'New Boat', numberMaxPlaces: 20, revisionDate: new Date() };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(result) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    boatServiceSpy.create.and.returnValue(of({ ...result, _id: '3' }));
    boatServiceSpy.getAll.and.returnValue(of([])); // pour reload

    component.openForm();
expect(boatServiceSpy.create).toHaveBeenCalledWith(jasmine.objectContaining(result as Partial<Boat>));
    expect(boatServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should call update on boatService and reload boats on dialog close with result (edit)', () => {
    const existingBoat = { _id: '1', name: 'Old Boat', numberMaxPlaces: 10, revisionDate: new Date() };
    const updated = { ...existingBoat, name: 'Updated Boat' };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(updated) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    boatServiceSpy.update.and.returnValue(of(updated));
    boatServiceSpy.getAll.and.returnValue(of([]));

    component.openForm(existingBoat);
    expect(boatServiceSpy.update).toHaveBeenCalledWith(updated);
    expect(boatServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should call delete on boatService if confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    boatServiceSpy.delete.and.returnValue(of({}));
    boatServiceSpy.getAll.and.returnValue(of([]));

    component.deleteBoat('1');
    expect(boatServiceSpy.delete).toHaveBeenCalledWith('1');
    expect(boatServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should not call delete on boatService if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteBoat('1');
    expect(boatServiceSpy.delete).not.toHaveBeenCalled();
  });
});
