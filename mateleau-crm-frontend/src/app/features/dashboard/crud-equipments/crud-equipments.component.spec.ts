import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrudEquipmentsComponent } from './crud-equipments.component';
import { EquipmentServiceService } from '../../../core/service/equipment-service.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Equipment } from '../../../models/Equipment';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CrudEquipmentsComponent', () => {
  let component: CrudEquipmentsComponent;
  let fixture: ComponentFixture<CrudEquipmentsComponent>;
  let equipmentServiceSpy: jasmine.SpyObj<EquipmentServiceService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockEquipments: Equipment[] = [
    {
      _id: '1',
      reference: 'EQ001',
      nature: 'combinaison',
      size: 'L',
      nextMaintenanceDate: new Date(),
      isRented: false,
    },
    {
      _id: '2',
      reference: 'EQ002',
      nature: 'combinaison',
      size: 'M',
      nextMaintenanceDate: new Date(),
      isRented: true,
    }
  ];

  beforeEach(async () => {
    equipmentServiceSpy = jasmine.createSpyObj('EquipmentServiceService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CrudEquipmentsComponent, MatTableModule, MatIconModule, MatButtonModule, BrowserAnimationsModule],
      providers: [
        { provide: EquipmentServiceService, useValue: equipmentServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrudEquipmentsComponent);
    component = fixture.componentInstance;

    equipmentServiceSpy.getAll.and.returnValue(of(mockEquipments));
    fixture.detectChanges();
  });

  it('should load equipments on init', () => {
    expect(equipmentServiceSpy.getAll).toHaveBeenCalled();
    expect(component.equipments.length).toBe(2);
  });

  it('should open dialog and create equipment', fakeAsync(() => {
    const result: Equipment = {
      _id: '3',
      reference: 'EQ003',
      nature: 'combinaison',
      size: 'S',
      nextMaintenanceDate: new Date(),
      isRented: false
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(result)
    } as any);

    equipmentServiceSpy.create.and.returnValue(of(result));
    component.openForm();
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(equipmentServiceSpy.create).toHaveBeenCalledWith(result);
  }));

  it('should open dialog and update equipment', fakeAsync(() => {
    const equipmentToEdit = mockEquipments[0];
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(equipmentToEdit)
    } as any);

    equipmentServiceSpy.update.and.returnValue(of(equipmentToEdit));
    component.openForm(equipmentToEdit);
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(equipmentServiceSpy.update).toHaveBeenCalledWith(equipmentToEdit);
  }));

  it('should delete equipment', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    equipmentServiceSpy.delete.and.returnValue(of({}));

    component.deleteEquipment('1');
    expect(equipmentServiceSpy.delete).toHaveBeenCalledWith('1');
  });
});
