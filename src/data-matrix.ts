import { DataMatrixHeader, DataMatrixRowGroup } from './interfaces';


export class DataMatrix {
    static build<T>(headers: DataMatrixHeader, ...groups: DataMatrixRowGroup[]): T[] {

    }

    private template;

    private header;

    private accessor;

    private constructor(
        headers: DataMatrixHeader, 
        groups: DataMatrixRowGroup[]
    ) {
    }
}
