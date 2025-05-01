import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectByCityComponent } from './project-by-city.component';

describe('ProjectByCityComponent', () => {
  let component: ProjectByCityComponent;
  let fixture: ComponentFixture<ProjectByCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectByCityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectByCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
