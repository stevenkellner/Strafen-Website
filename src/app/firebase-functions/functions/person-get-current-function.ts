import { ClubProperties } from "src/app/types/club-properties";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Person } from "src/app/types/person";
import { SignInData } from "src/app/types/sign-in-data";

export class PersonGetCurrentFunction implements FirebaseFunction<PersonGetCurrentFunctionType> {

  public readonly functionName: string = 'person-getCurrent';

  public constructor() {}

  public get flattenParameters(): FunctionType.FlattenParameters<PersonGetCurrentFunctionType> {
    return {};
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<PersonGetCurrentFunctionType>): FunctionType.ReturnType<PersonGetCurrentFunctionType> {
    return {
      ...Person.concrete(returnValue),
      signInData: SignInData.concrete(returnValue.signInData),
      club: ClubProperties.concrete(returnValue.club)
    };
  }
}

export type PersonGetCurrentFunctionType = FunctionType<Record<PropertyKey, never>, Person.Flatten & {
  signInData: SignInData.Flatten;
  club: ClubProperties.Flatten
}, Person & {
  signInData: SignInData;
  club: ClubProperties
}>;
