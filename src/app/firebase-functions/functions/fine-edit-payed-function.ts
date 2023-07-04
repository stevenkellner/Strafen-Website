import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { PayedState } from "src/app/types/payed-state";

export class FineEditPayedFunction implements FirebaseFunction<FineEditPayedFunctionType> {

  public readonly functionName: string = 'fine-editPayed';

  public constructor(
    private readonly clubId: Guid,
    private readonly fineId: Guid,
    private readonly payedState: PayedState
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<FineEditPayedFunctionType> {
    return {
      clubId: this.clubId.guidString,
      fineId: this.fineId.guidString,
      payedState: this.payedState
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<FineEditPayedFunctionType>): FunctionType.ReturnType<FineEditPayedFunctionType> {
    return returnValue;
  }
}

export type FineEditPayedFunctionType = FunctionType<{
  clubId: string;
  fineId: string;
  payedState: PayedState
}, void, void>;
