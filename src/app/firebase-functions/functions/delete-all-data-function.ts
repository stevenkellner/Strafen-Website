import { ClubProperties } from "src/app/types/club-properties";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { PersonName } from "src/app/types/person-name";
import { Guid } from "src/app/types/guid";

export class DeleteAllDataFunction implements FirebaseFunction<DeleteAllDataFunctionType> {

  public readonly functionName: string = 'deleteAllData';

  public constructor() {}

  public get flattenParameters(): FunctionType.FlattenParameters<DeleteAllDataFunctionType> {
    return {};
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<DeleteAllDataFunctionType>): FunctionType.ReturnType<DeleteAllDataFunctionType> {
    return returnValue;
  }
}

export type DeleteAllDataFunctionType = FunctionType<Record<PropertyKey, never>, void, void>;
