import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorCentersComponent } from './investigator-centers.component';

describe('InvestigatorCentersComponent', () => {
  let component: InvestigatorCentersComponent;
  let fixture: ComponentFixture<InvestigatorCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorCentersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
