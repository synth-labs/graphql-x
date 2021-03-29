import 'reflect-metadata';

import TypeFunction from '../types/TypeFunction';
import MutationType from '../types/MutationType';
import MutationMap from '../types/MutationMap';

function Mutation(typeFunction: TypeFunction, mutationType: MutationType, tableName: string, queryName: string) {
    return (target: ObjectConstructor, key: string) => {
        const mutations: MutationMap = <MutationMap>Reflect.getMetadata('graphQLMutations', target.constructor) || {};

        mutations[key] = {
            type: typeFunction,
            mutationType,
            tableName,
            queryName
        };

        Reflect.defineMetadata('graphQLMutations', mutations, target.constructor);
    }
}

export default Mutation;