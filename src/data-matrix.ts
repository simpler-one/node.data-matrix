import { DataMatrixHeader, DataGroup } from './interfaces';

type ObjPath = string[];

export class DataMatrix<T> {
    static build<T>(headers: DataMatrixHeader, ...groups: DataGroup[]): T[] {

    }

    private template: T;

    private type: DataType<T>;

    private accessor;


    private constructor(
        header: DataMatrixHeader, 
        groups: DataGroup[]
    ) {
        this.type = new DataType(header);
    }
}


class DataType<T> {
    private template: T;
    private paths: ObjPath[];

    
    private static getPaths(header: DataMatrixHeader): ObjPath[] {
        const paths: ObjPath[] = [];

        for (let i = 0; i < header[0].length; i++) {
            this.setPath(header, i, 0, [], paths);
        }

        return paths;
    }

    private static setPath(header: DataMatrixHeader, i: number, depth: number, path: ObjPath, paths: ObjPath[]): void {
        if (depth >= header.length || header[depth].length <= i) {
            paths.push(path); // End
            return;
        }

        const item = header[depth][i];
        if (typeof item === 'string') {
            path.push(item);
            this.setPath(header, i, depth + 1, path, paths); // Recursive
        } else {
            for (const key of item) {
                const newPath = [...path, key];
                this.setPath(header, i, depth + 1, newPath, paths); // Recursive
            }
        }
    }

    private static getTemplate<T>(paths: ObjPath[]): T {
        const template: T = {} as undefined; 
        for (const path of paths) {
            const pPath: ObjPath = path.slice(0, path.length - 1);
            for (const key of pPath) {
                
            }
        }

        return template;
    }

    constructor(header: DataMatrixHeader) {
        this.paths = DataType.getPaths(header);
        this.template = DataType.getTemplate<T>(this.paths);
    }

}


