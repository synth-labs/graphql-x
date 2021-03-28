import ResolverGroup from '../types/ResolverGroup';

function Resolver(resolverGroup: ResolverGroup) {
    return (target: ObjectConstructor) => {
        Reflect.defineMetadata('graphQLResolverGroup', resolverGroup, target.constructor);
    }
}

export default Resolver;