import { ClubProperties } from "src/app/types/club-properties";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Person } from "src/app/types/person";
import { Guid } from "src/app/types/guid";
import { PersonName } from "src/app/types/person-name";

export class InvitationLinkGetPersonFunction implements FirebaseFunction<InvitationLinkGetPersonFunctionType> {

  public readonly functionName: string = 'invitationLink-getPerson';

  public constructor(
    private readonly invitationLinkId: string
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<InvitationLinkGetPersonFunctionType> {
    return {
      invitationLinkId: this.invitationLinkId
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<InvitationLinkGetPersonFunctionType>): FunctionType.ReturnType<InvitationLinkGetPersonFunctionType> {
    return {
      id: new Guid(returnValue.id),
      name: PersonName.concrete(returnValue.name),
      fineIds: returnValue.fineIds.map(id => new Guid(id)),
      club: ClubProperties.concrete(returnValue.club)
    };
  }
}

export type InvitationLinkGetPersonFunctionType = FunctionType<{
  invitationLinkId: string;
}, Omit<Person.Flatten, 'signInData' | 'isInvited'> & { club: ClubProperties.Flatten }, Omit<Person, 'signInData' | 'isInvited'> & { club: ClubProperties }>;
