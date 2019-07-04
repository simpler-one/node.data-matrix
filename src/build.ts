import { MatrixStringHeader, DataGroup, DataUnit, HeaderDataSet, MatrixOptions } from './interfaces';
import { DataType } from './data-type';
import { MetaValue } from './meta-value';

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
        return build<T>(header, groups, undefined);
    } else {
        const set = headerOrSet as HeaderDataSet;
        return build<T>(set[0], set.slice(1) as DataGroup[], groupOrOpt);
    }
}

function build<T>(header: MatrixStringHeader, groups: DataGroup[], options: MatrixOptions): T[] {
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

    const models = fill(groups, type);
    const result: T[] = [];
    
    for (const model of models) {
        const data = type.getModel();
        for (let i = 0; i < model.length; i++) {
            type.set(data, i, model[i]);
        }

        result.push(data);
    }

    return result;
}

function fill(groups: DataGroup[], type: DataType<{}>, path: number[]): DataUnit[] {
    const result: DataUnit[] = [];
    const hCol = type.headerColumns;

    const firstOfAll: DataUnit = groups[0][0];
    let prev: DataUnit = new Array(firstOfAll.length);
    const dataLen = firstOfAll.length;
    for (const group of groups) {
        if (group.length === 0) continue;

        const firstInGroup = group[0];
        for (const data of group) {
            const short = dataLen - data.length;
            const emptyEnd = hCol + short;
            const cur: DataUnit = [...data.slice(0, hCol), ...new Array(short), ...data.slice(hCol)];

            for (let i = hCol; i < emptyEnd; i++) {
                cur[i] = prev[i]; // Fill empty with prev
            }

            for (let i = emptyEnd; i < dataLen; i++) {
                const val = cur[i];
                const branch = type.pathOf(i).findBranch();
                if (val instanceof MetaValue) {
                    cur[i] = val.select({
                        firstOfAll: firstOfAll[i],
                        firstInGroup: firstInGroup[i],
                        previous: prev[i]
                    }); // Fill meta value
                } else if (branch) {
                    fill
                }
            }

            prev = cur;
            result.push(cur);
        }
    }

    return result;
}
