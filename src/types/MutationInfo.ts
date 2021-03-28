import TypeFunction from './TypeFunction';
import MutationType from './MutationType';

interface MutationInfo {
    type: TypeFunction;
    mutationType: MutationType;
    tableName: string;
    queryName: string;
}

export default MutationInfo;