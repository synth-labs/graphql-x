import TypeFunction from './TypeFunction';
import MutationType from './MutationType';
import ResolverFunction from './ResolverFunction';

interface MutationInfo {
    type: TypeFunction;
    mutationType: MutationType;
    tableName: string;
    queryName: string;
    resolver?: ResolverFunction;
}

export default MutationInfo;