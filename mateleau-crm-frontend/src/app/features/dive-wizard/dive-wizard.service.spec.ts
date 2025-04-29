import { TestBed } from '@angular/core/testing';

import { DiveWizardService } from './dive-wizard.service';

describe('DiveWizardService', () => {
  let service: DiveWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiveWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
