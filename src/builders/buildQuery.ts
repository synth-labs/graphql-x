import { GraphQLObjectType } from "graphql";
import joinMonster from "join-monster";

import Class from "../types/Class";
import ResolverInfo from "../types/ResolverInfo";
import ResolverType from "../types/ResolverType";
import ResolverTypeMap from "../types/ResolverTypeMap";
import ResolverMap from "../types/ResolverMap";
import ResolverFunction from "../types/ResolverFunction";
import ArgMap from "../types/ArgMap";
import FilterMap from "../types/FilterMap";

import buildWhere from "./buildWhere";
import db from "../db";

db.init();
const connection = db.get();

function buildQuery(resolver: Class): ResolverTypeMap {
    const queries: ResolverMap = <ResolverMap>Reflect.getMetadata("graphQLQueryTypes", resolver);
    const args: ArgMap = <ArgMap>Reflect.getMetadata("graphQLArgs", resolver);
    const wheres: FilterMap = <FilterMap>Reflect.getMetadata("graphQLWheres", resolver);

    const resolvers: ResolverTypeMap = {};

    Object.entries(queries).forEach((f: [string, ResolverInfo]) => {
        const [key, value] = f;

        let resolverFunction: ResolverFunction;

        if (value.resolver !== undefined) {
            resolverFunction = value.resolver;
        } else {
            resolverFunction = (_parent: any, _args: any, _context: any, resolveInfo: any) =>
                joinMonster(
                    resolveInfo,
                    {},
                    async (sql: string) => {
                        if (process.env.QUERY_DEBUG === "true") {
                            console.log(`${sql}\n`);
                        }

                        const result = await connection.execute(sql);
                        return result[0];
                    },
                    {
                        dialect: "mysql8"
                    }
                );
        }

        const res: ResolverType = {
            type: <GraphQLObjectType>value.type(),
            resolve: resolverFunction
        };

        if (args !== undefined && key in args) {
            res.args = args[key];
        }

        if (wheres !== undefined && key in wheres) {
            res.extensions = {
                joinMonster: {
                    where: buildWhere(wheres[key])
                }
            };
        }

        resolvers[key] = res;
    });

    return resolvers;
}

export default buildQuery;
