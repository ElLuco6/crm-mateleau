import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEquipmentsComponent } from './crud-equipments.component';

describe('CrudEquipmentsComponent', () => {
  let component: CrudEquipmentsComponent;
  let fixture: ComponentFixture<CrudEquipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudEquipmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
