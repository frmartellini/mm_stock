import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasGrafComponent } from './vendas-graf.component';

describe('VendasGrafComponent', () => {
  let component: VendasGrafComponent;
  let fixture: ComponentFixture<VendasGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendasGrafComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendasGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
