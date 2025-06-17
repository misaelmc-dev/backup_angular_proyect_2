import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorSchoolsComponent } from './investigator-schools.component';

describe('InvestigatorSchoolsComponent', () => {
  let component: InvestigatorSchoolsComponent;
  let fixture: ComponentFixture<InvestigatorSchoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorSchoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
