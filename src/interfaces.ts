export type MatrixStringHeader = string[];

export interface DataGroup extends Array<DataUnit> { }
export interface DataUnit extends Array<DataElement> { }
type DataElement = {};

export type HeaderDataSet = [MatrixStringHeader, ...DataGroup[]];

export interface MatrixOptions {
    reservedForFuture?: undefined;
}
// tslint:disable-next-line:no-namespace
export namespace MatrixOptions {
    // eslint-disable-next-line no-inner-declarations
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
