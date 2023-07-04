import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class FineDeleteFunction implements FirebaseFunction<FineDeleteFunctionType> {

  public readonly functionName: string = 'fine-delete';

  public constructor(
    private readonly clubId: Guid,
    private readonly fineId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<FineDeleteFunctionType> {
    return {
      clubId: this.clubId.guidString,
      fineId: this.fineId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<FineDeleteFunctionType>): FunctionType.ReturnType<FineDeleteFunctionType> {
    return returnValue;
  }
}

export type FineDeleteFunctionType = FunctionType<{
  clubId: string;
  fineId: string;
}, void, void>;
