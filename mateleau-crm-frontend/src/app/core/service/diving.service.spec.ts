import { TestBed } from '@angular/core/testing';

import { DivingService } from './diving.service';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

describe('DivingService', () => {
  let service: DivingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [HttpClientTestingModule] 
    });
    service = TestBed.inject(DivingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
