import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FornecedorService } from '../services/fornecedor.service';


@Component({
  selector: 'app-fornecedor-det',
  templateUrl: './fornecedor-det.component.html',
  styleUrl: './fornecedor-det.component.css'
})
export class FornecedorDetComponent {

  private readonly fornecedoresApiService = inject(FornecedorService)

  public fornecedor_form: FormGroup = new FormGroup({
    nome_fornecedor: new FormControl(''),
    nome_responsavel: new FormControl(''),
    contato_telefonico: new FormControl(''),
    redes_sociais: new FormControl(''),
    materiais_fornecidos: new FormControl(''),
    cnpj: new FormControl(''),
    endereco: new FormControl(''),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    cidade: new FormControl(''),
    uf: new FormControl(''),
  });

  public getInputs() {  
    //return this.cliente_form.value;
    console.log(this.fornecedor_form.value);
  }

  public postFornecedor():void {
    const fornecedor = this.fornecedor_form.value;
    this.fornecedoresApiService.criarNovoFornecedor(fornecedor).subscribe({
      next: (response) => console.log(response),
      //error: (err) => console.log(err)
    });
    //this.cliente_service.criarNovoCliente(this.cliente_form.value).subscribe();
    //console.log(this.cliente_form.value);
  }

}





