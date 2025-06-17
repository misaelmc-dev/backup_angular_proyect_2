import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsScintraComponent } from './institutions-scintra.component';

describe('InstitutionsScintraComponent', () => {
  let component: InstitutionsScintraComponent;
  let fixture: ComponentFixture<InstitutionsScintraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionsScintraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionsScintraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
