import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInclusionComponent } from './client-inclusion.component';

describe('ClientInclusionComponent', () => {
  let component: ClientInclusionComponent;
  let fixture: ComponentFixture<ClientInclusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientInclusionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientInclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
