import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { ReasonTemplate } from "src/app/types/reason-template";

export class ReasonTemplateUpdateFunction implements FirebaseFunction<ReasonTemplateUpdateFunctionType> {

  public readonly functionName: string = 'reasonTemplate-update';

  public constructor(
    private readonly clubId: Guid,
    private readonly reasonTemplate: ReasonTemplate
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<ReasonTemplateUpdateFunctionType> {
    return {
      clubId: this.clubId.guidString,
      reasonTemplate: ReasonTemplate.flatten(this.reasonTemplate)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<ReasonTemplateUpdateFunctionType>): FunctionType.ReturnType<ReasonTemplateUpdateFunctionType> {
    return returnValue;
  }
}

export type ReasonTemplateUpdateFunctionType = FunctionType<{
  clubId: string;
  reasonTemplate: ReasonTemplate.Flatten;
}, void, void>;
