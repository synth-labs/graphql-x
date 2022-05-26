import "reflect-metadata";

import Class from "../types/Class";
import FilterInfo from "../types/FilterInfo";
import FilterMap from "../types/FilterMap";

/**
 * If a `FilterFunction` is given then it is applied in the SQL WHERE statement.
 *
 * If a `ComparatorObject` is passed then it applies the following expression to the SQL query:
 *
 * `columnName operator argName`
 *
 * or if a modifier is given then:
 *
 * `modifier(columnName) operator argName`
 *
 * E.g.: `columnName >= argName` or `YEAR(columnName) = argName`
 */
function Filter(filter: FilterInfo) {
    return (target: Class, key: string) => {
        const wheres: FilterMap = <FilterMap>Reflect.getMetadata("graphQLWheres", target.constructor) || {};

        if (wheres[key]) {
            wheres[key].push(filter);
        } else {
            wheres[key] = [filter];
        }

        Reflect.defineMetadata("graphQLWheres", wheres, target.constructor);
    };
}

export default Filter;
