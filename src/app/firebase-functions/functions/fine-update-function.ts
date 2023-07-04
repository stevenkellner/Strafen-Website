import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { Fine } from "src/app/types/fine";

export class FineUpdateFunction implements FirebaseFunction<FineUpdateFunctionType> {

  public readonly functionName: string = 'fine-update';

  public constructor(
    private readonly clubId: Guid,
    private readonly fine: Fine
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<FineUpdateFunctionType> {
    return {
      clubId: this.clubId.guidString,
      fine: Fine.flatten(this.fine)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<FineUpdateFunctionType>): FunctionType.ReturnType<FineUpdateFunctionType> {
    return returnValue;
  }
}

export type FineUpdateFunctionType = FunctionType<{
  clubId: string;
  fine: Fine.Flatten;
}, void, void>;
