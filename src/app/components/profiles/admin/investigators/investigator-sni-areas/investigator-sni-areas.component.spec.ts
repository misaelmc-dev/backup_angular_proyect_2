import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorSniAreasComponent } from './investigator-sni-areas.component';

describe('InvestigatorSniAreasComponent', () => {
  let component: InvestigatorSniAreasComponent;
  let fixture: ComponentFixture<InvestigatorSniAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorSniAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorSniAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
