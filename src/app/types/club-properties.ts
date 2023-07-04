import { Guid } from './guid';

export type ClubProperties = {
    id: Guid;
    name: string;
    paypalMeLink: string | null;
};

export namespace ClubProperties {
    export type Flatten = {
        id: string;
        name: string;
        paypalMeLink: string | null;
    };

    export function flatten(clubProperties: ClubProperties): ClubProperties.Flatten;
    export function flatten(clubProperties: Omit<ClubProperties, 'id'>): Omit<ClubProperties.Flatten, 'id'>;
    export function flatten(clubProperties: ClubProperties | Omit<ClubProperties, 'id'>): ClubProperties.Flatten | Omit<ClubProperties.Flatten, 'id'> {
        return {
            ...('id' in clubProperties ? { id: clubProperties.id.guidString } : {}),
            name: clubProperties.name,
            paypalMeLink: clubProperties.paypalMeLink
        };
    }

    export function concrete(clubProperties: ClubProperties.Flatten): ClubProperties;
    export function concrete(clubProperties: Omit<ClubProperties.Flatten, 'id'>): Omit<ClubProperties, 'id'>;
    export function concrete(clubProperties: ClubProperties.Flatten | Omit<ClubProperties.Flatten, 'id'>): ClubProperties | Omit<ClubProperties, 'id'> {
        return {
            ...('id' in clubProperties ? { id: new Guid(clubProperties.id) } : {}),
            name: clubProperties.name,
            paypalMeLink: clubProperties.paypalMeLink
        };
    }
}
