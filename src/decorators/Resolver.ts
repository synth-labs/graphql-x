import 'reflect-metadata';

import Class from '../types/Class';
import ResolverGroup from '../types/ResolverGroup';

function Resolver(resolverGroup: ResolverGroup) {
    return (target: Class) => {
        Reflect.defineMetadata('graphQLResolverGroup', resolverGroup, target.constructor);
    };
}

export default Resolver;