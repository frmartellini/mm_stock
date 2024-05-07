import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router
             )
  {

  }

  consultar_mov_entrada(): void {
  
    var id :string = "";

    id = (<HTMLInputElement>document.getElementById("id_mov_entrada")).value;

    this.router.navigate(["/produto-entrada/" + id]);
    
  }

  consultar_mov_saida(): void {
  
    var id :string = "";

    id = (<HTMLInputElement>document.getElementById("id_mov_saida")).value;

    this.router.navigate(["/produto-saida/" + id]);
    
  }

}


