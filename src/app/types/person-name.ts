export type PersonName = {
    first: string;
    last?: string;
};

export namespace PersonName {
    export type Flatten = {
        first: string;
        last: string | null;
    };

    export function flatten(personName: PersonName): PersonName.Flatten {
        return {
            first: personName.first,
            last: personName.last ?? null
        };
    }

    export function concrete(personName: PersonName.Flatten): PersonName {
        return {
            first: personName.first,
            last: personName.last ?? undefined
        };
    }
}
