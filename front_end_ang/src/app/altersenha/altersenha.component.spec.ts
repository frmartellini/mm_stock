import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterSenhaComponent } from './altersenha.component';

describe('ConfigComponent', () => {
  let component: AlterSenhaComponent;
  let fixture: ComponentFixture<AlterSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlterSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlterSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
