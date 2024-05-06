import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoEntradaComponent } from './produto-entrada.component';

describe('ProdutoEntradaComponent', () => {
  let component: ProdutoEntradaComponent;
  let fixture: ComponentFixture<ProdutoEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutoEntradaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdutoEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
