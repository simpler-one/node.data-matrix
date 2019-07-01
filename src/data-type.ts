import { DataMatrixHeader } from './interfaces';


type ObjPath = string[];

export class DataType<T> {

    public get size(): number {
        return this.paths.length;
    }
    public readonly headerColumns: number;

    /** template JSON string */
    private template: string;
    private paths: ObjPath[];


    public constructor(header: DataMatrixHeader) {
        this.headerColumns = DataType.getHeaderColumns(header);
        this.paths = DataType.getPaths(header);
        this.template = JSON.stringify(DataType.getTemplate<T>(this.paths));
    }

    private static getHeaderColumns(header: DataMatrixHeader): number {
        const index = header[0].findIndex(item => item instanceof Array && item.length === 0);
        return index >= 0 ? index : 0;
    }

    private static getPaths(header: DataMatrixHeader, separatorI: number): ObjPath[] {
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
            if (item.length === 0 && path.length > 0) { // Terminal & not separator
                paths.push(path); // End
                return;
            }

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

    public pathsString(separator: string): string[] {
        return this.paths.map(path => path.join(separator));
    }
}
