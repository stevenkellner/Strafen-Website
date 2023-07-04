import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class PaypalMeSetFunction implements FirebaseFunction<PaypalMeSetFunctionType> {

  public readonly functionName: string = 'paypalMe-set';

  public constructor(
    private readonly clubId: Guid,
    private readonly paypalMeLink: string | null
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PaypalMeSetFunctionType> {
    return {
      clubId: this.clubId.guidString,
      paypalMeLink: this.paypalMeLink
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PaypalMeSetFunctionType>): FunctionType.ReturnType<PaypalMeSetFunctionType> {
    return returnValue;
  }
}

export type PaypalMeSetFunctionType = FunctionType<{
  clubId: string;
  paypalMeLink: string | null;
}, void, void>;
