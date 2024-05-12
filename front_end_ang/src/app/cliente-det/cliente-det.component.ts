import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { response } from 'express';

@Component({
  selector: 'app-cliente-det',
  templateUrl: './cliente-det.component.html',
  styleUrl: './cliente-det.component.css'
})
export class ClienteDetComponent {

  private readonly clientsApiService = inject(ClienteService)

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
  public postCliente():void {
    const cliente = this.cliente_form.value;
    this.clientsApiService.criarNovoCliente(cliente).subscribe({
      next: (response) => console.log(response),
      //error: (err) => console.log(err)
    });
    //this.cliente_service.criarNovoCliente(this.cliente_form.value).subscribe();
    //console.log(this.cliente_form.value);
  }

}
///nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf