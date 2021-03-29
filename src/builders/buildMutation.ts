import 'reflect-metadata';
import { GraphQLObjectType } from 'graphql';
import { PrismaClient } from '@prisma/client';

import Class from '../types/Class';
import ArgMap from '../types/ArgMap';
import MutationInfo from '../types/MutationInfo';
import MutationMap from '../types/MutationMap';
import ResolverFunction from '../types/ResolverFunction';
import ResolverType from '../types/ResolverType';
import ResolverTypeMap from '../types/ResolverTypeMap';

import createTypeMutationResolver from './resolverGenerators/createTypeMutationResolver';
import updateTypeMutationResolver from './resolverGenerators/updateTypeMutationResolver';
import deleteTypeMutationResolver from './resolverGenerators/deleteTypeMutationResolver';
import joinTypeMutationResolver from './resolverGenerators/joinTypeMutationResolver';
import unjoinTypeMutationResolver from './resolverGenerators/unjoinTypeMutationResolver';


function buildMutation(mutation: Class, queryRoot: GraphQLObjectType, prisma: PrismaClient): ResolverTypeMap {
    const mutations: MutationMap = <MutationMap>Reflect.getMetadata('graphQLMutations', mutation);

    const resolvers: ResolverTypeMap = {};
    Object.entries(mutations).forEach((m: [string, MutationInfo]) => {
        const [key, value] = [...m];

        const { mutationType } = value;
        let res: ResolverFunction;

        switch (mutationType) {
            case 'create':
                res = createTypeMutationResolver(value.tableName, value.queryName, key, queryRoot, prisma, mutation);
                break;
            case 'update':
                res = updateTypeMutationResolver(value.tableName, value.queryName, queryRoot, prisma);
                break;
            case 'delete':
                res = deleteTypeMutationResolver(value.tableName, prisma);
                break;
            case 'join':
                res = joinTypeMutationResolver(value.tableName, value.queryName, key, queryRoot, prisma, mutation);
                break;
            case 'unjoin':
                res = unjoinTypeMutationResolver(value.tableName, value.queryName, key, queryRoot, prisma, mutation);
                break;
            default:
                res = () => null; // temporary
        }

        const args: ArgMap = <ArgMap>Reflect.getMetadata('graphQLArgs', mutation) || {};

        const resolver: ResolverType = {
            type: <GraphQLObjectType>value.type(),
            args: args[key],
            resolve: res
        };

        resolvers[key] = resolver;
    });

    return resolvers;
}

export default buildMutation;