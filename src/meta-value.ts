import { MetaValueParams } from "./private-interfaces";
import { DataUnit } from "./interfaces";

export class MetaValue {
    public static readonly FirstOfAll: MetaValue = new MetaValue(params => params.firstOfAll);
    public static readonly FirstInGroup: MetaValue = new MetaValue(params => params.firstInGroup);
    public static readonly Previous: MetaValue = new MetaValue(params => params.previous);
    
    constructor(
        private readonly selector: (selection: MetaValueParams) => DataUnit,
    ) {
    }

    public eval(params: MetaValueParams): DataUnit {
        return this.selector(params);
    }
}

/** FirstOfAll */
export const $00: MetaValue = MetaValue.FirstOfAll;
/** FirstInGroup */
export const $0: MetaValue = MetaValue.FirstInGroup;
/** Previous */
export const $$: MetaValue = MetaValue.Previous;
/** Previous */
export const _: MetaValue = MetaValue.Previous;
