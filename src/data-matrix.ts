import { DataMatrixHeader, DataGroup } from './interfaces';

type ObjPath = string[];

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

    private static paths(header: DataMatrixHeader): ObjPath[] {
        const paths: ObjPath[] = [];

        const len = header[0].length;
        for (let i = 0; i len; i++) {
            const path: ObjPath = [];
            for (let depth = 0; depth < header.length; depth++) {
                path.push(header[depth][i]);
            }

            paths.push(path);
        }

        return paths;
    }
}


