import { TestBed } from '@angular/core/testing';

import { DiverServiceService } from './diver-service.service';

describe('DiverServiceService', () => {
  let service: DiverServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiverServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
