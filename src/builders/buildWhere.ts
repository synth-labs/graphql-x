import { escape } from 'sqlstring';

import FilterInfo from '../types/FilterInfo';
import FilterFunction from '../types/FilterFunction';
import ComparatorObject from '../types/ComparatorObject';
import Operator from '../types/Operator';

function buildWhere(filterInfos?: FilterInfo[]): FilterFunction | undefined {
    if (filterInfos === undefined) return undefined;

    return (table: string, args: { [keys: string]: any }, context: any): string => {
        const functionFilters: FilterFunction[] = <FilterFunction[]>filterInfos.filter((f: FilterInfo): boolean => typeof f === 'function');
        const comparatorFilters: ComparatorObject[] = <ComparatorObject[]>filterInfos.filter((f: FilterInfo): boolean => typeof f !== 'function');

        const where1: string = comparatorFilters.map((f: ComparatorObject): string => {
            // if the query argument referenced by the filter is undefined (e.g. because of being optional) then the filter is skipped
            if (args[f.argName] === undefined) {
                return '';
            }

            if (f.operator === 'IS_NULL') {
                // falsy értékeket nem kell figyelembe venni
                if (args[f.argName] === true) {
                    return `${table}.\`${f.columnName}\` IS NULL`;
                } if (args[f.argName] === false) {
                    return `${table}.\`${f.columnName}\` IS NOT NULL`;
                }
                return ``;

            }
            if (f.operator === 'IS_NOT_NULL') {
                if (args[f.argName] === true) {
                    return `${table}.\`${f.columnName}\` IS NOT NULL`;
                } if (args[f.argName] === false) {
                    return `${table}.\`${f.columnName}\` IS NULL`;
                }
                return ``;

            }
            if (f.operator === 'LIKE') {
                let wildcarded;
                if (typeof args[f.argName] === 'string') {
                    const a: string = <string>args[f.argName];
                    wildcarded = `%${a}%`;
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    wildcarded = args[f.argName];
                }

                const escapedArg: string = escape(wildcarded);
                return `${table}.\`${f.columnName}\` ${Operator[f.operator]} ${escapedArg}`;

            }
            if (args[f.argName]) {
                const escapedArg: string = escape(args[f.argName]);
                return `${table}.\`${f.columnName}\` ${Operator[f.operator]} ${escapedArg}`;
            }
            return ``;


        }).filter((f: string): boolean => f.length > 0).join(' AND ');

        const where2: string = functionFilters.map((f: FilterFunction): string => f(table, args, context))
            .join(' AND ');

        const fullWhere = [where1, where2].filter((f: string): boolean => f.length > 0).join(' AND ');

        return fullWhere;
    };
}

export default buildWhere;