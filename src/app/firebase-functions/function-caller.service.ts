import { Injectable } from '@angular/core';
import { FirebaseFunction } from './firebase-function';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { CrypterService } from '../crypter';
import { environment } from 'src/environments/environment';
import { DatabaseType, VerboseType } from '../types';
import { CallSecret } from './call-secret';
import { lastValueFrom } from 'rxjs';
import { FirebasefunctionResult } from './firebase-function-result';

@Injectable({
  providedIn: 'root'
})
export class FunctionCallerService {

  constructor(
    private readonly functions: AngularFireFunctions,
    private readonly crypter: CrypterService
  ) {}

  private completeFunctionName(functionName: string): string {
    switch (environment.databaseType.value) {
      case 'release':
        return functionName;
      case 'debug':
        return `debug-${functionName}`
      case 'testing':
        return `debug-${functionName}`
    }
  }

  public async call<Function extends FirebaseFunction.DefaultType>(firebaseFunction: Function): Promise<FirebaseFunction.ReturnType<Function>> {
    const expiresAtIsoDate = new Date(new Date().getTime() + 60000).toISOString();
    const callableFunction = this.functions.httpsCallable<{
      verbose: VerboseType.Value;
      databaseType: DatabaseType.Value;
      callSecret: CallSecret;
      parameters: string;
    }, {
      result: string;
      context: unknown;
    }>(this.completeFunctionName(firebaseFunction.functionName));
    const httpsCallableResult = await lastValueFrom(callableFunction({
      verbose: environment.verbose.value,
      databaseType: environment.databaseType.value,
      callSecret: {
        expiresAt: expiresAtIsoDate,
        hashedData: CrypterService.sha512(expiresAtIsoDate, environment.callSecretKey)
      },
      parameters: this.crypter.encodeEncrypt(firebaseFunction.flattenParameters)
    }));
    const result: FirebasefunctionResult<FirebaseFunction.FlattenReturnType<Function>> = this.crypter.decryptDecode(httpsCallableResult.result);
    if (result.state === 'failure')
      throw result.error;
    return firebaseFunction.parseReturnValue(result.value) as FirebaseFunction.ReturnType<Function>;
  }
}
