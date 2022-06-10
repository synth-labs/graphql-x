import { escape } from "sqlstring";
import { isArray } from "lodash";

import FilterInfo from "../types/FilterInfo";
import FilterFunction from "../types/FilterFunction";
import ComparatorObject from "../types/ComparatorObject";
import Operator from "../types/Operator";

function parseModifier(modifier: NonNullable<ComparatorObject["modifier"]>): string {
    return modifier.split(":")[1];
}

function buildWhere(filterInfos?: FilterInfo[]): FilterFunction | undefined {
    if (filterInfos === undefined) return undefined;

    return (table: string, args: { [keys: string]: any }, context: any): string => {
        const functionFilters: FilterFunction[] = <FilterFunction[]>filterInfos.filter((f: FilterInfo): boolean => typeof f === "function");
        const comparatorFilters: ComparatorObject[] = <ComparatorObject[]>filterInfos.filter((f: FilterInfo): boolean => typeof f !== "function");

        const where1: string = comparatorFilters
            .map((f: ComparatorObject): string => {
                // if the query argument referenced by the filter is undefined (e.g. because of being optional) then the filter is skipped
                if (args[f.argName] === undefined) {
                    return "";
                }

                if (f.operator === "IS_NULL") {
                    // falsy értékeket nem kell figyelembe venni
                    if (args[f.argName] === true) {
                        return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) IS NULL` : `${table}.\`${f.columnName}\` IS NULL`;
                    }
                    if (args[f.argName] === false) {
                        return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) IS NOT NULL` : `${table}.\`${f.columnName}\` IS NOT NULL`;
                    }
                    return ``;
                }
                if (f.operator === "IS_NOT_NULL") {
                    if (args[f.argName] === true) {
                        return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) IS NOT NULL` : `${table}.\`${f.columnName}\` IS NOT NULL`;
                    }
                    if (args[f.argName] === false) {
                        return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) IS NULL` : `${table}.\`${f.columnName}\` IS NULL`;
                    }
                    return ``;
                }
                if (f.operator === "LIKE") {
                    let wildcarded;
                    if (typeof args[f.argName] === "string") {
                        const a: string = <string>args[f.argName];
                        wildcarded = `%${a}%`;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        wildcarded = args[f.argName];
                    }

                    const escapedArg: string = escape(wildcarded);
                    return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) ${Operator[f.operator]} ${escapedArg}` : `${table}.\`${f.columnName}\` ${Operator[f.operator]} ${escapedArg}`;
                }
                if (f.operator === "IN" || f.operator === "NOT_IN") {
                    let parsedElements: any[];
                    if (!isArray(args[f.argName])) {
                        throw new Error(`The ${f.argName} argument must be an array due to the IN operator.`);
                    } else {
                        parsedElements = (args[f.argName] as any[]).map(element => parseInt(element, 10));
                        // eslint-disable-next-line eqeqeq
                        const filtered = parsedElements.filter(element => parseInt(element, 10) == element);
                        if (parsedElements.length !== filtered.length) {
                            throw new Error(`The ${f.argName} array can contain only integers.`);
                        }
                    }

                    const stringifiedArgs: string = `(${parsedElements.toString()})`;
                    return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) ${Operator[f.operator]} ${stringifiedArgs}` : `${table}.\`${f.columnName}\` ${Operator[f.operator]} ${stringifiedArgs}`;
                }
                if (args[f.argName]) {
                    const escapedArg: string = escape(args[f.argName]);
                    return f.modifier ? `${parseModifier(f.modifier)}(${table}.\`${f.columnName}\`) ${Operator[f.operator]} ${escapedArg}` : `${table}.\`${f.columnName}\` ${Operator[f.operator]} ${escapedArg}`;
                }
                return ``;
            })
            .filter((f: string): boolean => f.length > 0)
            .join(" AND ");

        const where2: string = functionFilters.map((f: FilterFunction): string => f(table, args, context)).join(" AND ");

        const fullWhere = [where1, where2].filter((f: string): boolean => f.length > 0).join(" AND ");

        return fullWhere;
    };
}

export default buildWhere;
