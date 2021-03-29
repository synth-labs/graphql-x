import { GraphQLObjectType } from "graphql";
import joinMonster from "join-monster";

import Class from '../types/Class';
import ResolverInfo from '../types/ResolverInfo';
import ResolverType from '../types/ResolverType';
import ResolverTypeMap from '../types/ResolverTypeMap';
import ResolverMap from '../types/ResolverMap';
import ArgMap from '../types/ArgMap';
import FilterMap from '../types/FilterMap';

import buildWhere from './ buildWhere';
import db from '../db';

db.init();
const connection = db.get();

function buildQuery(resolver: Class): ResolverTypeMap {
    const queries: ResolverMap = <ResolverMap>Reflect.getMetadata('graphQLQueryTypes', resolver);
    const args: ArgMap = <ArgMap>Reflect.getMetadata('graphQLArgs', resolver)
    const wheres: FilterMap = <FilterMap>Reflect.getMetadata('graphQLWheres', resolver);

    const resolvers: ResolverTypeMap = {};

    Object.entries(queries).forEach((f: [string, ResolverInfo]) => {
        const [key, value] = f;

        const res: ResolverType = {
            type: <GraphQLObjectType>value.type(),
            args: args[key],
            resolve: (_parent: any, _args: any, _context: any, resolveInfo: any) => joinMonster(
                resolveInfo,
                {},
                async (sql: string) => {
                    const result = await connection.execute(sql);
                    return result[0];
                },
                {
                    dialect: "mysql8",
                },
            ),
            extensions: {
                joinMonster: {
                    where: buildWhere(wheres[key])
                }
            }
        }

        resolvers[key] = res;
    });

    return resolvers;
}

export default buildQuery;