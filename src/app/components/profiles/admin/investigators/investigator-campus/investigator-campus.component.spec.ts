import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorCampusComponent } from './investigator-campus.component';

describe('InvestigatorCampusComponent', () => {
  let component: InvestigatorCampusComponent;
  let fixture: ComponentFixture<InvestigatorCampusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorCampusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
