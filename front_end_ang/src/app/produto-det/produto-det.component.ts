import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-produto-det',
  templateUrl: './produto-det.component.html',
  styleUrl: './produto-det.component.css'
})
export class ProdutoDetComponent {

  public produto_form: FormGroup = new FormGroup({
    descricao: new FormControl(''),
    cor: new FormControl(''),
    tamanho: new FormControl(''),
    tipo_material: new FormControl(''),
    preco_venda: new FormControl(''),
    quantidade_atual: new FormControl(''),
  });

}

//descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual