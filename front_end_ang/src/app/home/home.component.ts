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

  // ajustar (aumentar/diminuir) a altura da "HomeBackgroundDiv"
  AdjustBackgroundDivHeight() {
    //console.log("document.documentElement.clientHeight=" + document.documentElement.clientHeight);
    var FullClientHeight = document.documentElement.clientHeight;
    //console.log("FullClientHeight=" + FullClientHeight);
    //console.log('(<HTMLDivElement>document.getElementById("Header")).style.height=' + (<HTMLDivElement>document.getElementById("Header")).clientHeight);
    var HeaderHeight = (<HTMLDivElement>document.getElementById("Header")).clientHeight;
    //console.log('(<HTMLDivElement>document.getElementById("Footer")).style.height=' + (<HTMLDivElement>document.getElementById("Footer")).clientHeight);
    var FooterHeight = (<HTMLDivElement>document.getElementById("Footer")).clientHeight;
    //var FooterHeight = parseInt() ;
    var NewHomeBackgroundDivHeight = FullClientHeight - FooterHeight - HeaderHeight;
    //console.log("NewHomeBackgroundDivHeight=" + NewHomeBackgroundDivHeight);
    // alterar a altura da div "HomeBackgroundDiv" para a nova altura que foi calculada descontando a altura do Header e do Footer
    (<HTMLDivElement>document.getElementById("HomeBackgroundDiv")).style.height = NewHomeBackgroundDivHeight+"px";
  }

  ngAfterViewInit() {
    //console.log('AfterViewInit');
    this.AdjustBackgroundDivHeight();
  }

  // executado quando a "HomeBackgroundDiv" sofre um redimensionamento
  onResize(event: any) {
    //console.log("event.target.innerWidth="+event.target.innerWidth);
    this.AdjustBackgroundDivHeight();
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

  // para ativar a chamda desta funcao precisa adicionar   (click)="HomeBackgroundDiv_Click()    na "HomeBackgroundDiv"
  //HomeBackgroundDiv_Click() {
  //  (<HTMLDivElement>document.getElementById("HomeBackgroundDiv")).style.height = "900px";
  //}

}


