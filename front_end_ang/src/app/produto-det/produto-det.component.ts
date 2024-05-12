import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-produto-det',
  templateUrl: './produto-det.component.html',
  styleUrl: './produto-det.component.css'
})
export class ProdutoDetComponent {

  readonly produtosApiService = inject(ProdutoService)

  public produto_form: FormGroup = new FormGroup({
    descricao: new FormControl(''),
    cor: new FormControl(''),
    tamanho: new FormControl(''),
    tipo_material: new FormControl(''),
    preco_venda: new FormControl(''),
    quantidade_atual: new FormControl(''),
  });

  public getInputs() {  
    //return this.cliente_form.value;
    console.log(this.produto_form.value);
  }

  public postProduto():void {
    const produto = this.produto_form.value;
    this.produtosApiService.criarNovoProduto(produto).subscribe({
      next: (response) => console.log(response),
      //error: (err) => console.log(err)
    });
    //this.cliente_service.criarNovoCliente(this.cliente_form.value).subscribe();
    //console.log(this.cliente_form.value);
  }

}

//descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual