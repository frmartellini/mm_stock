import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import Utils from '../utils';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})

export class ConfigComponent {

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

    // chamar a rotina que altera a senha
    this.authService.updatePassword(this.confirmPwd?.value
                                    ,this.oldPwd?.value
                                    ,this.OnPwChangeSuccess.bind(this)
                                    ,this.OnPwChangeError.bind(this)
                                    );

  }

} // class
