import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInstitutionReportComponent } from './modal-institution-report.component';

describe('ModalInstitutionReportComponent', () => {
  let component: ModalInstitutionReportComponent;
  let fixture: ComponentFixture<ModalInstitutionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInstitutionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInstitutionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
