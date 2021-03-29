import 'reflect-metadata';

import Class from '../types/Class';
import ResolverMap from '../types/ResolverMap';
import TypeFunction from '../types/TypeFunction';

function Query(typeFunction: TypeFunction) {
    return (target: Class, key: string) => {
        const queries: ResolverMap = <ResolverMap>Reflect.getMetadata('graphQLQueryTypes', target.constructor) || {};

        if (queries[key]) {
            queries[key].type = typeFunction;
        } else {
            queries[key] = {
                type: typeFunction
            }
        }

        Reflect.defineMetadata('graphQLQueryTypes', queries, target.constructor);
    }
}

export default Query;