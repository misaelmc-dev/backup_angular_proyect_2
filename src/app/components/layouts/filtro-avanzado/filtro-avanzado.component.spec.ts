import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroAvanzadoComponent } from './filtro-avanzado.component';

describe('FiltroAvanzadoComponent', () => {
  let component: FiltroAvanzadoComponent;
  let fixture: ComponentFixture<FiltroAvanzadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroAvanzadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroAvanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
