import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiveGroupComponent } from './create-dive-group.component';

describe('CreateDiveGroupComponent', () => {
  let component: CreateDiveGroupComponent;
  let fixture: ComponentFixture<CreateDiveGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDiveGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDiveGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
