import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { ReasonTemplate } from "src/app/types/reason-template";

export class ReasonTemplateGetFunction implements FirebaseFunction<ReasonTemplateGetFunctionType> {

  public readonly functionName: string = 'reasonTemplate-get';

  public constructor(
    private readonly clubId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<ReasonTemplateGetFunctionType> {
    return {
      clubId: this.clubId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<ReasonTemplateGetFunctionType>): FunctionType.ReturnType<ReasonTemplateGetFunctionType> {
    const value = {} as FunctionType.ReturnType<ReasonTemplateGetFunctionType>;
    for (const entry of Object.entries(returnValue))
      value[entry[0]] = ReasonTemplate.concrete(entry[1]);
    return value;
  }
}

export type ReasonTemplateGetFunctionType = FunctionType<{
  clubId: string;
}, Record<string, ReasonTemplate.Flatten>, Record<string, ReasonTemplate>>;
