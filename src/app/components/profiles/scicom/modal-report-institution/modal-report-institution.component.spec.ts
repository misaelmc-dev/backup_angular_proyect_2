import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReportInstitutionComponent } from './modal-report-institution.component';

describe('ModalReportInstitutionComponent', () => {
  let component: ModalReportInstitutionComponent;
  let fixture: ComponentFixture<ModalReportInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReportInstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReportInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
