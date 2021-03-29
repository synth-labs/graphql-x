import { GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import { PrismaClient } from '@prisma/client';

import AnyMap from '../../types/AnyMap';
import PrismaModel from '../../types/PrismaModel';
import PrismaTable from '../../types/PrismaTable';
import CreateJoinedMap from '../../types/CreateJoinedMap';

import transformResolveInfo from '../transformResolveInfo';


function createTypeMutationResolver(tableName: string, queryName: string, mutationName: string, queryRoot: GraphQLObjectType, prisma: PrismaClient, obj: any) {
    return async (parent: any, args: AnyMap, context: any, resolveInfo: any): Promise<any> => {
        if (!(tableName in prisma)) {

            throw new Error(`Tablename \`${tableName}\` is missing on Prisma client!`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const table: PrismaTable = <PrismaTable>prisma[tableName as PrismaModel];

        type A = { [keys: string]: any };
        type T = A | number[];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const argList: T[] = <T[]>Object.entries(args).map(e => e[1]);
        let dataArg: A;
        let joinArg: number[] | undefined;


        if (argList.length !== 1 && argList.length !== 2) {
            throw new Error('The `create` type mutation resolvers must have exactly 1 or 2 arguments.');
        } else if (argList.length === 1) {
            dataArg = <A>argList[0];
        } else {
            dataArg = Array.isArray(argList[0]) ? <A>argList[1] : argList[0];
            joinArg = Array.isArray(argList[0]) ? argList[0] : <number[]>argList[1];
        }


        let data;

        if (joinArg) {
            const createJoined: CreateJoinedMap = <CreateJoinedMap>Reflect.getMetadata('graphQLMutationsJoin', obj) || {};

            if (argList.length === 2 && (!createJoined[mutationName].junctionTable || !createJoined[mutationName].referencedField)) {
                throw new Error('Missing `@CreateJoined` decorator.');
            }

            const { junctionTable } = createJoined[mutationName];
            const { referencedField } = createJoined[mutationName];

            const joins = joinArg.map((arg: number): { [keys: string]: number } => ({
                [referencedField]: arg
            }));

            data = {
                ...dataArg,
                [junctionTable]: {
                    create: joins
                }
            };
        } else {
            data = dataArg;
        }


        type ObjectWithID = { id: string; };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const entity: ObjectWithID = <ObjectWithID>await table.create({
            data
        });

        const queryArgs = { id: entity.id };
        const queryResolveInfo: GraphQLResolveInfo = transformResolveInfo(queryRoot, resolveInfo, queryName, queryArgs);

        const queryResolver = queryRoot.getFields()[queryName];
        if (queryResolver.resolve) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return queryResolver.resolve(parent, queryArgs, context, queryResolveInfo);
        }

        return null;
    };
}

export default createTypeMutationResolver;