import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  private get storage(): Storage | null {
    return this.document.defaultView?.localStorage || null;
  }

  getItem<T>(key: string): T | null {
    const data = this.storage?.getItem(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: unknown): void {
    this.storage?.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    this.storage?.removeItem(key);
  }

  clear(): void {
    this.storage?.clear();
  }
}
