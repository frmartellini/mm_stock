import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import Utils from '../utils';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-altersenha',
  templateUrl: './altersenha.component.html',
  styleUrl: './altersenha.component.scss'
})

export class AlterSenhaComponent {

  ConfigForm: FormGroup;

  constructor(fb: FormBuilder
              ,private authService: AuthenticationService
              ,private toastr: ToastrService
              ,private router: Router
              )
  {
    this.ConfigForm = fb.group({
      'oldPwd': ['',Validators.required],
      'newPwd': ['',Validators.required],
      'confirmPwd': ['',Validators.required]
    },
    );
  }

  get oldPwd() {
    return this.ConfigForm.get('oldPwd');
  }

  get newPwd() {
    return this.ConfigForm.get('newPwd');
  }

  get confirmPwd() {
    return this.ConfigForm.get('confirmPwd');
  }

  OnPwChangeSuccess() {

    console.log(Utils.getDateTimeString() + " OnPwChangeSuccess foi executada");

    this.toastr.success('Nova senha gravada com sucesso!' , '', {
      timeOut: 3000
      ,positionClass: 'toast-top-center'
    });

    // redirecionar para a home
    this.router.navigate(['/']);

  }

  OnPwChangeError() {

    console.log(Utils.getDateTimeString() + " OnPwChangeError foi executada");

    this.toastr.error('Erro ao gravar a nova senha.' , '', {
      timeOut: 5000
      ,positionClass: 'toast-top-center'
    });

  }

  onSubmit() {

    //console.log(this.confirmPwd?.value);

    // verificar se a senha tem o tamanho minimo de chars
    if ( this.newPwd?.value.length < environment.NumMinCharSenhaUsuario ) {
      this.toastr.error('A senha deve ter ao menos '+ environment.NumMinCharSenhaUsuario +' caracteres.' , '', {
        timeOut: 3000
        ,positionClass: 'toast-top-center'
      });
      return;
    }

    // chamar a rotina que altera a senha do usuario
    this.authService.AlterSenhaUsuario(this.authService.IDUsuarioLogado
                                       ,this.confirmPwd?.value
                                       ,this.oldPwd?.value
                                       ,this.OnPwChangeSuccess.bind(this)
                                       ,this.OnPwChangeError.bind(this)
                                       );

  } // onSubmit

} // class
