import 'reflect-metadata';

import FilterInfo from '../types/FilterInfo';
import FilterMap from '../types/FilterMap';

function Filter(filter: FilterInfo) {
    return (target: ObjectConstructor, key: string) => {
        const wheres: FilterMap = <FilterMap>Reflect.getMetadata('graphQLWheres', target.constructor) || {};

        if (wheres[key]) {
            wheres[key].push(filter);
        } else {
            wheres[key] = [filter];
        }

        Reflect.defineMetadata('graphQLWheres', wheres, target.constructor);
    }
}

export default Filter;