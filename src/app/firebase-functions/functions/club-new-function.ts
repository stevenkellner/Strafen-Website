import { ClubProperties } from "src/app/types/club-properties";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { PersonName } from "src/app/types/person-name";
import { Guid } from "src/app/types/guid";

export class ClubNewFunction implements FirebaseFunction<ClubNewFunctionType> {

  public readonly functionName: string = 'club-new';

  public constructor(
    private readonly clubId: Guid,
    private readonly clubProperties: Omit<ClubProperties, 'id'>,
    private readonly personId: Guid,
    private readonly personName: PersonName
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<ClubNewFunctionType> {
    return {
      clubId: this.clubId.guidString,
      clubProperties: ClubProperties.flatten(this.clubProperties),
      personId: this.personId.guidString,
      personName: PersonName.flatten(this.personName)
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<ClubNewFunctionType>): FunctionType.ReturnType<ClubNewFunctionType> {
    return returnValue;
  }
}

export type ClubNewFunctionType = FunctionType<{
  clubId: string;
  clubProperties: Omit<ClubProperties.Flatten, 'id'>;
  personId: string;
  personName: PersonName.Flatten;
}, void, void>;
