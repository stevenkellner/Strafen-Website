import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { Fine } from "src/app/types/fine";

export class FineGetFunction implements FirebaseFunction<FineGetFunctionType> {

  public readonly functionName: string = 'fine-get';

  public constructor(
    private readonly clubId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<FineGetFunctionType> {
    return {
      clubId: this.clubId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<FineGetFunctionType>): FunctionType.ReturnType<FineGetFunctionType> {
    const value = {} as FunctionType.ReturnType<FineGetFunctionType>;
    for (const entry of Object.entries(returnValue))
      value[entry[0]] = Fine.concrete(entry[1]);
    return value;
  }
}

export type FineGetFunctionType = FunctionType<{
  clubId: string;
}, Record<string, Fine.Flatten>, Record<string, Fine>>;
