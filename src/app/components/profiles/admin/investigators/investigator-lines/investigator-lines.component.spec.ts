import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorLinesComponent } from './investigator-lines.component';

describe('InvestigatorLinesComponent', () => {
  let component: InvestigatorLinesComponent;
  let fixture: ComponentFixture<InvestigatorLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorLinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
