import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasCliGrafComponent } from './vendas-cli-graf.component';

describe('VendasCliGrafComponent', () => {
  let component: VendasCliGrafComponent;
  let fixture: ComponentFixture<VendasCliGrafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendasCliGrafComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendasCliGrafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
