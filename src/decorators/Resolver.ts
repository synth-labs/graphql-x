import ResolverGroup from '../types/ResolverGroup';

function Resolver(resolverGroup: ResolverGroup) {
    return (target: Object) => {
        Reflect.defineMetadata('graphQLResolverGroup', resolverGroup, target.constructor);
    }
}

export default Resolver;