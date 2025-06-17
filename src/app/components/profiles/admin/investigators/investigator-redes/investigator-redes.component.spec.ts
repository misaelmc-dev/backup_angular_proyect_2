import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorRedesComponent } from './investigator-redes.component';

describe('InvestigatorRedesComponent', () => {
  let component: InvestigatorRedesComponent;
  let fixture: ComponentFixture<InvestigatorRedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigatorRedesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigatorRedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
