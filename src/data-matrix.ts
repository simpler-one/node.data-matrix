import { DataMatrixHeader, DataGroup, DataUnit } from './interfaces';
import { DataType } from './data-type';
import { MetaValue } from './meta-value';


export function buildDataMatrix<T>(header: DataMatrixHeader, ...groups: DataGroup[]): T[] {
    const type = new DataType<T>(header);
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
    if (groups.length === 0 || groups[0].length === 0) return [];
    const result: DataUnit[] = [];

    let firstOfAll: DataUnit = groups[0][0];
    let prev: DataUnit = new Array(firstOfAll.length);
    let dataLen = firstOfAll.length;
    for (const group of groups) {
        if (group.length === 0) continue;

        let firstInGroup = group[0];
        for (const data of group) {
            const cur: DataUnit = [...data];
            const short = dataLen - data.length;
            for (let i = 0; i < short; i++) {
                cur[i] = prev[i]; // Fill empty with prev
            }

            for (let i = short; i < dataLen; i++) {
                const val = cur[i];
                if (val instanceof MetaValue) {
                    cur[i] = val.select({firstOfAll, firstInGroup, previous: prev }); // Fill meta value
                }
            }

            prev = cur;
            result.push(cur);
        }
    }

    return result;
}
