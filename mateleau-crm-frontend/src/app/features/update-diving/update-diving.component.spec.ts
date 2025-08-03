import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDivingComponent } from './update-diving.component';

describe('UpdateDivingComponent', () => {
  let component: UpdateDivingComponent;
  let fixture: ComponentFixture<UpdateDivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDivingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
