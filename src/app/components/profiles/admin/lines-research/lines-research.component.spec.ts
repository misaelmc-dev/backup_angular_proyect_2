import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesResearchComponent } from './lines-research.component';

describe('LinesResearchComponent', () => {
  let component: LinesResearchComponent;
  let fixture: ComponentFixture<LinesResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinesResearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
