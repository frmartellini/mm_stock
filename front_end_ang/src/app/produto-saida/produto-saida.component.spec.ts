import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoSaidaComponent } from './produto-saida.component';

describe('ProdutoEntradaComponent', () => {
  let component: ProdutoSaidaComponent;
  let fixture: ComponentFixture<ProdutoSaidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutoSaidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdutoSaidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
