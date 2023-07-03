export class DatabaseType {
    public constructor(
        public readonly value: DatabaseType.Value
    ) {}
}

export namespace DatabaseType {
    export type Value = 'release' | 'debug' | 'testing';
}
