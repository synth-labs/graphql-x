import { GraphQLObjectType } from 'graphql';

import ResolverFunction from './ResolverFunction';
import FilterFunction from './FilterFunction';

interface ResolverType {
    type: GraphQLObjectType,
    resolve: ResolverFunction,
    description?: string,
    args?: any,
    extensions?: {
        joinMonster: {
            where?: FilterFunction
        }
    }
}

export default ResolverType;