export class VerboseType {
  public constructor(
      public readonly value: VerboseType.Value
  ) {}
}

export namespace VerboseType {
  export type Value = 'none' | 'verbose' | 'colored' | 'coloredVerbose';
}
