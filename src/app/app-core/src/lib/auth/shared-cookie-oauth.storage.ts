import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class SharedCookieOAuthStorage implements OAuthStorage {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  getItem(key: string): string | null {
    const cookie = this.readCookie(key);
    return cookie ? decodeURIComponent(cookie) : null;
  }

  removeItem(key: string): void {
    this.document.cookie = `${encodeURIComponent(key)}=; Max-Age=0; path=/; SameSite=Lax`;
  }

  setItem(key: string, data: string): void {
    this.document.cookie = [
      `${encodeURIComponent(key)}=${encodeURIComponent(data)}`,
      'path=/',
      'SameSite=Lax'
    ].join('; ');
  }

  private readCookie(key: string): string | null {
    const encodedKey = `${encodeURIComponent(key)}=`;
    const cookies = this.document.cookie ? this.document.cookie.split('; ') : [];

    for (const cookie of cookies) {
      if (cookie.startsWith(encodedKey)) {
        return cookie.substring(encodedKey.length);
      }
    }

    return null;
  }
}
