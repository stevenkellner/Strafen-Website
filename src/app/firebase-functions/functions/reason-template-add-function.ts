import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { ReasonTemplate } from "src/app/types/reason-template";

export class ReasonTemplateAddFunction implements FirebaseFunction<ReasonTemplateAddFunctionType> {

  public readonly functionName: string = 'reasonTemplate-add';

  public constructor(
    private readonly clubId: Guid,
    private readonly reasonTemplate: ReasonTemplate
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<ReasonTemplateAddFunctionType> {
    return {
      clubId: this.clubId.guidString,
      reasonTemplate: ReasonTemplate.flatten(this.reasonTemplate)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<ReasonTemplateAddFunctionType>): FunctionType.ReturnType<ReasonTemplateAddFunctionType> {
    return returnValue;
  }
}

export type ReasonTemplateAddFunctionType = FunctionType<{
  clubId: string;
  reasonTemplate: ReasonTemplate.Flatten;
}, void, void>;
