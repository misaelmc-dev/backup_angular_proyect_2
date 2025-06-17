import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCountryComponent } from './source-country.component';

describe('SourceCountryComponent', () => {
  let component: SourceCountryComponent;
  let fixture: ComponentFixture<SourceCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
