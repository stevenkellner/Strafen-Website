import { FirebaseOptions } from '@angular/fire/app';
import { CrypterService } from '../app/crypter';
import { DatabaseType, VerboseType } from '../app/types';

export type IEnvironment = {
  firebase: FirebaseOptions;
  databaseType: DatabaseType;
  testUser?: {
    email: string;
    password: string;
  };
  verbose: VerboseType;
  cryptionKeys: CrypterService.Keys;
  callSecretKey: string;
  production: boolean;
  name: string;
}
