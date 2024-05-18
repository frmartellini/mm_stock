import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentacaoCsComponent } from './movimentacao-cs.component';

describe('MovimentacaoCsComponent', () => {
  let component: MovimentacaoCsComponent;
  let fixture: ComponentFixture<MovimentacaoCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimentacaoCsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovimentacaoCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
