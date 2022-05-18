import "reflect-metadata";

import Class from "../types/Class";
import ResolverMap from "../types/ResolverMap";
import TypeFunction from "../types/TypeFunction";
import ResolverFunction from "../types/ResolverFunction";

function Query(typeFunction: TypeFunction, customResolver?: ResolverFunction) {
    return (target: Class, key: string) => {
        const queries: ResolverMap = <ResolverMap>Reflect.getMetadata("graphQLQueryTypes", target.constructor) || {};

        queries[key] = {
            type: typeFunction,
            resolver: customResolver
        };

        Reflect.defineMetadata("graphQLQueryTypes", queries, target.constructor);
    };
}

export default Query;
