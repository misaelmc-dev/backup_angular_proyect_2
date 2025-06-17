import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceSimilarComponent } from './source-similar.component';

describe('SourceSimilarComponent', () => {
  let component: SourceSimilarComponent;
  let fixture: ComponentFixture<SourceSimilarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceSimilarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceSimilarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
