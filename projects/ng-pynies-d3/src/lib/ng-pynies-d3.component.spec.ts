import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPyniesD3Component } from './ng-pynies-d3.component';

describe('NgPyniesD3Component', () => {
  let component: NgPyniesD3Component;
  let fixture: ComponentFixture<NgPyniesD3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPyniesD3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPyniesD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
