export type DataMatrixHeader = HeaderLayer[];
type HeaderLayer = HeaderElement[];
type HeaderElement = string | string[];

export type DataGroup = DataUnit[];
export type DataUnit = DataElement[];
type DataElement = {};

export interface MetaValueSelection<T> {
    firstOfAll: T;
    firstInGroup: T;
    previous: T;
}
