import { DataMatrixHeader, DataGroup, DataUnit } from './interfaces';
import { DataType } from './data-type';
import { MetaValue } from './meta-value';


export function buildDataMatrix<T>(header: DataMatrixHeader, ...groups: DataGroup[]): T[] {
    if (header.length === 0 || groups.length === 0 || groups[0].length === 0) {
        console.error('Empty data matrix');
        return [];
    }

    const type = new DataType<T>(header);
    if (type.size !== groups[0][0].length) {
        console.error(`Header(keys) and first data size mismatch.`
            + ` key: ${type.size}, data: ${groups[0][0].length}. `
            + `object-path: [${type.pathsString('.').join(', ')}]`
        );
        return [];
    }

    const models = fill(groups);
    const result: T[] = [];
    
    for (const model of models) {
        const data = type.getTemplate();
        for (let i = 0; i < model.length; i++) {
            type.set(data, i, model[i]);
        }

        result.push(data);
    }

    return result;
}

function fill(groups: DataGroup[]): DataUnit[] {
    const result: DataUnit[] = [];

    let firstOfAll: DataUnit = groups[0][0];
    let prev: DataUnit = new Array(firstOfAll.length);
    let dataLen = firstOfAll.length;
    for (const group of groups) {
        if (group.length === 0) continue;

        let firstInGroup = group[0];
        for (const data of group) {
            const short = dataLen - data.length;
            const cur: DataUnit = [...new Array(short), ...data];

            for (let i = 0; i < short; i++) {
                cur[i] = prev[i]; // Fill empty with prev
            }

            for (let i = short; i < dataLen; i++) {
                const val = cur[i];
                if (val instanceof MetaValue) {
                    cur[i] = val.select({
                        firstOfAll: firstOfAll[i],
                        firstInGroup: firstInGroup[i],
                        previous: prev[i]
                    }); // Fill meta value
                }
            }

            prev = cur;
            result.push(cur);
        }
    }

    return result;
}
