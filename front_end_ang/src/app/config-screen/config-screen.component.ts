import { Component } from '@angular/core';

@Component({
  selector: 'app-config-screen',
  template: `
  <div class="d-flex flex-column align-items-center config-screen-style">
    <!-- Título do formulário para ajudar leitores de tela -->
    <h1 id="login-form-title" class="sr-only">Configurações do sistema</h1>

    <h2 id="PageTitle" class="mb-3">Configurações do sistema</h2>
    <div class="d-flex align-items-start justify-content-around gap-5">
      <app-altersenha/>
      <app-config/>
    </div>
  </div>
  `,
  styles: ``
})
export class ConfigScreenComponent {

}
