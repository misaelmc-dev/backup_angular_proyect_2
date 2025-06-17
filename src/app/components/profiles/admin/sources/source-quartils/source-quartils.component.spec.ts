import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceQuartilsComponent } from './source-quartils.component';

describe('SourceQuartilsComponent', () => {
  let component: SourceQuartilsComponent;
  let fixture: ComponentFixture<SourceQuartilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceQuartilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceQuartilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
