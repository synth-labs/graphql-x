import 'reflect-metadata';
import { GraphQLObjectType } from 'graphql';
import { PrismaClient } from '@prisma/client';

import AnyMap from '../../types/AnyMap';
import PrismaTable from '../../types/PrismaTable';
import PrismaModel from '../../types/PrismaModel';
import JoinMatchingMap from '../../types/JoinMatchingMap';
import JoinMatching from '../../types/JoinMatching';
import CustomError from '../../types/CustomError';

import transformResolveInfo from '../transformResolveInfo';


function unjoinTypeMutationResolver(tableName: string, queryName: string, key: string, queryRoot: GraphQLObjectType, prisma: PrismaClient, obj: any) {
    return async (parent: any, args: AnyMap, context: any, resolveInfo: any): Promise<any> => {
        const joins: JoinMatchingMap = <JoinMatchingMap>Reflect.getMetadata('graphQLUnjoinData', obj);
        const joinData: JoinMatching | undefined = joins[key];

        if (!joinData) {
            throw new Error('You mast use the @Unjoin decorator for `join` type mutations.');
        }

        if (!(joinData.argument1 in args)) {
            throw new Error(`Missing @Arg decorator for argument \`${joinData.argument1}\``);
        }

        if (!(joinData.argument2 in args)) {
            throw new Error(`Missing @Arg decorator for argument \`${joinData.argument2}\``);
        }

        if (!(tableName in prisma)) {

            throw new Error(`Tablename \`${tableName}\` is missing on Prisma client!`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const table: PrismaTable = <PrismaTable>prisma[tableName as PrismaModel];

        const [f1, f2] = [joinData.field1, joinData.field2].sort();
        const compundKeyName: string = `uk_${f1}_${f2}_idx`;

        const arg1: string = <string>args[joinData.argument1];
        const arg2: string = <string>args[joinData.argument2];
        try {
            await table.delete({
                where: {
                    [compundKeyName]: {
                        [joinData.field1]: arg1,
                        [joinData.field2]: arg2
                    }
                }
            });
        } catch (e) {
            const err: CustomError = <CustomError>e;
            if (err.code === 'P2025') {
                throw new Error('Record to delete does not exist.');
            } else {
                throw e;
            }
        }

        const queryArgs = { id: arg1 };
        const queryResolveInfo = transformResolveInfo(queryRoot, resolveInfo, queryName, queryArgs);

        const queryResolver = queryRoot.getFields()[queryName];
        if (queryResolver.resolve) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return queryResolver.resolve(parent, queryArgs, context, queryResolveInfo);
        }

        return null;
    };
}

export default unjoinTypeMutationResolver;