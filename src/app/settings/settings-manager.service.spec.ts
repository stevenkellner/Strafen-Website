import { TestBed } from '@angular/core/testing';

import { SettingsManagerService } from './settings-manager.service';
import { SignedInPerson } from './settings';
import { Guid } from '../types/guid';

describe('SettingsManagerService', () => {
  let settingsManager: SettingsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    settingsManager = TestBed.inject(SettingsManagerService);
  });

  it('should be created', () => {
    expect(settingsManager).toBeTruthy();
  });

  it('save and read', () => {
    settingsManager.save('appearance', 'dark');
    const signedInPerson: SignedInPerson = { id: Guid.newGuid(), name: { first: 'asfdav', last: 'iojnk' }, fineIds: [], isAdmin: false, hashedUserId: 'oiup89uui', club: { id: Guid.newGuid(), name: 'iuztrfb', paypalMeLink: 'paypal.me/iuzt' } };
    settingsManager.save('signedInPerson', signedInPerson);
    const settingsManager2 = TestBed.inject(SettingsManagerService);
    expect(settingsManager2).toBeTruthy();
    settingsManager2.readSettings();
    expect(settingsManager2.get('appearance')).toEqual('dark');
    expect(settingsManager2.get('sorting')).toEqual({
      personSorting: { sortingKey: 'name', order: 'ascending' },
      reasonTemplateSorting: { sortingKey: 'reasonMessage', order: 'ascending'},
      fineSorting: { sortingKey: 'date', order: 'descending' }
    });
    expect(settingsManager2.get('signedInPerson')).toEqual(signedInPerson);
  });
});
