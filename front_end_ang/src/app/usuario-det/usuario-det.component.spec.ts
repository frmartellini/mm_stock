import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioDetComponent } from './usuario-det.component';

describe('ClienteDetComponent', () => {
  let component: UsuarioDetComponent;
  let fixture: ComponentFixture<UsuarioDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuarioDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
