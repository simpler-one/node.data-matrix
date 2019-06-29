import { DataMatrixHeader } from './interfaces';


type ObjPath = string[];

export class DataType<T> {
    /** template JSON string */
    private template: string;
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
        const template: T = {} as T; 
        for (const path of paths) {
            const pPath: ObjPath = path.slice(0, path.length - 1);

            let cur: {} = template;
            for (const key of pPath) {
                if (cur[key] === undefined) {
                    cur[key] = {};
                }

                cur = cur[key];
            }
        }

        return template;
    }


    public constructor(header: DataMatrixHeader) {
        this.paths = DataType.getPaths(header);
        this.template = JSON.stringify(DataType.getTemplate<T>(this.paths));
    }

    
    public set(obj: T, i: number, value: {}): void {
        const path = this.paths[i];
        const pPath: ObjPath = path.slice(0, path.length - 1);

        let cur: {} = obj;
        for (const key of pPath) {
            cur = cur[key];
        }

        cur[path[path.length - 1]] = value;
    }

    public getTemplate(): T {
        return JSON.parse(this.template);
    }
}
