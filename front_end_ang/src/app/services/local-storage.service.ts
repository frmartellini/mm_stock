import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

  constructor()
  {

  }

  // retorna se o localStorage estah acessivel
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  // Set a value in local storage
  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable) {
      localStorage.setItem(key, value);
    }
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable) {
      return localStorage.getItem(key);
    }
    else {
      return null;
    }
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem(key);
    }
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }

} // class
