import { Guid } from './guid';
import { PersonName } from './person-name';
import { SignInData } from './sign-in-data';

export type Person = {
    id: Guid;
    name: PersonName;
    fineIds: Guid[];
    signInData?: SignInData;
    isInvited: boolean;
};

export namespace Person {
    export type Flatten = {
        id: string;
        name: PersonName.Flatten;
        fineIds: string[];
        signInData: SignInData.Flatten | null;
        isInvited: boolean;
    };

    export function flatten(person: Person): Person.Flatten;
    export function flatten(person: Omit<Person, 'id'>): Omit<Person.Flatten, 'id'>;
    export function flatten(person: Person | Omit<Person, 'id'>): Person.Flatten | Omit<Person.Flatten, 'id'> {
        return {
            ...('id' in person ? { id: person.id.guidString } : {}),
            name: PersonName.flatten(person.name),
            fineIds: person.fineIds.map(fineId => fineId.guidString),
            signInData: SignInData.flatten(person.signInData),
            isInvited: person.isInvited
        };
    }

    export function concrete(person: Person.Flatten): Person;
    export function concrete(person: Omit<Person.Flatten, 'id'>): Omit<Person, 'id'>;
    export function concrete(person: Person.Flatten | Omit<Person.Flatten, 'id'>): Person | Omit<Person, 'id'> {
        return {
            ...('id' in person ? { id: new Guid(person.id) } : {}),
            name: PersonName.concrete(person.name),
            fineIds: person.fineIds.map(fineId => new Guid(fineId)),
            signInData: SignInData.concrete(person.signInData),
            isInvited: person.isInvited
        };
    }

    export type PersonalProperties = Omit<Person, 'fineIds' | 'signInData' | 'isInvited'>;

    export namespace PersonalProperties {
        export type Flatten = Omit<Person.Flatten, 'fineIds' | 'signInData' | 'isInvited'>;

        export function flatten(person: Person.PersonalProperties): Person.PersonalProperties.Flatten;
        export function flatten(person: Omit<Person.PersonalProperties, 'id'>): Omit<Person.PersonalProperties.Flatten, 'id'>;
        export function flatten(person: Person.PersonalProperties | Omit<Person.PersonalProperties, 'id'>): Person.PersonalProperties.Flatten | Omit<Person.PersonalProperties.Flatten, 'id'> {
            return {
                ...('id' in person ? { id: person.id.guidString } : {}),
                name: PersonName.flatten(person.name)
            };
        }

        export function concrete(person: Person.PersonalProperties.Flatten): Person.PersonalProperties;
        export function concrete(person: Omit<Person.PersonalProperties.Flatten, 'id'>): Omit<Person.PersonalProperties, 'id'>;
        export function concrete(person: Person.PersonalProperties.Flatten | Omit<Person.PersonalProperties.Flatten, 'id'>): Person.PersonalProperties | Omit<Person.PersonalProperties, 'id'> {
            return {
                ...('id' in person ? { id: new Guid(person.id) } : {}),
                name: PersonName.concrete(person.name)
            };
        }
    }
}
