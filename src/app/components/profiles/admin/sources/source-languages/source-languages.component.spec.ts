import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceLanguagesComponent } from './source-languages.component';

describe('SourceLanguagesComponent', () => {
  let component: SourceLanguagesComponent;
  let fixture: ComponentFixture<SourceLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceLanguagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
