import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class InvitationLinkWithdrawFunction implements FirebaseFunction<InvitationLinkWithdrawFunctionType> {

  public readonly functionName: string = 'invitationLink-withdraw';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<InvitationLinkWithdrawFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<InvitationLinkWithdrawFunctionType>): FunctionType.ReturnType<InvitationLinkWithdrawFunctionType> {
    return returnValue;
  }
}

export type InvitationLinkWithdrawFunctionType = FunctionType<{
  clubId: string;
  personId: string;
}, void, void>;
