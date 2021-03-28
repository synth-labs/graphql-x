import JoinFunction from './JoinFunction';
import TypeFunction from './TypeFunction';

interface JoinMonsterFieldInfo {
    type: TypeFunction;
    optional?: boolean,
    description?: string;
    extensions?: {
        joinMonster: {
            sqlColumn?: string,
            sqlJoin?: JoinFunction,
            junction?: {
                sqlTable: string,
                sqlJoins: [JoinFunction, JoinFunction]
            }
        }
    }
}

export default JoinMonsterFieldInfo;