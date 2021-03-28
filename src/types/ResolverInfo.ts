import TypeFunction from './TypeFunction';
import Arg from './Arg';
import FilterInfo from './FilterInfo';

interface ResolverInfo {
    type: TypeFunction;
    args?: { [keys: string]: Arg };
    where?: FilterInfo[];
}

export default ResolverInfo;