import { Platform } from "@angular/cdk/platform";
import { DOCUMENT } from "@angular/common";
import { Component, inject, Injectable } from "@angular/core";

const BLACK_ON_WHITE_CSS_CLASS = 'cdk-high-contrast-black-on-white';
const HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = 'cdk-high-contrast-active';
const HIGH_CONTRAST_STORAGE_KEY = 'high-contrast-storage';

@Component({
  selector: 'toggle-highcontrast',
  template: `
  <button mat-icon-button (click)="toggle()" [matTooltip]="isHighContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'" [matTooltipPosition]="'above'" aria-label="Alterar contraste de cores da pagina">
    <mat-icon>contrast</mat-icon>
  </button>
  `,
})
@Injectable({providedIn: 'root'})
export class ToggleHighContrast {

  private _platform = inject(Platform);
  private _document = inject(DOCUMENT);
  private storage = window.localStorage;
  isHighContrast = false;

  ngOnInit() {
    this.isHighContrast = JSON.parse(this.storage.getItem(HIGH_CONTRAST_STORAGE_KEY) ?? String(false))
    this._applyBodyHighContrastModeCssClasses()
  }

  toggle() {
    this.isHighContrast = !this.isHighContrast;
    this._applyBodyHighContrastModeCssClasses();
    this.storage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(this.isHighContrast));
  }

  _applyBodyHighContrastModeCssClasses() {
    if (this._platform.isBrowser && this._document.body) {
      const bodyClasses = this._document.body.classList;
      bodyClasses.remove(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS);
      if (this.isHighContrast) bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS);
    }
  }
}