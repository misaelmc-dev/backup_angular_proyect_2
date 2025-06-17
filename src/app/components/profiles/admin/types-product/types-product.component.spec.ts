import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesProductComponent } from './types-product.component';

describe('TypesProductComponent', () => {
  let component: TypesProductComponent;
  let fixture: ComponentFixture<TypesProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
