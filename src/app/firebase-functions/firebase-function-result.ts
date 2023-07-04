import { Result } from "../types/result";

export type FunctionsErrorCode = 'ok' | 'cancelled' | 'unknown' | 'invalid-argument' | 'deadline-exceeded' | 'not-found' | 'already-exists' | 'permission-denied' | 'resource-exhausted' | 'failed-precondition' | 'aborted' | 'out-of-range' | 'unimplemented' | 'internal' | 'unavailable' | 'data-loss' | 'unauthenticated';


export type FirebaseFunctionError = {
  name: 'FirebaseFunctionError';
  code: FunctionsErrorCode;
  message: string;
  details?: unknown;
  stack?: string;
}

export type FirebasefunctionResult<T> = Result<T, FirebaseFunctionError>;
