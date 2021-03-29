import 'reflect-metadata';

import Class from '../types/Class';
import TypeFunction from '../types/TypeFunction';
import MutationType from '../types/MutationType';
import MutationMap from '../types/MutationMap';

function Mutation(typeFunction: TypeFunction, mutationType: MutationType, tableName: string, queryName: string) {
    return (target: Class, key: string) => {
        const mutations: MutationMap = <MutationMap>Reflect.getMetadata('graphQLMutations', target.constructor) || {};

        mutations[key] = {
            type: typeFunction,
            mutationType,
            tableName,
            queryName
        };

        Reflect.defineMetadata('graphQLMutations', mutations, target.constructor);
    };
}

export default Mutation;