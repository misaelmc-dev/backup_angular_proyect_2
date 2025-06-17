import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceResearchTopicsComponent } from './source-research-topics.component';

describe('SourceResearchTopicsComponent', () => {
  let component: SourceResearchTopicsComponent;
  let fixture: ComponentFixture<SourceResearchTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceResearchTopicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceResearchTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
