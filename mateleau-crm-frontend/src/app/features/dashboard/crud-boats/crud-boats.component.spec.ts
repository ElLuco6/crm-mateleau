import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudBoatsComponent } from './crud-boats.component';

describe('CrudBoatsComponent', () => {
  let component: CrudBoatsComponent;
  let fixture: ComponentFixture<CrudBoatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudBoatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
