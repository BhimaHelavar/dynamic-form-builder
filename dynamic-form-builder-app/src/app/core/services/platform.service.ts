import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private isBrowser: boolean = true;

  constructor() {
    // In a non-SSR app, we're always in the browser
    this.isBrowser = true;
  }

  /**
   * Checks if code is running in a browser environment
   */
  get isRunningInBrowser(): boolean {
    return this.isBrowser;
  }

  /**
   * Safely get item from localStorage (SSR-safe)
   */
  getLocalStorageItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Safely set item in localStorage (SSR-safe)
   */
  setLocalStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Safely remove item from localStorage (SSR-safe)
   */
  removeLocalStorageItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
