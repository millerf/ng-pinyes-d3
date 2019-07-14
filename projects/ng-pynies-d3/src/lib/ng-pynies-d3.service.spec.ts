import { TestBed } from '@angular/core/testing';

import { NgPyniesD3Service } from './ng-pynies-d3.service';

describe('NgPyniesD3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgPyniesD3Service = TestBed.get(NgPyniesD3Service);
    expect(service).toBeTruthy();
  });
});
