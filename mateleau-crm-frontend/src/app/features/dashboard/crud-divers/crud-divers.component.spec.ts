import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrudDiversComponent } from './crud-divers.component';
import { DiverServiceService } from '../../../core/service/diver-service.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Diver } from '../../../models/Diver';

describe('CrudDiversComponent', () => {
  let component: CrudDiversComponent;
  let fixture: ComponentFixture<CrudDiversComponent>;
  let diverServiceSpy: jasmine.SpyObj<DiverServiceService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockDivers: Diver[] = [
    {
      _id: '1',
      firstName: 'Lucas',
      lastName: 'Saint-Supéry',
       divingLvl: 1 as 0 | 1 | 2 | 3 | 4 | 5,
      email: 'lucas@test.com',
      age: 25,
      phone: '0123456789',
      additionalInfo: 'Aime les plongées profondes',    
    },
    {
      _id: '2',
      firstName: 'Marie',
      lastName: 'Curie',
      divingLvl: 1 as 0 | 1 | 2 | 3 | 4 | 5,
      email: 'marie@test.com',
      age: 30,
      phone: '0987654321',
      additionalInfo: 'Aime les plongées en apnée',
    }
  ];

  beforeEach(async () => {
    diverServiceSpy = jasmine.createSpyObj('DiverServiceService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CrudDiversComponent],
      providers: [
        { provide: DiverServiceService, useValue: diverServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrudDiversComponent);
    component = fixture.componentInstance;
  });

  it('should call loadDivers on init', () => {
    diverServiceSpy.getAll.and.returnValue(of(mockDivers));
    fixture.detectChanges();
    expect(diverServiceSpy.getAll).toHaveBeenCalled();
    expect(component.divers.length).toBe(2);
  });

  it('should open dialog and create a diver', fakeAsync(() => {
    const result = {
      _id: '3',
      firstName: 'John',
      lastName: 'Doe',
      divingLvl: 1 as 0 | 1 | 2 | 3 | 4 | 5,
      email: 'john@test.com',
      age: 28,
      phone: '1234567890',
      additionalInfo: 'New diver',
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(result)
    } as any);

    diverServiceSpy.create.and.returnValue(of(result));
    diverServiceSpy.getAll.and.returnValue(of(mockDivers));

    component.openForm();
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(diverServiceSpy.create).toHaveBeenCalledWith(result);
    expect(diverServiceSpy.getAll).toHaveBeenCalledTimes(1);
  }));

  it('should open dialog and update a diver', fakeAsync(() => {
    const diverToUpdate = mockDivers[0];

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(diverToUpdate)
    } as any);

    diverServiceSpy.update.and.returnValue(of(diverToUpdate));
    diverServiceSpy.getAll.and.returnValue(of(mockDivers));

    component.openForm(diverToUpdate);
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(diverServiceSpy.update).toHaveBeenCalledWith(diverToUpdate);
    expect(diverServiceSpy.getAll).toHaveBeenCalledTimes(1);
  }));

  it('should delete a diver after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    diverServiceSpy.delete.and.returnValue(of({}));
    diverServiceSpy.getAll.and.returnValue(of(mockDivers));

    component.deleteDiver('1');

    expect(diverServiceSpy.delete).toHaveBeenCalledWith('1');
    expect(diverServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should not delete a diver if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteDiver('1');
    expect(diverServiceSpy.delete).not.toHaveBeenCalled();
  });
});
