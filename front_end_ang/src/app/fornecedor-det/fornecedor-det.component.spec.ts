import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorDetComponent } from './fornecedor-det.component';

describe('FornecedorDetComponent', () => {
  let component: FornecedorDetComponent;
  let fixture: ComponentFixture<FornecedorDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FornecedorDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FornecedorDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
