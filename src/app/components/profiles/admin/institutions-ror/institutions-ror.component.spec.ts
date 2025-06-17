import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsRorComponent } from './institutions-ror.component';

describe('InstitutionsRorComponent', () => {
  let component: InstitutionsRorComponent;
  let fixture: ComponentFixture<InstitutionsRorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionsRorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionsRorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
