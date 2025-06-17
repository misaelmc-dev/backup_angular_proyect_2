import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCentersComponent } from './research-centers.component';

describe('ResearchCentersComponent', () => {
  let component: ResearchCentersComponent;
  let fixture: ComponentFixture<ResearchCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCentersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
