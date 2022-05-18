import TypeFunction from "./TypeFunction";
import Arg from "./Arg";
import FilterInfo from "./FilterInfo";
import ResolverFunction from "./ResolverFunction";

interface ResolverInfo {
    type: TypeFunction;
    args?: { [keys: string]: Arg };
    where?: FilterInfo[];
    resolver?: ResolverFunction;
}

export default ResolverInfo;
