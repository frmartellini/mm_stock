import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fornecedor-det',
  templateUrl: './fornecedor-det.component.html',
  styleUrl: './fornecedor-det.component.css'
})
export class FornecedorDetComponent {

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

}




//nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf }