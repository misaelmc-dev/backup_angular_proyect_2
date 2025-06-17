import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceLifetimesComponent } from './source-lifetimes.component';

describe('SourceLifetimesComponent', () => {
  let component: SourceLifetimesComponent;
  let fixture: ComponentFixture<SourceLifetimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceLifetimesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceLifetimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
