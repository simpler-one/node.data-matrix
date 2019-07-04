import { MatrixStringHeader, DataGroup, DataUnit, HeaderDataSet, MatrixOptions } from './interfaces';
import { MetaValueParams } from './private-interfaces';
import { DataType } from './data-type';
import { MetaValue } from './meta-value';
import { PathNode } from './path-node';

/**
 * Build data matrix
 * @param header header
 * @param groups data groups
 */
export function buildDataMatrix<T>(header: MatrixStringHeader, ...groups: DataGroup[]): T[];
/**
 * Build data matrix
 * @param headerAndData header and data array
 * @param options options
 */
export function buildDataMatrix<T>(headerAndData: HeaderDataSet, options?: MatrixOptions): T[];
export function buildDataMatrix<T>(
    headerOrSet: MatrixStringHeader | HeaderDataSet,
    groupOrOpt: DataGroup | MatrixOptions
): T[] {
    if (groupOrOpt instanceof Array) {
        const groups = Array.from(arguments).slice(1);
        const header = headerOrSet as MatrixStringHeader;
        return Builder.build<T>(header, groups, undefined);
    } else {
        const set = headerOrSet as HeaderDataSet;
        return Builder.build<T>(set[0], set.slice(1) as DataGroup[], groupOrOpt);
    }
}

class Builder<T> {

    private readonly params: MetaValueParams = { firstOfAll: undefined, firstInGroup: undefined };

    private readonly paths: PathNode[];


    constructor(
        private readonly type: DataType<T>,
    ) {
        this.paths = type.getPaths();
    }

    public static build<T>(header: MatrixStringHeader, groups: DataGroup[], options: MatrixOptions): T[] {
        MatrixOptions.fill(options);
        if (header.length === 0 || groups.length === 0 || groups[0].length === 0) {
            console.error('Matrix header or data is empty');
            return [];
        }

        const type = new DataType<T>(header);
        if (type.size !== groups[0][0].length) {
            console.error(`Header and first data size mismatch.`
                + ` header: ${type.size}, data: ${groups[0][0].length}. `
                + `object-path: [${type.pathsString().join(', ')}]`
            );
            return [];
        }

        const builder = new Builder(type);
        const data = builder.fill(groups);
        return builder.build(data);
    }

    private fill(groups: DataGroup[]): DataUnit[] {
        const result: DataUnit[] = [];

        this.params.firstOfAll = groups[0][0];
        this.params.previous = new Array(this.type.size);
        for (const group of groups) {
            if (group.length === 0) continue;

            this.params.firstInGroup = group[0];
            for (const data of group) {
                result.push(this.fillOne(data, this.paths, []));
            }
        }

        return result;
    }

    private fillOne(data: DataUnit, paths: PathNode[], path: number[]): DataUnit {
        const short = this.type.size - data.length;
        const emptyEnd = this.type.headerColumns + short;
        const cur: DataUnit = [
            ...data.slice(0, this.type.headerColumns),
            ...this.params.previous.slice(this.type.headerColumns, emptyEnd), // Fill with prev
            ...data.slice(this.type.headerColumns)
        ];

        for (let i = emptyEnd; i < this.type.size; i++) {
            const val = cur[i];
            const branch = paths[i].findBranch();
            if (val instanceof MetaValue) {
                cur[i] = val.eval({...this.params})[i];
            } else if (branch && val instanceof Array) {
                this.fillOne(val, branch.children, [...path, i]); // Recursive
            }
        }

        this.params.previous = cur;
        return cur;
    }

    private build(data: DataUnit[]): T[] {
        const results: T[] = [];

        for (const d of data) {
            const result = this.type.getModel();
            for (let i = 0; i < d.length; i++) {
                this.type.set(result, i, d[i]);
            }

            results.push(result);
        }

        return results;
    }
}
