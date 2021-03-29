import { GraphQLObjectType } from 'graphql';
import { PrismaClient } from '@prisma/client';

import AnyMap from '../../types/AnyMap';
import PrismaTable from '../../types/PrismaTable';
import PrismaModel from '../../types/PrismaModel';

import transformResolveInfo from '../transformResolveInfo';


function updateTypeMutationResolver(tableName: string, queryName: string, queryRoot: GraphQLObjectType, prisma: PrismaClient) {
    return async (parent: any, args: AnyMap, context: any, resolveInfo: any) => {
        if (!(tableName in prisma)) {

            throw new Error(`Tablename \`${tableName}\` is missing on Prisma client!`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const table: PrismaTable = <PrismaTable>prisma[tableName as PrismaModel];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const argList: any[] = Object.entries(args).map(e => e[1]);
        let dataArg;

        if (!('id' in args) || !(typeof args.id === 'number' || typeof args.id === 'string')) {
            throw new Error('It is mandatory to provide id for the update mutation!');
        }

        if (argList.length !== 2) {
            throw new Error('The `update` type mutation resolvers must have exactly 2 arguments.');
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            dataArg = argList[0] !== args.id ? argList[0] : argList[1];

            if (!dataArg) {
                throw new Error('It is mandatory to provide data for the update mutation!');
            }
        }


        await table.update({
            where: {
                id: args.id
            },
            data: <{ [keys: string]: any }>dataArg
        });


        const queryArgs = { id: args.id };
        const queryResolveInfo = transformResolveInfo(queryRoot, resolveInfo, queryName, queryArgs);

        const queryResolver = queryRoot.getFields()[queryName];
        if (queryResolver.resolve) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return queryResolver.resolve(parent, queryArgs, context, queryResolveInfo);
        }

        return null;
    };
}

export default updateTypeMutationResolver;