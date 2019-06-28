import { DataMatrixHeader, DataGroup } from './interfaces';


export class DataMatrix {
    static build<T>(headers: DataMatrixHeader, ...groups: DataGroup[]): T[] {

    }

    private template;

    private type: DataType<T>;

    private accessor;


    private constructor(
        header: DataMatrixHeader, 
        groups: DataGroup[]
    ) {
        this.type = new DataType(headers);
    }
}




class DataType<T> {
    private template: T;
    private setters: Setter[];

    constructor(header: DataMatrixHeader) {
        
    }

    private build(header: DataMatrixHeader) {
        const len = header[0].length;
        for (let i = 0; i len; i++) {
            for (let depth = 0; depth < header.length; depth++) {
            }
        }
    }
}


