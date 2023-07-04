import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { Person } from "src/app/types/person";

export class PersonAddFunction implements FirebaseFunction<PersonAddFunctionType> {

  public readonly functionName: string = 'person-add';

  public constructor(
    private readonly clubId: Guid,
    private readonly person: Person
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonAddFunctionType> {
    return {
      clubId: this.clubId.guidString,
      person: Person.flatten(this.person)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonAddFunctionType>): FunctionType.ReturnType<PersonAddFunctionType> {
    return returnValue;
  }
}

export type PersonAddFunctionType = FunctionType<{
  clubId: string;
  person: Person.Flatten;
}, void, void>;
