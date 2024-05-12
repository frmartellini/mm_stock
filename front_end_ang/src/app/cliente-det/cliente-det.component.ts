import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cliente-det',
  templateUrl: './cliente-det.component.html',
  styleUrl: './cliente-det.component.css'
})
export class ClienteDetComponent {

  public cliente_form: FormGroup = new FormGroup({
    nome_completo: new FormControl(''),
    email: new FormControl(''),
    telefone: new FormControl(''),
    nome_loja: new FormControl(''),
    cpf: new FormControl(''),
    tipo_cliente: new FormControl(''),
    endereco: new FormControl(''),
    numero: new FormControl(''),
    complemento: new FormControl(''),
    cidade: new FormControl(''),
    uf: new FormControl(''),
  });

  public getInputs() {  
    //return this.cliente_form.value;
    console.log(this.cliente_form.value);
  }


}
///nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf