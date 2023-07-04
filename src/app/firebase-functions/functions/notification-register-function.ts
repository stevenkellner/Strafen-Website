import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class NotificationRegisterFunction implements FirebaseFunction<NotificationRegisterFunctionType> {

  public readonly functionName: string = 'notification-register';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid,
    private readonly token: string
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<NotificationRegisterFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString,
      token: this.token
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<NotificationRegisterFunctionType>): FunctionType.ReturnType<NotificationRegisterFunctionType> {
    return returnValue;
  }
}

export type NotificationRegisterFunctionType = FunctionType<{
  clubId: string;
  personId: string;
  token: string;
}, void, void>;
