export type MatrixStringHeader = string[];

export interface DataGroup extends Array<DataUnit> { }
export interface DataUnit extends Array<DataElement> { }
export type DataElement = {} | DataUnit;

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
