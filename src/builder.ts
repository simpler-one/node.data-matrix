import { MatrixStringHeader, DataGroup, DataUnit, HeaderDataSet, MatrixOptions, DataElement } from './interfaces';
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

    private readonly params: MetaValueParams = { } as MetaValueParams;

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
        this.params.previous = this.type.getEmptyData();
        for (const group of groups) {
            if (group.length === 0) continue;

            this.params.firstInGroup = group[0];
            for (const data of group) {
                const filled = this.fillOne(data, this.type.headerColumns, this.paths, []);
                this.params.previous = filled;
                result.push(filled);
            }
        }

        return result;
    }

    private fillOne(data: DataUnit, hCol: number, pathMap: PathNode[], indexPath: number[]): DataUnit {
        if (pathMap.length < data.length) {
            console.warn('data is longer than header');
            return [];
        }

        const short = pathMap.length - data.length;
        const emptyEnd = hCol + short;
        const prev = getItem(this.params.previous, indexPath) as DataUnit;
        const cur = [
            ...data.slice(0, hCol),
            ...prev.slice(hCol, emptyEnd), // Fill with prev
            ...data.slice(hCol),
        ];

        for (let i = emptyEnd; i < pathMap.length; i++) {
            const val = cur[i];
            const branch = pathMap[i].findBranch();
            const idxPath = [...indexPath, i];
            if (val instanceof MetaValue) {
                cur[i] = getItem(val.eval({...this.params}), idxPath);
            } else if (branch && val instanceof Array) {
                cur[i] = this.fillOne(val, 0, branch.children, idxPath); // Recursive
            }
        }

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


function getItem(array: DataUnit, indices: number[]): DataElement {
    let item: DataElement = array;
    for (const index of indices) {
        item = item[index];
    }

    return item;
}
