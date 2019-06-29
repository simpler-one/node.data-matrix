import { MetaValueSelection } from "./interfaces";

export class MetaValue {
    public static readonly FirstOfAll: MetaValue = new MetaValue(selection => selection.firstOfAll);
    public static readonly FirstInGroup: MetaValue = new MetaValue(selection => selection.firstInGroup);
    public static readonly Previous: MetaValue = new MetaValue(selection => selection.previous);
    
    constructor(
        private readonly selector: <T>(selection: MetaValueSelection<T>) => T,
    ) {
    }

    public select<T>(selection: MetaValueSelection<T>): T {
        return this.selector(selection);
    }
}

export const $00: MetaValue = MetaValue.FirstOfAll;
export const $0: MetaValue = MetaValue.FirstInGroup;
export const $$: MetaValue = MetaValue.Previous;
