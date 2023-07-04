import { ClubProperties } from "src/app/types/club-properties";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class PersonRegisterFunction implements FirebaseFunction<PersonRegisterFunctionType> {

  public readonly functionName: string = 'person-register';

  public constructor(
    private readonly clubId: Guid,
    private readonly personId: Guid
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonRegisterFunctionType> {
    return {
      clubId: this.clubId.guidString,
      personId: this.personId.guidString
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonRegisterFunctionType>): FunctionType.ReturnType<PersonRegisterFunctionType> {
    return ClubProperties.concrete(returnValue);
  }
}

export type PersonRegisterFunctionType = FunctionType<{
  clubId: string;
  personId: string;
}, ClubProperties.Flatten, ClubProperties>;
