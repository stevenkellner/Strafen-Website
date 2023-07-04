import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class PersonMakeManagerFunction implements FirebaseFunction<PersonMakeManagerFunctionType> {

  public readonly functionName: string = 'person-makeManager';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonMakeManagerFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonMakeManagerFunctionType>): FunctionType.ReturnType<PersonMakeManagerFunctionType> {
    return returnValue;
  }
}

export type PersonMakeManagerFunctionType = FunctionType<{
  clubId: string;
  personId: string;
}, void, void>;
