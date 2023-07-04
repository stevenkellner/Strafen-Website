export class Amount {
    public constructor(
        public readonly value: number,
        public readonly subUnitValue: number
    ) {}
}

export namespace Amount {
    export type Flatten = number;

    export function flatten(amount: Amount): Amount.Flatten {
        return amount.value + amount.subUnitValue / 100;
    }

    export function concrete(amount: Amount.Flatten): Amount {
        const amountValue = Math.floor(amount);
        const subUnitValue = (amount * 100 - amountValue * 100);
        return new Amount(amountValue, Math.floor(subUnitValue));
    }
}
