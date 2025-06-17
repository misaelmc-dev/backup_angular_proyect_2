import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportAnualComponent } from './modal-report-anual.component';

describe('ModalReportAnualComponent', () => {
  let component: ModalReportAnualComponent;
  let fixture: ComponentFixture<ModalReportAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReportAnualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
