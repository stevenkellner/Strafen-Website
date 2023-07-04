import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class InvitationLinkCreateIdFunction implements FirebaseFunction<InvitationLinkCreateIdFunctionType> {

  public readonly functionName: string = 'invitationLink-createId';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<InvitationLinkCreateIdFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<InvitationLinkCreateIdFunctionType>): FunctionType.ReturnType<InvitationLinkCreateIdFunctionType> {
    return returnValue;
  }
}

export type InvitationLinkCreateIdFunctionType = FunctionType<{
  clubId: string;
  personId: string;
}, string, string>;
