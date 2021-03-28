import { GraphQLInputType } from 'graphql';


interface FieldInputInfo {
    type: GraphQLInputType;
    optional?: boolean,
    description?: string;
    column?: string;
    joinForward?: string;
    joinBackward?: string;
    junction?: {
        junctionTable: string;
        firstTableField: string;
        secondTableField: string
    }
}

export default FieldInputInfo;