import { ClubProperties } from "../types/club-properties";
import { Guid } from "../types/guid";
import { PersonName } from "../types/person-name";

export type Appearance = 'system' | 'light' | 'dark';

export type SignedInPerson = {
  id: Guid;
  name: PersonName;
  fineIds: Guid[];
  isAdmin: boolean;
  hashedUserId: string;
  club: ClubProperties;
};

export namespace SignedInPerson {
  export type Flatten = {
    id: string;
    name: PersonName.Flatten;
    fineIds: string[];
    isAdmin: boolean;
    hashedUserId: string;
    club: ClubProperties.Flatten;
  }

  export function flatten(person: SignedInPerson): SignedInPerson.Flatten {
      return {
        id: person.id.guidString,
        name: PersonName.flatten(person.name),
        fineIds: person.fineIds.map(id => id.guidString),
        isAdmin: person.isAdmin,
        hashedUserId: person.hashedUserId,
        club: ClubProperties.flatten(person.club)
      };
  }

  export function concrete(person: SignedInPerson.Flatten): SignedInPerson {
      return {
        id: new Guid(person.id),
        name: PersonName.concrete(person.name),
        fineIds: person.fineIds.map(id => new Guid(id)),
        isAdmin: person.isAdmin,
        hashedUserId: person.hashedUserId,
        club: ClubProperties.concrete(person.club)
      };
  }
}

type SortingKeyAndOrder<SortingKey> = {
  sortingKey: SortingKey;
  order: 'ascending' | 'descending';
}

export type Sorting = {
  personSorting: SortingKeyAndOrder<'name'>;
  reasonTemplateSorting: SortingKeyAndOrder<'reasonMessage' | 'amount'>;
  fineSorting: SortingKeyAndOrder<'date' | 'reasonMessage' | 'amount'>;
}

export namespace Sorting {
  export const defaultValue: Sorting = {
    personSorting: {
      sortingKey: 'name',
      order: 'ascending'
    },
    reasonTemplateSorting: {
      sortingKey: 'reasonMessage',
      order: 'ascending'
    },
    fineSorting: {
      sortingKey: 'date',
      order: 'descending'
    }
  }
}

export type Settings = {
  appearance: Appearance;
  sorting: Sorting;
  signedInPerson: SignedInPerson | null;
}

export namespace Settings {
  export const defaultValue: Settings = {
    appearance: 'system',
    sorting: Sorting.defaultValue,
    signedInPerson: null
  }

  export type Flatten = {
    appearance: Appearance;
    sorting: Sorting;
    signedInPerson: SignedInPerson.Flatten | null;
  }

  export function flatten(settings: Settings): Settings.Flatten {
      return {
        appearance: settings.appearance,
        sorting: settings.sorting,
        signedInPerson: settings.signedInPerson === null ? null : SignedInPerson.flatten(settings.signedInPerson)
      };
  }

  export function concrete(settings: Settings.Flatten): Settings {
      return {
        appearance: settings.appearance,
        sorting: settings.sorting,
        signedInPerson: settings.signedInPerson === null ? null : SignedInPerson.concrete(settings.signedInPerson)
      };
  }
}
