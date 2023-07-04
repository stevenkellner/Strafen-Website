import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class PersonDeleteFunction implements FirebaseFunction<PersonDeleteFunctionType> {

  public readonly functionName: string = 'person-delete';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonDeleteFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonDeleteFunctionType>): FunctionType.ReturnType<PersonDeleteFunctionType> {
    return returnValue;
  }
}

export type PersonDeleteFunctionType = FunctionType<{
  clubId: string;
  personId: string;
}, void, void>;
