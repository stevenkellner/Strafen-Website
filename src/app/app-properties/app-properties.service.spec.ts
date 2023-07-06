import { TestBed } from '@angular/core/testing';

import { AppPropertiesService } from './app-properties.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions, REGION } from '@angular/fire/compat/functions';
import { ClubNewTestFunction, DeleteAllDataFunction, PersonGetCurrentFunction, PersonGetCurrentFunctionType } from '../firebase-functions/functions';
import { FunctionCallerService } from '../firebase-functions/function-caller.service';
import { Guid } from '../types/guid';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CrypterService } from '../crypter';
import { UserAuthenticationType } from '../types/user-authentication-type';
import { FunctionType } from '../firebase-functions/firebase-function';
import { SignedInPerson } from '../settings/settings';
import { FetchState } from '../types/fetch-state';
import { IdentifiableList } from './identifiable-list';
import { Amount } from '../types/amount';

describe('AppPropertiesService', () => {
  let appProperties: AppPropertiesService;
  let functionCaller: FunctionCallerService;
  let firebaseDatabase: AngularFireDatabase;
  let firebaseAuthentication: AngularFireAuth;
  let crypter: CrypterService;

  const clubId = Guid.newGuid();

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFireFunctions,
        AngularFireAuth,
        AngularFireDatabase,
        { provide: REGION, useValue: 'europe-west1' }
      ]
    });
    appProperties = TestBed.inject(AppPropertiesService);
    crypter = TestBed.inject(CrypterService);
    functionCaller = TestBed.inject(FunctionCallerService);
    const deleteAllDataFunction = new DeleteAllDataFunction();
    await functionCaller.call(deleteAllDataFunction);
    const clubNewTestFunction = new ClubNewTestFunction(clubId, 'default');
    await functionCaller.call(clubNewTestFunction);
    firebaseAuthentication = TestBed.inject(AngularFireAuth);
    expect(environment.testUser).toBeDefined();
    const userCredential = await firebaseAuthentication.signInWithEmailAndPassword(environment.testUser!.email, environment.testUser!.password);
    expect(userCredential.user).not.toBeNull();
    const hashedUserId = CrypterService.sha512(userCredential.user!.uid);
    const userAuthenticationTypes: UserAuthenticationType[] = ['clubMember', 'clubManager'];
    firebaseDatabase = TestBed.inject(AngularFireDatabase);
    await Promise.all(userAuthenticationTypes.map(async userAuthenticationType => {
      await firebaseDatabase.database.ref(`clubs/${clubId.guidString}/authentication/${userAuthenticationType}/${hashedUserId}`).set('authenticated');
    }));
    await firebaseDatabase.database.ref(`users/${hashedUserId}`).set(crypter.encodeEncrypt({ clubId: clubId.guidString, personId: '76025DDE-6893-46D2-BC34-9864BB5B8DAD' }));
  });

  afterEach(async () => {
    const deleteAllDataFunction = new DeleteAllDataFunction();
    await functionCaller.call(deleteAllDataFunction);
    await firebaseAuthentication.signOut();
  });

  it('should be created', () => {
    expect(appProperties).toBeTruthy();
    expect(functionCaller).toBeTruthy();
    expect(firebaseDatabase).toBeTruthy();
    expect(firebaseAuthentication).toBeTruthy();
    expect(crypter).toBeTruthy();
  });

  it('fetch', async () => {
    const personGetCurrentFunction = new PersonGetCurrentFunction();
    const currentPerson = await functionCaller.call(personGetCurrentFunction) as FunctionType.ReturnType<PersonGetCurrentFunctionType>;
    const signedInPerson: SignedInPerson = {
      id: currentPerson.id,
      name: currentPerson.name,
      fineIds: currentPerson.fineIds,
      isAdmin: currentPerson.signInData.authentication.includes('clubManager'),
      hashedUserId: currentPerson.signInData.hashedUserId,
      club: currentPerson.club
    };
    await appProperties.fetch(signedInPerson);
    expect(appProperties.appProperties.isSuccess()).toBeTrue();
    expect(appProperties.appProperties.content).toEqual({
      signedInPerson: signedInPerson,
      persons: new IdentifiableList({
        '76025DDE-6893-46D2-BC34-9864BB5B8DAD': {
          id: new Guid('76025DDE-6893-46D2-BC34-9864BB5B8DAD'),
          name: {
            first: 'John',
            last: undefined
          },
          fineIds: [new Guid('02462A8B-107F-4BAE-A85B-EFF1F727C00F'), new Guid('0B5F958E-9D7D-46E1-8AEE-F52F4370A95A')],
          signInData:  {
            hashedUserId: 'sha_abc',
            signInDate: new Date('2022-01-24T16:23:45.678Z'),
            authentication: ['clubMember', 'clubManager'],
            notificationTokens: {}
          }, isInvited: false
        },
        'D1852AC0-A0E2-4091-AC7E-CB2C23F708D9': {
          id: new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'),
          name: {
            first: 'Jane',
            last: 'Doe'
          },
          fineIds: [],
          signInData: undefined,
          isInvited: true
        },
        '7BB9AB2B-8516-4847-8B5F-1A94B78EC7B7': {
          id: new Guid('7BB9AB2B-8516-4847-8B5F-1A94B78EC7B7'),
          name: {
            first: 'Max',
            last: 'Mustermann'
          },
          fineIds: [new Guid('1B5F958E-9D7D-46E1-8AEE-F52F4370A95A')],
          signInData: {
            hashedUserId: 'sha_xyz',
            signInDate: new Date('2022-01-26T16:23:45.678Z'),
            authentication: ['clubMember'],
            notificationTokens: {}
          },
          isInvited: false
        }
      }),
      reasonTemplates: new IdentifiableList({
        '062FB0CB-F730-497B-BCF5-A4F907A6DCD5': {
          id: new Guid('062FB0CB-F730-497B-BCF5-A4F907A6DCD5'),
          reasonMessage: "test_reason_1",
          amount: new Amount(1, 0),
          counts: undefined
        },
        '16805D21-5E8D-43E9-BB5C-7B4A790F0CE7': {
          id: new Guid('16805D21-5E8D-43E9-BB5C-7B4A790F0CE7'),
          reasonMessage: "test_reason_2",
          amount: new Amount(2, 50),
          counts: {
            item: 'minute',
            maxCount: undefined
          }
        },
        '23A3412E-87DE-4A23-A08F-67214B8A8541': {
          id: new Guid('23A3412E-87DE-4A23-A08F-67214B8A8541'),
          reasonMessage: "test_reason_3",
          amount: new Amount(2, 0),
          counts: {
            item: 'item',
            maxCount: 3
          }
        }
      }),
      fines: new IdentifiableList({
        '02462A8B-107F-4BAE-A85B-EFF1F727C00F': {
          id: new Guid('02462A8B-107F-4BAE-A85B-EFF1F727C00F'),
          personId: new Guid('76025DDE-6893-46D2-BC34-9864BB5B8DAD'),
          payedState: 'unpayed',
          date: new Date('2023-01-24T16:23:45.678Z'),
          reasonMessage: "test_fine_reason_1",
          amount: new Amount(1, 0)
        },
        '0B5F958E-9D7D-46E1-8AEE-F52F4370A95A': {
          id: new Guid('0B5F958E-9D7D-46E1-8AEE-F52F4370A95A'),
          personId: new Guid('76025DDE-6893-46D2-BC34-9864BB5B8DAD'),
          payedState: 'unpayed',
          date: new Date('2023-01-02T16:23:45.678Z'),
          reasonMessage: "test_fine_reason_2",
          amount: new Amount(2, 50)
        },
        '1B5F958E-9D7D-46E1-8AEE-F52F4370A95A': {
          id: new Guid('1B5F958E-9D7D-46E1-8AEE-F52F4370A95A'),
          personId: new Guid('7BB9AB2B-8516-4847-8B5F-1A94B78EC7B7'),
          payedState: 'payed',
          date: new Date('2023-01-20T16:23:45.678Z'),
          reasonMessage: "test_fine_reason_3",
          amount: new Amount(2, 0)
        }
      })
    });
  });
});
