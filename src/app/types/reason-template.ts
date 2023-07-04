import { Amount } from './amount';
import { Guid } from './guid';
import { ReasonTemplateCountsItem } from './reason-template-counts-item';

export type ReasonTemplate = {
    id: Guid;
    reasonMessage: string;
    amount: Amount;
    counts?: {
        item: ReasonTemplateCountsItem;
        maxCount?: number;
    };
};

export namespace ReasonTemplate {
    export type Flatten = {
        id: string;
        reasonMessage: string;
        amount: number;
        counts: {
            item: ReasonTemplateCountsItem;
            maxCount: number | null;
        } | null;
    };

    export function flatten(reasonTemplate: ReasonTemplate): ReasonTemplate.Flatten;
    export function flatten(reasonTemplate: Omit<ReasonTemplate, 'id'>): Omit<ReasonTemplate.Flatten, 'id'>;
    export function flatten(reasonTemplate: ReasonTemplate | Omit<ReasonTemplate, 'id'>): ReasonTemplate.Flatten | Omit<ReasonTemplate.Flatten, 'id'> {
        return {
            ...('id' in reasonTemplate ? { id: reasonTemplate.id.guidString } : {}),
            reasonMessage: reasonTemplate.reasonMessage,
            amount: Amount.flatten(reasonTemplate.amount),
            counts: reasonTemplate.counts === undefined
                ? null
                : {
                    item: reasonTemplate.counts.item,
                    maxCount: reasonTemplate.counts.maxCount === undefined ? null : reasonTemplate.counts.maxCount
                }
        };
    }

    export function concrete(reasonTemplate: ReasonTemplate.Flatten): ReasonTemplate;
    export function concrete(reasonTemplate: Omit<ReasonTemplate.Flatten, 'id'>): Omit<ReasonTemplate, 'id'>;
    export function concrete(reasonTemplate: ReasonTemplate.Flatten | Omit<ReasonTemplate.Flatten, 'id'>): ReasonTemplate | Omit<ReasonTemplate, 'id'> {
        return {
            ...('id' in reasonTemplate ? { id: new Guid(reasonTemplate.id) } : {}),
            reasonMessage: reasonTemplate.reasonMessage,
            amount: Amount.concrete(reasonTemplate.amount),
            counts: reasonTemplate.counts === null
                ? undefined
                : {
                    item: reasonTemplate.counts.item,
                    maxCount: reasonTemplate.counts.maxCount === null ? undefined : reasonTemplate.counts.maxCount
                }
        };
    }
}
