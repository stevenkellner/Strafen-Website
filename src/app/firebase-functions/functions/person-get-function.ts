import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";
import { Person } from "src/app/types/person";

export class PersonGetFunction implements FirebaseFunction<PersonGetFunctionType> {

  public readonly functionName: string = 'person-get';

  public constructor(
    private readonly clubId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonGetFunctionType> {
    return {
      clubId: this.clubId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonGetFunctionType>): FunctionType.ReturnType<PersonGetFunctionType> {
    const value = {} as FunctionType.ReturnType<PersonGetFunctionType>;
    for (const entry of Object.entries(returnValue))
      value[entry[0]] = Person.concrete(entry[1]);
    return value;
  }
}

export type PersonGetFunctionType = FunctionType<{
  clubId: string;
}, Record<string, Person.Flatten>, Record<string, Person>>;
