import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeAreasComponent } from './knowledge-areas.component';

describe('KnowledgeAreasComponent', () => {
  let component: KnowledgeAreasComponent;
  let fixture: ComponentFixture<KnowledgeAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowledgeAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
