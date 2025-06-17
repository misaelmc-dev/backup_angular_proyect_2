import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityCampusComponent } from './university-campus.component';

describe('UniversityCampusComponent', () => {
  let component: UniversityCampusComponent;
  let fixture: ComponentFixture<UniversityCampusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniversityCampusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversityCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
