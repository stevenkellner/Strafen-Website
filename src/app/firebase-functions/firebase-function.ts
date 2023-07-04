export type ValidParameters = boolean | string | number | null | ValidReturnType[] | { [key: string]: ValidReturnType };
export type ValidReturnType = boolean | string | number | null | undefined | void | ValidReturnType[] | { [key: string]: ValidReturnType };

export type FunctionType<FlattenParameters extends ValidParameters, FlattenReturnType extends ValidReturnType, ReturnType> = {
  flattenParameters: FlattenParameters;
  flattenReturnType: FlattenReturnType;
  returnType: ReturnType;
}

export namespace FunctionType {
  export type DefaultType = FunctionType<ValidParameters, ValidReturnType, unknown>;

  export type FlattenParameters<Function extends FunctionType.DefaultType> = Function extends FunctionType<infer FlattenParameters, ValidReturnType, unknown> ? FlattenParameters : never;

  export type FlattenReturnType<Function extends FunctionType.DefaultType> = Function extends FunctionType<ValidParameters, infer FlattenReturnType, unknown> ? FlattenReturnType : never;

  export type ReturnType<Function extends FunctionType.DefaultType> = Function extends FunctionType<ValidParameters, ValidReturnType, infer ReturnType> ? ReturnType : never;
}

export interface FirebaseFunction<FunctionType extends FunctionType.DefaultType> {
  functionName: string;
  flattenParameters: FunctionType.FlattenParameters<FunctionType>;
  parseReturnValue(returnValue: FunctionType.FlattenReturnType<FunctionType>): FunctionType.ReturnType<FunctionType>;
}

export namespace FirebaseFunction {
  export type DefaultType = FirebaseFunction<FunctionType.DefaultType>;

  export type FlattenParameters<Function extends FirebaseFunction.DefaultType> = Function extends FirebaseFunction<infer FunctionType> ? FunctionType.FlattenParameters<FunctionType> : never;

  export type FlattenReturnType<Function extends FirebaseFunction.DefaultType> = Function extends FirebaseFunction<infer FunctionType> ? FunctionType.FlattenReturnType<FunctionType> : never;

  export type ReturnType<Function extends FirebaseFunction.DefaultType> = Function extends FirebaseFunction<infer FunctionType> ? FunctionType.ReturnType<FunctionType> : never;
}
