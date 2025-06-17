import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceHistoryComponent } from './source-history.component';

describe('SourceHistoryComponent', () => {
  let component: SourceHistoryComponent;
  let fixture: ComponentFixture<SourceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
