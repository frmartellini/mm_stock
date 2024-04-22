import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoDetComponent } from './produto-det.component';

describe('ProdutoDetComponent', () => {
  let component: ProdutoDetComponent;
  let fixture: ComponentFixture<ProdutoDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdutoDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdutoDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
