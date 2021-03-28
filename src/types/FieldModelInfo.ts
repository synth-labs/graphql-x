import { GraphQLOutputType } from 'graphql';

import JoinFunction from './JoinFunction';


interface FieldModelInfo {
    type: GraphQLOutputType;
    optional?: boolean,
    description?: string;
    column?: string;
    joinForward?: string;
    joinBackward?: string;
    junction?: {
        junctionTable: string;
        firstTableField: string;
        secondTableField: string
    },
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

export default FieldModelInfo;