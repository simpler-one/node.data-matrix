import { DataMatrixHeader, DataMatrixRowGroup } from './interfaces';


export class DataMatrix {
    static build<T>(headers: DataMatrixHeader, ...groups: DataMatrixRowGroup[]): T[] {

    }

    private template;

    private type: DataType<T>;

    private accessor;


    private constructor(
        headers: DataMatrixHeader, 
        groups: DataMatrixRowGroup[]
    ) {
        this.type = new DataType(headers);
    }
}




class DataType<T> {
    private readonly template: T;
    private readonly setters: Setter[];

    constructor(headers: DataMatrixHeader) {
        
    }
}


