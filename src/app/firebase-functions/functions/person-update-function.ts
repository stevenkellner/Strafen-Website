import { Person } from "src/app/types/person";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class PersonUpdateFunction implements FirebaseFunction<PersonUpdateFunctionType> {

  public readonly functionName: string = 'person-update';

  public constructor(
    private readonly clubId: Guid,
    private readonly person: Person
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonUpdateFunctionType> {
    return {
      clubId: this.clubId.guidString,
      person: Person.flatten(this.person)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonUpdateFunctionType>): FunctionType.ReturnType<PersonUpdateFunctionType> {
    return returnValue;
  }
}

export type PersonUpdateFunctionType = FunctionType<{
  clubId: string;
  person: Person.Flatten;
}, void, void>;
