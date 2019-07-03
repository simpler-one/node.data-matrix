import { MatrixStringHeader } from './interfaces';
import { Separator } from './separator';
import { HeaderLayer, MatrixHeader } from './private-interface';
import { ObjTree } from './object-tree';
import { NoChildren } from './meta-header';


const IdChar = '[a-zA-Z0-9_\-]';
const BeforeId = new RegExp(`( |^)(?=${IdChar})`, 'g');
const AfterId = new RegExp(`(?<=${IdChar})( |$)`, 'g');


export class DataType<T> {

    public get size(): number {
        return this.paths.length;
    }
    public readonly headerColumns: number;

    /** template JSON string */
    private template: string;
    private paths: ObjTree[];


    public constructor(strHeader: MatrixStringHeader) {
        let header = strHeader.map(layer => DataType.parseHeaderLayer(layer))
        this.headerColumns = DataType.getHeaderColumns(header);
        header = DataType.filter(header);
        this.paths = DataType.getPaths(header);
        this.template = JSON.stringify(DataType.getTemplate<T>(this.paths));
    }


    private static parseHeaderLayer(layer: string): HeaderLayer {
        let result = layer;
        for (const separator of Separator.All) {
            result = separator.sandSpace(result);
        }
    
        result = result
            .replace(BeforeId, ' "')
            .replace(AfterId, '",')
            .replace(/\]/g, '],')
            .replace(/{/g, '{"vals":[')
            .replace(/}/g, ']},')
            .replace(/ /g, '')
        ;
    
        result = `[${result}]`;
    
        for (const separator of Separator.Closers) {
            result = separator.removeComma(result);
        }
    
        return JSON.parse(result);
    }

    private static getHeaderColumns(header: MatrixHeader): number {
        const index = header[0].indexOf('|');
        return index >= 0 ? index : 0;
    }

    private static filter(header: MatrixHeader): MatrixHeader {
        return header.map(layer => layer.filter(item => item !== '|'));
    }

    private static getPaths(header: MatrixHeader): ObjTree[] {
        const paths: ObjPath[] = [];
        const top: ObjTree = new ObjTree('-top-');

        header[0] = { vals: header[0] as string[] };
        this.setPath(header, 0, top, top, paths);

        return paths.map(top => top.children[0]);
    }

    private static setPath(
        header: MatrixHeader, depth: number,
        parent: ObjTree, top: ObjTree, branches: ObjTree[]
    ): void {
        if (depth >= header.length || header[depth].length <= 0) {
            branches.push(top); // End
            return;
        }

        const item = header[depth].shift();
        if (item === NoChildren) {
            branches.push(top); // End
            return;
        } else if (typeof item === 'string') {
            const cur = new ObjTree(item);
            parent.children.push(cur);
            this.setPath(header, depth + 1, cur, top, branches); // Recursive
        } else if (item instanceof Array) {
            for (const key of item) {
                const cur = new ObjTree(key);
                parent.children.push(cur);　　
                this.setPath(header, depth + 1, cur, cur, parent.children); // Recursive
            }
        } else {
            for (const key of item.vals) {
                const p = top.clone().descendant();
                const cur = new ObjTree(key);
                p.children.push(cur);
                this.setPath(header, depth + 1, cur, top, branches); // Recursive
            }
        }
    }

    private static getTemplate<T>(tree: ObjPath[]): T {
        const template: T = {} as T; 
        for (const path of tree) {
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
