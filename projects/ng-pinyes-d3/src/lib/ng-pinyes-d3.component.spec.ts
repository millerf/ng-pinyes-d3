import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPinyesD3Component } from './ng-pinyes-d3.component';

describe('NgPyniesD3Component', () => {
  let component: NgPinyesD3Component;
  let fixture: ComponentFixture<NgPinyesD3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPinyesD3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPinyesD3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
