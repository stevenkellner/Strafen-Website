export interface FetchState<Content, Failure extends Error = Error> {
  readonly state: 'loading' | 'success' | 'failure';
  content: Content | undefined;
  error: Failure | undefined;
  isLoading(): this is FetchState.Loading;
  isSuccess(): this is FetchState.Success<Content>;
  isFailure(): this is FetchState.Failure<Failure>;
}

export namespace FetchState {
  export class Loading implements FetchState<never, never> {
    public readonly state = 'loading';

    public readonly content = undefined;

    public readonly error = undefined;

    public isLoading = (): true => true;

    public isSuccess = (): false => false;

    public isFailure = (): false => false;
  }

  export class Success<Content> implements FetchState<Content, never> {
    public readonly state = 'success';

    public readonly error = undefined;

    public constructor(
        public readonly content: Content
    ) {}

    public isLoading = (): false => false;

    public isSuccess = (): true => true;

    public isFailure = (): false => false;
  }

  export class Failure<Failure extends Error = Error> implements FetchState<never, Failure> {
    public readonly state = 'failure';

    public readonly content = undefined;

    public constructor(
        public readonly error: Failure
    ) {}

    public isLoading = (): false => false;

    public isSuccess = (): false => false;

    public isFailure = (): true => true;
  }

  export const loading: FetchState.Loading = new FetchState.Loading();

  export function success<Content>(content: Content): FetchState.Success<Content> {
    return new FetchState.Success(content);
  }

  export function failure<Failure extends Error = Error>(error: Failure): FetchState.Failure<Failure> {
    return new FetchState.Failure(error);
  }
}
