import { MatrixStringHeader, DataUnit } from './interfaces';
import { Separator } from './separator';
import { HeaderLayer, MatrixHeader, HeaderObject } from './private-interfaces';
import { PathNode } from './path-node';
import { NoChildren } from './meta-header';


const IdChar = '[a-zA-Z0-9_\\-\\|]';
const BeforeId = new RegExp(`( |^)(?=${IdChar})`, 'g');
const AfterId = new RegExp(`(?<=${IdChar})( |$)`, 'g');


export class DataType<T> {

    public get size(): number {
        return this.paths.length;
    }
    public readonly headerColumns: number;

    /** Model JSON string */
    private model: string;
    private paths: PathNode[];


    public constructor(strHeader: MatrixStringHeader) {
        let header = strHeader.map(layer => DataType.parseHeaderLayer(layer))
        this.headerColumns = DataType.getHeaderColumns(header);
        header = DataType.filter(header);
        this.paths = DataType.getPaths(header);
        this.model = JSON.stringify(DataType.getModel<T>(this.paths));
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

    private static getPaths(header: MatrixHeader): PathNode[] {
        const paths: PathNode[] = [];
        const top: PathNode = new PathNode('-top-');

        header[0] = [{ vals: header[0] } as HeaderObject];
        this.setPath(header, 0, top, top, paths);

        return paths.map(topP => topP.children[0]);
    }

    private static setPath(
        header: MatrixHeader, depth: number,
        parent: PathNode, top: PathNode, branches: PathNode[]
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
            const cur = new PathNode(item);
            parent.children.push(cur);
            this.setPath(header, depth + 1, cur, top, branches); // Recursive
        } else if (item instanceof Array) {
            branches.push(top);
            for (const key of item) {
                const cur = new PathNode(key);
                this.setPath(header, depth + 1, cur, cur, parent.children); // Recursive
            }
        } else {
            for (const key of item.vals) {
                const t = top.clone();
                const p = t.descendant();
                const cur = new PathNode(key);
                p.children.push(cur);
                this.setPath(header, depth + 1, cur, t, branches); // Recursive
            }
        }
    }

    private static getModel<T>(paths: PathNode[]): T {
        const model: T = {} as T; 
        for (const path of paths) {
            this.setModel(path, model);
        }

        return model;
    }

    private static setModel<T>(path: PathNode, model: T): void {
        if (path.isLeaf) {
            return;
        }

        if (model[path.key] === undefined) {
            model[path.key] = {};
        }

        model = model[path.key];
        for (const child of path.children) {
            this.setModel(child, model);
        }
    }

    private static setVal(obj: {}, path: PathNode, val: {}): void {
        if (path.isLeaf) {
            obj[path.key] = val; // End
        } else if (!path.isBranch) {
            this.setVal(obj[path.key], path.children[0], val); // Recursive
        } else {
            if (val instanceof Array) {
                for (let i = 0; i < val.length; i++) {
                    this.setVal(obj[path.key], path.children[i], val[i]); // Recursive
                }
            } else {
                obj[path.key] = val; // End
            }
        }
    }

    private static getEmptyData(branches: PathNode[]): DataUnit {
        const data = new Array(branches.length);
        for (let i = 0; i < branches.length; i++) {
            const branch = branches[i].findBranch();
            if (branch) {
                data[i] = this.getEmptyData(branch.children); // Recursive
            }
        }

        return data;
    }

    public set(obj: T, i: number, value: {}): void {
        DataType.setVal(obj, this.paths[i], value);
    }

    public getModel(): T {
        return JSON.parse(this.model);
    }

    public getEmptyData(): DataUnit {
        return DataType.getEmptyData(this.paths);
    }

    public getPaths(): PathNode[] {
        return this.paths.map(path => path.clone());
    }

    public pathsString(): string[] {
        return this.paths.map(path => path.toString());
    }
}
