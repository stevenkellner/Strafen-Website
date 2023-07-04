import { v4 as uuidv4 } from 'uuid';

export class Guid {
    public constructor(
        public readonly guidString: string
    ) {}
}

export namespace Guid {
    export function newGuid(): Guid {
        return new Guid(uuidv4().toUpperCase());
    }
}
