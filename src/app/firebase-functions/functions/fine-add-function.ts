import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { Fine } from "src/app/types/fine";

export class FineAddFunction implements FirebaseFunction<FineAddFunctionType> {

  public readonly functionName: string = 'fine-add';

  public constructor(
    private readonly clubId: Guid,
    private readonly fine: Fine
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<FineAddFunctionType> {
    return {
      clubId: this.clubId.guidString,
      fine: Fine.flatten(this.fine)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<FineAddFunctionType>): FunctionType.ReturnType<FineAddFunctionType> {
    return returnValue;
  }
}

export type FineAddFunctionType = FunctionType<{
  clubId: string;
  fine: Fine.Flatten;
}, void, void>;
