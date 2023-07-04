import { TestClubType } from "src/app/types/test-club-type";
import { FirebaseFunction, FunctionType } from "../firebase-function";
import { Guid } from "src/app/types/guid";

export class ClubNewTestFunction implements FirebaseFunction<ClubNewTestFunctionType> {

  public readonly functionName: string = 'club-newTest';

  public constructor(
    private readonly clubId: Guid,
    private readonly testClubType: TestClubType
  ) {}

  public get flattenParameters(): FunctionType.FlattenParameters<ClubNewTestFunctionType> {
    return {
      clubId: this.clubId.guidString,
      testClubType: this.testClubType
    };
  }

  public parseReturnValue(returnValue: FunctionType.FlattenReturnType<ClubNewTestFunctionType>): FunctionType.ReturnType<ClubNewTestFunctionType> {
    return returnValue;
  }
}

export type ClubNewTestFunctionType = FunctionType<{
  clubId: string;
  testClubType: TestClubType;
}, void, void>;
