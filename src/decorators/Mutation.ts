import 'reflect-metadata';

import Class from '../types/Class';
import TypeFunction from '../types/TypeFunction';
import MutationType from '../types/MutationType';
import MutationMap from '../types/MutationMap';
import ResolverFunction from '../types/ResolverFunction';

function Mutation(typeFunction: TypeFunction, mutationType: MutationType, tableName: string, queryName: string, customResolver?: ResolverFunction) {
    return (target: Class, key: string) => {
        const mutations: MutationMap = <MutationMap>Reflect.getMetadata('graphQLMutations', target.constructor) || {};

        mutations[key] = {
            type: typeFunction,
            mutationType,
            tableName,
            queryName,
            resolver: customResolver
        };

        Reflect.defineMetadata('graphQLMutations', mutations, target.constructor);
    };
}

export default Mutation;
