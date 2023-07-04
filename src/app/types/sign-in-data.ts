import { UserAuthenticationType } from './user-authentication-type';

export type SignInData = {
    hashedUserId: string;
    signInDate: Date;
    authentication: UserAuthenticationType[];
    notificationTokens: Record<string, string>;
};

export namespace SignInData {
    export type Flatten = {
        hashedUserId: string;
        signInDate: string;
        authentication: UserAuthenticationType[];
        notificationTokens: Record<string, string>;
    };

    export function flatten(signInData: SignInData): SignInData.Flatten;
    export function flatten(signInData: SignInData | undefined): SignInData.Flatten | null;
    export function flatten(signInData: SignInData | undefined): SignInData.Flatten | null {
        if (signInData === undefined)
            return null;
        return {
            hashedUserId: signInData.hashedUserId,
            signInDate: signInData.signInDate.toISOString(),
            authentication: signInData.authentication,
            notificationTokens: signInData.notificationTokens
        };
    }

    export function concrete(signInData: SignInData.Flatten): SignInData;
    export function concrete(signInData: SignInData.Flatten | null): SignInData | undefined;
    export function concrete(signInData: SignInData.Flatten | null): SignInData | undefined {
        if (signInData === null)
            return undefined;
        return {
            hashedUserId: signInData.hashedUserId,
            signInDate: new Date(signInData.signInDate),
            authentication: signInData.authentication,
            notificationTokens: signInData.notificationTokens
        };
    }
}
