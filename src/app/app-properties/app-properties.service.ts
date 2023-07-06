import { Injectable } from '@angular/core';
import { SignedInPerson } from '../settings/settings';
import { Person } from '../types/person';
import { ReasonTemplate } from '../types/reason-template';
import { Fine } from '../types/fine';
import { IdentifiableList } from './identifiable-list';
import { FineGetFunction, FineGetFunctionType, PersonGetCurrentFunction, PersonGetCurrentFunctionType, PersonGetFunction, PersonGetFunctionType, ReasonTemplateGetFunction, ReasonTemplateGetFunctionType } from '../firebase-functions/functions';
import { FunctionCallerService } from '../firebase-functions/function-caller.service';
import { FunctionType } from '../firebase-functions/firebase-function';
import { SettingsManagerService } from '../settings/settings-manager.service';
import { FetchState } from '../types/fetch-state';

@Injectable({
  providedIn: 'root'
})
export class AppPropertiesService {

  appProperties: FetchState<AppProperties> = FetchState.loading;

  constructor(
    private readonly functionCaller: FunctionCallerService,
    private readonly settingsManager: SettingsManagerService
  ) {}

  public async fetch(signedInPerson: SignedInPerson) {
    try {
      const clubId = signedInPerson.club.id;
      const personGetFunction = new PersonGetFunction(clubId);
      const reasonTemplateGetFunction = new ReasonTemplateGetFunction(clubId);
      const fineGetFunction = new FineGetFunction(clubId);
      const [persons, reasonTemplates, fines] = await Promise.all([
        this.functionCaller.call(personGetFunction) as Promise<FunctionType.ReturnType<PersonGetFunctionType>>,
        this.functionCaller.call(reasonTemplateGetFunction) as Promise<FunctionType.ReturnType<ReasonTemplateGetFunctionType>>,
        this.functionCaller.call(fineGetFunction) as Promise<FunctionType.ReturnType<FineGetFunctionType>>
      ]);
      this.appProperties = FetchState.success({
        signedInPerson: signedInPerson,
        persons: new IdentifiableList(persons),
        reasonTemplates: new IdentifiableList(reasonTemplates),
        fines: new IdentifiableList(fines)
      });
    } catch (error) {
      this.appProperties = FetchState.failure(error as Error);
    }
  }

  public async refresh() {
    try {
      const personGetCurrentFunction = new PersonGetCurrentFunction();
      const currentPerson = await this.functionCaller.call(personGetCurrentFunction) as FunctionType.ReturnType<PersonGetCurrentFunctionType>;
      const signedInPerson: SignedInPerson = {
        id: currentPerson.id,
        name: currentPerson.name,
        fineIds: currentPerson.fineIds,
        isAdmin: currentPerson.signInData.authentication.includes('clubManager'),
        hashedUserId: currentPerson.signInData.hashedUserId,
        club: currentPerson.club
      };
      this.settingsManager.save('signedInPerson', signedInPerson);
      this.fetch(signedInPerson);
    } catch (error) {
      this.appProperties = FetchState.failure(error as Error);
    }
  }
}

export type AppProperties = {
  signedInPerson: SignedInPerson;
  persons: IdentifiableList<Person>;
  reasonTemplates: IdentifiableList<ReasonTemplate>;
  fines: IdentifiableList<Fine>;
}
