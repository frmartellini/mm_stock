import { Component, Inject, OnInit } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { AuthenticationService } from './services/authentication.service';
import { LoginComponent } from './login/login.component';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { environment } from '../environments/environment';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Controle de Estoque';
  menu: boolean = false;

  // Vars que indicam se está executando no servidor ou no browser
  isServer: boolean;
  isBrowser: boolean;
  platformId: Object;  // Declare platformId as a property
  IsInProduction: Boolean; // indica se o sistema estah rodando em producao (true)
  currentYear: number; // Ano corrente no footer da pagina

  constructor(
    public authenticationService: AuthenticationService,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.platformId = platformId; // Assign the platformId to the property
    this.isServer = isPlatformServer(platformId);
    this.isBrowser = isPlatformBrowser(platformId);
    this.IsInProduction = environment.production;
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(this.updateActiveLinks);

      // Ensure the active link is set on initial load
      this.updateActiveLinks();
    }
  }

  deslogar() {
    this.authenticationService.deslogar();
  }

  showMenu(component: any): void {
    this.menu = !(component instanceof LoginComponent);
  }

  updateActiveLinks() {
    if (this.isBrowser) {
      const links = document.querySelectorAll('nav a');
      const currentPath = this.router.url;

      links.forEach(link => {
        if (link.getAttribute('routerLink') === currentPath) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }
}
