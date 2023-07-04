import { Guid } from './guid';
import { PayedState } from './payed-state';
import { Amount } from './amount';

export type Fine = {
    id: Guid;
    personId: Guid;
    payedState: PayedState;
    date: Date;
    reasonMessage: string;
    amount: Amount;
};

export namespace Fine {
    export type Flatten = {
        id: string;
        personId: string;
        payedState: PayedState;
        date: string;
        reasonMessage: string;
        amount: Amount.Flatten;
    };

    export function flatten(fine: Fine): Fine.Flatten;
    export function flatten(fine: Omit<Fine, 'id'>): Omit<Fine.Flatten, 'id'>;
    export function flatten(fine: Fine | Omit<Fine, 'id'>): Fine.Flatten | Omit<Fine.Flatten, 'id'> {
        return {
            ...('id' in fine ? { id: fine.id.guidString } : {}),
            personId: fine.personId.guidString,
            payedState: fine.payedState,
            date: fine.date.toISOString(),
            reasonMessage: fine.reasonMessage,
            amount: Amount.flatten(fine.amount)
        };
    }

    export function concrete(fine: Fine.Flatten): Fine;
    export function concrete(fine: Omit<Fine.Flatten, 'id'>): Omit<Fine, 'id'>;
    export function concrete(fine: Fine.Flatten | Omit<Fine.Flatten, 'id'>): Fine | Omit<Fine, 'id'> {
        return {
            ...('id' in fine ? { id: new Guid(fine.id) } : {}),
            personId: new Guid(fine.personId),
            payedState: fine.payedState,
            date: new Date(fine.date),
            reasonMessage: fine.reasonMessage,
            amount: Amount.concrete(fine.amount)
        };
    }
}
