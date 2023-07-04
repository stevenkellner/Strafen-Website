import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { NotificationPayload } from "src/app/types/notification-payload";

export class NotificationPushFunction implements FirebaseFunction<NotificationPushFunctionType> {

  public readonly functionName: string = 'notification-push';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid,
    private readonly payload: NotificationPayload
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<NotificationPushFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString,
      payload: this.payload
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<NotificationPushFunctionType>): FunctionType.ReturnType<NotificationPushFunctionType> {
    return returnValue;
  }
}

export type NotificationPushFunctionType = FunctionType<{
  clubId: string;
  personId: string;
  payload: NotificationPayload;
}, void, void>;
