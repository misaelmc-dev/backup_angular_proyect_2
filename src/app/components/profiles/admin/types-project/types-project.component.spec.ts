import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesProjectComponent } from './types-project.component';

describe('TypesProjectComponent', () => {
  let component: TypesProjectComponent;
  let fixture: ComponentFixture<TypesProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
