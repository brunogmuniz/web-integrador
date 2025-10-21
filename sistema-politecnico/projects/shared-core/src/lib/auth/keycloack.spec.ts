import { TestBed } from '@angular/core/testing';

import { Keycloack } from './keycloack';

describe('Keycloack', () => {
  let service: Keycloack;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Keycloack);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
