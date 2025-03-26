import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiveWizardComponent } from './dive-wizard.component';

describe('DiveWizardComponent', () => {
  let component: DiveWizardComponent;
  let fixture: ComponentFixture<DiveWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiveWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiveWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
