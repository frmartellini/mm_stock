import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacaoGrafComponent } from './movimentacao-graf.component';

describe('MovimentacaoGrafComponent', () => {
  let component: MovimentacaoGrafComponent;
  let fixture: ComponentFixture<MovimentacaoGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimentacaoGrafComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovimentacaoGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
