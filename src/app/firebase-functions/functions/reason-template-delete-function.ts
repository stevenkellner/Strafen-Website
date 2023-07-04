import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class ReasonTemplateDeleteFunction implements FirebaseFunction<ReasonTemplateDeleteFunctionType> {

  public readonly functionName: string = 'reasonTemplate-delete';

  public constructor(
    private readonly clubId: Guid,
    private readonly reasonTemplateId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<ReasonTemplateDeleteFunctionType> {
    return {
      clubId: this.clubId.guidString,
      reasonTemplateId: this.reasonTemplateId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<ReasonTemplateDeleteFunctionType>): FunctionType.ReturnType<ReasonTemplateDeleteFunctionType> {
    return returnValue;
  }
}

export type ReasonTemplateDeleteFunctionType = FunctionType<{
  clubId: string;
  reasonTemplateId: string;
}, void, void>;
