import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Settings } from './settings';
import { CrypterService } from '../crypter';

@Injectable({
  providedIn: 'root'
})
export class SettingsManagerService {

  private settings: Settings;

  constructor(
    private readonly cookieService: CookieService,
    private readonly crypter: CrypterService
  ) {
    this.settings = Settings.defaultValue;
    this.readSettings();
  }

  readSettings() {
    if (!this.cookieService.check('settings'))
      return;
    const encryptedData = this.cookieService.get('settings');
    const flattenSettings: Settings.Flatten = this.crypter.decryptDecode(encryptedData);
    this.settings = Settings.concrete(flattenSettings);
  }

  get<Key extends keyof Settings>(key: Key): Settings[Key] {
    return this.settings[key];
  }

  saveSettings() {
    const encryptedData = this.crypter.encodeEncrypt(Settings.flatten(this.settings));
    this.cookieService.set('settings', encryptedData);
  }

  save<Key extends keyof Settings>(key: Key, value: Settings[Key]) {
    this.settings[key] = value;
    this.saveSettings();
  }
}
