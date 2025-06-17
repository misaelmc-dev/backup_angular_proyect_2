import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorSniLevelsComponent } from './investigator-sni-levels.component';

describe('InvestigatorSniLevelsComponent', () => {
  let component: InvestigatorSniLevelsComponent;
  let fixture: ComponentFixture<InvestigatorSniLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorSniLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorSniLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
