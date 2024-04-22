import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDetComponent } from './cliente-det.component';

describe('ClienteDetComponent', () => {
  let component: ClienteDetComponent;
  let fixture: ComponentFixture<ClienteDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClienteDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
