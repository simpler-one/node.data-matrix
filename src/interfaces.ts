export interface DataMatrixHeader extends Array<HeaderLayer> { }
type HeaderLayer = HeaderElement[];
type HeaderElement = string | string[];

export interface DataGroup extends Array<DataUnit> { }
export interface DataUnit extends Array<DataElement> { }
type DataElement = {};

export type HeaderDataSet = [DataMatrixHeader, ...DataGroup[]];

export interface MatrixOptions {
}
// tslint:disable-next-line:no-namespace
export namespace MatrixOptions {
    export function fill(options: MatrixOptions): MatrixOptions {
        return {
            ...options
        };
    }
}

export interface MetaValueSelection<T> {
    firstOfAll: T;
    firstInGroup: T;
    previous: T;
}
