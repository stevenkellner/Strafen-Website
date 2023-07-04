import { TestBed } from '@angular/core/testing';

import { FunctionCallerService } from './function-caller.service';
import { ClubNewFunction, ClubNewTestFunction, DeleteAllDataFunction, FineAddFunction, FineDeleteFunction, FineEditPayedFunction, FineGetFunction, FineGetFunctionType, FineUpdateFunction, InvitationLinkCreateIdFunction, InvitationLinkCreateIdFunctionType, InvitationLinkGetPersonFunction, InvitationLinkGetPersonFunctionType, InvitationLinkWithdrawFunction, NotificationPushFunction, NotificationRegisterFunction, PaypalMeSetFunction, PersonAddFunction, PersonDeleteFunction, PersonGetCurrentFunction, PersonGetCurrentFunctionType, PersonGetFunction, PersonGetFunctionType, PersonMakeManagerFunction, PersonRegisterFunction, PersonRegisterFunctionType, PersonUpdateFunction, ReasonTemplateAddFunction, ReasonTemplateDeleteFunction, ReasonTemplateGetFunction, ReasonTemplateGetFunctionType, ReasonTemplateUpdateFunction } from './functions';
import { Guid } from '../types/guid';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database'
import { environment } from 'src/environments/environment';
import { UserAuthenticationType } from '../types/user-authentication-type';
import { CrypterService } from '../crypter';
import { AngularFireFunctions, REGION } from '@angular/fire/compat/functions';
import { AngularFireModule } from '@angular/fire/compat';
import { Amount } from '../types/amount';
import { FunctionType } from './firebase-function';
import { Person } from '../types/person';

describe('FunctionCallerService', () => {
  let functionCaller: FunctionCallerService;
  let firebaseAuthentication: AngularFireAuth;
  let firebaseDatabase: AngularFireDatabase;
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
    functionCaller = TestBed.inject(FunctionCallerService);
    crypter = TestBed.inject(CrypterService);
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
  });

  afterEach(async () => {
    const deleteAllDataFunction = new DeleteAllDataFunction();
    await functionCaller.call(deleteAllDataFunction);
  });

  it('should be created', () => {
    expect(functionCaller).toBeTruthy();
    expect(firebaseAuthentication).toBeTruthy();
    expect(firebaseDatabase).toBeTruthy();
    expect(crypter).toBeTruthy();
  });

  it('throws https error', async () => {
    let fineEditPayedFunction = new FineEditPayedFunction(clubId, Guid.newGuid(), 'payed');
    await functionCaller.call(fineEditPayedFunction)
      .then(() => {
        fail();
      }).catch((error) => {
        expect(error.name).toEqual('FirebaseFunctionError');
        expect(error.code).toEqual('not-found');
        expect(error.message).toEqual('Couldn\'t found fine to edit payed state.');
      });
  });

  it('new club', async () => {
    const clubNewFunction = new ClubNewFunction(Guid.newGuid(), {
      name: 'abc',
      paypalMeLink: null
    }, Guid.newGuid(), {
      first: 'John',
      last: 'Doe'
    });
    await functionCaller.call(clubNewFunction);
  });

  it('fine add', async () => {
    const fineAddFunction = new FineAddFunction(clubId, {
      id: Guid.newGuid(),
      personId: Guid.newGuid(),
      payedState: 'unpayed',
      date: new Date(),
      amount: new Amount(1, 50),
      reasonMessage: 'asdf'
    });
    await functionCaller.call(fineAddFunction);
  });

  it('fine update', async () => {
    const fineUpdateFunction = new FineUpdateFunction(clubId, {
      id: new Guid('02462A8B-107F-4BAE-A85B-EFF1F727C00F'),
      personId: Guid.newGuid(),
      payedState: 'unpayed',
      date: new Date(),
      amount: new Amount(1, 50),
      reasonMessage: 'asdf'
    });
    await functionCaller.call(fineUpdateFunction);
  });

  it('fine delete', async () => {
    const fineDeleteFunction = new FineDeleteFunction(clubId, new Guid('02462A8B-107F-4BAE-A85B-EFF1F727C00F'));
    await functionCaller.call(fineDeleteFunction);
  });

  it('fine edit payed', async () => {
    const fineEditPayedFunction = new FineEditPayedFunction(clubId, new Guid('0B5F958E-9D7D-46E1-8AEE-F52F4370A95A'), 'payed');
    await functionCaller.call(fineEditPayedFunction);
  });

  it('fine get', async () => {
    const fineGetFunction = new FineGetFunction(clubId);
    const fineList = await functionCaller.call(fineGetFunction) as FunctionType.ReturnType<FineGetFunctionType>;
    expect(fineList).toEqual({
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
    });
  });

  it('person add', async () => {
    const personAddFunction = new PersonAddFunction(clubId, {
      id: Guid.newGuid(),
      name: {
        first: 'John',
        last: 'Doe'
      },
      signInData: undefined,
      fineIds: [],
      isInvited: false
    });
    await functionCaller.call(personAddFunction);
  });

  it('person update', async () => {
    const personUpdateFunction = new PersonUpdateFunction(clubId, {
      id: new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'),
      name: {
        first: 'John',
        last: 'Doe'
      },
      signInData: undefined,
      fineIds: [],
      isInvited: false
    });
    await functionCaller.call(personUpdateFunction);
  });

  it('person delete', async () => {
    const personDeleteFunction = new PersonDeleteFunction(clubId, new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'));
    await functionCaller.call(personDeleteFunction);
  });

  it('person get current', async () => {
    const user = await firebaseAuthentication.currentUser;
    expect(user).not.toBeNull();
    const hashedUserId = CrypterService.sha512(user!.uid);
    const personId = Guid.newGuid();
    await firebaseDatabase.database.ref(`users/${hashedUserId}`).set(crypter.encodeEncrypt({ clubId: clubId.guidString, personId: personId.guidString }));
    const signInDate = new Date();
    await firebaseDatabase.database.ref(`clubs/${clubId.guidString}/persons/${personId.guidString}`).set(crypter.encodeEncrypt({ id: personId.guidString, name: { first: 'asdf', last: 'imv'}, fineIds: [], signInData: { hashedUserId: hashedUserId, signInDate: signInDate.toISOString(), authentication: ['clubMember'], notificationTokens: {} }, isInvited: false } satisfies Person.Flatten));
    const personGetCurrentFunction = new PersonGetCurrentFunction();
    const person = await functionCaller.call(personGetCurrentFunction) as FunctionType.ReturnType<PersonGetCurrentFunctionType>;
    expect(person).toEqual({ id: personId, name: { first: 'asdf', last: 'imv' }, fineIds: [], signInData: { hashedUserId: hashedUserId, signInDate: signInDate, authentication: ['clubMember'], notificationTokens: {} }, club: { id: clubId, name: 'Neuer Verein', paypalMeLink: 'paypal.me/test' }, isInvited: false });
  });

  it('person get', async () => {
    const personGetFunction = new PersonGetFunction(clubId);
    const personList = await functionCaller.call(personGetFunction) as FunctionType.ReturnType<PersonGetFunctionType>;
    expect(personList).toEqual({
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
    });
  });

  it('person register', async () => {
    const user = await firebaseAuthentication.currentUser;
    expect(user).not.toBeNull();
    const hashedUserId = CrypterService.sha512(user!.uid);
    await firebaseDatabase.database.ref(`clubs/${clubId.guidString}/authentication/clubMember/${hashedUserId}`).remove();
    await firebaseDatabase.database.ref(`clubs/${clubId.guidString}/authentication/clubManager/${hashedUserId}`).remove();
    const personRegisterFunction = new PersonRegisterFunction(clubId, new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'));
    const club = await functionCaller.call(personRegisterFunction) as FunctionType.ReturnType<PersonRegisterFunctionType>;
    expect(club).toEqual({
      id: clubId,
      name: 'Neuer Verein',
      paypalMeLink: 'paypal.me/test'
    });
  });

  it('person make manager', async () => {
    const personMakeManagerFunction = new PersonMakeManagerFunction(clubId, new Guid('7BB9AB2B-8516-4847-8B5F-1A94B78EC7B7'));
    await functionCaller.call(personMakeManagerFunction);
  });

  it('reason template add', async () => {
    const reasonTemplateAddFunction = new ReasonTemplateAddFunction(clubId, {
      id: Guid.newGuid(),
      amount: new Amount(1, 50),
      reasonMessage: 'lköansdf'
    });
    await functionCaller.call(reasonTemplateAddFunction);
  });

  it('reason template update', async () => {
    const reasonTemplateUpdateFunction = new ReasonTemplateUpdateFunction(clubId, {
      id: new Guid('062FB0CB-F730-497B-BCF5-A4F907A6DCD5'),
      amount: new Amount(1, 50),
      reasonMessage: 'lköansdf'
    });
    await functionCaller.call(reasonTemplateUpdateFunction);
  });

  it('reason template delete', async () => {
    const reasonTemplateDeleteFunction = new ReasonTemplateDeleteFunction(clubId, new Guid('062FB0CB-F730-497B-BCF5-A4F907A6DCD5'));
    await functionCaller.call(reasonTemplateDeleteFunction);
  });

  it('reason template get', async () => {
    const reasonTemplateGetFunction = new ReasonTemplateGetFunction(clubId);
    const reasonTemplateList = await functionCaller.call(reasonTemplateGetFunction) as FunctionType.ReturnType<ReasonTemplateGetFunctionType>;
    expect(reasonTemplateList).toEqual({
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
    });
  });

  it('invitation link create id', async () => {
    const invitationLinkCreateIdFunction = new InvitationLinkCreateIdFunction(clubId, new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'));
    await functionCaller.call(invitationLinkCreateIdFunction);
  });

  it('invitation link withdraw', async () => {
    const invitationLinkWithdrawFunction = new InvitationLinkWithdrawFunction(clubId, new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'));
    await functionCaller.call(invitationLinkWithdrawFunction);
  });

  it('invitation link get person', async () => {
    const invitationLinkCreateIdFunction = new InvitationLinkCreateIdFunction(clubId, new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'));
    const invitationLinkId = await functionCaller.call(invitationLinkCreateIdFunction) as FunctionType.ReturnType<InvitationLinkCreateIdFunctionType>;
    const invitationLinkGetPersonFunction = new InvitationLinkGetPersonFunction(invitationLinkId);
    const person = await functionCaller.call(invitationLinkGetPersonFunction) as FunctionType.ReturnType<InvitationLinkGetPersonFunctionType>;
    expect(person).toEqual({ id: new Guid('D1852AC0-A0E2-4091-AC7E-CB2C23F708D9'), name: { first: 'Jane', last: 'Doe' }, fineIds: [], club: { id: clubId, name: 'Neuer Verein', paypalMeLink: 'paypal.me/test' } })
  });

  it('notification register', async () => {
    const notificationRegisterFunction = new NotificationRegisterFunction(clubId, new Guid('76025DDE-6893-46D2-BC34-9864BB5B8DAD'), 'abc123');
    await functionCaller.call(notificationRegisterFunction);
  });

  it('notification push', async () => {
    const notificationPushFunction = new NotificationPushFunction(clubId, new Guid('76025DDE-6893-46D2-BC34-9864BB5B8DAD'), { title: 'A title', body: 'The body' });
    await functionCaller.call(notificationPushFunction);
  });

  it('paypal me set', async () => {
    const paypalMeSetFunction = new PaypalMeSetFunction(clubId, 'paypal.me/asdf');
    await functionCaller.call(paypalMeSetFunction);
  });
});
