import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCore } from './shared-core';

describe('SharedCore', () => {
  let component: SharedCore;
  let fixture: ComponentFixture<SharedCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
