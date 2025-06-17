import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyImpactInvestComponent } from './my-impact-invest.component';

describe('MyImpactInvestComponent', () => {
  let component: MyImpactInvestComponent;
  let fixture: ComponentFixture<MyImpactInvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyImpactInvestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyImpactInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
