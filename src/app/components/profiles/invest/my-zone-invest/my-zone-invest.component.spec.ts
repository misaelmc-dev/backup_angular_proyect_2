import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyZoneInvestComponent } from './my-zone-invest.component';

describe('MyZoneInvestComponent', () => {
  let component: MyZoneInvestComponent;
  let fixture: ComponentFixture<MyZoneInvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyZoneInvestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyZoneInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
